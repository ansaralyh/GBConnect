import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';
import { connectToDatabase } from '../../services/model';

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send OTP email
async function sendOtpEmail(email: string, otp: string) {
  const emailUser = process.env.EMAIL_USER?.trim();
  const emailPass = process.env.EMAIL_PASS?.trim();
  const emailHost = process.env.EMAIL_HOST?.trim() || 'smtp.gmail.com';
  const emailPort = Number(process.env.EMAIL_PORT || 465);

  if (!emailUser || !emailPass) {
    console.log('[Signup] EMAIL_USER/EMAIL_PASS not set — OTP for', email, ':', otp);
    return;
  }

  const transporter = nodemailer.createTransport({
    host: emailHost,
    port: emailPort,
    secure: emailPort === 465,
    auth: {
      user: emailUser,
      pass: emailPass,
    },
  });
  await transporter.sendMail({
    from: `GBConnect <${emailUser}>`,
    to: email,
    subject: 'Your GBConnect OTP Code',
    text: `Your OTP code is: ${otp}`,
    html: `<p>Your OTP code is: <b>${otp}</b></p><p>This code is valid for 10 minutes.</p>`,
  });
  console.log('[Signup] OTP email sent to', email);
}

// POST: Send OTP
export async function POST(req: NextRequest) {
  try {
    const { email, password, userType, name, phone, location } = await req.json();
    console.log('[Signup] POST request for', email);
    if (!email || !password || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log('[Signup] Connecting to database...');
    const client = await connectToDatabase();
    const db = client.db();
    const users = db.collection('users');
    const otps = db.collection('emailOtps');
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.log('[Signup] User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    await otps.deleteMany({ email });
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);
    await otps.insertOne({ email, otp, expiresAt: otpExpiry, password, userType, name, phone, location });
    console.log('[Signup] OTP stored in database for', email);
    await sendOtpEmail(email, otp);
    return NextResponse.json({ message: 'OTP sent to your email. Please verify to complete signup.' }, { status: 200 });
  } catch (error) {
    console.error('[Signup] POST error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

// PUT: Verify OTP and create user
export async function PUT(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const users = db.collection('users');
    const otps = db.collection('emailOtps');
    // Find OTP record
    const otpRecord = await otps.findOne({ email, otp });
    if (!otpRecord) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
    if (new Date() > new Date(otpRecord.expiresAt)) {
      return NextResponse.json({ error: 'OTP expired' }, { status: 400 });
    }
    // Check if user already exists (shouldn't happen, but double check)
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    // Create user
    const hashedPassword = await bcrypt.hash(otpRecord.password, 10);
    const newUser = {
      email,
      password: hashedPassword,
      userType: otpRecord.userType,
      name: otpRecord.name,
      phone: otpRecord.phone,
      location: otpRecord.location,
      createdAt: new Date(),
      verified: true,
    };
    await users.insertOne(newUser);
    // Remove OTP record
    await otps.deleteOne({ email, otp });
    return NextResponse.json({ message: 'User registered and verified successfully' }, { status: 201 });
  } catch (error) {
    console.error('[Signup] PUT error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
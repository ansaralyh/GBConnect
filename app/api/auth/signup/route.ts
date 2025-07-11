import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import nodemailer from 'nodemailer';

const uri = 'mongodb://localhost:27017/GBConnect';
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

// Helper to generate a 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Helper to send OTP email
async function sendOtpEmail(email: string, otp: string) {
  const transporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      user: 'ansaralyh@gmail.com',
      pass: 'vsld xkwv xcam tmzr',
    },
  });
  await transporter.sendMail({
    from: 'Ansar Ali <ansaralyh@gmail.com>',
    to: email,
    subject: 'Your OTP Code',
    text: `Your OTP code is: ${otp}`,
  });
}

// POST: Send OTP
export async function POST(req: NextRequest) {
  try {
    const { email, password, userType, name, phone, location } = await req.json();
    if (!email || !password || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const users = db.collection('users');
    const otps = db.collection('emailOtps');
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }
    // Remove any previous OTPs for this email
    await otps.deleteMany({ email });
    // Generate and store OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes
    await otps.insertOne({ email, otp, expiresAt: otpExpiry, password, userType, name, phone, location });
    // Send OTP email
    await sendOtpEmail(email, otp);
    return NextResponse.json({ message: 'OTP sent to your email. Please verify to complete signup.' }, { status: 200 });
  } catch (error) {
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
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
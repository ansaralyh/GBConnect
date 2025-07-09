import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../services/model';
import nodemailer from 'nodemailer';

export async function POST(req: NextRequest) {
  try {
    const { email } = await req.json();
    if (!email) {
      return NextResponse.json({ error: 'Email is required' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const user = await db.collection('users').findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'No user found with this email' }, { status: 404 });
    }
    // Generate a 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    // Store OTP in a separate collection with expiry (10 min)
    await db.collection('emailOtps').insertOne({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });
    // Send OTP email
    const transporter = nodemailer.createTransport({
      host: process.env.EMAIL_HOST,
      port: Number(process.env.EMAIL_PORT),
      secure: true,
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });
    await transporter.sendMail({
      from: `GBConnect <${process.env.EMAIL_USER}>`,
      to: email,
      subject: 'GBConnect Password Reset OTP',
      text: `Your OTP for password reset is: ${otp}\nThis code is valid for 10 minutes.`,
      html: `<p>Your OTP for password reset is: <b>${otp}</b></p><p>This code is valid for 10 minutes.</p>`,
    });
    return NextResponse.json({ message: 'OTP sent to your email' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../services/model';
import { EmailNotConfiguredError, sendOtpEmail } from '@/lib/email';

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

    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    await db.collection('emailOtps').deleteMany({ email });
    await db.collection('emailOtps').insertOne({
      email,
      otp,
      createdAt: new Date(),
      expiresAt: new Date(Date.now() + 10 * 60 * 1000),
      used: false,
    });

    try {
      await sendOtpEmail({
        to: email,
        otp,
        subject: 'GBConnect password reset code',
      });
    } catch (mailError) {
      await db.collection('emailOtps').deleteMany({ email });
      console.error('[ForgotPassword] Failed to send OTP email:', mailError instanceof Error ? mailError.message : mailError);
      return NextResponse.json({
        error: mailError instanceof EmailNotConfiguredError
          ? mailError.message
          : 'Failed to send OTP to your email. Check EMAIL_USER / EMAIL_PASS in .env.',
      }, { status: 503 });
    }

    return NextResponse.json({ message: `OTP sent to ${email}` });
  } catch (error) {
    console.error('[ForgotPassword] error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Failed to send OTP' }, { status: 500 });
  }
}

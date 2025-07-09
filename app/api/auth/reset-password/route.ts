import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../services/model';
import bcrypt from 'bcryptjs';

export async function POST(req: NextRequest) {
  try {
    const { email, otp, password } = await req.json();
    if (!email || !otp || !password) {
      return NextResponse.json({ error: 'Email, OTP, and new password are required' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    // Check OTP (must be unused and not expired)
    const otpDoc = await db.collection('emailOtps').findOne({ email, otp, used: true });
    if (!otpDoc) {
      return NextResponse.json({ error: 'Invalid or expired OTP' }, { status: 400 });
    }
    // Update user password
    const hashedPassword = await bcrypt.hash(password, 10);
    const result = await db.collection('users').updateOne(
      { email },
      { $set: { password: hashedPassword } }
    );
    if (result.modifiedCount === 0) {
      return NextResponse.json({ error: 'Failed to update password' }, { status: 500 });
    }
    return NextResponse.json({ message: 'Password reset successful' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to reset password' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../services/model';

export async function POST(req: NextRequest) {
  try {
    const { email, otp } = await req.json();
    if (!email || !otp) {
      return NextResponse.json({ error: 'Email and OTP are required' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const otpDoc = await db.collection('emailOtps').findOne({ email, otp, used: false });
    if (!otpDoc) {
      return NextResponse.json({ error: 'Invalid OTP' }, { status: 400 });
    }
    if (new Date() > new Date(otpDoc.expiresAt)) {
      return NextResponse.json({ error: 'OTP has expired' }, { status: 400 });
    }
    // Mark OTP as used
    await db.collection('emailOtps').updateOne({ _id: otpDoc._id }, { $set: { used: true } });
    return NextResponse.json({ message: 'OTP verified' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to verify OTP' }, { status: 500 });
  }
} 
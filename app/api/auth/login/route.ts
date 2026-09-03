import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { connectToDatabase } from '../../services/model';

const JWT_SECRET = process.env.JWT_SECRET?.trim() || 'dev_secret';

export async function POST(req: NextRequest) {
  let email = undefined;
  try {
    const body = await req.json();
    email = body.email;
    const { password } = body;
    if (!email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const users = db.collection('users');
    const user = await users.findOne({ email });
    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
    return NextResponse.json({
      token,
      user: {
        _id: user._id,
        email: user.email,
        userType: user.userType,
        name: user.name || '',
        avatar: user.avatar || '',
        location: user.location || '',
      }
    });
  } catch (error) {
    console.error('Login error:', { error: error instanceof Error ? error.message : error, email });
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
} 
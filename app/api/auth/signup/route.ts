import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcryptjs';
import { connectToDatabase } from '../../services/model';

// POST: Create account
export async function POST(req: NextRequest) {
  try {
    const { email, password, userType, name, phone, location } = await req.json();
    console.log('[Signup] POST request for', email);
    if (!email || !password || !userType) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await connectToDatabase();
    const db = client.db();
    const users = db.collection('users');
    const existingUser = await users.findOne({ email });
    if (existingUser) {
      console.log('[Signup] User already exists:', email);
      return NextResponse.json({ error: 'User already exists' }, { status: 409 });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    await users.insertOne({
      email,
      password: hashedPassword,
      userType,
      name,
      phone,
      location,
      createdAt: new Date(),
      verified: true,
    });

    console.log('[Signup] User created:', email);
    return NextResponse.json({ message: 'Account created successfully' }, { status: 201 });
  } catch (error) {
    console.error('[Signup] POST error:', error instanceof Error ? error.message : error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

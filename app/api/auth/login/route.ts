import { NextRequest, NextResponse } from 'next/server';
import { MongoClient } from 'mongodb';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
// mongodb+srv://aliyasmuhammad1122:aliyassajid@cluster0.cifooiu.mongodb.net
const uri = 'mongodb+srv://GBConnect:GBConnect@cluster0.3v0gb0g.mongodb.net/GBConnect';
const JWT_SECRET = process.env.JWT_SECRET || 'dev_secret';
let cachedClient: MongoClient | null = null;

async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export async function POST(req: NextRequest) {
  let email = undefined;
  try {
    console.log('Login: parsing request body');
    const body = await req.json();
    email = body.email;
    const { password } = body;
    console.log('Login: parsed body', { email });
    if (!email || !password) {
      console.log('Login: missing required fields');
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    console.log('Login: connecting to database');
    const client = await connectToDatabase();
    const db = client.db();
    const users = db.collection('users');
    console.log('Login: looking up user');
    const user = await users.findOne({ email });
    if (!user) {
      console.log('Login: user not found');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log('Login: comparing password');
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      console.log('Login: password mismatch');
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
    }
    console.log('Login: creating JWT');
    const token = jwt.sign({ userId: user._id, email: user.email, userType: user.userType }, JWT_SECRET, { expiresIn: '7d' });
    console.log('Login: success');
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
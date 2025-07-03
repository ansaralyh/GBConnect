import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../model';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const providerId = searchParams.get('providerId');
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const services = await db.collection('services').find({ providerId }).toArray();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch provider services' }, { status: 500 });
  }
} 
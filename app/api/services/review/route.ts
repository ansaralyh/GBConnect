import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../model';

// GET: Fetch all reviews by userId
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const userId = searchParams.get('userId');
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const reviews = await db.collection('reviews').find({ userId }).sort({ createdAt: -1 }).toArray();
    // Populate service details
    const serviceIds = reviews.map(r => r.serviceId);
    const services = await db.collection('services').find({ _id: { $in: serviceIds.map(id => typeof id === 'string' ? new ObjectId(id) : id) } }).toArray();
    const serviceMap = Object.fromEntries(services.map(s => [s._id.toString(), s]));
    const mapped = reviews.map((r) => ({ ...r, id: r._id?.toString?.() || r.id, service: serviceMap[r.serviceId] }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
} 
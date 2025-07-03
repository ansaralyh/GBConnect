import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Review } from '../../model';
import { ObjectId } from 'mongodb';

// POST: Add a review for a service
export async function POST(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: serviceId } = params;
    const body = await req.json();
    const { userId, rating, comment, userName, userAvatar } = body;
    if (!userId || !rating || !comment) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const now = new Date();
    const newReview: any = {
      serviceId,
      userId,
      rating,
      comment,
      userName: userName || null,
      userAvatar: userAvatar || null,
      createdAt: now,
      updatedAt: now,
    };
    const result = await db.collection('reviews').insertOne(newReview);
    return NextResponse.json({ ...newReview, _id: result.insertedId, id: result.insertedId.toString() }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to add review' }, { status: 500 });
  }
}

// GET: Fetch all reviews for a service
export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id: serviceId } = params;
    const client = await connectToDatabase();
    const db = client.db();
    const reviews = await db.collection('reviews').find({ serviceId }).sort({ createdAt: -1 }).toArray();
    const mapped = reviews.map((r) => ({ ...r, id: r._id?.toString?.() || r.id }));
    return NextResponse.json(mapped);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch reviews' }, { status: 500 });
  }
} 
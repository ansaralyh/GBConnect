import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../services/model';
import { ObjectId } from 'mongodb';

// PATCH: Update user profile
export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, avatar, location, phone, website, bio } = body;
    if (!userId) {
      return NextResponse.json({ error: 'Missing userId' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const updateFields: any = {};
    if (name !== undefined) updateFields.name = name;
    if (avatar !== undefined) updateFields.avatar = avatar;
    if (location !== undefined) updateFields.location = location;
    if (phone !== undefined) updateFields.phone = phone;
    if (website !== undefined) updateFields.website = website;
    if (bio !== undefined) updateFields.bio = bio;
    const result = await db.collection('users').findOneAndUpdate(
      { _id: new ObjectId(userId) },
      { $set: updateFields },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }
    return NextResponse.json({ ...result.value, id: result.value._id?.toString?.() || result.value.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update profile' }, { status: 500 });
  }
} 
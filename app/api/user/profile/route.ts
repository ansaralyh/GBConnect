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

// GET: Fetch user profile by id
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    if (!id) {
      return NextResponse.json({ error: "Missing id" }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    let user = null;
    // Check if id is a valid ObjectId
    let isValidObjectId = false;
    try {
      isValidObjectId = ObjectId.isValid(id);
    } catch {}
    if (isValidObjectId) {
      user = await db.collection("users").findOne({ _id: new ObjectId(id) });
    } else {
      user = await db.collection("users").findOne({ _id: id as any });
    }
    if (!user) {
      return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    return NextResponse.json(user);
  } catch (error) {
    return NextResponse.json({ error: "Failed to fetch user" }, { status: 500 });
  }
} 
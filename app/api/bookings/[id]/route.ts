import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../../services/model';
import { ObjectId } from 'mongodb';

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await connectToDatabase();
    const db = client.db();
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) });
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    // Fetch the service details
    const service = await db.collection('services').findOne({ _id: new ObjectId(booking.serviceId) });
    return NextResponse.json({
      ...booking,
      id: booking._id?.toString?.() || booking.id,
      _id: booking._id?.toString?.() || booking.id,
      service: service ? { ...service, id: service._id?.toString?.() || service.id } : null,
    });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { status } = body;
    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' }
    );
    if (!result.value) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 });
    }
    return NextResponse.json({ ...result.value, id: result.value._id?.toString?.() || result.value.id });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 });
  }
} 
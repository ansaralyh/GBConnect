import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Booking } from '../services/model';
import { ObjectId } from 'mongodb';

// Create a new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, userId, checkIn, checkOut, guests, status, totalPrice } = body;
    if (!serviceId || !userId || !checkIn || !checkOut || !guests || !status || !totalPrice) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const newBooking: Booking = {
      serviceId,
      userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: Number(guests),
      status,
      totalPrice: Number(totalPrice),
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    const result = await db.collection('bookings').insertOne(newBooking);
    return NextResponse.json({ ...newBooking, id: result.insertedId.toString(), _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 });
  }
}

// Get bookings for a user or provider
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!);
    const userId = searchParams.get('userId');
    const providerId = searchParams.get('providerId');
    const client = await connectToDatabase();
    const db = client.db();
    let bookings = [];
    if (userId) {
      bookings = await db.collection('bookings').find({ userId }).toArray();
    } else if (providerId) {
      // Find all services owned by this provider
      const services = await db.collection('services').find({ providerId }).toArray();
      const serviceIds = services.map(s => s._id.toString());
      bookings = await db.collection('bookings').find({ serviceId: { $in: serviceIds } }).toArray();
    } else {
      return NextResponse.json({ error: 'Missing userId or providerId' }, { status: 400 });
    }
    // Fetch all services and map by _id
    const services = await db.collection('services').find({}).toArray();
    const serviceMap = Object.fromEntries(services.map(s => [s._id.toString(), s]));
    const mappedBookings = bookings.map((booking) => ({
      ...booking,
      id: booking._id?.toString?.() || booking.id,
      _id: booking._id?.toString?.() || booking.id,
      service: serviceMap[booking.serviceId],
    }));
    return NextResponse.json(mappedBookings);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
} 
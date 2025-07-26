import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Booking } from '../services/model';
import { ObjectId } from 'mongodb';

// Create a new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { serviceId, userId, checkIn, checkOut, guests, status } = body;
    if (!serviceId || !userId || !checkIn || !checkOut || !guests || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    // Fetch the service to snapshot its details
    const service = await db.collection('services').findOne({ _id: new ObjectId(serviceId) });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    const serviceSnapshot = {
      title: service.title,
      price: service.price,
      location: service.location,
      category: service.category,
      providerId: service.providerId,
      images: service.images || [],
      serviceFeeRate: service.serviceFeeRate ?? 0.1,
      taxRate: service.taxRate ?? 0.05,
    };
    // Calculate booking cost breakdown using per-service rates
    const checkInDate = new Date(checkIn);
    const checkOutDate = new Date(checkOut);
    
    // Calculate nights more accurately (inclusive of check-in, exclusive of check-out)
    const nights = Math.max(1, Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)));
    
    const guestsCount = Number(guests);
    const basePrice = Number(service.price) || 0;
    
    // Calculate subtotal based on pricing model
    // Default: per night per guest, but can be customized per service
    const pricingModel = service.pricingModel || 'per_night_per_guest'; // per_night_per_guest, per_night_total, per_booking
    
    let subtotal = 0;
    switch (pricingModel) {
      case 'per_night_total':
        // Total price for the entire stay regardless of guests
        subtotal = basePrice * nights;
        break;
      case 'per_booking':
        // Fixed price for the entire booking
        subtotal = basePrice;
        break;
      case 'per_night_per_guest':
      default:
        // Price per night per guest (most common for accommodations)
        subtotal = basePrice * nights * guestsCount;
        break;
    }
    
    // Calculate fees and taxes with proper precision - all dynamic from service data
    const serviceFeeRate = Number(service.serviceFeeRate) || 0; // Use service's fee rate or 0 if not set
    const taxRate = Number(service.taxRate) || 0; // Use service's tax rate or 0 if not set
    
    const serviceFee = Math.round(subtotal * serviceFeeRate * 100) / 100; // Round to 2 decimal places
    const taxes = Math.round(subtotal * taxRate * 100) / 100; // Round to 2 decimal places
    const totalPrice = Math.round((subtotal + serviceFee + taxes) * 100) / 100; // Round to 2 decimal places
    const newBooking: Booking = {
      serviceId,
      userId,
      checkIn: new Date(checkIn),
      checkOut: new Date(checkOut),
      guests: guestsCount,
      status,
      totalPrice,
      subtotal,
      serviceFee,
      taxes,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceSnapshot,
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
      // For user bookings, use aggregation to get service details
      bookings = await db.collection('bookings').aggregate([
        { $match: { userId } },
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            let: { userId: '$userId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$_id', { $toObjectId: '$$userId' }] },
                      { $eq: ['$_id', '$$userId'] }
                    ]
                  }
                }
              }
            ],
            as: 'user'
          }
        },
        { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
      ]).toArray();
    } else if (providerId) {
      // For provider bookings, use aggregation to get both service and user details
      const services = await db.collection('services').find({ providerId }).toArray();
      const serviceIds = services.map(s => s._id.toString());
      
      bookings = await db.collection('bookings').aggregate([
        { $match: { serviceId: { $in: serviceIds } } },
        {
          $lookup: {
            from: 'services',
            localField: 'serviceId',
            foreignField: '_id',
            as: 'service'
          }
        },
        {
          $lookup: {
            from: 'users',
            let: { userId: '$userId' },
            pipeline: [
              {
                $match: {
                  $expr: {
                    $or: [
                      { $eq: ['$_id', { $toObjectId: '$$userId' }] },
                      { $eq: ['$_id', '$$userId'] }
                    ]
                  }
                }
              }
            ],
            as: 'user'
          }
        },
        { $unwind: { path: '$service', preserveNullAndEmptyArrays: true } },
        { $unwind: { path: '$user', preserveNullAndEmptyArrays: true } }
      ]).toArray();
    } else {
      return NextResponse.json({ error: 'Missing userId or providerId' }, { status: 400 });
    }
    
    const mappedBookings = bookings.map((booking) => {
      // Debug logging
      console.log('Booking userId:', booking.userId);
      console.log('User lookup result:', booking.user);
      
      return {
        ...booking,
        id: booking._id?.toString?.() || booking.id,
        _id: booking._id?.toString?.() || booking.id,
        // Include user info for guest name
        guestName: booking.user?.name || 'Unknown Guest',
        guestEmail: booking.user?.email || '',
      };
    });
    
    return NextResponse.json(mappedBookings);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, Booking } from '../services/model'
import { ObjectId } from 'mongodb'

function toObjectIds(ids: string[]) {
  return ids.filter((id) => ObjectId.isValid(id)).map((id) => new ObjectId(id))
}

async function hydrateBookings(db: any, bookings: any[]) {
  if (bookings.length === 0) return []

  const serviceIds = [
    ...new Set(bookings.map((b) => String(b.serviceId || '')).filter(Boolean)),
  ]
  const userIds = [...new Set(bookings.map((b) => String(b.userId || '')).filter(Boolean))]

  const [services, users] = await Promise.all([
    serviceIds.length
      ? db
          .collection('services')
          .find({
            $or: [
              { _id: { $in: toObjectIds(serviceIds) } },
              { _id: { $in: serviceIds as any } },
            ],
          })
          .project({
            title: 1,
            price: 1,
            location: 1,
            category: 1,
            images: { $slice: 1 },
            providerId: 1,
          })
          .toArray()
      : Promise.resolve([]),
    userIds.length
      ? db
          .collection('users')
          .find({
            $or: [
              { _id: { $in: toObjectIds(userIds) } },
              { _id: { $in: userIds as any } },
            ],
          })
          .project({ name: 1, email: 1, phone: 1 })
          .toArray()
      : Promise.resolve([]),
  ])

  const serviceMap = new Map(services.map((s: any) => [s._id.toString(), s]))
  const userMap = new Map(users.map((u: any) => [u._id.toString(), u]))

  return bookings.map((booking) => {
    const serviceId = String(booking.serviceId || '')
    const userId = String(booking.userId || '')
    const service = serviceMap.get(serviceId) || booking.serviceSnapshot || null
    const guest = userMap.get(userId) || null
    const id = booking._id?.toString?.() || booking.id

    return {
      ...booking,
      id,
      _id: id,
      service,
      guestName: guest?.name || 'Unknown Guest',
      guestEmail: guest?.email || '',
      guestPhone: guest?.phone || '',
    }
  })
}

// Create a new booking
export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { serviceId, userId, checkIn, checkOut, guests, status } = body
    if (!serviceId || !userId || !checkIn || !checkOut || !guests || !status) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const service = await db.collection('services').findOne({ _id: new ObjectId(serviceId) })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
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
    }

    const checkInDate = new Date(checkIn)
    const checkOutDate = new Date(checkOut)
    const nights = Math.max(
      1,
      Math.ceil((checkOutDate.getTime() - checkInDate.getTime()) / (1000 * 60 * 60 * 24)),
    )
    const guestsCount = Number(guests)
    const basePrice = Number(service.price) || 0
    const pricingModel = service.pricingModel || 'per_night_per_guest'

    let subtotal = 0
    switch (pricingModel) {
      case 'per_night_total':
        subtotal = basePrice * nights
        break
      case 'per_booking':
        subtotal = basePrice
        break
      case 'per_night_per_guest':
      default:
        subtotal = basePrice * nights * guestsCount
        break
    }

    const serviceFeeRate = Number(service.serviceFeeRate) || 0
    const taxRate = Number(service.taxRate) || 0
    const serviceFee = Math.round(subtotal * serviceFeeRate * 100) / 100
    const taxes = Math.round(subtotal * taxRate * 100) / 100
    const totalPrice = Math.round((subtotal + serviceFee + taxes) * 100) / 100

    const newBooking: Booking = {
      serviceId,
      userId,
      checkIn: checkInDate,
      checkOut: checkOutDate,
      guests: guestsCount,
      status,
      totalPrice,
      subtotal,
      serviceFee,
      taxes,
      createdAt: new Date(),
      updatedAt: new Date(),
      serviceSnapshot,
    }

    const result = await db.collection('bookings').insertOne(newBooking)
    return NextResponse.json(
      { ...newBooking, id: result.insertedId.toString(), _id: result.insertedId },
      { status: 201 },
    )
  } catch (error) {
    console.error('[Bookings POST]', error)
    return NextResponse.json({ error: 'Failed to create booking' }, { status: 500 })
  }
}

// Get bookings for a user or provider — simple finds (fast) instead of heavy aggregations
export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!)
    const userId = searchParams.get('userId')
    const providerId = searchParams.get('providerId')
    const client = await connectToDatabase()
    const db = client.db()

    let bookings: any[] = []

    if (userId) {
      bookings = await db
        .collection('bookings')
        .find({ userId })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()
    } else if (providerId) {
      const providerFilter = ObjectId.isValid(providerId)
        ? { providerId: { $in: [providerId, new ObjectId(providerId)] } }
        : { providerId }

      const services = await db
        .collection('services')
        .find(providerFilter)
        .project({ _id: 1 })
        .toArray()

      const serviceIdStrings = services.map((s) => s._id.toString())
      if (serviceIdStrings.length === 0) {
        return NextResponse.json([])
      }

      bookings = await db
        .collection('bookings')
        .find({ serviceId: { $in: serviceIdStrings } })
        .sort({ createdAt: -1 })
        .limit(100)
        .toArray()
    } else {
      return NextResponse.json({ error: 'Missing userId or providerId' }, { status: 400 })
    }

    const mapped = await hydrateBookings(db, bookings)
    return NextResponse.json(mapped)
  } catch (error) {
    console.error('[Bookings GET]', error)
    return NextResponse.json({ error: 'Failed to fetch bookings' }, { status: 500 })
  }
}

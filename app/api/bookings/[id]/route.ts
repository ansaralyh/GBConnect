import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../../services/model'
import { ObjectId } from 'mongodb'

type RouteContext = { params: Promise<{ id: string }> }

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const booking = await db.collection('bookings').findOne({ _id: new ObjectId(id) })
    if (!booking) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    let service = booking.serviceSnapshot || null
    if (!service && booking.serviceId && ObjectId.isValid(booking.serviceId)) {
      const serviceDoc = await db.collection('services').findOne({ _id: new ObjectId(booking.serviceId) })
      service = serviceDoc
        ? { ...serviceDoc, id: serviceDoc._id?.toString?.() || serviceDoc.id }
        : null
    }

    let guest = null
    if (booking.userId) {
      try {
        guest = ObjectId.isValid(booking.userId)
          ? await db.collection('users').findOne({ _id: new ObjectId(booking.userId) })
          : await db.collection('users').findOne({ _id: booking.userId as any })
      } catch {
        guest = null
      }
    }

    return NextResponse.json({
      ...booking,
      id: booking._id?.toString?.() || booking.id,
      _id: booking._id?.toString?.() || booking.id,
      service,
      guestName: guest?.name || booking.guestName || 'Unknown Guest',
      guestEmail: guest?.email || booking.guestEmail || '',
      guestPhone: guest?.phone || '',
    })
  } catch (error) {
    console.error('[Booking GET]', error)
    return NextResponse.json({ error: 'Failed to fetch booking' }, { status: 500 })
  }
}

export async function PATCH(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })
    }

    const body = await req.json()
    const { status } = body
    if (!status) {
      return NextResponse.json({ error: 'Missing status' }, { status: 400 })
    }

    const allowed = ['pending', 'confirmed', 'cancelled', 'completed', 'rejected']
    if (!allowed.includes(status)) {
      return NextResponse.json({ error: 'Invalid status' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const result = await db.collection('bookings').findOneAndUpdate(
      { _id: new ObjectId(id) },
      { $set: { status, updatedAt: new Date() } },
      { returnDocument: 'after' },
    )

    // MongoDB Node driver v6 returns the document directly (or null)
    if (!result) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({
      ...result,
      id: result._id?.toString?.() || result.id,
      _id: result._id?.toString?.() || result.id,
    })
  } catch (error) {
    console.error('[Booking PATCH]', error)
    return NextResponse.json({ error: 'Failed to update booking' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid booking id' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const result = await db.collection('bookings').findOneAndDelete({ _id: new ObjectId(id) })

    // MongoDB Node driver v6 returns the deleted document directly (or null)
    if (!result) {
      return NextResponse.json({ error: 'Booking not found' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Booking deleted', id })
  } catch (error) {
    console.error('[Booking DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete booking' }, { status: 500 })
  }
}

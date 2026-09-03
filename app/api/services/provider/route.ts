import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../model'
import { ObjectId } from 'mongodb'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url!)
    const providerId = searchParams.get('providerId')
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()

    const filter = ObjectId.isValid(providerId)
      ? { providerId: { $in: [providerId, new ObjectId(providerId)] } }
      : { providerId }

    const services = await db
      .collection('services')
      .find(filter)
      .project({
        title: 1,
        description: 1,
        price: 1,
        images: { $slice: 1 },
        category: 1,
        location: 1,
        providerId: 1,
        status: 1,
        rating: 1,
        createdAt: 1,
        updatedAt: 1,
      })
      .sort({ createdAt: -1 })
      .toArray()
    return NextResponse.json(
      services.map((s) => ({
        ...s,
        id: s._id?.toString?.() || s.id,
        _id: s._id?.toString?.() || s.id,
      })),
    )
  } catch (error) {
    console.error('[Provider services GET]', error)
    return NextResponse.json({ error: 'Failed to fetch provider services' }, { status: 500 })
  }
}

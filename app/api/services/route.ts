import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase, Service } from './model'
import { ObjectId } from 'mongodb'

export async function GET() {
  try {
    const client = await connectToDatabase()
    const db = client.db()

    const services = await db.collection('services').find({}).toArray()

    const providerIds = [
      ...new Set(
        services
          .map((s) => (s.providerId != null ? String(s.providerId) : null))
          .filter((id): id is string => !!id && ObjectId.isValid(id)),
      ),
    ]

    const users =
      providerIds.length > 0
        ? await db
            .collection('users')
            .find({ _id: { $in: providerIds.map((id) => new ObjectId(id)) } })
            .project({ name: 1, email: 1 })
            .toArray()
        : []

    const userMap = new Map(users.map((u) => [u._id.toString(), u]))

    const mappedServices = services.map((service) => {
      const providerIdStr = service.providerId != null ? String(service.providerId) : ''
      const provider = providerIdStr ? userMap.get(providerIdStr) : null
      const id = service._id?.toString?.() || service.id

      return {
        ...service,
        id,
        _id: id,
        providerName: provider?.name || 'Unknown Provider',
        providerEmail: provider?.email || '',
      }
    })

    return NextResponse.json(mappedServices)
  } catch (error) {
    console.error('Error fetching services:', error)
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 })
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json()
    const { title, description, price, images, category, location, providerId, status } = body

    if (!title?.trim() || !description?.trim() || price === undefined || price === null || !providerId) {
      return NextResponse.json(
        { error: 'Missing required fields', details: { title, description, price, providerId } },
        { status: 400 },
      )
    }

    if (!ObjectId.isValid(providerId)) {
      return NextResponse.json({ error: 'Invalid providerId format' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const providerObjectId = new ObjectId(providerId)

    const user = await db.collection('users').findOne({ _id: providerObjectId })
    if (!user) {
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 })
    }

    const newService: Service = {
      title,
      description,
      price: Number(price),
      images: images || [],
      category: category || '',
      location: location || '',
      providerId: providerObjectId.toString(),
      createdAt: new Date(),
      updatedAt: new Date(),
      status: status || 'draft',
    }

    const result = await db.collection('services').insertOne(newService)
    return NextResponse.json({ ...newService, _id: result.insertedId }, { status: 201 })
  } catch (error) {
    console.error('Error creating service:', error)
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 })
  }
}

import { NextRequest, NextResponse } from 'next/server'
import { connectToDatabase } from '../model'
import { ObjectId } from 'mongodb'

type RouteContext = { params: Promise<{ id: string }> }

function providerIdFilter(providerId: string) {
  if (ObjectId.isValid(providerId)) {
    return { $in: [providerId, new ObjectId(providerId)] }
  }
  return providerId
}

export async function PUT(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid service id' }, { status: 400 })
    }

    const body = await req.json()
    const { title, description, price, images, category, location, providerId, status } = body
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const result = await db.collection('services').findOneAndUpdate(
      { _id: new ObjectId(id), providerId: providerIdFilter(String(providerId)) },
      {
        $set: {
          title,
          description,
          price: Number(price),
          images: images || [],
          category: category || '',
          location: location || '',
          updatedAt: new Date(),
          status: status || 'draft',
        },
      },
      { returnDocument: 'after' },
    )

    // MongoDB Node driver v6 returns the document directly (or null)
    if (!result) {
      return NextResponse.json({ error: 'Service not found or not authorized' }, { status: 404 })
    }
    return NextResponse.json(result)
  } catch (error) {
    console.error('[Services PUT]', error)
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 })
  }
}

export async function DELETE(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid service id' }, { status: 400 })
    }

    const body = await req.json()
    const { providerId } = body
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()

    // Match providerId whether it was stored as string or ObjectId
    const result = await db.collection('services').findOneAndDelete({
      _id: new ObjectId(id),
      providerId: providerIdFilter(String(providerId)),
    })

    // MongoDB Node driver v6 returns the deleted document directly (or null)
    if (!result) {
      return NextResponse.json({ error: 'Service not found or not authorized' }, { status: 404 })
    }

    return NextResponse.json({ message: 'Service deleted', id })
  } catch (error) {
    console.error('[Services DELETE]', error)
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 })
  }
}

export async function GET(req: NextRequest, { params }: RouteContext) {
  try {
    const { id } = await params
    if (!ObjectId.isValid(id)) {
      return NextResponse.json({ error: 'Invalid service id' }, { status: 400 })
    }

    const client = await connectToDatabase()
    const db = client.db()
    const service = await db.collection('services').findOne({ _id: new ObjectId(id) })
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 })
    }
    return NextResponse.json({
      ...service,
      id: service._id.toString(),
      _id: service._id.toString(),
    })
  } catch (error) {
    console.error('[Services GET]', error)
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 })
  }
}

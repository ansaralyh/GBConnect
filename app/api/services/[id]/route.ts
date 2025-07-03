import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase } from '../model';
import { ObjectId } from 'mongodb';

export async function PUT(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { title, description, price, images, category, location, providerId, status } = body;
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const result = await db.collection('services').findOneAndUpdate(
      { _id: new ObjectId(id), providerId },
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
      { returnDocument: 'after' }
    );
    if (!result || !result.value) {
      return NextResponse.json({ error: 'Service not found or not authorized' }, { status: 404 });
    }
    return NextResponse.json(result.value);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to update service' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const body = await req.json();
    const { providerId } = body;
    if (!providerId) {
      return NextResponse.json({ error: 'Missing providerId' }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const result = await db.collection('services').findOneAndDelete({ _id: new ObjectId(id), providerId });
    if (!result || !result.value) {
      return NextResponse.json({ error: 'Service not found or not authorized' }, { status: 404 });
    }
    return NextResponse.json({ message: 'Service deleted' });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to delete service' }, { status: 500 });
  }
}

export async function GET(req: NextRequest, { params }: { params: { id: string } }) {
  try {
    const { id } = params;
    const client = await connectToDatabase();
    const db = client.db();
    const service = await db.collection('services').findOne({ _id: new ObjectId(id) });
    if (!service) {
      return NextResponse.json({ error: 'Service not found' }, { status: 404 });
    }
    return NextResponse.json(service);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch service' }, { status: 500 });
  }
} 
import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Service } from './model';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    const services = await db.collection('services').find({}).toArray();
    return NextResponse.json(services);
  } catch (error) {
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price, images, category, location, providerId, status } = body;
    console.log('Received body:', body);
    console.log('Parsed fields:', { title, description, price, providerId });
    if (!title?.trim() || !description?.trim() || price === undefined || price === null || providerId === undefined || providerId === null || providerId === '') {
      return NextResponse.json({ error: 'Missing required fields', details: { title, description, price, providerId } }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    const newService: Service = {
      title,
      description,
      price: Number(price),
      images: images || [],
      category: category || '',
      location: location || '',
      providerId,
      createdAt: new Date(),
      updatedAt: new Date(),
      status: status || 'draft',
    };
    const result = await db.collection('services').insertOne(newService);
    return NextResponse.json({ ...newService, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
} 
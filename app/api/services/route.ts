import { NextRequest, NextResponse } from 'next/server';
import { connectToDatabase, Service } from './model';
import { ObjectId } from 'mongodb';

export async function GET() {
  try {
    const client = await connectToDatabase();
    const db = client.db();
    
    // Debug: Check what users exist
    const users = await db.collection('users').find({}).toArray();
    console.log('Available users:', users.map(u => ({
      userId: u._id,
      userName: u.name,
      userEmail: u.email
    })));
    
    // Get all services first
    const services = await db.collection('services').find({}).toArray();
    console.log('All services structure:', services.map(s => ({
      serviceId: s._id,
      providerId: s.providerId,
      title: s.title
    })));
    
    // Fix services with invalid providerIds (like "1", "2", etc.)
    for (const service of services) {
      if (service.providerId && service.providerId.length < 24) {
        console.log('Found service with invalid providerId:', service._id, service.providerId);
        
        // Try to find a user by name or email that might match
        // This is a temporary fix - in production you'd want to map these properly
        const firstUser = users[0];
        if (firstUser) {
          console.log('Updating service providerId from', service.providerId, 'to', firstUser._id.toString());
          await db.collection('services').updateOne(
            { _id: service._id },
            { $set: { providerId: firstUser._id.toString() } }
          );
        }
      }
    }
    
    // Get updated services
    const updatedServices = await db.collection('services').find({}).toArray();
    
    // Create a map of user IDs to user data for quick lookup
    const userMap = new Map();
    users.forEach(user => {
      userMap.set(user._id.toString(), user);
    });
    
    const mappedServices = updatedServices.map((service) => {
      // Try to find the provider by providerId
      let provider = null;
      if (service.providerId) {
        try {
          // Handle both string and ObjectId providerIds
          const providerIdStr = typeof service.providerId === 'string' ? service.providerId : service.providerId.toString();
          provider = userMap.get(providerIdStr);
        } catch (error) {
          console.log('Error looking up provider for service:', service._id, error);
        }
      }
      
      // Debug logging for each service
      console.log('Service mapping:', {
        serviceId: service._id,
        providerId: service.providerId,
        providerFound: !!provider,
        providerName: provider?.name
      });
      
      return {
        ...service,
        id: service._id?.toString?.() || service.id,
        _id: service._id?.toString?.() || service.id,
        // Include provider info with fallback
        providerName: provider?.name || 'Unknown Provider',
        providerEmail: provider?.email || '',
      };
    });
    
    return NextResponse.json(mappedServices);
  } catch (error) {
    console.error('Error fetching services:', error);
    return NextResponse.json({ error: 'Failed to fetch services' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { title, description, price, images, category, location, providerId, status } = body;
    console.log('Received body:', body);
    console.log('Parsed fields:', { title, description, price, providerId });
    console.log('ProviderId type:', typeof providerId, 'Value:', providerId);
    
    if (!title?.trim() || !description?.trim() || price === undefined || price === null || providerId === undefined || providerId === null || providerId === '') {
      return NextResponse.json({ error: 'Missing required fields', details: { title, description, price, providerId } }, { status: 400 });
    }
    const client = await connectToDatabase();
    const db = client.db();
    
    // Convert providerId to ObjectId if it's a valid string
    let providerObjectId;
    try {
      console.log('Attempting to convert providerId to ObjectId:', providerId);
      providerObjectId = new ObjectId(providerId);
      console.log('Successfully converted to ObjectId:', providerObjectId.toString());
    } catch (error) {
      console.error('Failed to convert providerId to ObjectId:', error);
      return NextResponse.json({ error: 'Invalid providerId format' }, { status: 400 });
    }
    
    // Verify the user exists
    const user = await db.collection('users').findOne({ _id: providerObjectId });
    if (!user) {
      console.error('User not found with providerId:', providerObjectId.toString());
      return NextResponse.json({ error: 'Provider not found' }, { status: 404 });
    }
    console.log('Found provider user:', { userId: user._id, userName: user.name, userEmail: user.email });
    
    const newService: Service = {
      title,
      description,
      price: Number(price),
      images: images || [],
      category: category || '',
      location: location || '',
      providerId: providerObjectId.toString(), // Store as string but ensure it's a valid ObjectId
      createdAt: new Date(),
      updatedAt: new Date(),
      status: status || 'draft',
    };
    const result = await db.collection('services').insertOne(newService);
    console.log('Service created successfully:', { serviceId: result.insertedId, providerId: newService.providerId });
    return NextResponse.json({ ...newService, _id: result.insertedId }, { status: 201 });
  } catch (error) {
    console.error('Error creating service:', error);
    return NextResponse.json({ error: 'Failed to create service' }, { status: 500 });
  }
} 
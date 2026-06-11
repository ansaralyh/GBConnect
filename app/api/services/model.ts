import { MongoClient, ObjectId } from 'mongodb';

const uri = process.env.MONGO_URI?.trim() || 'mongodb://localhost:27017/GBConnect';
let cachedClient: MongoClient | null = null;

function maskUri(connectionUri: string) {
  return connectionUri.replace(/\/\/([^:@/]+):([^@/]+)@/, '//$1:***@');
}

export async function connectToDatabase() {
  if (cachedClient) {
    console.log('[DB] Using cached MongoDB connection');
    return cachedClient;
  }

  console.log('[DB] Connecting to MongoDB:', maskUri(uri));

  const options = {
    serverSelectionTimeoutMS: 15000,
    family: 4,
  };

  let lastError: unknown;
  for (let attempt = 1; attempt <= 2; attempt++) {
    try {
      const client = new MongoClient(uri, options);
      await client.connect();
      await client.db().command({ ping: 1 });
      console.log('[DB] MongoDB connected successfully');
      cachedClient = client;
      return client;
    } catch (error) {
      lastError = error;
      console.error(`[DB] MongoDB connection attempt ${attempt} failed:`, error instanceof Error ? error.message : error);
      if (attempt < 2) {
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }
  }

  throw lastError;
}

export interface Service {
  _id?: ObjectId;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  location: string;
  providerId: ObjectId | string; // Can be either ObjectId or string for flexibility
  createdAt: Date;
  updatedAt: Date;
  status?: string;
  serviceFeeRate?: number;
  taxRate?: number;
}

export interface ServiceSnapshot {
  title: string;
  price: number;
  location: string;
  category: string;
  providerId: string;
  images: string[];
  serviceFeeRate?: number;
  taxRate?: number;
}

export interface Booking {
  _id?: ObjectId;
  serviceId: string;
  userId: string;
  checkIn: Date;
  checkOut: Date;
  guests: number;
  status: string;
  totalPrice: number;
  subtotal?: number;
  serviceFee?: number;
  taxes?: number;
  createdAt: Date;
  updatedAt: Date;
  serviceSnapshot?: ServiceSnapshot;
}

export interface Review {
  _id?: ObjectId;
  serviceId: string;
  userId: string;
  rating: number;
  comment: string;
  createdAt: Date;
  updatedAt: Date;
} 
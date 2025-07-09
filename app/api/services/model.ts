import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb+srv://GBConnect:GBConnect@cluster0.3v0gb0g.mongodb.net/GBConnect';
let cachedClient: MongoClient | null = null;

export async function connectToDatabase() {
  if (cachedClient) return cachedClient;
  const client = new MongoClient(uri);
  await client.connect();
  cachedClient = client;
  return client;
}

export interface Service {
  _id?: ObjectId;
  title: string;
  description: string;
  price: number;
  images: string[];
  category: string;
  location: string;
  providerId: string;
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
import { MongoClient, ObjectId } from 'mongodb';

const uri = 'mongodb://127.0.0.1:27017/GBConnect';
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
  createdAt: Date;
  updatedAt: Date;
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
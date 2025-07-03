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
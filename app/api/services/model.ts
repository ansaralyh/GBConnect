import { MongoClient, ObjectId } from 'mongodb'

const uri = process.env.MONGO_URI?.trim() || 'mongodb://localhost:27017/GBConnect'

declare global {
  // Persist across hot reloads in Next.js / webpack
  // eslint-disable-next-line no-var
  var _mongoClientPromise: Promise<MongoClient> | undefined
}

function maskUri(connectionUri: string) {
  return connectionUri.replace(/\/\/([^:@/]+):([^@/]+)@/, '//$1:***@')
}

function createClientPromise() {
  const client = new MongoClient(uri, {
    maxPoolSize: 10,
    minPoolSize: 1,
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4,
  })
  console.log('[DB] Creating MongoDB connection pool:', maskUri(uri))
  return client.connect().then((connected) => {
    console.log('[DB] MongoDB connected successfully')
    return connected
  })
}

export async function connectToDatabase() {
  if (!global._mongoClientPromise) {
    global._mongoClientPromise = createClientPromise()
  }
  return global._mongoClientPromise
}

export interface Service {
  _id?: ObjectId
  title: string
  description: string
  price: number
  images: string[]
  category: string
  location: string
  providerId: ObjectId | string
  createdAt: Date
  updatedAt: Date
  status?: string
  serviceFeeRate?: number
  taxRate?: number
}

export interface ServiceSnapshot {
  title: string
  price: number
  location: string
  category: string
  providerId: string
  images: string[]
  serviceFeeRate?: number
  taxRate?: number
}

export interface Booking {
  _id?: ObjectId
  serviceId: string
  userId: string
  checkIn: Date
  checkOut: Date
  guests: number
  status: string
  totalPrice: number
  subtotal?: number
  serviceFee?: number
  taxes?: number
  createdAt: Date
  updatedAt: Date
  serviceSnapshot?: ServiceSnapshot
}

export interface Review {
  _id?: ObjectId
  serviceId: string
  userId: string
  rating: number
  comment: string
  createdAt: Date
  updatedAt: Date
}

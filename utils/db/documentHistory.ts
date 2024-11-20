import { MongoClient, ObjectId } from 'mongodb';

if (!process.env.MONGODB_URI) {
  throw new Error('Please add your Mongodb URI to .env.local');
}

const client = new MongoClient(process.env.MONGODB_URI);
const dbName = 'nyai';

export interface DocumentHistory {
  _id?: ObjectId;
  userId: string;
  fileName: string;
  fileType: string;
  fileSize: number;
  processedContent: string;
  summary: string;
  language: string;
  timestamp: Date;
  status: 'processed' | 'failed';
}

export async function saveDocumentHistory(history: Omit<DocumentHistory, '_id'>) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection('document_history');
    const result = await collection.insertOne(history);
    return result;
  } finally {
    await client.close();
  }
}

export async function getUserHistory(userId: string) {
  try {
    await client.connect();
    const collection = client.db(dbName).collection('document_history');
    return await collection
      .find({ userId })
      .sort({ timestamp: -1 })
      .limit(10)
      .toArray();
  } finally {
    await client.close();
  }
} 
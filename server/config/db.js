import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = process.env.MONGODB_URI;
const client = new MongoClient(uri);

let db = null;

export const connectDB = async () => {
  try {
    await client.connect();
    console.log('Connected to MongoDB successfully!');
    db = client.db('learn2earn');
    return db;
  } catch (error) {
    console.error('MongoDB connection error:', error);
    process.exit(1);
  }
};

export const getDB = () => {
  if (!db) {
    throw new Error('Database not initialized. Call connectDB first.');
  }
  return db;
};

export const closeDB = async () => {
  await client.close();
};

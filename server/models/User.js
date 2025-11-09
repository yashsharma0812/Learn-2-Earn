import bcrypt from 'bcrypt';
import { getDB } from '../config/db.js';

const COLLECTION_NAME = 'users';

export const createUser = async (email, password, username) => {
  const db = getDB();
  const users = db.collection(COLLECTION_NAME);

  const existingUser = await users.findOne({ email });
  if (existingUser) {
    throw new Error('User already exists');
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const user = {
    email,
    password: hashedPassword,
    username,
    createdAt: new Date(),
    points: 0,
    completedModules: []
  };

  const result = await users.insertOne(user);
  return { ...user, _id: result.insertedId };
};

export const findUserByEmail = async (email) => {
  const db = getDB();
  const users = db.collection(COLLECTION_NAME);
  return await users.findOne({ email });
};

export const findUserById = async (userId) => {
  const db = getDB();
  const users = db.collection(COLLECTION_NAME);
  const { ObjectId } = await import('mongodb');
  return await users.findOne({ _id: new ObjectId(userId) });
};

export const verifyPassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
};

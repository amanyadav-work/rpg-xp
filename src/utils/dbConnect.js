import mongoose from 'mongoose';

const MONGO_URI = process.env.MONGODB_ATLAS_URI || 'mongodb://127.0.0.1:27017/rpg';

let isConnected = false;

export async function dbConnect() {
  if (isConnected) {
    return;
  }

  try {
    await mongoose.connect(MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    isConnected = true;
    console.log('MongoDB connected');
  } catch (error) {
    console.error('MongoDB connection error:', error);
    throw error;
  }
}

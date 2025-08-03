import mongoose from 'mongoose'
import env from './env.js'
export const connectDB = async () => {
  try {
     await mongoose.connect(env.MONGODB_URI);
    console.log('MongoDB Connected...');
  } catch (err) {
    console.error('MongoDB Connection Error:', err.message);
    process.exit(1); // Exit process with failure
  }
};


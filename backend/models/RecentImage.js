// models/RecentImage.js
import mongoose from 'mongoose';

const recentImageSchema = new mongoose.Schema({
  url: {
    type: String,
    required: true,
  },
  filename: String,
  size: Number,
  uploadedAt: {
    type: Date,
    default: Date.now,
  },
});

export const RecentImage = mongoose.model('RecentImage', recentImageSchema);

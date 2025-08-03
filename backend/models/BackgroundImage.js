
import mongoose from 'mongoose';

const backgroundImageSchema = new mongoose.Schema({
  pageType: {
    type: String,
    enum: ['home', 'about'],
    required: true,
    unique: true 
  },
  url: {
    type: String,
    required: true
  },
  filename: String,
  uploadedAt: {
    type: Date,
    default: Date.now
  }
});

export const BackgroundImage = mongoose.model('BackgroundImage', backgroundImageSchema);

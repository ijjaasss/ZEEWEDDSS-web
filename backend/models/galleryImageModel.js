import mongoose from 'mongoose';

const GalleryImageSchema = new mongoose.Schema({
  fileId: { type: String, required: true },
  url: { type: String, required: true },        
  filename: { type: String, required: true },
  size: { type: Number, required: true }         
}, {
  timestamps: true
});

const GalleryImage = mongoose.model('GalleryImage', GalleryImageSchema);
export default GalleryImage;

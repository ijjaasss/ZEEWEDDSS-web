import mongoose from 'mongoose';

const GallerySchema = new mongoose.Schema({
  clientName: { type: String, required: true },
  eventName: { type: String, required: true },
  eventDate: { type: String, required: true },           
  images: [{ type: mongoose.Schema.Types.ObjectId, ref: 'GalleryImage' }],  
  createdAt: { type: Date, default: Date.now }
});

const Gallery = mongoose.model('Gallery', GallerySchema);
export default Gallery;

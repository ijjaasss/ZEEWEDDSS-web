// controllers/galleryImageController.js
import fs from 'fs/promises';
import { uploadToTelegram } from '../utils/uploadToTelegram.js';
import GalleryImage from '../models/galleryImageModel.js';
import Gallery from '../models/galleryModel.js';
import axios from 'axios';




export const uploadImage = async (req, res) => {
  try {
    const file = req.file;
    const { galleryId } = req.body;

    if (!file || !galleryId) {
      return res.status(400).json({ success: false, message: "Missing file or galleryId" });
    }
 
    // Upload to Telegram
    const imageUrl = await uploadToTelegram(file.path);

    // Save in MongoDB
    const imageDoc = await GalleryImage.create({
      url: imageUrl,
      filename: file.originalname,
      size: file.size,
    });

    // Link to Gallery
    await Gallery.findByIdAndUpdate(galleryId, {
      $push: { images: imageDoc._id },
    });

    
try {
  await fs.unlink(file.path);
  console.log("File deleted");
} catch (err) {
  console.error("Failed to delete file:", err.message);
}

    res.status(201).json({ success: true, data: imageDoc });
  } catch (err) {
    console.error("Image upload error:", err);
    res.status(500).json({ success: false, message: "Image upload failed" });
  }
};

export const downloadGalleryImage = async (req, res) => {
  try {
    const { imageUrl } = req.query;
    
    if (!imageUrl) {
      return res.status(400).json({ success: false, message: "Image URL is required" });
    }

    // Fetch the image from Telegram
    const response = await axios.get(imageUrl, {
      responseType: 'stream'
    });

    // Determine content type and extension
    const contentType = response.headers['content-type'] || 'image/jpeg';
    let extension = '.jpg';
    if (contentType.includes('png')) extension = '.png';
    if (contentType.includes('gif')) extension = '.gif';
    if (contentType.includes('webp')) extension = '.webp';

    // Set headers for download
    res.setHeader('Content-Type', contentType);
    res.setHeader('Content-Disposition', `attachment; filename="image${extension}"`);

    // Pipe the image data to response
    response.data.pipe(res);
  } catch (err) {
    console.error("Image download error:", err);
    res.status(500).json({ success: false, message: "Image download failed" });
  }
};
// controllers/recentImageController.js
import fs from 'fs/promises';
import { RecentImage } from '../models/RecentImage.js';
import { uploadToTelegram } from '../utils/uploadToTelegram.js';
import { generateNewTelegramUrl, validateTelegramUrl } from '../services/telagramService.js';

export const uploadRecentImage = async (req, res) => {
  try {
    const file = req.file;

    if (!file) {
      return res.status(400).json({ success: false, message: "Missing image file" });
    }

  
    const { fileId, url: imageUrl } = await uploadToTelegram(file.path);

    const imageDoc = await RecentImage.create({
      fileId,
      url: imageUrl,
      filename: file.originalname,
      size: file.size,
    });

   
    try {
      await fs.unlink(file.path);
      console.log("Temporary file deleted");
    } catch (err) {
      console.error("Failed to delete file:", err.message);
    }

    res.status(201).json({ success: true, data: imageDoc });
  } catch (err) {
    console.error("Recent image upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export const getRecentImages = async (req, res) => {
  try {
    const images = await RecentImage.find().sort({ uploadedAt: -1 }).limit(20);
     await Promise.all(images.map(async (img) => {
      const isValid = await validateTelegramUrl(img.url);
      if (!isValid) {
        const newUrl = await generateNewTelegramUrl(img.fileId);
        img.url = newUrl;
        await img.save();
      }
    }));
    res.json({ success: true, data: images });
  } catch (err) {
    console.error("Fetch recent images failed:", err);
    res.status(500).json({ success: false, message: "Failed to fetch" });
  }
};

export const deleteRecentImage = async (req, res) => {
  try {
    const { id } = req.params;

    const image = await RecentImage.findById(id);
    if (!image) {
      return res.status(404).json({ success: false, message: 'Image not found' });
    }

    await RecentImage.findByIdAndDelete(id);

    res.json({ success: true, message: 'Image deleted successfully' });
  } catch (err) {
    console.error("Delete image error:", err);
    res.status(500).json({ success: false, message: 'Delete failed' });
  }
};
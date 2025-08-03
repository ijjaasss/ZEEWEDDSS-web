// controllers/backgroundImageController.js
import fs from 'fs/promises';
import { BackgroundImage } from '../models/BackgroundImage.js';
import { uploadToTelegram } from '../utils/uploadToTelegram.js';

export const uploadBackgroundImage = async (req, res) => {
  try {
    const file = req.file;
    const { pageType } = req.body;

    if (!file || !pageType) {
      return res.status(400).json({ success: false, message: "Image and pageType are required" });
    }

    if (!['home', 'about'].includes(pageType)) {
      return res.status(400).json({ success: false, message: "pageType must be 'home' or 'about'" });
    }

    const imageUrl = await uploadToTelegram(file.path);


    const existing = await BackgroundImage.findOne({ pageType });
    let imageDoc;

    if (existing) {
      existing.url = imageUrl;
      existing.filename = file.originalname;
      existing.uploadedAt = new Date();
      await existing.save();
      imageDoc = existing;
    } else {
      imageDoc = await BackgroundImage.create({
        pageType,
        url: imageUrl,
        filename: file.originalname
      });
    }


    await fs.unlink(file.path).catch(err =>
      console.error("Failed to delete temp file:", err.message)
    );

    res.status(200).json({ success: true, data: imageDoc });
  } catch (err) {
    console.error("Upload error:", err);
    res.status(500).json({ success: false, message: "Upload failed" });
  }
};

export const getBackgroundImage = async (req, res) => {
  try {
  
  
    const images = await BackgroundImage.find();

    const result = {
      home: null,
      about: null,
    };

    images.forEach((img) => {
      if (img.pageType === 'home') result.home = img;
      if (img.pageType === 'about') result.about = img;
    });

    res.json({ success: true, data: result });
  } catch (err) {
    console.error("Fetch error:", err);
    res.status(500).json({ success: false, message: "Failed to fetch image" });
  }
};

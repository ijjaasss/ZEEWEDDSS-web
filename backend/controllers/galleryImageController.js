// controllers/galleryImageController.js
import fs from 'fs/promises';
import { uploadToTelegram } from '../utils/uploadToTelegram.js';
import GalleryImage from '../models/galleryImageModel.js';
import Gallery from '../models/galleryModel.js';
import axios from 'axios';
import sharp from 'sharp';

async function compressImage(inputPath) {
  const outputPath = `${inputPath}-compressed`;
  let quality = 85;
  let compressedPath = '';
  let compressedSize = Infinity;

  try {
    const metadata = await sharp(inputPath).metadata();
    const isTransparent = metadata.hasAlpha;

    do {
      const currentOutput = `${outputPath}-q${quality}.${metadata.format || 'jpg'}`;
      const compressor = sharp(inputPath);

      // Format-specific compression
      if (metadata.format === 'png' || isTransparent) {
        await compressor
          .png({ quality, progressive: true, compressionLevel: 9 })
          .toFile(currentOutput);
      } else if (metadata.format === 'webp') {
        await compressor
          .webp({ quality, alphaQuality: quality, lossless: false })
          .toFile(currentOutput);
      } else {
        await compressor
          .jpeg({ quality, mozjpeg: true, progressive: true })
          .toFile(currentOutput);
      }

      // Verify the file was created
      const stats = await fs.stat(currentOutput);
      compressedSize = stats.size;
      compressedPath = currentOutput;

      if (compressedSize <= 19 * 1024 * 1024) break;
      
      // Clean up failed attempt if file exists but is too large
      await fs.unlink(currentOutput).catch(() => {});
      quality -= 5;

    } while (quality >= 30);

    if (compressedSize > 19 * 1024 * 1024) {
      throw new Error('Could not compress below 19MB');
    }

    return compressedPath;

  } catch (err) {
    // Clean up any partial files
    if (compressedPath) {
      await fs.unlink(compressedPath).catch(() => {});
    }
    throw new Error(`Compression failed: ${err.message}`);
  }
}

export const uploadImage = async (req, res) => {
   let tempFiles = [];
  try {
    const file = req.file;
    const { galleryId } = req.body;

    if (!file || !galleryId) {
      return res.status(400).json({ success: false, message: "Missing file or galleryId" });
    }
     tempFiles.push(file.path);
      let finalPath = file.path;
    if (file.size > 20 * 1024 * 1024) {
      finalPath = await compressImage(file.path);
      tempFiles.push(finalPath);
    }
    // Upload to Telegram
    const imageUrl = await uploadToTelegram(finalPath);

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

    
// try {
//   await fs.unlink(file.path);
//   console.log("File deleted");
// } catch (err) {
//   console.error("Failed to delete file:", err.message);
// }
  await Promise.all(
      tempFiles.map(filePath => 
        fs.unlink(filePath).catch(err => console.error('Delete error:', err))
    ))
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
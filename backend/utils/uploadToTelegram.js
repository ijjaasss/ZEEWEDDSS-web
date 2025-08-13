
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import path from 'path'; // Add this import
import http from 'http'; // Add these for keep-alive agents
import https from 'https'; // Add these for keep-alive agents
import env from '../config/env.js';

export const uploadToTelegram = async (filePath) => {
  const botToken = env.botToken;
  const chatId = env.chatId;
  const stats = fs.statSync(filePath);
  const fileSize = stats.size;

  // Conservative limits with buffer
  const PHOTO_LIMIT = 8 * 1024 * 1024; // 8MB (with 2MB buffer)
  const DOCUMENT_LIMIT = 20 * 1024 * 1024; // 20MB (with 5MB buffer)

  if (fileSize > DOCUMENT_LIMIT) {
    throw new Error(`File size (${(fileSize / (1024 * 1024)).toFixed(2)}MB) exceeds our 45MB limit`);
  }

  const form = new FormData();
  form.append('chat_id', chatId);

  try {
    const endpoint = fileSize > PHOTO_LIMIT 
      ? `https://api.telegram.org/bot${botToken}/sendDocument` 
      : `https://api.telegram.org/bot${botToken}/sendPhoto`;

    // Create read stream with highWaterMark for better memory management
    const fileStream = fs.createReadStream(filePath, {
      highWaterMark: 2 * 1024 * 1024 // 2MB chunks
    });

    form.append(fileSize > PHOTO_LIMIT ? 'document' : 'photo', fileStream, {
      filename: path.basename(filePath), // Now using the imported path module
      knownLength: fileSize
    });

    // Extended timeout for large files (in milliseconds)
    const timeout = fileSize > 20 * 1024 * 1024 ? 300000 : 60000; // 5min/1min

    const sendRes = await axios.post(endpoint, form, {
      headers: {
        ...form.getHeaders(),
        'Connection': 'keep-alive'
      },
      maxBodyLength: Infinity,
      maxContentLength: Infinity,
      timeout,
      maxRedirects: 0,
      httpAgent: new http.Agent({ keepAlive: true }),
      httpsAgent: new https.Agent({ keepAlive: true })
    });

    const fileObj = sendRes.data?.result?.document || 
                   sendRes.data?.result?.photo?.pop();
    
    if (!fileObj?.file_id) {
      throw new Error('Invalid file response from Telegram');
    }

    const fileRes = await axios.get(
      `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileObj.file_id}`,
      { timeout: 10000 }
    );

    return `https://api.telegram.org/file/bot${botToken}/${fileRes.data.result.file_path}`;
  } catch (err) {
    console.error('Detailed upload error:', {
      fileSizeMB: (fileSize / (1024 * 1024)).toFixed(2),
      error: err.response?.data || err.message,
      stack: err.stack
    });
    throw new Error(`Upload failed for ${(fileSize / (1024 * 1024)).toFixed(2)}MB file`);
  }
};
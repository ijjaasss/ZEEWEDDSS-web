// utils/uploadToTelegram.js
import axios from 'axios';
import FormData from 'form-data';
import fs from 'fs';
import env from '../config/env.js';

export const uploadToTelegram = async (filePath) => {
  const botToken = env.botToken;
  const chatId = env.chatId;

  const form = new FormData();
  form.append('chat_id', chatId);
  form.append('photo', fs.createReadStream(filePath));

  // Send photo to Telegram
 let sendRes;
  try {
    sendRes = await axios.post(
      `https://api.telegram.org/bot${botToken}/sendPhoto`,
      form,
      { headers: form.getHeaders() }
    );
  } catch (err) {
    console.error('❌ Failed to upload to Telegram:', err.response?.data || err.message);
    throw new Error('Telegram upload failed');
  }

  // ✅ Step 2: Validate response
  const photoArray = sendRes.data?.result?.photo;
  if (!photoArray || !Array.isArray(photoArray) || photoArray.length === 0) {
    console.error('❌ Invalid photo response from Telegram:', sendRes.data);
    throw new Error('Telegram did not return a photo');
  }
  const fileId =  photoArray[photoArray.length - 1].file_id;

  // Get file path to build image URL
  const fileRes = await axios.get(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
  );

  const filePathUrl = fileRes.data.result.file_path;
  const imageUrl = `https://api.telegram.org/file/bot${botToken}/${filePathUrl}`;

  return imageUrl;
};

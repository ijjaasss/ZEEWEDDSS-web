import axios from "axios";
import env from "../config/env.js";
export const validateTelegramUrl = async (url) => {
  try {
    const headRes = await axios.head(url, { timeout: 5000 });
    return headRes.status === 200;
  } catch {
    return false;
  }
};
export const generateNewTelegramUrl = async (fileId) => {
  const botToken = env.botToken;
  const fileRes = await axios.get(
    `https://api.telegram.org/bot${botToken}/getFile?file_id=${fileId}`
  );
  return `https://api.telegram.org/file/bot${botToken}/${fileRes.data.result.file_path}`;
};
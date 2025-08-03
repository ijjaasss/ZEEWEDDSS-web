
import dotenv from 'dotenv';

dotenv.config();

export default {
  PORT: process.env.PORT || 3000,
  MONGODB_URI: process.env.MONGODB_URI,
  NODE_ENV: process.env.NODE_ENV || 'development',
  JWT_SECRET:process.env.JWT_SECRET,
  JWT_EXPIRE:process.env.JWT_EXPIRE,
  COOKIE_EXPIRE:process.env.COOKIE_EXPIRE,
  botToken : process.env.TELEGRAM_BOT_TOKEN,
  chatId :process.env.TELEGRAM_CHAT_ID,
  CLIENT_URL:process.env.CLIENT_URL
};

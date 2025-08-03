import express from 'express';
import morgan from 'morgan';
import cors from 'cors';

import { connectDB } from './config/db.js';
import env from './config/env.js';
import routes from './routes/index.js'; // adjust if routes is a folder with index.js
import cookieParser from 'cookie-parser';

// Create Express app
const app = express();

// Connect to MongoDB
connectDB();

// Middlewares
const options={
  origin: env.CLIENT_URL, 
  credentials: true              
}
app.use(cors(options));
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

if (env.NODE_ENV === 'development') {
  app.use(morgan('dev'));
}

// Routes
app.use('/api', routes);

// Error handling middleware (add to the end after all other middlewares/routes)
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ error: 'Something went wrong!' });
});

export default app;

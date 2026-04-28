import express from 'express';
import mongoose from 'mongoose';
import cors from 'cors';
import dotenv from 'dotenv';
import taskRoutes from './routes/tasks';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Routes
app.use('/api/tasks', taskRoutes);

// Database Connection
console.log('Skipping MongoDB connection. Using in-memory array for Tasks...');
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import taskRoutes from './routes/taskRoutes';
import tagRoutes from './routes/tagRoutes';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors());
app.use(bodyParser.json());

app.use('/api/tasks', taskRoutes);
app.use('/api/tags', tagRoutes);

app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Task Tracker API is running' });
});

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/task-tracker';

mongoose.connect(MONGODB_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err);
    process.exit(1);
  });

export default app;
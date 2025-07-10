import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import prisma from './prisma';

dotenv.config(); // Loads .env

const app = express();
app.use(cors());
app.use(express.json());

const PORT = process.env.PORT || 3001;

// Route to fetch all YouTube videos
app.get('/api/videos', async (req, res) => {
  try {
    const videos = await prisma.youtubeVideo.findMany({
      orderBy: { date: 'desc' },
    });
    res.json(videos);
  } catch (error) {
    console.error('Error fetching videos:', error);
    res.status(500).json({ error: 'Failed to fetch videos' });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});

import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { YoutubeVideo } from '../../types/YoutubeVideo';
import YearSection from './YearSection';
import '../../styles/YoutubeVideos.css';

const groupVideosByYear = (videos: YoutubeVideo[]) => {
  return videos.reduce<Record<string, YoutubeVideo[]>>((acc, video) => {
    const year = new Date(video.date).getFullYear().toString();
    if (!acc[year]) acc[year] = [];
    acc[year].push(video);
    return acc;
  }, {});
};

const YoutubeVideos: React.FC = () => {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);

  const API_HOST = import.meta.env.VITE_API_HOST;
  const API_PORT = import.meta.env.VITE_API_PORT;

  useEffect(() => {
    axios
      .get<YoutubeVideo[]>(`${API_HOST}:${API_PORT}/api/videos`)
      .then((res) => setVideos(res.data))
      .catch((err) => console.error('Error fetching videos:', err));
  }, []);

  const videosByYear = groupVideosByYear(videos);
  const sortedYears = Object.keys(videosByYear).sort((a, b) => Number(b) - Number(a));

  return (
    <div className="container">
      <h2>What am I up to?</h2>
      <div className="timeline-container">
        <div className="timeline-content">
          {sortedYears.map((year) => (
            <YearSection key={year} year={year} videos={videosByYear[year]} />
          ))}

          <div className="timeline-year-group">
            <div className="timeline-marker">
              <div className="year-label">le beginning....</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default YoutubeVideos;

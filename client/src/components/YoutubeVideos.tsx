import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { YoutubeVideo } from '../types/YoutubeVideo';


const YoutubeVideos: React.FC = () => {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);

const API_HOST = import.meta.env.VITE_API_HOST;
const API_PORT = import.meta.env.VITE_API_PORT;

  useEffect(() => {
    axios.get<YoutubeVideo[]>(`${API_HOST}:${API_PORT}/api/videos`)
      .then(res => setVideos(res.data))
      .catch(err => console.error('Error fetching videos:', err));
  }, []);

  return (
    <div>
      <h2>YouTube Videos</h2>
      <ul>
        {videos.map(video => (
          <li key={video.id}>
            <a href={video.link} target="_blank" rel="noopener noreferrer">{video.name}</a>
            <div>{new Date(video.date).toDateString()}</div>
            {video.location && <div>📍 {video.location}</div>}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default YoutubeVideos;

import React, { useEffect } from 'react';
import type { YoutubeVideo } from '../../types/YoutubeVideo';
import { useGeocode } from '../geolocation/useGeocode';
import '../../styles/YoutubeVideos.css';

const getYouTubeThumbnail = (url: string): string | null => {
  const match = url.match(/[?&]v=([^&]+)/) || url.match(/youtu\.be\/([^?&]+)/);
  return match ? `https://img.youtube.com/vi/${match[1]}/hqdefault.jpg` : null;
};

interface Props {
  video: YoutubeVideo;
  isSelected: boolean;
  onClick: () => void;
  onCoordsUpdate: (coords: { lat: number; lng: number } | null) => void;
  onLocationUpdate: (locationName: string | null) => void;
}

const VideoCard: React.FC<Props> = ({
  video,
  isSelected,
  onClick,
  onCoordsUpdate,
  onLocationUpdate,
}) => {
  const thumbnailUrl = getYouTubeThumbnail(video.link);
  const coords = useGeocode(isSelected ? video.location ?? null : null);

  useEffect(() => {
    if (isSelected) {
      onLocationUpdate(video.location ?? null);
      if (coords) onCoordsUpdate(coords);
    }
  }, [isSelected, coords]);

  return (
    <div className={`video-card ${isSelected ? 'selected' : ''}`} onClick={onClick}>
      <div className="thumbnail-box">
        {thumbnailUrl && <img src={thumbnailUrl} alt={`${video.name} thumbnail`} />}
      </div>
      <div className="video-info">
        <a href={video.link} target="_blank" rel="noopener noreferrer">
          <h3>{video.name}</h3>
        </a>
        {video.date && <p>📅 {new Date(video.date).toDateString()}</p>}
        {video.location && <p>📍 {video.location}</p>}
      </div>
    </div>
  );
};

export default VideoCard;

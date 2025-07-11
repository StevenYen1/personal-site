import React from 'react';
import type { YoutubeVideo } from '../../types/YoutubeVideo';
import VideoCard from './VideoCard';

interface Props {
  year: string;
  videos: YoutubeVideo[];
  selectedCardId: string | null;
  onCardClick: (id: string) => void;
}

const YearSection: React.FC<Props> = ({ year, videos, selectedCardId, onCardClick }) => (
  <div className="timeline-year-group">
    <div className="timeline-marker">
      <div className="year-label">{year}</div>
    </div>
    <div className="year-videos">
      {videos.map((video) => (
        <VideoCard
          key={video.id}
          video={video}
          isSelected={selectedCardId === String(video.id)}
          onClick={() => onCardClick(String(video.id))}
        />
      ))}
    </div>
  </div>
);

export default YearSection;

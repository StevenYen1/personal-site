import React from 'react';
import type { YoutubeVideo } from '../../types/YoutubeVideo';
import VideoCard from './VideoCard';

interface Props {
  year: string;
  videos: YoutubeVideo[];
}

const YearSection: React.FC<Props> = ({ year, videos }) => (
  <div className="timeline-year-group">
    <div className="timeline-marker">
      <div className="year-label">{year}</div>
    </div>
    <div className="year-videos">
      {videos.map((video) => (
        <VideoCard key={video.id} video={video} />
      ))}
    </div>
  </div>
);

export default YearSection;

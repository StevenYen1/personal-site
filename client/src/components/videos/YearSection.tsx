import type { YoutubeVideo } from '../../types/YoutubeVideo';
import VideoCard from './VideoCard';

interface Props {
  year: string;
  videos: YoutubeVideo[];
  selectedCardId: string | null;
  onCardClick: (id: string) => void;
  onCoordsUpdate: (coords: { lat: number; lng: number } | null) => void;
  onLocationUpdate: (locationName: string | null) => void;
}

const YearSection: React.FC<Props> = ({
  year,
  videos,
  selectedCardId,
  onCardClick,
  onCoordsUpdate,
  onLocationUpdate,
}) => (
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
          onCoordsUpdate={onCoordsUpdate}
          onLocationUpdate={onLocationUpdate}
        />
      ))}
    </div>
  </div>
);

export default YearSection;

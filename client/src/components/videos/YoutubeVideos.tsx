import React, { useEffect, useState } from 'react';
import axios from 'axios';
import type { YoutubeVideo } from '../../types/YoutubeVideo';
import { getMapImageUrl } from '../geolocation/mapUtils';
import YearSection from './YearSection';
import '../../styles/YoutubeVideos.css';

const groupVideosByYear = (videos: YoutubeVideo[]) =>
  videos.reduce<Record<string, YoutubeVideo[]>>((acc, video) => {
    const year = new Date(video.date).getFullYear().toString();
    (acc[year] ||= []).push(video);
    return acc;
  }, {});

const YoutubeVideos: React.FC = () => {
  const [videos, setVideos] = useState<YoutubeVideo[]>([]);
  const [selectedCardId, setSelectedCardId] = useState<string | null>(null);
  const [selectedCoordinates, setSelectedCoordinates] = useState<{ lat: number; lng: number } | null>(null);
  const [selectedLocationName, setSelectedLocationName] = useState<string | null>(null);

  const API_HOST = import.meta.env.VITE_API_HOST;
  const API_PORT = import.meta.env.VITE_API_PORT;

  useEffect(() => {
    axios
      .get<YoutubeVideo[]>(`${API_HOST}:${API_PORT}/api/videos`)
      .then((res) => setVideos(res.data))
      .catch((err) => console.error('Error fetching videos:', err));
  }, []);

  const toggleCard = (id: string) => {
    setSelectedCardId((prev) => (prev === id ? null : id));
  };

  const videosByYear = groupVideosByYear(videos);
  const sortedYears = Object.keys(videosByYear).sort((a, b) => Number(b) - Number(a));

  const mapImageUrl = getMapImageUrl(
    selectedCoordinates,
    selectedLocationName,
    import.meta.env.VITE_GOOGLE_MAPS_API_KEY
  );

  return (
    <div className="youtube-videos-wrapper">
      <div className="left-column" />

      <div className="middle-column">
        <h2>What am I up to?</h2>
        <div className="timeline-container">
          <div className="timeline-content">
            {sortedYears.map((year) => (
              <YearSection
                key={year}
                year={year}
                videos={videosByYear[year]}
                selectedCardId={selectedCardId}
                onCardClick={toggleCard}
                onCoordsUpdate={setSelectedCoordinates}
                onLocationUpdate={setSelectedLocationName}
              />
            ))}

            <div className="timeline-year-group">
              <div className="timeline-marker">
                <div className="year-label">Le beginning....</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className={`right-column ${selectedCardId ? 'visible' : 'hidden'}`}>
        <h2>Where am I exploring?</h2>
        {mapImageUrl ? (
          <img src={mapImageUrl} alt={`Map of ${selectedLocationName}`} />
        ) : (
          <p className="map-placeholder-text">Select a video to see the location</p>
        )}
      </div>
    </div>
  );
};

export default YoutubeVideos;

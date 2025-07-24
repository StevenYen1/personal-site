// client/src/hooks/useGeocode.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

interface LatLng {
  lat: number;
  lng: number;
}

export const useGeocode = (location: string | null) => {
  const [coords, setCoords] = useState<LatLng | null>(null);

  useEffect(() => {
    const fetchCoords = async () => {
      if (!location) {
        setCoords(null);
        return;
      }

      const apiKey = import.meta.env.VITE_GOOGLE_MAPS_API_KEY;
      const encodedLocation = encodeURIComponent(location);

      try {
        const res = await axios.get(
          `https://maps.googleapis.com/maps/api/geocode/json?address=${encodedLocation}&key=${apiKey}`
        );

        if (res.data.status === 'OK') {
          const { lat, lng } = res.data.results[0].geometry.location;
          setCoords({ lat, lng });
        } else {
          console.warn('Geocoding failed:', res.data.status);
          setCoords(null);
        }
      } catch (err) {
        console.error('Error fetching geocode:', err);
        setCoords(null);
      }
    };

    fetchCoords();
  }, [location]);

  return coords;
};

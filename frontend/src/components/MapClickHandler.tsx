// Fil: frontend/src/components/MapClickHandler.tsx
import { useMapEvents } from 'react-leaflet';
import type { LatLng } from 'leaflet';

interface MapClickHandlerProps {
  onMapClick: (latlng: LatLng) => void;
}

const MapClickHandler: React.FC<MapClickHandlerProps> = ({ onMapClick }) => {
  useMapEvents({
    click(e) {
      onMapClick(e.latlng);
    },
  });

  return null;
};

export default MapClickHandler;
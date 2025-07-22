import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import type { LatLng, LatLngExpression, LatLngBoundsExpression } from 'leaflet';
import MapClickHandler from './MapClickHandler';
import styles from './TravelMap.module.css';

interface TravelMapProps {
  startPos: LatLngExpression | null;
  endPos: LatLngExpression | null;
  route: LatLngExpression[];
  onMapClick: (latlng: LatLng) => void;
}

const TravelMap: React.FC<TravelMapProps> = ({ startPos, endPos, route, onMapClick }) => {
  const defaultCenter: LatLngExpression = [64.0, 15.0];
  const maxBounds: LatLngBoundsExpression = [
    [45, -15],
    [72, 40],
  ];

  return (
    <div className={styles.mapWrapper}>
      <MapContainer 
        center={defaultCenter} 
        zoom={4}
        minZoom={4}
        maxZoom={18}
        maxBounds={maxBounds}
        className={styles.mapContainer}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        <MapClickHandler onMapClick={onMapClick} />

        {startPos && <Marker position={startPos} />}
        {endPos && <Marker position={endPos} />}

        {route.length > 0 && <Polyline positions={route} color="var(--primary-blue)" weight={5} />}
      </MapContainer>
    </div>
  );
};

export default TravelMap;
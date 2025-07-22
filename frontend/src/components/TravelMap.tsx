import React from 'react';
import { MapContainer, TileLayer, Marker, Polyline } from 'react-leaflet';
import type { LatLngExpression } from 'leaflet';
import styles from './TravelMap.module.css';

interface TravelMapProps {
  startPos: LatLngExpression | null;
  endPos: LatLngExpression | null;
  route: LatLngExpression[];
}

const TravelMap: React.FC<TravelMapProps> = ({ startPos, endPos, route }) => {
  const defaultCenter: LatLngExpression = [63.4305, 10.3951]; // Midt-Norge

  return (
    <div className={styles.mapWrapper}>
      <MapContainer center={defaultCenter} zoom={5} className={styles.mapContainer}>
        <TileLayer
          attribution='© <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        {startPos && <Marker position={startPos} />}
        {endPos && <Marker position={endPos} />}
        {route.length > 0 && <Polyline positions={route} color="blue" />}
      </MapContainer>
    </div>
  );
};

export default TravelMap;
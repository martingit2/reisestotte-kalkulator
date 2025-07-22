// Fil: frontend/src/components/RouteInfoControl.tsx
import { useEffect } from 'react';
import { useMap } from 'react-leaflet';
import L from 'leaflet';
import styles from './RouteInfoControl.module.css';

interface RouteInfoControlProps {
  distance: number | null;
}

const RouteInfoControl: React.FC<RouteInfoControlProps> = ({ distance }) => {
  const map = useMap();

  useEffect(() => {
    if (!map) return;
    
    // Opprett en ny Leaflet-kontroll
    const control = new L.Control({ position: 'topright' });

    control.onAdd = () => {
      const div = L.DomUtil.create('div', styles.infoControl);
      div.innerHTML = distance !== null 
        ? `<strong>Avstand:</strong> ${distance.toFixed(1)} km` 
        : '';
      return div;
    };
    
    // Fjern den gamle kontrollen hvis den finnes, og legg til den nye
    const existingControl = (map as any)._controlContainer.querySelector(`.${styles.infoControl}`);
    if (existingControl) {
      existingControl.remove();
    }
    
    if (distance !== null) {
      control.addTo(map);
    }

  }, [map, distance]);

  return null;
};

export default RouteInfoControl;
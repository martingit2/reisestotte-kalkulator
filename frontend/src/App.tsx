import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import axios from 'axios';
import type { LatLng, LatLngExpression } from 'leaflet';
import './global.css';
import styles from './App.module.css';
import Header from './components/Header';
import TravelForm from './components/TravelForm';
import HistoryList from './components/HistoryList';
import TravelMap from './components/TravelMap';
import TransportSelector from './components/TransportSelector';

function App() {
  const { t } = useTranslation();
  const [historyKey, setHistoryKey] = useState(0);
  const [startPos, setStartPos] = useState<LatLngExpression | null>(null);
  const [endPos, setEndPos] = useState<LatLngExpression | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [distance, setDistance] = useState<number | null>(null);
  const [isSettingStart, setIsSettingStart] = useState(true);
  const [mapKey, setMapKey] = useState(Date.now());
  const [transportMode, setTransportMode] = useState('Egen bil');

  const handleCalculationSuccess = () => {
    setHistoryKey(prevKey => prevKey + 1);
    resetMapAndForm();
  };

  const resetMapAndForm = () => {
    setStartPos(null);
    setEndPos(null);
    setRoute([]);
    setDistance(null);
    setIsSettingStart(true);
    setMapKey(Date.now());
  };

  const handleMapClick = (latlng: LatLng) => {
    const newPos: LatLngExpression = [latlng.lat, latlng.lng];
    if (isSettingStart) {
      setStartPos(newPos);
      setEndPos(null);
      setRoute([]);
      setDistance(null);
      setIsSettingStart(false);
    } else {
      setEndPos(newPos);
      setIsSettingStart(true);
    }
  };

  const handleMarkerDoubleClick = (type: 'start' | 'end') => {
    if (type === 'start') {
      setStartPos(null);
      if (endPos === null) {
        setIsSettingStart(true);
      }
    } else {
      setEndPos(null);
      setIsSettingStart(false);
    }
    setRoute([]);
    setDistance(null);
  };

  const fetchAddressFromCoords = async (coords: LatLngExpression): Promise<string> => {
    try {
      const [lat, lon] = coords as number[];
      const response = await axios.get('https://nominatim.openstreetmap.org/reverse', {
        params: { lat, lon, format: 'json' }
      });
      return response.data.display_name || 'Ukjent adresse';
    } catch (error) {
      console.error("Kunne ikke hente adressenavn", error);
      return 'Kunne ikke hente adresse';
    }
  };

  useEffect(() => {
    const getRoute = async () => {
      if (startPos && endPos) {
        const formatCoords = (coords: LatLngExpression) => (coords as number[]).slice().reverse().join(',');
        const url = `https://router.project-osrm.org/route/v1/driving/${formatCoords(startPos)};${formatCoords(endPos)}?overview=full&geometries=geojson`;
        
        try {
          const response = await axios.get(url);
          const routeData = response.data.routes[0];
          setDistance(routeData.distance / 1000);
          setRoute(routeData.geometry.coordinates.map((p: number[]) => [p[1], p[0]]));
        } catch (error) {
          console.error("Kunne ikke hente rute:", error);
        }
      }
    };

    getRoute();
  }, [startPos, endPos]);

  return (
    <div className={styles.pageContainer}>
      <Header />

      <main className={styles.mainContainer}>
        <div className={styles.contentHeader}>
          <h1>{t('mainTitle')}</h1>
          <p className={styles.introText}>
            {isSettingStart ? t('introText') : t('introTextClickAgain')}
          </p>
        </div>

        <TransportSelector
          selectedValue={transportMode}
          onSelect={setTransportMode}
        />

        <TravelMap 
          key={mapKey}
          startPos={startPos} 
          endPos={endPos} 
          route={route} 
          onMapClick={handleMapClick}
          onMarkerDoubleClick={handleMarkerDoubleClick}
          distance={distance}
        />

        <TravelForm
          onCalculationSuccess={handleCalculationSuccess}
          setStartPos={setStartPos}
          setEndPos={setEndPos}
          distance={distance}
          startPos={startPos}
          endPos={endPos}
          fetchAddressFromCoords={fetchAddressFromCoords}
          transportMode={transportMode}
        />
        
        <HistoryList key={historyKey} />
      </main>
    </div>
  );
}

export default App;
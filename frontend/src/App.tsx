import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { IconCalculator } from '@tabler/icons-react';
import type { LatLngExpression } from 'leaflet';

import './global.css';
import styles from './App.module.css';

import TravelForm from './components/TravelForm';
import HistoryList from './components/HistoryList';
import TravelMap from './components/TravelMap';

function App() {
  const [historyKey, setHistoryKey] = useState(0);
  const [startPos, setStartPos] = useState<LatLngExpression | null>(null);
  const [endPos, setEndPos] = useState<LatLngExpression | null>(null);
  const [route, setRoute] = useState<LatLngExpression[]>([]);
  const [distance, setDistance] = useState<number | null>(null);

  const handleCalculationSuccess = () => {
    setHistoryKey(prevKey => prevKey + 1);
    // Nullstill kart og skjema etter vellykket beregning
    setStartPos(null);
    setEndPos(null);
    setRoute([]);
    setDistance(null);
  };

  // Effekt for å hente rute når start- eller sluttpunkt endres
  useEffect(() => {
    const getRoute = async () => {
      if (startPos && endPos) {
        // OSRM forventer formatet {longitude},{latitude};{longitude},{latitude}
        const start = `${(startPos as number[]).reverse().join(',')}`;
        const end = `${(endPos as number[]).reverse().join(',')}`;
        
        try {
          const response = await axios.get(
            `https://router.project-osrm.org/route/v1/driving/${start};${end}?overview=full&geometries=geojson`
          );
          const routeData = response.data.routes[0];
          setDistance(routeData.distance / 1000); // Konverter meter til km
          setRoute(routeData.geometry.coordinates.map((p: number[]) => [p[1], p[0]])); // Konverter [lon, lat] til [lat, lon]
        } catch (error) {
          console.error("Kunne ikke hente rute:", error);
        }
      }
    };

    getRoute();
  }, [startPos, endPos]);

  return (
    <div className={styles.pageWrapper}>
      <main className={styles.mainContainer}>
        <header className={styles.header}>
          <IconCalculator size={32} stroke={1.5} />
          <h1>Reisestøtte-kalkulator</h1>
        </header>
        
        <p className={styles.introText}>
          Søk etter adresser for å se ruten på kartet og få avstanden automatisk, 
          eller fyll ut skjemaet manuelt.
        </p>

        <TravelMap startPos={startPos} endPos={endPos} route={route} />

        <TravelForm
          onCalculationSuccess={handleCalculationSuccess}
          setStartPos={setStartPos}
          setEndPos={setEndPos}
          setRoute={setRoute}
          setDistance={setDistance}
          distance={distance}
        />
        
        <HistoryList key={historyKey} />
      </main>
    </div>
  );
}

export default App;
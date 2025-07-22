// Fil: frontend/src/components/HistoryList.tsx
import React, { useEffect, useState } from 'react';
import axios from 'axios';

import styles from './HistoryList.module.css';
import { IconClock, IconMapPin, IconRoute, IconCash } from '@tabler/icons-react';
import type { TravelClaim } from '../types';

const HistoryList: React.FC = () => {
  const [history, setHistory] = useState<TravelClaim[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        setIsLoading(true);
        const response = await axios.get<TravelClaim[]>('/api/v1/history');
        setHistory(response.data);
        setError(null);
      } catch (err) {
        setError('Kunne ikke laste historikk.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchHistory();
  }, []);

  if (isLoading) return <p>Laster historikk...</p>;
  if (error) return <p className={styles.error}>{error}</p>;

  return (
    <div className={styles.historyContainer}>
      <h2 className={styles.title}>Siste 5 beregninger</h2>
      {history.length === 0 ? (
        <p>Ingen beregninger er gjort ennå.</p>
      ) : (
        <ul className={styles.list}>
          {history.map((item) => (
            <li key={item.id} className={styles.listItem}>
              <div className={styles.mainInfo}>
                <div className={styles.route}>
                  <IconMapPin size={16} /> <span>{item.startAddress}</span>
                  <IconRoute size={16} /> <span>{item.destinationAddress}</span>
                </div>
                <div className={styles.supportAmount}>
                  {item.calculatedSupport.toFixed(2)} kr
                </div>
              </div>
              <div className={styles.metaInfo}>
                <IconCash size={14} /> {item.distanceKm} km | {item.transportMode} | <IconClock size={14} /> {new Date(item.createdAt).toLocaleString('no-NO')}
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default HistoryList;
import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TravelForm.module.css';
import { IconArrowRight } from '@tabler/icons-react';
import type { LatLngExpression } from 'leaflet';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface TravelFormProps {
  onCalculationSuccess: () => void;
  setStartPos: (pos: LatLngExpression | null) => void;
  setEndPos: (pos: LatLngExpression | null) => void;
  distance: number | null;
  startPos: LatLngExpression | null;
  endPos: LatLngExpression | null;
  fetchAddressFromCoords: (coords: LatLngExpression) => Promise<string>;
}

const TravelForm: React.FC<TravelFormProps> = ({
  onCalculationSuccess,
  setStartPos,
  setEndPos,
  distance,
  startPos,
  endPos,
  fetchAddressFromCoords
}) => {
  const [formData, setFormData] = useState({
    startAddress: '',
    destinationAddress: '',
    transportMode: 'Egen bil'
  });
  const [distanceInput, setDistanceInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeSearch, setActiveSearch] = useState<'start' | 'end' | null>(null);

  useEffect(() => {
    const performSearch = async (query: string) => {
      if (query.length < 3) {
        setSearchResults([]);
        return;
      }
      try {
        const response = await axios.get<SearchResult[]>('/api/v1/search-address', {
          params: { q: query }
        });
        setSearchResults(response.data);
      } catch (err) {
        console.error("Feil ved adressesøk:", err);
      }
    };

    const searchAddress = activeSearch === 'start' ? formData.startAddress : formData.destinationAddress;
    
    const handler = setTimeout(() => {
      if (activeSearch && searchAddress) {
        performSearch(searchAddress);
      }
    }, 300);

    return () => {
      clearTimeout(handler);
    };
  }, [formData.startAddress, formData.destinationAddress, activeSearch]);

  useEffect(() => {
    setDistanceInput(distance !== null ? distance.toFixed(1) : '');
  }, [distance]);

  useEffect(() => {
    if (startPos) {
      fetchAddressFromCoords(startPos).then(address => {
        setFormData(prev => ({ ...prev, startAddress: address }));
      });
    } else if (!endPos) {
      setFormData(prev => ({ ...prev, startAddress: '' }));
    }
  }, [startPos, fetchAddressFromCoords]);

  useEffect(() => {
    if (endPos) {
      fetchAddressFromCoords(endPos).then(address => {
        setFormData(prev => ({ ...prev, destinationAddress: address }));
      });
    } else if (!startPos) {
      setFormData(prev => ({ ...prev, destinationAddress: '' }));
    }
  }, [endPos, fetchAddressFromCoords]);

  const selectAddress = (result: SearchResult) => {
    const position: LatLngExpression = [parseFloat(result.lat), parseFloat(result.lon)];
    if (activeSearch === 'start') {
      setStartPos(position);
    } else if (activeSearch === 'end') {
      setEndPos(position);
    }
    setSearchResults([]);
    setActiveSearch(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);
    try {
      const finalDistance = parseFloat(distanceInput);
      if (isNaN(finalDistance) || finalDistance <= 0) {
        throw new Error("Avstand må være et gyldig, positivt tall.");
      }
      const requestData = { ...formData, distanceKm: finalDistance };
      await axios.post('/api/v1/calculate-support', requestData);
      onCalculationSuccess();
      setFormData({ startAddress: '', destinationAddress: '', transportMode: 'Egen bil' });
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || (err as Error).message || "En ukjent feil oppstod.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} onBlur={() => setTimeout(() => { if (searchResults.length > 0) setSearchResults([]); }, 200)}>
      <div className={styles.addressWrapper}>
        <div className={styles.inputGroup}>
          <label htmlFor="startAddress">Fra</label>
          <input
            type="text"
            id="startAddress"
            value={formData.startAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, startAddress: e.target.value }))}
            onFocus={() => setActiveSearch('start')}
            placeholder="Søk eller klikk på kartet..."
            autoComplete="off"
            required
          />
        </div>
        
        <div className={styles.inputGroup}>
          <label htmlFor="destinationAddress">Til</label>
          <input
            type="text"
            id="destinationAddress"
            value={formData.destinationAddress}
            onChange={(e) => setFormData(prev => ({ ...prev, destinationAddress: e.target.value }))}
            onFocus={() => setActiveSearch('end')}
            placeholder="Søk eller klikk på kartet..."
            autoComplete="off"
            required
          />
        </div>

        {searchResults.length > 0 && activeSearch && (
          <ul className={styles.searchResults}>
            {searchResults.map(result => (
              <li key={result.place_id} onMouseDown={() => selectAddress(result)}>
                {result.display_name}
              </li>
            ))}
          </ul>
        )}
      </div>

      <div className={styles.row}>
        <div className={styles.inputGroup}>
          <label htmlFor="distanceKm">Avstand (km)</label>
          <input
            type="number"
            id="distanceKm"
            name="distanceKm"
            value={distanceInput}
            onChange={(e) => setDistanceInput(e.target.value)}
            placeholder="Beregnes automatisk"
            required
            step="0.1"
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="transportMode">Transport</label>
          <select 
            id="transportMode" 
            name="transportMode" 
            value={formData.transportMode} 
            onChange={(e) => setFormData(prev => ({ ...prev, transportMode: e.target.value }))}
          >
            <option>Egen bil</option>
            <option>Kollektivtransport</option>
            <option>Annet</option>
          </select>
        </div>
      </div>

      <button type="submit" className={styles.submitButton} disabled={isLoading}>
        {isLoading ? 'Beregner...' : 'Beregn støtte'}
        {!isLoading && <IconArrowRight size={20} />}
      </button>

      {error && <p className={styles.errorText}>{error}</p>}
    </form>
  );
};

export default TravelForm;
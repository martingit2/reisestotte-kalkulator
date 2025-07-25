import { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TravelForm.module.css';
import { IconArrowRight } from '@tabler/icons-react';
import type { LatLngExpression } from 'leaflet';
import { useDebounce } from '../hooks/useDebounce';

interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

interface TravelFormProps {
  onCalculationSuccess: (amount: number) => void;
  setStartPos: (pos: LatLngExpression | null) => void;
  setEndPos: (pos: LatLngExpression | null) => void;
  distance: number | null;
  startPos: LatLngExpression | null;
  endPos: LatLngExpression | null;
  fetchAddressFromCoords: (coords: LatLngExpression) => Promise<string>;
  transportMode: string;
}

const TravelForm: React.FC<TravelFormProps> = ({
  onCalculationSuccess,
  setStartPos,
  setEndPos,
  distance,
  startPos,
  endPos,
  fetchAddressFromCoords,
  transportMode
}) => {
  const [formData, setFormData] = useState({
    startAddress: '',
    destinationAddress: ''
  });
  const [age, setAge] = useState('');
  const [hasFrikort, setHasFrikort] = useState(false);
  const [distanceInput, setDistanceInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [searchResults, setSearchResults] = useState<SearchResult[]>([]);
  const [activeSearch, setActiveSearch] = useState<'start' | 'end' | null>(null);

  const debouncedStartSearch = useDebounce(formData.startAddress, 300);
  const debouncedEndSearch = useDebounce(formData.destinationAddress, 300);

  const performSearch = async (query: string) => {
    try {
      const response = await axios.get<SearchResult[]>('/api/v1/search-address', {
        params: { q: query }
      });
      setSearchResults(response.data);
    } catch (err) {
      console.error("Feil ved adressesøk:", err);
      setSearchResults([]);
    }
  };

  useEffect(() => {
    if (activeSearch === 'start' && debouncedStartSearch.length >= 3) {
      performSearch(debouncedStartSearch);
    } else if (activeSearch !== 'end') {
      setSearchResults([]);
    }
  }, [debouncedStartSearch, activeSearch]);

  useEffect(() => {
    if (activeSearch === 'end' && debouncedEndSearch.length >= 3) {
      performSearch(debouncedEndSearch);
    } else if (activeSearch !== 'start') {
      setSearchResults([]);
    }
  }, [debouncedEndSearch, activeSearch]);

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
      const finalAge = parseInt(age);
      if (isNaN(finalDistance) || finalDistance <= 0) {
        throw new Error("Avstand må være et gyldig, positivt tall.");
      }
      if (isNaN(finalAge) || finalAge < 0) {
        throw new Error("Alder må være et gyldig tall.");
      }
      const requestData = { 
        startAddress: formData.startAddress,
        destinationAddress: formData.destinationAddress, 
        transportMode: transportMode, 
        distanceKm: finalDistance,
        age: finalAge,
        hasFrikort: hasFrikort
      };
      const response = await axios.post('/api/v1/calculate-support', requestData);
      const calculatedAmount = response.data.calculatedSupport;
      onCalculationSuccess(calculatedAmount);
      setFormData({ startAddress: '', destinationAddress: '' });
      setAge('');
      setHasFrikort(false);
    } catch (err) {
      const errorMessage = (err as any).response?.data?.message || (err as Error).message || "En ukjent feil oppstod.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form} onBlur={() => setTimeout(() => setActiveSearch(null), 200)}>
      <div className={styles.inputGroup}>
        <label htmlFor="startAddress">Fra</label>
        <div className={styles.searchInputWrapper}>
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
          {searchResults.length > 0 && activeSearch === 'start' && (
            <ul className={styles.searchResults}>
              {searchResults.map(result => (
                <li key={result.place_id} onMouseDown={() => selectAddress(result)}>
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
      
      <div className={styles.inputGroup}>
        <label htmlFor="destinationAddress">Til</label>
        <div className={styles.searchInputWrapper}>
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
          {searchResults.length > 0 && activeSearch === 'end' && (
            <ul className={styles.searchResults}>
              {searchResults.map(result => (
                <li key={result.place_id} onMouseDown={() => selectAddress(result)}>
                  {result.display_name}
                </li>
              ))}
            </ul>
          )}
        </div>
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
            min="0" 
          />
        </div>
        <div className={styles.inputGroup}>
          <label htmlFor="age">Alder</label>
          <input
            type="number"
            id="age"
            name="age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
            placeholder="f.eks. 35"
            required
            min="0"
          />
        </div>
      </div>

      <div className={styles.checkboxGroup}>
        <input 
          type="checkbox"
          id="hasFrikort"
          name="hasFrikort"
          checked={hasFrikort}
          onChange={(e) => setHasFrikort(e.target.checked)}
        />
        <label htmlFor="hasFrikort">Jeg har frikort</label>
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
import React, { useState, useEffect } from 'react';
import axios from 'axios';
import styles from './TravelForm.module.css';
import { IconArrowRight } from '@tabler/icons-react';
import type { LatLngExpression } from 'leaflet';




// Definerer hvordan et adressesøk-resultat ser ut
interface SearchResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
}

// Definerer props fra App.tsx
interface TravelFormProps {
  onCalculationSuccess: () => void;
  setStartPos: (pos: LatLngExpression | null) => void;
  setEndPos: (pos: LatLngExpression | null) => void;
  setRoute: (route: LatLngExpression[]) => void;
  setDistance: (distance: number | null) => void;
  distance: number | null;
}

const TravelForm: React.FC<TravelFormProps> = ({
  onCalculationSuccess,
  setStartPos,
  setEndPos,
  setRoute,
  setDistance,
  distance
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

  // Oppdater input-feltet for avstand når den beregnes automatisk
  useEffect(() => {
    if (distance !== null) {
      setDistanceInput(distance.toFixed(1));
    }
  }, [distance]);


  const handleAddressSearch = async (address: string) => {
    if (address.length < 3) {
      setSearchResults([]);
      return;
    }
    
    try {
      const response = await axios.get<SearchResult[]>(`https://nominatim.openstreetmap.org/search`, {
        params: { q: address, format: 'json', countrycodes: 'no', limit: 5 }
      });
      setSearchResults(response.data);
    } catch (error) {
      console.error("Feil ved adressesøk:", error);
    }
  };

  const selectAddress = (result: SearchResult) => {
    const position: LatLngExpression = [parseFloat(result.lat), parseFloat(result.lon)];
    
    if (activeSearch === 'start') {
      setFormData(prev => ({ ...prev, startAddress: result.display_name }));
      setStartPos(position);
    } else if (activeSearch === 'end') {
      setFormData(prev => ({ ...prev, destinationAddress: result.display_name }));
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
      
      const requestData = {
        startAddress: formData.startAddress,
        destinationAddress: formData.destinationAddress,
        transportMode: formData.transportMode,
        distanceKm: finalDistance,
      };

      await axios.post('/api/v1/calculate-support', requestData);

      onCalculationSuccess();
      
      // Nullstill skjemaet
      setFormData({ startAddress: '', destinationAddress: '', transportMode: 'Egen bil' });
      setDistanceInput('');
      setStartPos(null);
      setEndPos(null);
      setRoute([]);
      setDistance(null);

    } catch (err: any) {
      const errorMessage = err.response?.data?.message || err.message || "En ukjent feil oppstod.";
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className={styles.form}>
      <div className={styles.addressWrapper}>
        <div className={styles.inputGroup}>
          <label htmlFor="startAddress">Fra</label>
          <input
            type="text"
            id="startAddress"
            value={formData.startAddress}
            onChange={(e) => {
              setFormData(prev => ({...prev, startAddress: e.target.value}));
              handleAddressSearch(e.target.value);
            }}
            onFocus={() => setActiveSearch('start')}
            placeholder="Søk etter startadresse..."
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
            onChange={(e) => {
              setFormData(prev => ({...prev, destinationAddress: e.target.value}));
              handleAddressSearch(e.target.value);
            }}
            onFocus={() => setActiveSearch('end')}
            placeholder="Søk etter destinasjon..."
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
            placeholder="f.eks. 45.5"
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
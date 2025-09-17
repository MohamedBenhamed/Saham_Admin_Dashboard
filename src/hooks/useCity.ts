/**
 * useCity Hook
 * React hook for fetching and managing city data
 */
import { useState, useEffect } from 'react';
import { getCityById, getCityName, City } from '@/utils/cityUtils';

/**
 * Hook to fetch city data by ID
 * @param cityId - The city ID to fetch
 * @returns Object with city data, loading state, and error state
 */
export const useCity = (cityId: number | null | undefined) => {
  const [city, setCity] = useState<City | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId || cityId <= 0) {
      setCity(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchCity = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const cityData = await getCityById(cityId);
        setCity(cityData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch city');
        setCity(null);
      } finally {
        setLoading(false);
      }
    };

    fetchCity();
  }, [cityId]);

  return { city, loading, error };
};

/**
 * Hook to fetch city name by ID
 * @param cityId - The city ID to fetch
 * @returns Object with city name, loading state, and error state
 */
export const useCityName = (cityId: number | null | undefined) => {
  const [cityName, setCityName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!cityId || cityId <= 0) {
      setCityName('');
      setLoading(false);
      setError(null);
      return;
    }

    const fetchCityName = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const name = await getCityName(cityId);
        setCityName(name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch city name');
        setCityName('Unknown City');
      } finally {
        setLoading(false);
      }
    };

    fetchCityName();
  }, [cityId]);

  return { cityName, loading, error };
};

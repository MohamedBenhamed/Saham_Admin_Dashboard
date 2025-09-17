/**
 * CitiesDropdown Component
 * Reusable dropdown for selecting cities using getAllCities API
 */
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { MapPin, Loader2 } from 'lucide-react';

interface City {
  id: number;
  name: string;
  country: string | null;
  countryId: number;
}

interface CitiesDropdownProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const CitiesDropdown: React.FC<CitiesDropdownProps> = ({
  value,
  onValueChange,
  placeholder = "Select a city",
  disabled = false,
  className = "",
  error = false
}) => {
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Fetch cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setErrorState(null);
        console.log('Fetching cities for dropdown...');
        
        const response = await fetch('http://161.97.100.109:7001/api/City/getAllCities', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Cities data received for dropdown:', data);
        
        setCities(data);
      } catch (err) {
        console.error('Error fetching cities for dropdown:', err);
        setErrorState(err instanceof Error ? err.message : 'Failed to fetch cities');
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <Select disabled>
          <SelectTrigger className={error ? 'border-red-500' : ''}>
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-gray-500">Loading cities...</span>
            </div>
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  if (errorState) {
    return (
      <div className={`relative ${className}`}>
        <Select disabled>
          <SelectTrigger className="border-red-500">
            <div className="flex items-center">
              <MapPin className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-red-500">Error loading cities</span>
            </div>
          </SelectTrigger>
        </Select>
      </div>
    );
  }

  return (
    <div className={`relative ${className}`}>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled}
      >
        <SelectTrigger className={error ? 'border-red-500' : ''}>
          <div className="flex items-center">
            <MapPin className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {cities.length === 0 ? (
            <SelectItem value="" disabled>
              No cities available
            </SelectItem>
          ) : (
            cities.map((city) => (
              <SelectItem key={city.id} value={city.id.toString()}>
                <div className="flex items-center">
                  <MapPin className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{city.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

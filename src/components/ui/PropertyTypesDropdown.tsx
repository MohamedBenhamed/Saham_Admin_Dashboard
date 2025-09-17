/**
 * PropertyTypesDropdown Component
 * Reusable dropdown for selecting property types using getAllTypeProperty API
 */
import React, { useState, useEffect } from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Home, Loader2 } from 'lucide-react';

interface PropertyType {
  id: number;
  name: string;
}

interface PropertyTypesDropdownProps {
  value?: string;
  onValueChange?: (value: string) => void;
  placeholder?: string;
  disabled?: boolean;
  className?: string;
  error?: boolean;
}

export const PropertyTypesDropdown: React.FC<PropertyTypesDropdownProps> = ({
  value,
  onValueChange,
  placeholder = "Select a property type",
  disabled = false,
  className = "",
  error = false
}) => {
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [errorState, setErrorState] = useState<string | null>(null);

  // Fetch property types data
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        setErrorState(null);
        console.log('Fetching property types for dropdown...');
        
        const response = await fetch('http://161.97.100.109:7001/api/TypeProperty/getAllTypeProperty', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Property types data received for dropdown:', data);
        
        setPropertyTypes(data);
      } catch (err) {
        console.error('Error fetching property types for dropdown:', err);
        setErrorState(err instanceof Error ? err.message : 'Failed to fetch property types');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  if (loading) {
    return (
      <div className={`relative ${className}`}>
        <Select disabled>
          <SelectTrigger className={error ? 'border-red-500' : ''}>
            <div className="flex items-center">
              <Loader2 className="w-4 h-4 mr-2 animate-spin" />
              <span className="text-gray-500">Loading property types...</span>
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
              <Home className="w-4 h-4 mr-2 text-red-500" />
              <span className="text-red-500">Error loading property types</span>
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
            <Home className="w-4 h-4 mr-2 text-gray-400" />
            <SelectValue placeholder={placeholder} />
          </div>
        </SelectTrigger>
        <SelectContent>
          {propertyTypes.length === 0 ? (
            <SelectItem value="" disabled>
              No property types available
            </SelectItem>
          ) : (
            propertyTypes.map((propertyType) => (
              <SelectItem key={propertyType.id} value={propertyType.id.toString()}>
                <div className="flex items-center">
                  <Home className="w-4 h-4 mr-2 text-gray-400" />
                  <span>{propertyType.name}</span>
                </div>
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

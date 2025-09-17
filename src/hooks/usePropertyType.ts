/**
 * usePropertyType Hook
 * React hook for fetching and managing property type data
 */
import { useState, useEffect } from 'react';
import { getPropertyTypeById, getPropertyTypeName, PropertyType } from '@/utils/propertyTypeUtils';

/**
 * Hook to fetch property type data by ID
 * @param propertyTypeId - The property type ID to fetch
 * @returns Object with property type data, loading state, and error state
 */
export const usePropertyType = (propertyTypeId: number | null | undefined) => {
  const [propertyType, setPropertyType] = useState<PropertyType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyTypeId || propertyTypeId <= 0) {
      setPropertyType(null);
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPropertyType = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const propertyTypeData = await getPropertyTypeById(propertyTypeId);
        setPropertyType(propertyTypeData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property type');
        setPropertyType(null);
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyType();
  }, [propertyTypeId]);

  return { propertyType, loading, error };
};

/**
 * Hook to fetch property type name by ID
 * @param propertyTypeId - The property type ID to fetch
 * @returns Object with property type name, loading state, and error state
 */
export const usePropertyTypeName = (propertyTypeId: number | null | undefined) => {
  const [propertyTypeName, setPropertyTypeName] = useState<string>('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!propertyTypeId || propertyTypeId <= 0) {
      setPropertyTypeName('');
      setLoading(false);
      setError(null);
      return;
    }

    const fetchPropertyTypeName = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const name = await getPropertyTypeName(propertyTypeId);
        setPropertyTypeName(name);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch property type name');
        setPropertyTypeName('Unknown Property Type');
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypeName();
  }, [propertyTypeId]);

  return { propertyTypeName, loading, error };
};

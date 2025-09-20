/**
 * useProperties Hook
 * Custom hook for managing property data and state
 */
import { useState, useEffect, useCallback, useMemo } from 'react';
import { propertyRepository } from '../../data/repository/propertyRepository';
import { createGetAllPropertiesUseCase } from '../../domain/useCases/getAllProperties';

/**
 * Custom hook for properties
 * @param {Object} options - Options for fetching properties
 * @returns {Object} Hook state and methods
 */
export const useProperties = (options = {}) => {
  const [properties, setProperties] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [refreshing, setRefreshing] = useState(false);
  const [hasFetched, setHasFetched] = useState(false);

  // Stabilize options to prevent unnecessary re-renders
  const stableOptions = useMemo(() => options, [JSON.stringify(options)]);

  // Create use case instance
  const getAllPropertiesUseCase = useMemo(() => {
    return createGetAllPropertiesUseCase(propertyRepository);
  }, []);

  /**
   * Fetch properties
   */
  const fetchProperties = useCallback(async (fetchOptions = {}) => {
    // Prevent multiple simultaneous calls
    if (loading) {
      console.log('Already loading properties, skipping fetch');
      return;
    }

    try {
      setLoading(true);
      setError(null);
      
      const mergedOptions = { ...stableOptions, ...fetchOptions };
      const fetchedProperties = await getAllPropertiesUseCase.execute(mergedOptions);
      
      setProperties(fetchedProperties);
      setHasFetched(true);
    } catch (err) {
      console.error('Error fetching properties:', err);
      setError(err.message || 'Failed to fetch properties');
      setProperties([]);
    } finally {
      setLoading(false);
    }
  }, [getAllPropertiesUseCase, stableOptions, loading]);

  /**
   * Refresh properties
   */
  const refreshProperties = useCallback(async () => {
    try {
      setRefreshing(true);
      setError(null);
      
      const fetchedProperties = await getAllPropertiesUseCase.execute(stableOptions);
      setProperties(fetchedProperties);
    } catch (err) {
      console.error('Error refreshing properties:', err);
      setError(err.message || 'Failed to refresh properties');
    } finally {
      setRefreshing(false);
    }
  }, [getAllPropertiesUseCase, stableOptions]);

  /**
   * Get property by ID
   */
  const getPropertyById = useCallback((id) => {
    return properties.find(property => property.id === id);
  }, [properties]);

  /**
   * Filter properties by criteria
   */
  const filterProperties = useCallback((criteria) => {
    return properties.filter(property => {
      if (criteria.propertyType && (property.propertyType || '') !== criteria.propertyType) {
        return false;
      }
      
      if (criteria.minPrice && (property.price || 0) < criteria.minPrice) {
        return false;
      }
      
      if (criteria.maxPrice && (property.price || 0) > criteria.maxPrice) {
        return false;
      }
      
      if (criteria.location && !(property.location || '').toLowerCase().includes(criteria.location.toLowerCase())) {
        return false;
      }
      
      if (criteria.onlyAvailable && !property.isAvailable()) {
        return false;
      }
      
      return true;
    });
  }, [properties]);

  /**
   * Sort properties
   */
  const sortProperties = useCallback((sortBy, sortOrder = 'asc') => {
    return [...properties].sort((a, b) => {
      let aValue = a[sortBy] || '';
      let bValue = b[sortBy] || '';

      if (typeof aValue === 'string') {
        aValue = aValue.toLowerCase();
        bValue = bValue.toLowerCase();
      }

      if (sortOrder === 'asc') {
        return aValue > bValue ? 1 : aValue < bValue ? -1 : 0;
      } else {
        return aValue < bValue ? 1 : aValue > bValue ? -1 : 0;
      }
    });
  }, [properties]);

  /**
   * Get property statistics
   */
  const statistics = useMemo(() => {
    return getAllPropertiesUseCase.getPropertyStatistics(properties);
  }, [getAllPropertiesUseCase, properties]);

  /**
   * Get unique property types
   */
  const propertyTypes = useMemo(() => {
    const types = properties.map(p => p.propertyType).filter(Boolean);
    return [...new Set(types)];
  }, [properties]);

  /**
   * Get price range
   */
  const priceRange = useMemo(() => {
    const prices = properties.map(p => p.price).filter(price => price > 0);
    if (prices.length === 0) return { min: 0, max: 0 };
    
    return {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };
  }, [properties]);

  /**
   * Get available properties count
   */
  const availableCount = useMemo(() => {
    return properties.filter(p => p.isAvailable()).length;
  }, [properties]);

  /**
   * Search properties
   */
  const searchProperties = useCallback((searchTerm) => {
    if (!searchTerm) return properties;
    
    const term = searchTerm.toLowerCase();
    return properties.filter(property => {
      // Safely check each field with fallbacks
      const title = (property.title || '').toLowerCase();
      const description = (property.description || '').toLowerCase();
      const location = (property.location || '').toLowerCase();
      const propertyType = (property.propertyType || '').toLowerCase();
      
      return title.includes(term) ||
             description.includes(term) ||
             location.includes(term) ||
             propertyType.includes(term);
    });
  }, [properties]);

  // Fetch properties on mount only
  useEffect(() => {
    if (!hasFetched && !loading) {
      console.log('Initial fetch of properties');
      fetchProperties();
    }
  }, [fetchProperties, hasFetched, loading]);

  return {
    // State
    properties,
    loading,
    error,
    refreshing,
    hasFetched,
    
    // Computed values
    statistics,
    propertyTypes,
    priceRange,
    availableCount,
    
    // Methods
    fetchProperties,
    refreshProperties,
    getPropertyById,
    filterProperties,
    sortProperties,
    searchProperties,
    
    // Utility methods
    clearError: () => setError(null),
    retry: () => fetchProperties(),
    forceRefresh: () => {
      setHasFetched(false);
      fetchProperties();
    }
  };
};

/**
 * Hook for a single property
 * @param {string|number} propertyId - Property ID
 * @returns {Object} Hook state and methods
 */
export const useProperty = (propertyId) => {
  const [property, setProperty] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProperty = useCallback(async () => {
    if (!propertyId) return;
    
    try {
      setLoading(true);
      setError(null);
      
      const fetchedProperty = await propertyRepository.getPropertyById(propertyId);
      setProperty(fetchedProperty);
    } catch (err) {
      console.error(`Error fetching property ${propertyId}:`, err);
      setError(err.message || 'Failed to fetch property');
      setProperty(null);
    } finally {
      setLoading(false);
    }
  }, [propertyId]);

  useEffect(() => {
    fetchProperty();
  }, [fetchProperty]);

  return {
    property,
    loading,
    error,
    refetch: fetchProperty,
    clearError: () => setError(null)
  };
};

/**
 * Hook for property search
 * @param {Object} searchParams - Search parameters
 * @returns {Object} Hook state and methods
 */
export const usePropertySearch = (searchParams = {}) => {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const search = useCallback(async (params = {}) => {
    try {
      setLoading(true);
      setError(null);
      
      const mergedParams = { ...searchParams, ...params };
      const searchResults = await propertyRepository.searchProperties(mergedParams);
      setResults(searchResults);
    } catch (err) {
      console.error('Error searching properties:', err);
      setError(err.message || 'Failed to search properties');
      setResults([]);
    } finally {
      setLoading(false);
    }
  }, [searchParams]);

  useEffect(() => {
    if (Object.keys(searchParams).length > 0) {
      search();
    }
  }, [search, searchParams]);

  return {
    results,
    loading,
    error,
    search,
    clearError: () => setError(null)
  };
};

/**
 * City Utilities
 * Functions for fetching and managing city data
 */

export interface City {
  id: number;
  name: string;
  country?: string | null;
  countryId?: number;
}

// Cache for city data to avoid repeated API calls
const cityCache = new Map<number, City>();

/**
 * Fetch city data by ID using the getCitiesById endpoint
 * @param cityId - The city ID to fetch
 * @returns Promise<City | null> - The city data or null if not found
 */
export const getCityById = async (cityId: number): Promise<City | null> => {
  try {
    // Check cache first
    if (cityCache.has(cityId)) {
      console.log(`City ${cityId} found in cache`);
      return cityCache.get(cityId) || null;
    }

    console.log(`Fetching city data for ID: ${cityId}`);
    
    const response = await fetch(`http://161.97.100.109:7001/api/City/getCitiesById/${cityId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const cityData = await response.json();
    console.log(`City data received for ID ${cityId}:`, cityData);
    
    // Cache the result
    cityCache.set(cityId, cityData);
    
    return cityData;
  } catch (error) {
    console.error(`Error fetching city data for ID ${cityId}:`, error);
    return null;
  }
};

/**
 * Get city name by ID
 * @param cityId - The city ID
 * @returns Promise<string> - The city name or 'Unknown City' if not found
 */
export const getCityName = async (cityId: number): Promise<string> => {
  const city = await getCityById(cityId);
  return city?.name || 'Unknown City';
};

/**
 * Clear the city cache (useful for testing or when data might be stale)
 */
export const clearCityCache = (): void => {
  cityCache.clear();
  console.log('City cache cleared');
};

/**
 * Preload multiple cities into cache
 * @param cityIds - Array of city IDs to preload
 */
export const preloadCities = async (cityIds: number[]): Promise<void> => {
  const promises = cityIds.map(cityId => getCityById(cityId));
  await Promise.all(promises);
  console.log(`Preloaded ${cityIds.length} cities into cache`);
};

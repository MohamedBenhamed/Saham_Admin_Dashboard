/**
 * Property Type Utilities
 * Functions for fetching and managing property type data
 */

export interface PropertyType {
  id: number;
  name: string;
}

// Cache for property type data to avoid repeated API calls
const propertyTypeCache = new Map<number, PropertyType>();

/**
 * Fetch property type data by ID using the getTypePropertyById endpoint
 * @param propertyTypeId - The property type ID to fetch
 * @returns Promise<PropertyType | null> - The property type data or null if not found
 */
export const getPropertyTypeById = async (propertyTypeId: number): Promise<PropertyType | null> => {
  try {
    // Check cache first
    if (propertyTypeCache.has(propertyTypeId)) {
      console.log(`Property type ${propertyTypeId} found in cache`);
      return propertyTypeCache.get(propertyTypeId) || null;
    }

    console.log(`Fetching property type data for ID: ${propertyTypeId}`);
    
    const response = await fetch(`http://161.97.100.109:7001/api/TypeProperty/getTypePropertyById/${propertyTypeId}`, {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const propertyTypeData = await response.json();
    console.log(`Property type data received for ID ${propertyTypeId}:`, propertyTypeData);
    
    // Cache the result
    propertyTypeCache.set(propertyTypeId, propertyTypeData);
    
    return propertyTypeData;
  } catch (error) {
    console.error(`Error fetching property type data for ID ${propertyTypeId}:`, error);
    return null;
  }
};

/**
 * Get property type name by ID
 * @param propertyTypeId - The property type ID
 * @returns Promise<string> - The property type name or 'Unknown Property Type' if not found
 */
export const getPropertyTypeName = async (propertyTypeId: number): Promise<string> => {
  const propertyType = await getPropertyTypeById(propertyTypeId);
  return propertyType?.name || 'Unknown Property Type';
};

/**
 * Clear the property type cache (useful for testing or when data might be stale)
 */
export const clearPropertyTypeCache = (): void => {
  propertyTypeCache.clear();
  console.log('Property type cache cleared');
};

/**
 * Preload multiple property types into cache
 * @param propertyTypeIds - Array of property type IDs to preload
 */
export const preloadPropertyTypes = async (propertyTypeIds: number[]): Promise<void> => {
  const promises = propertyTypeIds.map(propertyTypeId => getPropertyTypeById(propertyTypeId));
  await Promise.all(promises);
  console.log(`Preloaded ${propertyTypeIds.length} property types into cache`);
};

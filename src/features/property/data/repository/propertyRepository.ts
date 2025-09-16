/**
 * Property Repository
 * Abstracts data access and provides domain entities
 */
import { propertyApi } from '../api/propertyApi';
import { Property } from '../../domain/entities/Property';

/**
 * Property Repository Class
 */
export class PropertyRepository {
  private api: any;

  constructor(api = propertyApi) {
    this.api = api;
  }

  /**
   * Get all properties
   * @returns {Promise<Property[]>} Array of Property entities
   */
  async getAllProperties() {
    try {
      const apiData = await this.api.getAllProperties();
      console.log('PropertyRepository - API data received:', apiData);
      console.log('PropertyRepository - API data length:', apiData.length);
      console.log('PropertyRepository - First property data:', apiData[0]);
      
      // Transform API data to domain entities
      const properties = apiData.map((propertyData: Record<string, unknown>) => {
        try {
          return Property.fromAPIResponse(propertyData as any);
        } catch (error) {
          console.warn('Failed to create Property entity from API data:', propertyData, error);
          // Return a fallback property with basic data
          return new Property({
            id: Number(propertyData.id) || Math.floor(Math.random() * 1000000),
            title: String(propertyData.title || propertyData.name || 'Unknown Property'),
            description: String(propertyData.description || ''),
            price: Number(propertyData.price) || 0,
            location: String(propertyData.location || propertyData.nearby || ''),
            propertyType: propertyData.propertyType || propertyData.type || propertyData.typeProperty || (propertyData.typePropertyId ? Property.getPropertyTypeName(propertyData.typePropertyId) : 'Unknown'),
            bedrooms: Number(propertyData.bedrooms) || 0,
            bathrooms: Number(propertyData.bathrooms) || 0,
            area: Number(propertyData.area || propertyData.squareFeet) || 0,
            images: propertyData.images || propertyData.photos || propertyData.imagesProperty || [],
            status: String(propertyData.status || 'available'),
            createdAt: propertyData.createdAt as string,
            updatedAt: propertyData.updatedAt as string | undefined,
            owner: propertyData.owner,
            features: propertyData.features || [],
            amenities: propertyData.amenities || []
          });
        }
      });

      // Filter out invalid properties
      const validProperties = properties.filter((property: Property) => property.isValid());
      console.log('PropertyRepository - Total properties created:', properties.length);
      console.log('PropertyRepository - Valid properties:', validProperties.length);
      console.log('PropertyRepository - Valid properties details:', validProperties.map((p: Property) => ({ id: p.id, title: p.title, price: p.price, propertyType: p.propertyType })));
      return validProperties;
    } catch (error) {
      console.error('Repository error in getAllProperties:', error);
      throw new Error(`Failed to fetch properties: ${error instanceof Error ? error.message : String(error)}`);
    }
  }

  /**
   * Get property by ID
   * @param {string|number} id - Property ID
   * @returns {Promise<Property>} Property entity
   */
  async getPropertyById(id) {
    try {
      const apiData = await this.api.getPropertyById(id);
      return Property.fromAPIResponse(apiData);
    } catch (error) {
      console.error(`Repository error in getPropertyById(${id}):`, error);
      throw new Error(`Failed to fetch property ${id}: ${error.message}`);
    }
  }

  /**
   * Create new property
   * @param {Object} propertyData - Property data
   * @returns {Promise<Property>} Created Property entity
   */
  async createProperty(propertyData) {
    try {
      const apiData = await this.api.createProperty(propertyData);
      return Property.fromAPIResponse(apiData);
    } catch (error) {
      console.error('Repository error in createProperty:', error);
      throw new Error(`Failed to create property: ${error.message}`);
    }
  }


  /**
   * Delete property
   * @param {string|number} id - Property ID
   * @returns {Promise<boolean>} Success status
   */
  async deleteProperty(id) {
    try {
      await this.api.deleteProperty(id);
      return true;
    } catch (error) {
      console.error(`Repository error in deleteProperty(${id}):`, error);
      throw new Error(`Failed to delete property ${id}: ${error.message}`);
    }
  }

  /**
   * Search properties
   * @param {Object} searchParams - Search parameters
   * @returns {Promise<Property[]>} Array of matching Property entities
   */
  async searchProperties(searchParams) {
    try {
      const apiData = await this.api.searchProperties(searchParams);
      
      const properties = apiData.map((propertyData: Record<string, unknown>) => {
        try {
          return Property.fromAPIResponse(propertyData as any);
        } catch (error) {
          console.warn('Failed to create Property entity from search result:', propertyData, error);
          return new Property({
            id: Number(propertyData.id) || Math.floor(Math.random() * 1000000),
            title: String(propertyData.title || propertyData.name || 'Unknown Property'),
            description: String(propertyData.description || ''),
            price: Number(propertyData.price) || 0,
            propertyType: propertyData.propertyType || propertyData.type || 'Unknown',
            bedrooms: Number(propertyData.bedrooms) || 0,
            bathrooms: Number(propertyData.bathrooms) || 0,
            area: Number(propertyData.area || propertyData.squareFeet) || 0,
            images: propertyData.images || propertyData.photos || [],
            status: String(propertyData.status || 'unknown'),
            createdAt: propertyData.createdAt as string,
            updatedAt: propertyData.updatedAt as string | undefined,
            owner: propertyData.owner,
            features: propertyData.features || [],
            amenities: propertyData.amenities || []
          });
        }
      });

      return properties.filter((property: Property) => property.isValid());
    } catch (error) {
      console.error('Repository error in searchProperties:', error);
      throw new Error(`Failed to search properties: ${error.message}`);
    }
  }

  /**
   * Get properties by type
   * @param {string} type - Property type
   * @returns {Promise<Property[]>} Array of Property entities
   */
  async getPropertiesByType(type) {
    try {
      const allProperties = await this.getAllProperties();
      return allProperties.filter(property => 
        property.propertyType.toLowerCase() === type.toLowerCase()
      );
    } catch (error) {
      console.error(`Repository error in getPropertiesByType(${type}):`, error);
      throw new Error(`Failed to get properties by type ${type}: ${error.message}`);
    }
  }

  /**
   * Get available properties
   * @returns {Promise<Property[]>} Array of available Property entities
   */
  async getAvailableProperties() {
    try {
      const allProperties = await this.getAllProperties();
      return allProperties.filter(property => property.isAvailable());
    } catch (error) {
      console.error('Repository error in getAvailableProperties:', error);
      throw new Error(`Failed to get available properties: ${error.message}`);
    }
  }

  /**
   * Update property
   * @param {number} id - Property ID
   * @param {Object} propertyData - Updated property data
   * @returns {Promise<Property>} Updated Property entity
   */
  async updateProperty(id: number, propertyData: Record<string, unknown>) {
    try {
      // In a real application, this would make an API call to update the property
      // For now, we'll simulate the update by modifying the mock data
      const property = await this.getPropertyById(id);
      
      if (!property) {
        throw new Error(`Property with ID ${id} not found`);
      }

      // Create updated property with new data
      const updatedProperty = Property.fromAPIResponse({
        ...property.toJSON(),
        ...propertyData,
        id: id, // Ensure ID doesn't change
        updatedAt: new Date().toISOString()
      });

      // In a real app, you would make an API call here:
      // const response = await this.propertyApi.updateProperty(id, propertyData);
      // return Property.fromAPIResponse(response);

      console.log('Property updated:', updatedProperty);
      return updatedProperty;
    } catch (error) {
      console.error('Repository error in updateProperty:', error);
      throw new Error(`Failed to update property: ${error.message}`);
    }
  }
}

// Export singleton instance
export const propertyRepository = new PropertyRepository();

/**
 * GetAllProperties Use Case
 * Business logic for fetching all properties
 */
import { Property } from '../entities/Property';

/**
 * GetAllProperties Use Case Class
 */
export class GetAllPropertiesUseCase {
  constructor(propertyRepository) {
    this.propertyRepository = propertyRepository;
  }

  /**
   * Execute the use case
   * @param {Object} options - Options for fetching properties
   * @param {boolean} options.onlyAvailable - Filter only available properties
   * @param {string} options.propertyType - Filter by property type
   * @param {number} options.limit - Limit number of results
   * @param {string} options.sortBy - Sort by field (price, area, createdAt)
   * @param {string} options.sortOrder - Sort order (asc, desc)
   * @returns {Promise<Property[]>} Array of Property entities
   */
  async execute(options = {}) {
    try {
      const {
        onlyAvailable = false,
        propertyType = null,
        limit = null,
        sortBy = 'createdAt',
        sortOrder = 'desc'
      } = options;

      // Fetch properties from repository
      let properties = await this.propertyRepository.getAllProperties();

      // Apply business logic filters
      if (onlyAvailable) {
        properties = this._filterAvailableProperties(properties);
      }

      if (propertyType) {
        properties = this._filterByPropertyType(properties, propertyType);
      }

      // Apply sorting
      properties = this._sortProperties(properties, sortBy, sortOrder);

      // Apply limit
      if (limit && limit > 0) {
        properties = properties.slice(0, limit);
      }

      // Validate and enrich properties
      properties = this._enrichProperties(properties);

      return properties;
    } catch (error) {
      console.error('GetAllPropertiesUseCase error:', error);
      throw new Error(`Failed to get properties: ${error.message}`);
    }
  }

  /**
   * Filter available properties
   * @private
   */
  _filterAvailableProperties(properties) {
    return properties.filter(property => property.isAvailable());
  }

  /**
   * Filter properties by type
   * @private
   */
  _filterByPropertyType(properties, type) {
    return properties.filter(property => 
      property.propertyType.toLowerCase() === type.toLowerCase()
    );
  }

  /**
   * Sort properties
   * @private
   */
  _sortProperties(properties, sortBy, sortOrder) {
    return properties.sort((a, b) => {
      let aValue = a[sortBy];
      let bValue = b[sortBy];

      // Handle different data types
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
  }

  /**
   * Enrich properties with additional business logic
   * @private
   */
  _enrichProperties(properties) {
    return properties.map(property => {
      // Add computed properties or business logic here
      // For example, calculate property age, add market insights, etc.
      
      return property;
    });
  }

  /**
   * Get property statistics
   * @param {Property[]} properties - Array of properties
   * @returns {Object} Statistics object
   */
  getPropertyStatistics(properties) {
    if (!properties || properties.length === 0) {
      return {
        total: 0,
        available: 0,
        averagePrice: 0,
        propertyTypes: {},
        priceRange: { min: 0, max: 0 }
      };
    }

    const available = properties.filter(p => p.isAvailable()).length;
    const totalPrice = properties.reduce((sum, p) => sum + (p.price || 0), 0);
    const averagePrice = totalPrice / properties.length;

    const propertyTypes = properties.reduce((acc, p) => {
      const type = p.propertyType || 'Unknown';
      acc[type] = (acc[type] || 0) + 1;
      return acc;
    }, {});

    const prices = properties.map(p => p.price || 0).filter(price => price > 0);
    const priceRange = {
      min: Math.min(...prices),
      max: Math.max(...prices)
    };

    return {
      total: properties.length,
      available,
      averagePrice: Math.round(averagePrice),
      propertyTypes,
      priceRange
    };
  }

  /**
   * Get properties by price range
   * @param {Property[]} properties - Array of properties
   * @param {number} minPrice - Minimum price
   * @param {number} maxPrice - Maximum price
   * @returns {Property[]} Filtered properties
   */
  getPropertiesByPriceRange(properties, minPrice, maxPrice) {
    return properties.filter(property => {
      const price = property.price || 0;
      return price >= minPrice && price <= maxPrice;
    });
  }

  /**
   * Get properties by location
   * @param {Property[]} properties - Array of properties
   * @param {string} location - Location to filter by
   * @returns {Property[]} Filtered properties
   */
  getPropertiesByLocation(properties, location) {
    return properties.filter(property => 
      property.location.toLowerCase().includes(location.toLowerCase())
    );
  }
}

/**
 * Factory function to create GetAllPropertiesUseCase instance
 * @param {PropertyRepository} propertyRepository - Repository instance
 * @returns {GetAllPropertiesUseCase} Use case instance
 */
export const createGetAllPropertiesUseCase = (propertyRepository) => {
  return new GetAllPropertiesUseCase(propertyRepository);
};

/**
 * Property Entity
 * Represents a property in the domain layer
 */
export class Property {
  public readonly id: number;
  public readonly title: string;
  public readonly description: string;
  public readonly price: number;
  public readonly location: string;
  public readonly cityId?: number;
  public readonly typePropertyId?: number;
  public readonly propertyType: string;
  public readonly bedrooms: number;
  public readonly bathrooms: number;
  public readonly area: number;
  public readonly images: string[];
  public readonly status: string;
  public readonly createdAt: string;
  public readonly updatedAt?: string;
  public readonly owner?: any;
  public readonly features: string[];
  public readonly amenities: string[];

  constructor({
    id,
    title,
    description,
    price,
    location,
    cityId,
    typePropertyId,
    propertyType,
    bedrooms,
    bathrooms,
    area,
    images,
    status,
    createdAt,
    updatedAt,
    owner,
    features,
    amenities
  }: {
    id: number;
    title: string;
    description: string;
    price: number;
    location: string;
    cityId?: number;
    typePropertyId?: number;
    propertyType: string;
    bedrooms: number;
    bathrooms: number;
    area: number;
    images: string[];
    status: string;
    createdAt: string;
    updatedAt?: string;
    owner?: any;
    features: string[];
    amenities: string[];
  }) {
    this.id = id;
    this.title = title;
    this.description = description;
    this.price = price;
    this.location = location;
    this.cityId = cityId;
    this.typePropertyId = typePropertyId;
    this.propertyType = propertyType;
    this.bedrooms = bedrooms;
    this.bathrooms = bathrooms;
    this.area = area;
    this.images = images || [];
    this.status = status;
    this.createdAt = createdAt;
    this.updatedAt = updatedAt;
    this.owner = owner;
    this.features = features || [];
    this.amenities = amenities || [];
  }

  /**
   * Get formatted price
   */
  getFormattedPrice() {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
    }).format(this.price);
  }

  /**
   * Get property summary
   */
  getSummary() {
    return `${this.bedrooms} bed, ${this.bathrooms} bath • ${this.area} sq ft`;
  }

  /**
   * Check if property is available
   */
  isAvailable() {
    return this.status === 'available' || this.status === 'active';
  }

  /**
   * Get primary image URL
   */
  getPrimaryImage() {
    return this.images.length > 0 ? this.images[0] : null;
  }

  /**
   * Validate property data
   */
  isValid() {
    return !!(
      this.id &&
      this.title &&
      this.price &&
      this.propertyType
    );
  }

  /**
   * Convert to plain object
   */
  toJSON() {
    return {
      id: this.id,
      title: this.title,
      description: this.description,
      price: this.price,
      location: this.location,
      cityId: this.cityId,
      typePropertyId: this.typePropertyId,
      propertyType: this.propertyType,
      bedrooms: this.bedrooms,
      bathrooms: this.bathrooms,
      area: this.area,
      images: this.images,
      status: this.status,
      createdAt: this.createdAt,
      updatedAt: this.updatedAt,
      owner: this.owner,
      features: this.features,
      amenities: this.amenities
    };
  }

  /**
   * Convert typePropertyId to property type name
   */
  static getPropertyTypeName(typePropertyId: number): string {
    const typeMap: Record<number, string> = {
      1: 'Apartment',
      2: 'House', 
      3: 'Villa',
      4: 'Commercial',
      5: 'Land'
    };
    return typeMap[typePropertyId] || 'Unknown';
  }

  /**
   * Create Property instance from API response
   */
  static fromAPIResponse(apiData: any) {
    console.log('Property.fromAPIResponse - Processing API data:', apiData);
    
    // Get property type name from typePropertyId
    const propertyType = apiData.propertyType || 
                        apiData.type || 
                        apiData.typeProperty || 
                        (apiData.typePropertyId ? Property.getPropertyTypeName(apiData.typePropertyId) : 'Unknown');

    console.log('Property.fromAPIResponse - Resolved propertyType:', propertyType, 'from typePropertyId:', apiData.typePropertyId);

    const propertyData = {
      id: apiData.id,
      title: apiData.title || apiData.name,
      description: apiData.description,
      price: apiData.price,
      location: apiData.location || apiData.nearby || '',
      cityId: apiData.cityId,
      typePropertyId: apiData.typePropertyId,
      propertyType: propertyType,
      bedrooms: apiData.bedrooms,
      bathrooms: apiData.bathrooms,
      area: apiData.area || apiData.squareFeet,
      images: apiData.images || apiData.photos || [],
      status: apiData.status || 'available',
      createdAt: apiData.createdAt || new Date().toISOString(),
      updatedAt: apiData.updatedAt,
      owner: apiData.owner,
      features: apiData.features || [],
      amenities: apiData.amenities || []
    };

    console.log('Property.fromAPIResponse - Property data to create:', propertyData);

    const property = new Property(propertyData);
    console.log('Property.fromAPIResponse - Created property:', property);
    console.log('Property.fromAPIResponse - Property isValid:', property.isValid());
    
    return property;
  }
}

/**
 * PropertyViewPage Component
 * Displays detailed property information fetched by ID
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate, useLocation } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Car,
  DollarSign,
  Calendar,
  User,
  Building2
} from 'lucide-react';
import { propertyApi } from '@/features/property/data/api/propertyApi';
import { useCityName } from '@/hooks/useCity';
import { usePropertyTypeName } from '@/hooks/usePropertyType';
import { Property } from '@/features/property/domain/entities/Property';

interface PropertyDetails {
  id: number;
  title: string;
  description: string;
  price: number;
  originalPrice: number;
  discount: number;
  bedrooms: number;
  bathrooms: number;
  area: number;
  parking: number;
  latitude: string;
  longitude: string;
  nearby: string;
  cityId: number;
  typePropertyId: number;
  images: string[];
}

export const PropertyViewPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const location = useLocation();
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  // Get city name by ID
  const { cityName, loading: cityLoading, error: cityError } = useCityName(property?.cityId);
  
  // Get property type name by ID
  const { propertyTypeName, loading: propertyTypeLoading, error: propertyTypeError } = usePropertyTypeName(property?.typePropertyId);

  // Function to handle back navigation
  const handleBackNavigation = () => {
    // Check if there's a previous page in history
    if (window.history.length > 1) {
      // Go back to the previous page
      navigate(-1);
    } else {
      // Fallback to investments if no history
      navigate('/admin/investments');
    }
  };

  useEffect(() => {
    const fetchProperty = async () => {
      if (!id) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching property with ID:', id);
        
        const propertyData = await propertyApi.getPropertyById(id);
        console.log('Property data received:', propertyData);
        
        setProperty(propertyData);
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [id]);


  const formatCurrency = (amount: number): string => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount);
  };

  const formatDate = (dateString: string): string => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property details...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={handleBackNavigation} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  if (!property) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-gray-600 mb-4">Property not found</p>
          <Button onClick={handleBackNavigation} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-6xl mx-auto p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center space-x-4">
            <Button
              variant="outline"
              onClick={handleBackNavigation}
              className="flex items-center"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">{property.title}</h1>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            {/* Property Images */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Property Images
                </CardTitle>
              </CardHeader>
              <CardContent>
                {property.images && property.images.length > 0 ? (
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                    {property.images.map((image, index) => (
                      <div key={index} className="aspect-square bg-gray-200 rounded-lg overflow-hidden">
                        <img
                          src={image}
                          alt={`Property image ${index + 1}`}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            const target = e.target as HTMLImageElement;
                            target.style.display = 'none';
                          }}
                        />
                      </div>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-500">
                    <Building2 className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                    <p>No images available</p>
                  </div>
                )}
              </CardContent>
            </Card>

            {/* Property Description */}
            <Card>
              <CardHeader>
                <CardTitle>Description</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-700 leading-relaxed">
                  {property.description || 'No description available'}
                </p>
              </CardContent>
            </Card>

            {/* Location Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="w-5 h-5 mr-2" />
                  Location Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Nearby</label>
                    <p className="text-gray-900">{property.nearby || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">City</label>
                    <p className="text-gray-900">
                      {cityLoading ? (
                        <span className="text-gray-500">Loading city...</span>
                      ) : cityError ? (
                        <span className="text-red-500">Error loading city</span>
                      ) : (
                        cityName || 'N/A'
                      )}
                    </p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Latitude</label>
                    <p className="text-gray-900">{property.latitude || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">Longitude</label>
                    <p className="text-gray-900">{property.longitude || 'N/A'}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            {/* Property Details */}
            <Card>
              <CardHeader>
                <CardTitle>Property Details</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Type</span>
                  <Badge variant="outline">
                    {propertyTypeLoading ? (
                      <span className="text-gray-400">Loading...</span>
                    ) : propertyTypeError ? (
                      <span className="text-red-500">Error</span>
                    ) : (
                      propertyTypeName || 'Unknown'
                    )}
                  </Badge>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Bed className="w-4 h-4 mr-1" />
                    Bedrooms
                  </span>
                  <span className="font-medium">{property.bedrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Bath className="w-4 h-4 mr-1" />
                    Bathrooms
                  </span>
                  <span className="font-medium">{property.bathrooms}</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Square className="w-4 h-4 mr-1" />
                    Area
                  </span>
                  <span className="font-medium">{property.area} sq ft</span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600 flex items-center">
                    <Car className="w-4 h-4 mr-1" />
                    Parking
                  </span>
                  <span className="font-medium">{property.parking}</span>
                </div>
              </CardContent>
            </Card>

            {/* Pricing Information */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <DollarSign className="w-5 h-5 mr-2" />
                  Pricing
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Current Price</span>
                  <span className="text-xl font-bold text-green-600">
                    {formatCurrency(property.price)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Original Price</span>
                  <span className="text-lg font-medium text-gray-900">
                    {formatCurrency(property.originalPrice)}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Discount</span>
                  <span className="text-lg font-medium text-red-600">
                    {formatCurrency(property.discount)}
                  </span>
                </div>
                {property.discount > 0 && (
                  <div className="pt-2 border-t">
                    <div className="flex items-center justify-between">
                      <span className="text-gray-600">Savings</span>
                      <span className="text-lg font-bold text-green-600">
                        {formatCurrency(property.originalPrice - property.price)}
                      </span>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>

          </div>
        </div>
      </div>
    </div>
  );
};

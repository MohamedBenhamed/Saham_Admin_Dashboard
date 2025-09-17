/**
 * PropertyCard Component
 * Displays individual property information in a card format
 */
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Bed, 
  Bath, 
  Square, 
  Eye, 
  Heart, 
  Share2,
  Calendar,
  User,
  Edit,
  Trash2
} from 'lucide-react';
import { Property } from '@/features/property/domain/entities/Property';
import { useCityName } from '@/hooks/useCity';
import { usePropertyTypeName } from '@/hooks/usePropertyType';
import { useRTL } from '@/hooks/useRTL';

interface PropertyCardProps {
  property: Property | null;
  onView?: (property: Property) => void;
  onEdit?: (property: Property) => void;
  onDelete?: (property: Property) => void;
  showActions?: boolean;
  className?: string;
  viewMode?: 'grid' | 'list';
}

/**
 * PropertyCard Component
 * @param {Object} props - Component props
 * @param {Object} props.property - Property entity
 * @param {Function} props.onView - Callback for view action
 * @param {Function} props.onEdit - Callback for edit action
 * @param {Function} props.onDelete - Callback for delete action
 * @param {boolean} props.showActions - Whether to show action buttons
 * @param {string} props.className - Additional CSS classes
 */
export const PropertyCard: React.FC<PropertyCardProps> = ({ 
  property, 
  onView, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '',
  viewMode = 'grid'
}) => {
  // Get city name by ID
  const { cityName, loading: cityLoading } = useCityName(property?.cityId);
  
  // Get property type name by ID
  const { propertyTypeName, loading: propertyTypeLoading } = usePropertyTypeName(property?.typePropertyId);
  
  // Get RTL utilities
  const { getMargin } = useRTL();
  
  if (!property) {
    return (
      <Card className={`admin-card admin-card-hover ${className}`}>
        <CardContent className="p-6">
          <div className="text-center text-gray-500">
            No property data available
          </div>
        </CardContent>
      </Card>
    );
  }

  const handleView = () => {
    if (onView) onView(property);
  };

  const handleEdit = () => {
    if (onEdit) onEdit(property);
  };

  const handleDelete = () => {
    if (onDelete) onDelete(property);
  };

  const getStatusColor = (status: string) => {
    switch (status?.toLowerCase()) {
      case 'available':
      case 'active':
        return 'bg-success text-white';
      case 'pending':
        return 'bg-warning text-white';
      case 'sold':
      case 'rented':
        return 'bg-gray-500 text-white';
      case 'inactive':
        return 'bg-error text-white';
      default:
        return 'bg-gray-400 text-white';
    }
  };

  const formatDate = (dateString: string) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  // Render list view
  if (viewMode === 'list') {
    return (
      <Card className={`admin-card admin-card-hover ${className}`}>
        <CardContent className="p-0">
          <div className="flex">
            {/* Property Image */}
            <div className="relative w-48 h-32 bg-gray-200 flex-shrink-0">
              {property.getPrimaryImage() ? (
                <img
                  src={property.getPrimaryImage() || ''}
                  alt={property.title}
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    const nextSibling = target.nextSibling as HTMLElement;
                    if (nextSibling) {
                      nextSibling.style.display = 'flex';
                    }
                  }}
                />
              ) : null}
              <div 
                className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500"
                style={{ display: property.getPrimaryImage() ? 'none' : 'flex' }}
              >
                <Square className="w-8 h-8" />
              </div>
              
              {/* Status Badge */}
              <div className="absolute top-2 left-2">
                <Badge className={getStatusColor(property.status)}>
                  {property.status || 'Unknown'}
                </Badge>
              </div>
            </div>

            {/* Property Details */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <h3 className="text-lg font-semibold text-gray-900 truncate">
                    {property.title || 'Untitled Property'}
                  </h3>
                  <div className="flex items-center mt-1 text-sm text-gray-600">
                    <MapPin className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')} flex-shrink-0`} />
                    <span className="truncate">
                      {cityLoading ? (
                        <span className="text-gray-400">Loading city...</span>
                      ) : (
                        cityName || property.location || 'Location not specified'
                      )}
                    </span>
                  </div>
                </div>
                <div className="text-right flex-shrink-0 ml-4">
                  <div className="text-xl font-bold text-primary">
                    {property.getFormattedPrice()}
                  </div>
                </div>
              </div>

              {/* Property Details Row */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4 text-sm text-gray-600">
                  <div className="flex items-center">
                    <Bed className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')}`} />
                    <span>{property.bedrooms || 0} bed</span>
                  </div>
                  <div className="flex items-center">
                    <Bath className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')}`} />
                    <span>{property.bathrooms || 0} bath</span>
                  </div>
                  <div className="flex items-center">
                    <Square className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')}`} />
                    <span>{property.area || 0} sq ft</span>
                  </div>
                </div>
                <Badge variant="outline" className="text-xs">
                  {propertyTypeLoading ? (
                    <span className="text-gray-400">Loading...</span>
                  ) : (
                    propertyTypeName || property.propertyType || 'Unknown Type'
                  )}
                </Badge>
              </div>

              {/* Property Info and Actions */}
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4 text-xs text-gray-500">
                  {property.owner && (
                    <div className="flex items-center">
                      <User className={`w-3 h-3 ${getMargin('mr-1', 'ml-1')}`} />
                      <span>Owner: {property.owner}</span>
                    </div>
                  )}
                  {property.createdAt && (
                    <div className="flex items-center">
                      <Calendar className={`w-3 h-3 ${getMargin('mr-1', 'ml-1')}`} />
                      <span>Listed: {formatDate(property.createdAt)}</span>
                    </div>
                  )}
                </div>

                {/* Action Buttons */}
                {showActions && (
                  <div className="flex items-center space-x-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={handleView}
                    >
                      <Eye className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')}`} />
                      View
                    </Button>
                    {onEdit && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleEdit}
                      >
                        <Edit className="w-4 h-4" />
                      </Button>
                    )}
                    {onDelete && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={handleDelete}
                        className="text-red-600 hover:text-red-700 hover:bg-red-50"
                      >
                        <Trash2 className="w-4 h-4" />
                      </Button>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render grid view (default)
  return (
    <Card className={`admin-card admin-card-hover w-full max-w-sm mx-auto ${className}`}>
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {property.getPrimaryImage() ? (
          <img
            src={property.getPrimaryImage() || ''}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              const target = e.target as HTMLImageElement;
              target.style.display = 'none';
              const nextSibling = target.nextSibling as HTMLElement;
              if (nextSibling) {
                nextSibling.style.display = 'flex';
              }
            }}
          />
        ) : null}
        <div 
          className="absolute inset-0 bg-gray-300 flex items-center justify-center text-gray-500"
          style={{ display: property.getPrimaryImage() ? 'none' : 'flex' }}
        >
          <Square className="w-12 h-12" />
        </div>
        
        {/* Status Badge */}
        <div className="absolute top-3 left-3">
          <Badge className={getStatusColor(property.status)}>
            {property.status || 'Unknown'}
          </Badge>
        </div>

        {/* Action Buttons */}
        <div className="absolute top-3 right-3 flex space-x-2">
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 bg-white/90 hover:bg-white"
            onClick={() => {/* Add to favorites */}}
          >
            <Heart className="w-4 h-4" />
          </Button>
          <Button
            size="icon"
            variant="secondary"
            className="w-8 h-8 bg-white/90 hover:bg-white"
            onClick={() => {/* Share property */}}
          >
            <Share2 className="w-4 h-4" />
          </Button>
        </div>
      </div>

      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <CardTitle 
              className="text-lg font-semibold text-gray-900 truncate"
              title={property.title || 'Untitled Property'}
            >
              {property.title || 'Untitled Property'}
            </CardTitle>
            <CardDescription className="flex items-center mt-1 text-sm text-gray-600 truncate">
              <MapPin className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')} flex-shrink-0`} />
              <span className="truncate" title={cityName || property.location || 'Location not specified'}>
                {cityLoading ? (
                  <span className="text-gray-400">Loading city...</span>
                ) : (
                  cityName || property.location || 'Location not specified'
                )}
              </span>
            </CardDescription>
          </div>
          <div className="text-right flex-shrink-0">
            <div className="text-xl font-bold text-primary whitespace-nowrap">
              {property.getFormattedPrice()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Property Details */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          <div className="flex items-center text-sm text-gray-600 min-w-0">
            <Bed className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')} flex-shrink-0`} />
            <span className="truncate">{property.bedrooms || 0} bed</span>
          </div>
          <div className="flex items-center text-sm text-gray-600 min-w-0">
            <Bath className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')} flex-shrink-0`} />
            <span className="truncate">{property.bathrooms || 0} bath</span>
          </div>
        </div>
        
        {/* Area and Property Type */}
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Square className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')} flex-shrink-0`} />
            <span className="truncate">{property.area || 0} sq ft</span>
          </div>
          <Badge variant="outline" className="text-xs">
            {propertyTypeLoading ? (
              <span className="text-gray-400">Loading...</span>
            ) : (
              propertyTypeName || property.propertyType || 'Unknown Type'
            )}
          </Badge>
        </div>

        {/* Property Info */}
        <div className="space-y-2 mb-4 text-xs text-gray-500">
          {property.owner && (
            <div className="flex items-center">
              <User className={`w-3 h-3 ${getMargin('mr-1', 'ml-1')}`} />
              <span>Owner: {property.owner}</span>
            </div>
          )}
          {property.createdAt && (
            <div className="flex items-center">
              <Calendar className={`w-3 h-3 ${getMargin('mr-1', 'ml-1')}`} />
              <span>Listed: {formatDate(property.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Features:</div>
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature: string, index: number) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {feature}
                </Badge>
              ))}
              {property.features.length > 3 && (
                <Badge variant="secondary" className="text-xs">
                  +{property.features.length - 3} more
                </Badge>
              )}
            </div>
          </div>
        )}

        {/* Action Buttons */}
        {showActions && (
          <div className="flex gap-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1 min-w-0"
              onClick={handleView}
            >
              <Eye className={`w-4 h-4 ${getMargin('mr-1', 'ml-1')} flex-shrink-0`} />
              <span className="truncate">View</span>
            </Button>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0"
                onClick={handleEdit}
              >
                <Edit className="w-4 h-4" />
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                className="flex-shrink-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                onClick={handleDelete}
              >
                <Trash2 className="w-4 h-4" />
              </Button>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

/**
 * PropertyCardSkeleton Component
 * Loading skeleton for PropertyCard
 */
export const PropertyCardSkeleton = ({ className = '', viewMode = 'grid' }) => {
  // Render list view skeleton
  if (viewMode === 'list') {
    return (
      <Card className={`admin-card ${className}`}>
        <CardContent className="p-0">
          <div className="flex">
            {/* Image Skeleton */}
            <div className="w-48 h-32 bg-gray-200 flex-shrink-0 animate-pulse" />
            
            {/* Content Skeleton */}
            <div className="flex-1 p-4">
              <div className="flex items-start justify-between mb-2">
                <div className="flex-1 min-w-0">
                  <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
                </div>
                <div className="h-6 bg-gray-200 rounded animate-pulse w-20 flex-shrink-0 ml-4" />
              </div>
              
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-4">
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
                </div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
              </div>
              
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-4">
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-20" />
                  <div className="h-3 bg-gray-200 rounded animate-pulse w-24" />
                </div>
                <div className="flex items-center space-x-2">
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-12" />
                  <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
                </div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render grid view skeleton (default)
  return (
    <Card className={`admin-card w-full max-w-sm mx-auto ${className}`}>
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between gap-3">
          <div className="flex-1 min-w-0">
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20 flex-shrink-0" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Details Skeleton */}
        <div className="grid grid-cols-2 gap-2 mb-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>
        
        {/* Area and Property Type Skeleton */}
        <div className="flex items-center justify-between mb-4">
          <div className="h-4 bg-gray-200 rounded animate-pulse w-16" />
          <div className="h-5 bg-gray-200 rounded animate-pulse w-20" />
        </div>

        {/* Button Skeleton */}
        <div className="flex gap-2">
          <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

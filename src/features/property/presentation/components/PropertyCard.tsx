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
  User
} from 'lucide-react';

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
export const PropertyCard = ({ 
  property, 
  onView, 
  onEdit, 
  onDelete, 
  showActions = true,
  className = '' 
}) => {
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

  const getStatusColor = (status) => {
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

  const formatDate = (dateString) => {
    if (!dateString) return 'N/A';
    try {
      return new Date(dateString).toLocaleDateString();
    } catch {
      return 'N/A';
    }
  };

  return (
    <Card className={`admin-card admin-card-hover ${className}`}>
      {/* Property Image */}
      <div className="relative h-48 bg-gray-200 rounded-t-lg overflow-hidden">
        {property.getPrimaryImage() ? (
          <img
            src={property.getPrimaryImage()}
            alt={property.title}
            className="w-full h-full object-cover"
            onError={(e) => {
              e.target.style.display = 'none';
              e.target.nextSibling.style.display = 'flex';
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
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <CardTitle className="text-lg font-semibold text-gray-900 line-clamp-2">
              {property.title || 'Untitled Property'}
            </CardTitle>
            <CardDescription className="flex items-center mt-1 text-sm text-gray-600">
              <MapPin className="w-4 h-4 mr-1" />
              {property.location || 'Location not specified'}
            </CardDescription>
          </div>
          <div className="text-right ml-4">
            <div className="text-xl font-bold text-primary">
              {property.getFormattedPrice()}
            </div>
          </div>
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Property Details */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          <div className="flex items-center text-sm text-gray-600">
            <Bed className="w-4 h-4 mr-1" />
            <span>{property.bedrooms || 0} bed</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Bath className="w-4 h-4 mr-1" />
            <span>{property.bathrooms || 0} bath</span>
          </div>
          <div className="flex items-center text-sm text-gray-600">
            <Square className="w-4 h-4 mr-1" />
            <span>{property.area || 0} sq ft</span>
          </div>
        </div>

        {/* Property Type */}
        <div className="mb-3">
          <Badge variant="outline" className="text-xs">
            {property.propertyType || 'Unknown Type'}
          </Badge>
        </div>

        {/* Description */}
        {property.description && (
          <p className="text-sm text-gray-600 mb-4 line-clamp-2">
            {property.description}
          </p>
        )}

        {/* Property Info */}
        <div className="space-y-2 mb-4 text-xs text-gray-500">
          {property.owner && (
            <div className="flex items-center">
              <User className="w-3 h-3 mr-1" />
              <span>Owner: {property.owner}</span>
            </div>
          )}
          {property.createdAt && (
            <div className="flex items-center">
              <Calendar className="w-3 h-3 mr-1" />
              <span>Listed: {formatDate(property.createdAt)}</span>
            </div>
          )}
        </div>

        {/* Features */}
        {property.features && property.features.length > 0 && (
          <div className="mb-4">
            <div className="text-xs font-medium text-gray-700 mb-2">Features:</div>
            <div className="flex flex-wrap gap-1">
              {property.features.slice(0, 3).map((feature, index) => (
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
          <div className="flex space-x-2">
            <Button
              variant="outline"
              size="sm"
              className="flex-1"
              onClick={handleView}
            >
              <Eye className="w-4 h-4 mr-1" />
              View
            </Button>
            {onEdit && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                Edit
              </Button>
            )}
            {onDelete && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                className="text-red-600 hover:text-red-700 hover:bg-red-50"
              >
                Delete
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
export const PropertyCardSkeleton = ({ className = '' }) => {
  return (
    <Card className={`admin-card ${className}`}>
      {/* Image Skeleton */}
      <div className="h-48 bg-gray-200 rounded-t-lg animate-pulse" />
      
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <div className="h-5 bg-gray-200 rounded animate-pulse mb-2" />
            <div className="h-4 bg-gray-200 rounded animate-pulse w-3/4" />
          </div>
          <div className="h-6 bg-gray-200 rounded animate-pulse w-20 ml-4" />
        </div>
      </CardHeader>

      <CardContent className="pt-0">
        {/* Details Skeleton */}
        <div className="grid grid-cols-3 gap-4 mb-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-4 bg-gray-200 rounded animate-pulse" />
          ))}
        </div>

        {/* Description Skeleton */}
        <div className="space-y-2 mb-4">
          <div className="h-3 bg-gray-200 rounded animate-pulse" />
          <div className="h-3 bg-gray-200 rounded animate-pulse w-2/3" />
        </div>

        {/* Button Skeleton */}
        <div className="flex space-x-2">
          <div className="flex-1 h-8 bg-gray-200 rounded animate-pulse" />
          <div className="h-8 bg-gray-200 rounded animate-pulse w-16" />
        </div>
      </CardContent>
    </Card>
  );
};

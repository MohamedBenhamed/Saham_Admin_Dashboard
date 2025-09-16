/**
 * PropertyAddForm Component
 * Form for adding new property information
 */
import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { PropertyImageManager, PropertyImage } from './PropertyImageManager';
import { 
  Save, 
  X, 
  MapPin, 
  Bed, 
  Square, 
  Car,
  DollarSign
} from 'lucide-react';

export interface PropertyFormData {
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
  userId: string;
  images?: PropertyImage[];
}

interface PropertyAddFormProps {
  onSave: (data: PropertyFormData) => void;
  onCancel: () => void;
  loading?: boolean;
}

export const PropertyAddForm: React.FC<PropertyAddFormProps> = ({
  onSave,
  onCancel,
  loading = false
}) => {
  const [formData, setFormData] = useState<PropertyFormData>({
    title: '',
    description: '',
    price: 0,
    originalPrice: 0,
    discount: 0,
    bedrooms: 0,
    bathrooms: 0,
    area: 0,
    parking: 0,
    latitude: '',
    longitude: '',
    nearby: '',
    cityId: 0,
    typePropertyId: 0,
    userId: '',
    images: []
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Handle input changes
  const handleInputChange = (field: keyof PropertyFormData, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));

    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({
        ...prev,
        [field]: undefined
      }));
    }
  };

  // Handle select changes for number fields
  const handleSelectChange = (field: keyof PropertyFormData, value: string) => {
    const numValue = parseInt(value);
    handleInputChange(field, numValue);
  };

  // Handle images change
  const handleImagesChange = (images: PropertyImage[]) => {
    console.log('PropertyAddForm: handleImagesChange called with:', images.length, 'images');
    console.log('PropertyAddForm: images data:', images);
    console.log('PropertyAddForm: current formData.images before update:', formData.images);
    
    setFormData(prev => {
      const updated = {
        ...prev,
        images
      };
      console.log('PropertyAddForm: updated formData.images:', updated.images);
      return updated;
    });
  };

  // Validate form
  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }

    if (formData.price <= 0) {
      newErrors.price = 'Price must be greater than 0';
    }

    if (formData.bedrooms < 0) {
      newErrors.bedrooms = 'Bedrooms cannot be negative';
    }

    if (formData.bathrooms < 0) {
      newErrors.bathrooms = 'Bathrooms cannot be negative';
    }

    if (formData.area <= 0) {
      newErrors.area = 'Area must be greater than 0';
    }

    if (!formData.latitude.trim()) {
      newErrors.latitude = 'Latitude is required';
    }

    if (!formData.longitude.trim()) {
      newErrors.longitude = 'Longitude is required';
    }

    if (!formData.nearby.trim()) {
      newErrors.nearby = 'Nearby location is required';
    }

    if (formData.cityId <= 0) {
      newErrors.cityId = 'City is required';
    }

    if (formData.typePropertyId <= 0) {
      newErrors.typePropertyId = 'Property type is required';
    }

    if (!formData.userId.trim()) {
      newErrors.userId = 'User ID is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  // Handle form submission
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    console.log('=== FORM SUBMISSION DEBUG ===');
    console.log('PropertyAddForm: Form submitted');
    console.log('PropertyAddForm: Current formData:', formData);
    console.log('PropertyAddForm: FormData.images:', formData.images);
    console.log('PropertyAddForm: FormData.images length:', formData.images?.length || 0);
    console.log('PropertyAddForm: FormData.images details:', formData.images?.map(img => ({
      id: img.id,
      name: img.name,
      isNew: img.isNew,
      hasFile: !!img.file,
      fileType: img.file?.type,
      fileSize: img.file?.size
    })));
    console.log('PropertyAddForm: Form submission - validation result:', validateForm());
    console.log('=== END FORM DEBUG ===');
    
    if (validateForm()) {
      console.log('PropertyAddForm: Form is valid, calling onSave with:', formData);
      onSave(formData);
    } else {
      console.log('PropertyAddForm: Form validation failed');
    }
  };

  return (
    <div className="max-w-4xl mx-auto p-6">
      <Card className="admin-card">
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Add New Property</span>
            <Button
              variant="outline"
              size="sm"
              onClick={onCancel}
              disabled={loading}
            >
              <X className="w-4 h-4 mr-2" />
              Cancel
            </Button>
          </CardTitle>
        </CardHeader>
        
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Basic Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <DollarSign className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Basic Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                    Title *
                  </label>
                  <Input
                    id="title"
                    type="text"
                    value={formData.title}
                    onChange={(e) => handleInputChange('title', e.target.value)}
                    placeholder="Enter property title"
                    className={errors.title ? 'border-red-500' : ''}
                  />
                  {errors.title && (
                    <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="price" className="block text-sm font-medium text-gray-700 mb-1">
                    Price *
                  </label>
                  <Input
                    id="price"
                    type="number"
                    value={formData.price}
                    onChange={(e) => handleInputChange('price', parseFloat(e.target.value) || 0)}
                    placeholder="Enter price"
                    className={errors.price ? 'border-red-500' : ''}
                  />
                  {errors.price && (
                    <p className="text-red-500 text-sm mt-1">{errors.price}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                  Description *
                </label>
                <Textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Enter property description"
                  rows={4}
                  className={errors.description ? 'border-red-500' : ''}
                />
                {errors.description && (
                  <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                )}
              </div>
            </div>

            {/* Property Details */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Bed className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Property Details</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div>
                  <label htmlFor="bedrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bedrooms *
                  </label>
                  <Input
                    id="bedrooms"
                    type="number"
                    min="0"
                    value={formData.bedrooms}
                    onChange={(e) => handleInputChange('bedrooms', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.bedrooms ? 'border-red-500' : ''}
                  />
                  {errors.bedrooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.bedrooms}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="bathrooms" className="block text-sm font-medium text-gray-700 mb-1">
                    Bathrooms *
                  </label>
                  <Input
                    id="bathrooms"
                    type="number"
                    min="0"
                    value={formData.bathrooms}
                    onChange={(e) => handleInputChange('bathrooms', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.bathrooms ? 'border-red-500' : ''}
                  />
                  {errors.bathrooms && (
                    <p className="text-red-500 text-sm mt-1">{errors.bathrooms}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="area" className="block text-sm font-medium text-gray-700 mb-1">
                    Area (sq ft) *
                  </label>
                  <Input
                    id="area"
                    type="number"
                    min="0"
                    value={formData.area}
                    onChange={(e) => handleInputChange('area', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.area ? 'border-red-500' : ''}
                  />
                  {errors.area && (
                    <p className="text-red-500 text-sm mt-1">{errors.area}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="parking" className="block text-sm font-medium text-gray-700 mb-1">
                    Parking Spaces
                  </label>
                  <Input
                    id="parking"
                    type="number"
                    min="0"
                    value={formData.parking}
                    onChange={(e) => handleInputChange('parking', parseInt(e.target.value) || 0)}
                    placeholder="0"
                    className={errors.parking ? 'border-red-500' : ''}
                  />
                  {errors.parking && (
                    <p className="text-red-500 text-sm mt-1">{errors.parking}</p>
                  )}
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="originalPrice" className="block text-sm font-medium text-gray-700 mb-1">
                    Original Price
                  </label>
                  <Input
                    id="originalPrice"
                    type="number"
                    min="0"
                    value={formData.originalPrice}
                    onChange={(e) => handleInputChange('originalPrice', parseFloat(e.target.value) || 0)}
                    placeholder="Enter original price"
                  />
                </div>

                <div>
                  <label htmlFor="discount" className="block text-sm font-medium text-gray-700 mb-1">
                    Discount (%)
                  </label>
                  <Input
                    id="discount"
                    type="number"
                    min="0"
                    max="100"
                    value={formData.discount}
                    onChange={(e) => handleInputChange('discount', parseFloat(e.target.value) || 0)}
                    placeholder="Enter discount percentage"
                  />
                </div>
              </div>
            </div>

            {/* Location Information */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <MapPin className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Location Information</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="latitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Latitude *
                  </label>
                  <Input
                    id="latitude"
                    type="text"
                    value={formData.latitude}
                    onChange={(e) => handleInputChange('latitude', e.target.value)}
                    placeholder="Enter latitude"
                    className={errors.latitude ? 'border-red-500' : ''}
                  />
                  {errors.latitude && (
                    <p className="text-red-500 text-sm mt-1">{errors.latitude}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="longitude" className="block text-sm font-medium text-gray-700 mb-1">
                    Longitude *
                  </label>
                  <Input
                    id="longitude"
                    type="text"
                    value={formData.longitude}
                    onChange={(e) => handleInputChange('longitude', e.target.value)}
                    placeholder="Enter longitude"
                    className={errors.longitude ? 'border-red-500' : ''}
                  />
                  {errors.longitude && (
                    <p className="text-red-500 text-sm mt-1">{errors.longitude}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="nearby" className="block text-sm font-medium text-gray-700 mb-1">
                  Nearby Location *
                </label>
                <Input
                  id="nearby"
                  type="text"
                  value={formData.nearby}
                  onChange={(e) => handleInputChange('nearby', e.target.value)}
                  placeholder="Enter nearby location"
                  className={errors.nearby ? 'border-red-500' : ''}
                />
                {errors.nearby && (
                  <p className="text-red-500 text-sm mt-1">{errors.nearby}</p>
                )}
              </div>
            </div>

            {/* Property Classification */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Car className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Property Classification</h3>
              </div>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label htmlFor="cityId" className="block text-sm font-medium text-gray-700 mb-1">
                    City *
                  </label>
                  <Select
                    value={formData.cityId.toString()}
                    onValueChange={(value) => handleSelectChange('cityId', value)}
                  >
                    <SelectTrigger className={errors.cityId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select city" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Tripoli</SelectItem>
                      <SelectItem value="2">Benghazi</SelectItem>
                      <SelectItem value="3">Misrata</SelectItem>
                      <SelectItem value="4">Zawiya</SelectItem>
                      <SelectItem value="5">Sabha</SelectItem>
                      <SelectItem value="6">Other</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.cityId && (
                    <p className="text-red-500 text-sm mt-1">{errors.cityId}</p>
                  )}
                </div>

                <div>
                  <label htmlFor="typePropertyId" className="block text-sm font-medium text-gray-700 mb-1">
                    Property Type *
                  </label>
                  <Select
                    value={formData.typePropertyId.toString()}
                    onValueChange={(value) => handleSelectChange('typePropertyId', value)}
                  >
                    <SelectTrigger className={errors.typePropertyId ? 'border-red-500' : ''}>
                      <SelectValue placeholder="Select property type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="1">Apartment</SelectItem>
                      <SelectItem value="2">House</SelectItem>
                      <SelectItem value="3">Villa</SelectItem>
                      <SelectItem value="4">Commercial</SelectItem>
                      <SelectItem value="5">Land</SelectItem>
                    </SelectContent>
                  </Select>
                  {errors.typePropertyId && (
                    <p className="text-red-500 text-sm mt-1">{errors.typePropertyId}</p>
                  )}
                </div>
              </div>

              <div>
                <label htmlFor="userId" className="block text-sm font-medium text-gray-700 mb-1">
                  User ID *
                </label>
                <Input
                  id="userId"
                  type="text"
                  value={formData.userId}
                  onChange={(e) => handleInputChange('userId', e.target.value)}
                  placeholder="Enter user ID"
                  className={errors.userId ? 'border-red-500' : ''}
                />
                {errors.userId && (
                  <p className="text-red-500 text-sm mt-1">{errors.userId}</p>
                )}
              </div>
            </div>

            {/* Property Images */}
            <div className="space-y-3">
              <div className="flex items-center space-x-2 mb-3">
                <Square className="w-5 h-5 text-primary" />
                <h3 className="text-lg font-semibold text-gray-900">Property Images</h3>
              </div>
              
              <div className={`mb-2 p-3 border rounded-lg ${
                (formData.images?.length || 0) === 0 
                  ? 'bg-blue-50 border-blue-200' 
                  : 'bg-green-50 border-green-200'
              }`}>
                <p className={`text-sm ${
                  (formData.images?.length || 0) === 0 
                    ? 'text-blue-700' 
                    : 'text-green-700'
                }`}>
                  <strong>Images Status:</strong> {formData.images?.length || 0} images selected
                  {formData.images && formData.images.length > 0 && (
                    <span className="ml-2">
                      ({formData.images.filter(img => img.isNew).length} new)
                    </span>
                  )}
                </p>
              </div>
              
              <PropertyImageManager
                images={formData.images || []}
                onImagesChange={handleImagesChange}
                maxImages={10}
              />
            </div>

            {/* Form Actions */}
            <div className="flex justify-end space-x-4 pt-3 border-t border-gray-200">
              <Button
                type="submit"
                disabled={loading}
                className="min-w-[120px]"
              >
                {loading ? (
                  <>
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                    Creating...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" />
                    Create Property
                  </>
                )}
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
};

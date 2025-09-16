/**
 * PropertyAddPage Component
 * Page for adding new property information
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { PropertyAddForm, PropertyFormData } from '../components/PropertyAddForm';
import { propertyApi } from '../../data/api/propertyApi';
import { toast } from 'sonner';

export const PropertyAddPage: React.FC = () => {
  const navigate = useNavigate();
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Handle form save
  const handleSave = async (formData: PropertyFormData) => {
    try {
      setSaving(true);
      setError(null);

      // Process images - separate new files from existing URLs
      const newImageFiles: File[] = [];
      const existingImageUrls: string[] = [];

      // Debug: Log all images in the form
      console.log('Processing form images for new property:', formData.images);
      console.log('Form data images length:', formData.images?.length || 0);
      console.log('Form data images details:', formData.images?.map(img => ({
        id: img.id,
        name: img.name,
        isNew: img.isNew,
        hasFile: !!img.file,
        fileType: img.file?.type,
        fileSize: img.file?.size
      })));

      (formData.images || []).forEach((image, index) => {
        console.log(`Processing image ${index}:`, {
          id: image.id,
          name: image.name,
          isNew: image.isNew,
          hasFile: !!image.file,
          url: image.url
        });
        
        if (image.isNew && image.file) {
          newImageFiles.push(image.file);
          console.log('✅ Added new image file:', image.file.name);
        } else if (!image.isNew) {
          // Include existing images (shouldn't happen for new properties, but just in case)
          existingImageUrls.push(image.url);
          console.log('Existing image path:', image.url);
        } else {
          console.log('❌ Skipped image:', image.name, 'reason:', !image.isNew ? 'not new' : 'no file');
        }
      });

      // Debug: Log image processing
      console.log('New property image processing:', {
        totalImagesInForm: formData.images?.length || 0,
        newImageFiles: newImageFiles.length,
        existingImageUrls: existingImageUrls.length
      });

      // Create property data in the exact format expected by the API
      // Note: Server expects capitalized field names with [FromForm]
      const newPropertyData: any = {
        Title: formData.title,
        Description: formData.description,
        Price: formData.price,
        OriginalPrice: formData.originalPrice,
        Discount: formData.discount,
        Bedrooms: formData.bedrooms,
        Bathrooms: formData.bathrooms,
        Area: formData.area,
        Parking: formData.parking,
        Latitude: formData.latitude,
        Longitude: formData.longitude,
        Nearby: formData.nearby,
        CityId: formData.cityId,
        TypePropertyId: formData.typePropertyId,
        UserId: formData.userId
      };

      // Handle images according to server expectations
      // Server expects Files: List<IFormFile>? and generates URLs itself
      // Server doesn't use ImagesProperty from request - it creates it from uploaded files
      
      // Add Files for new image uploads (if any)
      if (newImageFiles.length > 0) {
        newPropertyData.Files = newImageFiles;
        console.log('✅ Added Files to newPropertyData:', newImageFiles.length, 'files');
      } else {
        console.log('❌ No Files to add - newImageFiles.length:', newImageFiles.length);
      }

      // Debug: Log the form data and final payload
      console.log('=== PROPERTY ADD DEBUG ===');
      console.log('Form data received:', formData);
      console.log('Form data images:', formData.images);
      console.log('New image files:', newImageFiles);
      console.log('New image files details:', newImageFiles.map(f => ({ name: f.name, type: f.type, size: f.size })));
      console.log('Existing image URLs:', existingImageUrls);
      console.log('Final API payload for new property:', newPropertyData);
      console.log('Payload keys:', Object.keys(newPropertyData));
      console.log('Has Files:', !!newPropertyData.Files);
      console.log('Files count:', newPropertyData.Files?.length || 0);
      console.log('Files details:', newPropertyData.Files?.map((f: File) => ({ name: f.name, type: f.type, size: f.size })));
      console.log('ImagesProperty:', newPropertyData.ImagesProperty);
      console.log('=== END DEBUG ===');

      // Test FormData construction
      console.log('=== TESTING FORMDATA CONSTRUCTION ===');
      const testFormData = new FormData();
      testFormData.append('Title', 'Test Title');
      testFormData.append('Description', 'Test Description');
      if (newImageFiles.length > 0) {
        testFormData.append('Files', newImageFiles[0], newImageFiles[0].name);
        console.log('Added test file to FormData:', newImageFiles[0].name);
        console.log('Test file details:', {
          name: newImageFiles[0].name,
          type: newImageFiles[0].type,
          size: newImageFiles[0].size,
          lastModified: newImageFiles[0].lastModified
        });
      }
      
      console.log('Test FormData entries:');
      for (const [key, value] of testFormData.entries()) {
        if (value instanceof File) {
          console.log(`${key}:`, `File(${value.name}, ${value.type}, ${value.size} bytes)`);
        } else {
          console.log(`${key}:`, value);
        }
      }
      
      // Test if we can read the file
      if (newImageFiles.length > 0) {
        const testFile = newImageFiles[0];
        console.log('Testing file read...');
        const reader = new FileReader();
        reader.onload = (e) => {
          console.log('File read successfully, size:', e.target?.result ? (e.target.result as ArrayBuffer).byteLength : 'unknown');
        };
        reader.onerror = (e) => {
          console.error('File read error:', e);
        };
        reader.readAsArrayBuffer(testFile);
      }
      
      console.log('=== END FORMDATA TEST ===');

      // Create property via API with all data including images
      const createResult = await propertyApi.createProperty(newPropertyData);
      
      // Debug: Log the API response
      console.log('API create response:', createResult);
      
      // Show success message with image details
      const imageMessage = newImageFiles.length > 0 
        ? ` with ${newImageFiles.length} image${newImageFiles.length === 1 ? '' : 's'}`
        : ' (no images)';
      toast.success(`Property created successfully${imageMessage}!`);
      
      // Navigate back to properties list
      navigate('/admin/properties');
    } catch (err) {
      console.error('Error creating property:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create property';
      setError(errorMessage);
      toast.error(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  // Handle form cancel
  const handleCancel = () => {
    navigate('/admin/properties');
  };

  return (
    <div className="space-y-4">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Add New Property</h1>
          <p className="text-gray-600 mt-1">Create a new property listing</p>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Add Form */}
      <PropertyAddForm
        onSave={handleSave}
        onCancel={handleCancel}
        loading={saving}
      />
    </div>
  );
};

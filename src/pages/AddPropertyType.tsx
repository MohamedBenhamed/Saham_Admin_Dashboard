/**
 * AddPropertyTypePage Component
 * Form for creating new property types
 */
import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  ArrowLeft, 
  Save, 
  X,
  Home,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

interface PropertyTypeFormData {
  name: string;
}

export const AddPropertyType: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<PropertyTypeFormData>({
    name: ''
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof PropertyTypeFormData, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => {
        const newErrors = { ...prev };
        delete newErrors[field];
        return newErrors;
      });
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Property type name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'Property type name must be at least 2 characters';
    } else if (formData.name.trim().length > 50) {
      newErrors.name = 'Property type name must be less than 50 characters';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = async () => {
    if (!validateForm()) {
      toast.error('Please fix the errors before saving');
      return;
    }

    try {
      setLoading(true);
      console.log('Creating property type with data:', formData);

      const response = await fetch('http://161.97.100.109:7001/api/TypeProperty/addTypeProperty', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        body: JSON.stringify(formData),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Property type created successfully:', result);

      toast.success('Property type created successfully!', {
        description: `Property type "${formData.name}" has been created.`,
      });

      navigate('/admin/settings/property-types');
    } catch (err) {
      console.error('Error creating property type:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create property type';
      toast.error('Failed to create property type', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/property-types');
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-4xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Property Types
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New Property Type</h1>
              <p className="text-sm lg:text-base text-gray-600">Create a new property type entry</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 xl:grid-cols-3 gap-4 lg:gap-6">
          {/* Main Form */}
          <div className="xl:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Building2 className="w-5 h-5 mr-2" />
                  Property Type Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                {/* Basic Information */}
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-base lg:text-lg font-medium text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      Property Type Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter property type name"
                      className={errors.name ? 'border-red-500' : ''}
                      maxLength={50}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.name.length}/50 characters
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Form Actions */}
            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={loading}
                    className="w-full"
                  >
                    {loading ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Property Type...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Property Type
                      </>
                    )}
                  </Button>
                  <Button
                    onClick={handleCancel}
                    variant="outline"
                    className="w-full"
                  >
                    <X className="w-4 h-4 mr-2" />
                    Cancel
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
};

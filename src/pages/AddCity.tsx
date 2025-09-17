/**
 * AddCityPage Component
 * Form for creating new cities
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
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

interface CityFormData {
  name: string;
  countryId: number;
}

export const AddCity: React.FC = () => {
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<CityFormData>({
    name: '',
    countryId: 1 // Always set to 1 as requested
  });

  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (field: keyof CityFormData, value: string | number) => {
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
      newErrors.name = 'City name is required';
    } else if (formData.name.trim().length < 2) {
      newErrors.name = 'City name must be at least 2 characters';
    } else if (formData.name.trim().length > 100) {
      newErrors.name = 'City name must be less than 100 characters';
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
      console.log('Creating city with data:', formData);

      const response = await fetch('http://161.97.100.109:7001/api/City/addNewCities', {
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
      console.log('City created successfully:', result);

      toast.success('City created successfully!', {
        description: `City "${formData.name}" has been created.`,
      });

      navigate('/admin/settings/cities');
    } catch (err) {
      console.error('Error creating city:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create city';
      toast.error('Failed to create city', {
        description: errorMessage,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/settings/cities');
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
              Back to Cities
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add New City</h1>
              <p className="text-sm lg:text-base text-gray-600">Create a new city entry</p>
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
                  City Information
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                {/* Basic Information */}
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-base lg:text-lg font-medium text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                      City Name *
                    </label>
                    <Input
                      id="name"
                      type="text"
                      value={formData.name}
                      onChange={(e) => handleInputChange('name', e.target.value)}
                      placeholder="Enter city name"
                      className={errors.name ? 'border-red-500' : ''}
                      maxLength={100}
                    />
                    {errors.name && (
                      <p className="text-red-500 text-sm mt-1">{errors.name}</p>
                    )}
                    <p className="text-gray-500 text-sm mt-1">
                      {formData.name.length}/100 characters
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
                        Creating City...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create City
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

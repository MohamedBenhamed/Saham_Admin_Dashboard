/**
 * AddInvestmentPage Component
 * Form for creating new investment from property
 */
import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { 
  ArrowLeft, 
  Save, 
  X,
  DollarSign,
  Calendar,
  Users,
  Building2
} from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { propertyApi } from '@/features/property/data/api/propertyApi';
import { toast } from 'sonner';

interface InvestmentFormData {
  title: string;
  description: string;
  totalShares: number;
  sharePrice: number;
  availableShares: number;
  durationByMonths: number;
  propertyId: number;
  userId: string;
}

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

export const AddInvestmentPage: React.FC = () => {
  const { propertyId } = useParams<{ propertyId: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  const [property, setProperty] = useState<PropertyDetails | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  const [formData, setFormData] = useState<InvestmentFormData>({
    title: '',
    description: '',
    totalShares: 0,
    sharePrice: 0,
    availableShares: 0,
    durationByMonths: 0,
    propertyId: propertyId ? parseInt(propertyId) : 0,
    userId: user?.id || ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch property details on component mount
  useEffect(() => {
    const fetchProperty = async () => {
      if (!propertyId) {
        setError('Property ID is required');
        setLoading(false);
        return;
      }

      try {
        setLoading(true);
        setError(null);
        console.log('Fetching property with ID:', propertyId);
        
        const propertyData = await propertyApi.getPropertyById(propertyId);
        console.log('Property data received:', propertyData);
        
        setProperty(propertyData);
        
        // Pre-fill form with property data
        setFormData(prev => ({
          ...prev,
          title: propertyData.title || '',
          description: propertyData.description || '',
          propertyId: propertyData.id,
          userId: user?.id || ''
        }));
      } catch (err) {
        console.error('Error fetching property:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property');
      } finally {
        setLoading(false);
      }
    };

    fetchProperty();
  }, [propertyId, user?.id]);

  // Update userId when user changes
  useEffect(() => {
    if (user?.id) {
      setFormData(prev => ({ ...prev, userId: user.id }));
    }
  }, [user?.id]);

  const handleInputChange = (field: keyof InvestmentFormData, value: string | number) => {
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

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }
    if (!formData.description.trim()) {
      newErrors.description = 'Description is required';
    }
    if (formData.totalShares < 0 || formData.totalShares > 100) {
      newErrors.totalShares = 'Total shares must be between 0 and 100';
    }
    if (formData.sharePrice < 0) {
      newErrors.sharePrice = 'Share price must be 0 or greater';
    }
    if (formData.availableShares < 0 || formData.availableShares > 50) {
      newErrors.availableShares = 'Available shares must be between 0 and 50';
    }
    if (formData.availableShares > formData.totalShares) {
      newErrors.availableShares = 'Available shares cannot exceed total shares';
    }
    if (formData.durationByMonths <= 0) {
      newErrors.durationByMonths = 'Duration must be greater than 0 months';
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
      setSaving(true);
      console.log('Creating investment with data:', formData);

      const response = await fetch('http://161.97.100.109:7001/api/Investment/addNewInvestment', {
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
      console.log('Investment created successfully:', result);

      toast.success('Investment created successfully!', {
        description: `Investment "${formData.title}" has been created.`,
      });

      navigate('/admin/investments');
    } catch (err) {
      console.error('Error creating investment:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to create investment';
      toast.error('Failed to create investment', {
        description: errorMessage,
      });
      setError(errorMessage);
    } finally {
      setSaving(false);
    }
  };

  const handleCancel = () => {
    navigate('/admin/investments');
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
          <Button onClick={() => navigate('/admin/investments')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investments
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
          <Button onClick={() => navigate('/admin/investments')} variant="outline">
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back to Investments
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4 lg:mb-6 gap-4">
          <div className="flex flex-col sm:flex-row sm:items-center space-y-2 sm:space-y-0 sm:space-x-4">
            <Button
              variant="outline"
              onClick={handleCancel}
              className="flex items-center w-fit"
            >
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Investments
            </Button>
            <div>
              <h1 className="text-2xl lg:text-3xl font-bold text-gray-900">Add Investment</h1>
              <p className="text-sm lg:text-base text-gray-600">Create investment for: {property.title}</p>
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
                  Investment Details
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 lg:space-y-6">
                {/* Basic Information */}
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-base lg:text-lg font-medium text-gray-900">Basic Information</h3>
                  
                  <div>
                    <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-1">
                      Investment Title *
                    </label>
                    <Input
                      id="title"
                      type="text"
                      value={formData.title}
                      onChange={(e) => handleInputChange('title', e.target.value)}
                      placeholder="Enter investment title"
                      className={errors.title ? 'border-red-500' : ''}
                    />
                    {errors.title && (
                      <p className="text-red-500 text-sm mt-1">{errors.title}</p>
                    )}
                  </div>

                  <div>
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                      Description *
                    </label>
                    <Textarea
                      id="description"
                      value={formData.description}
                      onChange={(e) => handleInputChange('description', e.target.value)}
                      placeholder="Enter investment description"
                      rows={4}
                      className={errors.description ? 'border-red-500' : ''}
                    />
                    {errors.description && (
                      <p className="text-red-500 text-sm mt-1">{errors.description}</p>
                    )}
                  </div>
                </div>

                {/* Investment Structure */}
                <div className="space-y-3 lg:space-y-4">
                  <h3 className="text-base lg:text-lg font-medium text-gray-900 flex items-center">
                    <DollarSign className="w-4 h-4 lg:w-5 lg:h-5 mr-2" />
                    Investment Structure
                  </h3>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 lg:gap-4">
                    <div>
                      <label htmlFor="totalShares" className="block text-sm font-medium text-gray-700 mb-1">
                        Total Shares *
                      </label>
                      <Input
                        id="totalShares"
                        type="number"
                        min="0"
                        max="100"
                        step="1"
                        value={formData.totalShares}
                        onChange={(e) => handleInputChange('totalShares', parseInt(e.target.value) || 0)}
                        placeholder="Enter total shares (0-100)"
                        className={errors.totalShares ? 'border-red-500' : ''}
                      />
                      {errors.totalShares && (
                        <p className="text-red-500 text-sm mt-1">{errors.totalShares}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="sharePrice" className="block text-sm font-medium text-gray-700 mb-1">
                        Share Price ($) *
                      </label>
                      <Input
                        id="sharePrice"
                        type="number"
                        min="0"
                        step="1"
                        value={formData.sharePrice}
                        onChange={(e) => handleInputChange('sharePrice', parseInt(e.target.value) || 0)}
                        placeholder="Enter share price (integer)"
                        className={errors.sharePrice ? 'border-red-500' : ''}
                      />
                      {errors.sharePrice && (
                        <p className="text-red-500 text-sm mt-1">{errors.sharePrice}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="availableShares" className="block text-sm font-medium text-gray-700 mb-1">
                        Available Shares *
                      </label>
                      <Input
                        id="availableShares"
                        type="number"
                        min="0"
                        max="50"
                        step="1"
                        value={formData.availableShares}
                        onChange={(e) => handleInputChange('availableShares', parseInt(e.target.value) || 0)}
                        placeholder="Enter available shares (0-50)"
                        className={errors.availableShares ? 'border-red-500' : ''}
                      />
                      {errors.availableShares && (
                        <p className="text-red-500 text-sm mt-1">{errors.availableShares}</p>
                      )}
                    </div>

                    <div>
                      <label htmlFor="durationByMonths" className="block text-sm font-medium text-gray-700 mb-1">
                        Duration (Months) *
                      </label>
                      <Input
                        id="durationByMonths"
                        type="number"
                        min="1"
                        value={formData.durationByMonths}
                        onChange={(e) => handleInputChange('durationByMonths', parseInt(e.target.value) || 0)}
                        placeholder="Enter duration in months"
                        className={errors.durationByMonths ? 'border-red-500' : ''}
                      />
                      {errors.durationByMonths && (
                        <p className="text-red-500 text-sm mt-1">{errors.durationByMonths}</p>
                      )}
                    </div>
                  </div>
                </div>

              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-4 lg:space-y-6">
            {/* Property Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Property Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Title</label>
                  <p className="text-gray-900">{property.title}</p>
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-1">Property Price</label>
                  <p className="text-gray-900">${property.price.toLocaleString()}</p>
                </div>
              </CardContent>
            </Card>

            {/* Investment Summary */}
            <Card>
              <CardHeader>
                <CardTitle>Investment Summary</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3 lg:space-y-4">
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Total Investment Value</span>
                  <span className="font-bold text-lg">
                    ${(formData.totalShares * formData.sharePrice).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Available Value</span>
                  <span className="font-medium">
                    ${(formData.availableShares * formData.sharePrice).toLocaleString()}
                  </span>
                </div>
                <div className="flex items-center justify-between">
                  <span className="text-gray-600">Duration</span>
                  <span className="font-medium">{formData.durationByMonths} months</span>
                </div>
              </CardContent>
            </Card>

            {/* Form Actions */}
            <Card>
              <CardContent className="pt-4 lg:pt-6">
                <div className="space-y-3">
                  <Button
                    onClick={handleSave}
                    disabled={saving}
                    className="w-full"
                  >
                    {saving ? (
                      <>
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2" />
                        Creating Investment...
                      </>
                    ) : (
                      <>
                        <Save className="w-4 h-4 mr-2" />
                        Create Investment
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

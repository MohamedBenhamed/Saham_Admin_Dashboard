/**
 * PropertyTypes Page Component
 * Displays and manages property types data
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Home, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

interface PropertyType {
  id: number;
  name: string;
}

export const PropertyTypes: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [propertyTypes, setPropertyTypes] = useState<PropertyType[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredPropertyTypes, setFilteredPropertyTypes] = useState<PropertyType[]>([]);

  // Fetch property types data
  useEffect(() => {
    const fetchPropertyTypes = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching property types...');
        
        const response = await fetch('http://161.97.100.109:7001/api/TypeProperty/getAllTypeProperty', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Property types data received:', data);
        
        setPropertyTypes(data);
        setFilteredPropertyTypes(data);
      } catch (err) {
        console.error('Error fetching property types:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch property types');
        toast.error('Failed to fetch property types', {
          description: 'Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchPropertyTypes();
  }, []);

  // Filter property types based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredPropertyTypes(propertyTypes);
    } else {
      const filtered = propertyTypes.filter(propertyType =>
        propertyType.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredPropertyTypes(filtered);
    }
  }, [searchTerm, propertyTypes]);

  const handleAddPropertyType = () => {
    console.log('Add property type clicked');
    // Navigate to add property type page
    navigate('/admin/settings/property-types/add');
  };

  const handleEditPropertyType = (propertyType: PropertyType) => {
    console.log('Edit property type:', propertyType);
    // TODO: Implement edit property type functionality
    toast.info(`Edit property type "${propertyType.name}" functionality coming soon`);
  };

  const handleDeletePropertyType = (propertyType: PropertyType) => {
    console.log('Delete property type:', propertyType);
    // TODO: Implement delete property type functionality
    toast.info(`Delete property type "${propertyType.name}" functionality coming soon`);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading property types...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <p className="text-red-600 mb-4">Error: {error}</p>
          <Button onClick={() => window.location.reload()} variant="outline">
            Try Again
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('propertyTypes')}</h1>
          <p className="text-gray-600 mt-1">{t('managePropertyTypesInfo')}</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleAddPropertyType}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addPropertyType')}
          </Button>
        </div>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t('propertyTypesManagement')}</CardTitle>
          <CardDescription>{t('searchPropertyTypesPlaceholder')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('searchPropertyTypesPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Property Types Table */}
          <div className="border border-gray-200 rounded-large overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading property types...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">Error: {error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Try Again
                </Button>
              </div>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-medium text-gray-900">{t('propertyTypeName')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredPropertyTypes.map((propertyType) => (
                    <tr key={propertyType.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <Home className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{propertyType.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditPropertyType(propertyType)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeletePropertyType(propertyType)}
                            className="text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="w-4 h-4" />
                          </Button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

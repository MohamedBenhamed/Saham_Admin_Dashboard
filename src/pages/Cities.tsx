/**
 * Cities Page Component
 * Displays and manages cities data
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash2
} from 'lucide-react';
import { toast } from 'sonner';
import { useTranslation } from '@/hooks/useTranslation';

interface City {
  id: number;
  name: string;
  country: string | null;
  countryId: number;
}

export const Cities: React.FC = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [cities, setCities] = useState<City[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>([]);

  // Fetch cities data
  useEffect(() => {
    const fetchCities = async () => {
      try {
        setLoading(true);
        setError(null);
        console.log('Fetching cities...');
        
        const response = await fetch('http://161.97.100.109:7001/api/City/getAllCities', {
          method: 'GET',
          headers: {
            'Accept': 'application/json',
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
        console.log('Cities data received:', data);
        
        setCities(data);
        setFilteredCities(data);
      } catch (err) {
        console.error('Error fetching cities:', err);
        setError(err instanceof Error ? err.message : 'Failed to fetch cities');
        toast.error('Failed to fetch cities', {
          description: 'Please try again later.',
        });
      } finally {
        setLoading(false);
      }
    };

    fetchCities();
  }, []);

  // Filter cities based on search term
  useEffect(() => {
    if (!searchTerm.trim()) {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (city.country && city.country.toLowerCase().includes(searchTerm.toLowerCase()))
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm, cities]);

  const handleAddCity = () => {
    console.log('Add city clicked');
    // Navigate to add city page
    navigate('/admin/settings/cities/add');
  };

  const handleEditCity = (city: City) => {
    console.log('Edit city:', city);
    // TODO: Implement edit city functionality
    toast.info(`Edit city "${city.name}" functionality coming soon`);
  };

  const handleDeleteCity = (city: City) => {
    console.log('Delete city:', city);
    // TODO: Implement delete city functionality
    toast.info(`Delete city "${city.name}" functionality coming soon`);
  };

  const getCountryName = (countryId: number): string => {
    // Map country IDs to names (you can expand this based on your needs)
    const countryMap: Record<number, string> = {
      1: 'Libya',
      2: 'Egypt',
      3: 'Tunisia',
      4: 'Algeria',
      5: 'Morocco',
    };
    return countryMap[countryId] || `Country ${countryId}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading cities...</p>
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
          <h1 className="text-3xl font-bold text-gray-900">{t('cities')}</h1>
          <p className="text-gray-600 mt-1">{t('manageCitiesInfo')}</p>
        </div>
        <div className="flex space-x-3">
          <Button onClick={handleAddCity}>
            <Plus className="w-4 h-4 mr-2" />
            {t('addCity')}
          </Button>
        </div>
      </div>


      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>{t('citiesManagement')}</CardTitle>
          <CardDescription>{t('searchCitiesPlaceholder')}</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder={t('searchCitiesPlaceholder')}
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
          </div>

          {/* Cities Table */}
          <div className="border border-gray-200 rounded-large overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading cities...</p>
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
                    <th className="text-left py-3 px-4 font-medium text-gray-900">{t('cityName')}</th>
                    <th className="text-left py-3 px-4 font-medium text-gray-900">{t('actions')}</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredCities.map((city) => (
                    <tr key={city.id} className="border-b border-gray-100 hover:bg-gray-50">
                      <td className="py-3 px-4">
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 text-gray-400 mr-2" />
                          <span className="font-medium text-gray-900">{city.name}</span>
                        </div>
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex items-center space-x-2">
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleEditCity(city)}
                            className="text-blue-600 hover:text-blue-700 hover:bg-blue-50"
                          >
                            <Edit className="w-4 h-4" />
                          </Button>
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteCity(city)}
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

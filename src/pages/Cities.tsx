/**
 * Cities Page Component
 * Displays and manages cities data
 */
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  MapPin, 
  Plus, 
  Search, 
  Edit, 
  Trash2,
  Building2
} from 'lucide-react';
import { toast } from 'sonner';

interface City {
  id: number;
  name: string;
  country: string | null;
  countryId: number;
}

export const Cities: React.FC = () => {
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
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto p-4 lg:p-6">
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-6 gap-4">
          <div>
            <h1 className="text-2xl lg:text-3xl font-bold text-gray-900 flex items-center">
              <MapPin className="w-6 h-6 lg:w-8 lg:h-8 mr-3" />
              Cities Management
            </h1>
            <p className="text-sm lg:text-base text-gray-600 mt-1">
              Manage cities and their information
            </p>
          </div>
          <Button onClick={handleAddCity} className="w-fit">
            <Plus className="w-4 h-4 mr-2" />
            Add City
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 lg:gap-6 mb-6">
          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                  <Building2 className="w-6 h-6 text-blue-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Total Cities</p>
                  <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                  <MapPin className="w-6 h-6 text-green-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Active Cities</p>
                  <p className="text-2xl font-bold text-gray-900">{cities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-4 lg:p-6">
              <div className="flex items-center">
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                  <Search className="w-6 h-6 text-purple-600" />
                </div>
                <div className="ml-4">
                  <p className="text-sm font-medium text-gray-600">Filtered Results</p>
                  <p className="text-2xl font-bold text-gray-900">{filteredCities.length}</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Search and Filters */}
        <Card className="mb-6">
          <CardContent className="p-4 lg:p-6">
            <div className="flex flex-col sm:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                  <Input
                    type="text"
                    placeholder="Search cities by name or country..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Cities Table */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <MapPin className="w-5 h-5 mr-2" />
              Cities List
            </CardTitle>
          </CardHeader>
          <CardContent>
            {filteredCities.length === 0 ? (
              <div className="text-center py-8">
                <MapPin className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-medium text-gray-900 mb-2">
                  {searchTerm ? 'No cities found' : 'No cities available'}
                </h3>
                <p className="text-gray-600 mb-4">
                  {searchTerm 
                    ? `No cities match your search for "${searchTerm}"`
                    : 'Get started by adding your first city.'
                  }
                </p>
                {!searchTerm && (
                  <Button onClick={handleAddCity}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add First City
                  </Button>
                )}
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-gray-200">
                      <th className="text-left py-3 px-4 font-medium text-gray-900">City Name</th>
                      <th className="text-left py-3 px-4 font-medium text-gray-900">Actions</th>
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
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

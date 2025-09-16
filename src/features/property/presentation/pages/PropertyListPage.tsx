/**
 * PropertyListPage Component
 * Main page for displaying a list of properties
 */
import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { 
  Search, 
  Filter, 
  Grid, 
  List, 
  Plus,
  RefreshCw,
  AlertCircle,
  TrendingUp,
  MapPin,
  Home
} from 'lucide-react';
import { useTranslation } from '@/hooks/useTranslation';
import { useProperties } from '../hooks/useProperties';
import { PropertyCard, PropertyCardSkeleton } from '../components/PropertyCard';

/**
 * PropertyListPage Component
 */
export const PropertyListPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [sortBy, setSortBy] = useState('createdAt');
  const [sortOrder, setSortOrder] = useState('desc');
  const [viewMode, setViewMode] = useState('grid'); // 'grid' or 'list'
  const [showFilters, setShowFilters] = useState(false);

  // Fetch properties with options
  const {
    properties,
    loading,
    error,
    refreshing,
    statistics,
    propertyTypes,
    priceRange,
    availableCount,
    refreshProperties,
    filterProperties,
    sortProperties,
    searchProperties,
    clearError
  } = useProperties({
    sortBy,
    sortOrder
  });

  // Debug: Log properties data
  console.log('PropertyListPage - properties:', properties);
  console.log('PropertyListPage - properties length:', properties.length);
  console.log('PropertyListPage - loading:', loading);
  console.log('PropertyListPage - error:', error);

  // Filter and search properties
  const filteredProperties = useMemo(() => {
    let filtered = properties;
    console.log('PropertyListPage - Starting with properties:', filtered.length);

    // Apply search
    if (searchTerm) {
      filtered = searchProperties(searchTerm);
      console.log('PropertyListPage - After search filter:', filtered.length);
    }

    // Apply type filter
    if (selectedType) {
      filtered = filterProperties({ propertyType: selectedType });
      console.log('PropertyListPage - After type filter:', filtered.length);
    }

    console.log('PropertyListPage - Final filtered properties:', filtered.length);
    return filtered;
  }, [properties, searchTerm, selectedType, searchProperties, filterProperties]);

  // Sort filtered properties
  const sortedProperties = useMemo(() => {
    const sorted = sortProperties(sortBy, sortOrder);
    console.log('PropertyListPage - sortedProperties:', sorted);
    console.log('PropertyListPage - sortedProperties length:', sorted.length);
    console.log('PropertyListPage - sortedProperties details:', sorted.map(p => ({ id: p.id, title: p.title, price: p.price })));
    return sorted;
  }, [filteredProperties, sortBy, sortOrder, sortProperties]);

  const handleViewProperty = (property) => {
    console.log('View property:', property);
    // Navigate to property detail page
  };

  const handleEditProperty = (property) => {
    console.log('Edit property:', property);
    // Navigate to property edit page
  };

  const handleDeleteProperty = (property) => {
    console.log('Delete property:', property);
    // Show confirmation dialog and delete
  };

  const handleAddProperty = () => {
    navigate('/admin/properties/add');
  };

  const handleRefresh = () => {
    refreshProperties();
  };

  const handleRetry = () => {
    clearError();
    refreshProperties();
  };

  if (error) {
    return (
      <div className="space-y-6">
        {/* Page Header */}
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
            <p className="text-gray-600 mt-1">Manage and view all properties</p>
          </div>
        </div>

        {/* Error State */}
        <Card className="admin-card">
          <CardContent className="p-12 text-center">
            <AlertCircle className="w-12 h-12 text-red-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              Failed to Load Properties
            </h3>
            <p className="text-gray-600 mb-4">{error}</p>
            <Button onClick={handleRetry} className="mr-2">
              <RefreshCw className="w-4 h-4 mr-2" />
              Try Again
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Properties</h1>
          <p className="text-gray-600 mt-1">Manage and view all properties</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" onClick={handleRefresh} disabled={refreshing}>
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          <Button onClick={handleAddProperty}>
            <Plus className="w-4 h-4 mr-2" />
            Add Property
          </Button>
        </div>
      </div>

      {/* Statistics Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="admin-card admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
            <Home className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{statistics.total}</div>
            <p className="text-xs text-gray-500">All properties in system</p>
          </CardContent>
        </Card>

        <Card className="admin-card admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Available</CardTitle>
            <TrendingUp className="h-4 w-4 text-success" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-success">{availableCount}</div>
            <p className="text-xs text-gray-500">Ready for sale/rent</p>
          </CardContent>
        </Card>

        <Card className="admin-card admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Average Price</CardTitle>
            <TrendingUp className="h-4 w-4 text-primary" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-primary">
              ${statistics.averagePrice?.toLocaleString() || '0'}
            </div>
            <p className="text-xs text-gray-500">Market average</p>
          </CardContent>
        </Card>

        <Card className="admin-card admin-card-hover">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Property Types</CardTitle>
            <MapPin className="h-4 w-4 text-gray-400" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{propertyTypes.length}</div>
            <p className="text-xs text-gray-500">Different categories</p>
          </CardContent>
        </Card>
      </div>

      {/* Search and Filters */}
      <Card className="admin-card">
        <CardContent className="p-6">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Search */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search properties by title, location, or type..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Filters */}
            <div className="flex gap-2">
              <Button
                variant="outline"
                onClick={() => setShowFilters(!showFilters)}
                className={showFilters ? 'bg-gray-100' : ''}
              >
                <Filter className="w-4 h-4 mr-2" />
                Filters
              </Button>

              <div className="flex border rounded-md">
                <Button
                  variant={viewMode === 'grid' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('grid')}
                  className="rounded-r-none"
                >
                  <Grid className="w-4 h-4" />
                </Button>
                <Button
                  variant={viewMode === 'list' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setViewMode('list')}
                  className="rounded-l-none"
                >
                  <List className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </div>

          {/* Filter Options */}
          {showFilters && (
            <div className="mt-4 pt-4 border-t border-gray-200">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Property Type Filter */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Property Type
                  </label>
                  <select
                    value={selectedType}
                    onChange={(e) => setSelectedType(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="">All Types</option>
                    {propertyTypes.map((type) => (
                      <option key={type} value={type}>
                        {type}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Sort By */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Sort By
                  </label>
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="createdAt">Date Created</option>
                    <option value="price">Price</option>
                    <option value="title">Title</option>
                    <option value="area">Area</option>
                  </select>
                </div>

                {/* Sort Order */}
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Order
                  </label>
                  <select
                    value={sortOrder}
                    onChange={(e) => setSortOrder(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-primary"
                  >
                    <option value="desc">Descending</option>
                    <option value="asc">Ascending</option>
                  </select>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Results Summary */}
      <div className="flex items-center justify-between">
        <div className="text-sm text-gray-600">
          Showing {sortedProperties.length} of {properties.length} properties
          {searchTerm && ` matching "${searchTerm}"`}
          {selectedType && ` of type "${selectedType}"`}
        </div>
        <div className="flex items-center space-x-2">
          {selectedType && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSelectedType('')}>
              {selectedType} ×
            </Badge>
          )}
          {searchTerm && (
            <Badge variant="secondary" className="cursor-pointer" onClick={() => setSearchTerm('')}>
              "{searchTerm}" ×
            </Badge>
          )}
        </div>
      </div>

      {/* Properties Grid/List */}
      {loading ? (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {Array.from({ length: 8 }).map((_, index) => (
            <PropertyCardSkeleton key={index} />
          ))}
        </div>
      ) : sortedProperties.length === 0 ? (
        <Card className="admin-card">
          <CardContent className="p-12 text-center">
            <Home className="w-12 h-12 text-gray-400 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">
              No Properties Found
            </h3>
            <p className="text-gray-600 mb-4">
              {searchTerm || selectedType 
                ? 'Try adjusting your search criteria or filters.'
                : 'Get started by adding your first property.'
              }
            </p>
            <Button onClick={handleAddProperty}>
              <Plus className="w-4 h-4 mr-2" />
              Add Property
            </Button>
          </CardContent>
        </Card>
      ) : (
        <div className={`grid gap-6 ${
          viewMode === 'grid' 
            ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' 
            : 'grid-cols-1'
        }`}>
          {sortedProperties.map((property) => (
            <PropertyCard
              key={property.id}
              property={property}
              onView={handleViewProperty}
              onEdit={handleEditProperty}
              onDelete={handleDeleteProperty}
              className={viewMode === 'list' ? 'flex flex-row' : ''}
            />
          ))}
        </div>
      )}
    </div>
  );
};

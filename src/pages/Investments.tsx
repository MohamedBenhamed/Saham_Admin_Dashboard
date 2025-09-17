import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  Search,
  Filter,
  Download,
  Eye,
  Edit,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react'
import { formatDate, formatCurrency, formatNumber, getStatusColor } from '@/lib/utils'
import { Property } from '@/features/property/domain/entities/Property'
import { propertyApi } from '@/features/property/data/api/propertyApi'

const statusOptions = ['all', '1', '2', '3', '4', '5']
const typeOptions = ['all', 'Apartment', 'House', 'Villa', 'Commercial', 'Land']

export function Investments() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all') // Default to show all available statuses
  const [typeFilter, setTypeFilter] = useState('all')
  const [properties, setProperties] = useState<Property[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch properties on component mount
  useEffect(() => {
    const fetchProperties = async () => {
      try {
        setLoading(true)
        setError(null)
        console.log('Fetching properties for investments...')
        
        const apiData = await propertyApi.getAllProperties()
        console.log('Raw API data:', apiData)
        
        // Convert API data to Property entities
        const propertyEntities = apiData.map((propertyData: any) => {
          try {
            return Property.fromAPIResponse(propertyData)
          } catch (error) {
            console.warn('Failed to create Property entity from API data:', propertyData, error)
            return null
          }
        }).filter((property: Property | null) => property !== null) as Property[]
        
        console.log('Property entities created:', propertyEntities)
        setProperties(propertyEntities)
      } catch (err) {
        console.error('Error fetching properties:', err)
        setError(err instanceof Error ? err.message : 'Failed to fetch properties')
      } finally {
        setLoading(false)
      }
    }

    fetchProperties()
  }, [])

  // Filter properties with status "1" or "2" and apply other filters
  const filteredInvestments = properties.filter(property => {
    // Show properties with status "1" (Available) or "2" (Pending)
    if (property.status !== '1' && property.status !== '2') {
      return false
    }
    
    const matchesSearch = property.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         property.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || property.status === statusFilter
    const matchesType = typeFilter === 'all' || property.propertyType === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case '1':
        return 'success'
      case '2':
        return 'warning'
      case '3':
        return 'info'
      case '4':
        return 'secondary'
      case '5':
        return 'error'
      default:
        return 'secondary'
    }
  }

  const getStatusLabel = (status: string) => {
    switch (status) {
      case '1':
        return 'Available'
      case '2':
        return 'Pending'
      case '3':
        return 'Sold'
      case '4':
        return 'Rented'
      case '5':
        return 'Inactive'
      default:
        return 'Unknown'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Apartment':
        return '🏢'
      case 'House':
        return '🏠'
      case 'Villa':
        return '🏰'
      case 'Commercial':
        return '🏪'
      case 'Land':
        return '🌍'
      default:
        return '🏗️'
    }
  }

  // Handler functions for action buttons
  const handleAddToInvestment = (property: Property) => {
    console.log('Adding property to investment:', property)
    // Navigate to add investment page
    navigate(`/admin/investments/add/${property.id}`)
  }

  const handleEditProperty = (property: Property) => {
    console.log('Editing property:', property)
    // TODO: Implement edit property logic
    // This could navigate to the edit page or open an edit modal
    alert(`Editing "${property.title}"...`)
  }

  const handleViewProperty = (property: Property) => {
    console.log('Viewing property:', property)
    // Navigate to property view page
    navigate(`/admin/properties/view/${property.id}`)
  }


  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Investments</h1>
          <p className="text-gray-600 mt-1">Manage investment properties and opportunities</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add Investment
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{properties.length}</div>
            <p className="text-xs text-gray-500">All properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Investment Properties</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {properties.filter(p => p.status === '1' || p.status === '2').length}
            </div>
            <p className="text-xs text-gray-500">Available & Pending</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(properties.reduce((sum, p) => sum + p.price, 0))}
            </div>
            <p className="text-xs text-gray-500">Across all properties</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Property Types</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {new Set(properties.map(p => p.propertyType)).size}
            </div>
            <p className="text-xs text-gray-500">Different types</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>Investment Management</CardTitle>
          <CardDescription>Search and filter investments by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search investments by name or location..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            <div className="flex gap-2">
              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {statusOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)} Status
                  </option>
                ))}
              </select>
              <select
                value={typeFilter}
                onChange={(e) => setTypeFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {typeOptions.map(option => (
                  <option key={option} value={option}>
                    {option} Type
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Properties Table */}
          <div className="border border-gray-200 rounded-large overflow-hidden">
            {loading ? (
              <div className="p-8 text-center">
                <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
                <p className="text-gray-600">Loading properties...</p>
              </div>
            ) : error ? (
              <div className="p-8 text-center">
                <p className="text-red-600">Error: {error}</p>
                <Button 
                  onClick={() => window.location.reload()} 
                  className="mt-4"
                  variant="outline"
                >
                  Retry
                </Button>
              </div>
            ) : (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead>Property</TableHead>
                    <TableHead>Type</TableHead>
                    <TableHead>Status</TableHead>
                    <TableHead>Price</TableHead>
                    <TableHead>Location</TableHead>
                    <TableHead>Created</TableHead>
                    <TableHead className="text-right">Actions</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {filteredInvestments.map((property) => (
                    <TableRow key={property.id}>
                      <TableCell>
                        <div>
                          <div className="font-medium text-gray-900 flex items-center">
                            <span className="mr-2">{getTypeIcon(property.propertyType)}</span>
                            {property.title}
                          </div>
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge variant="outline">{property.propertyType}</Badge>
                      </TableCell>
                      <TableCell>
                        <Badge variant={getStatusBadgeVariant(property.status) as any}>
                          {getStatusLabel(property.status)}
                        </Badge>
                      </TableCell>
                      <TableCell>
                        <div className="font-medium text-gray-900">
                          {property.getFormattedPrice()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <div className="text-sm text-gray-600">
                          {property.location}
                        </div>
                      </TableCell>
                      <TableCell>
                        {formatDate(property.createdAt)}
                      </TableCell>
                      <TableCell className="text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <Button 
                            size="sm" 
                            variant="ghost"
                            onClick={() => handleViewProperty(property)}
                          >
                            <Eye className="w-4 h-4" />
                          </Button>
                          
                          {/* Conditional action buttons based on status */}
                          {property.status === '1' ? (
                            <Button 
                              size="sm" 
                              variant="default"
                              className="bg-green-600 hover:bg-green-700 text-white"
                              onClick={() => handleAddToInvestment(property)}
                            >
                              <Plus className="w-4 h-4 mr-1" />
                              Add to Investment
                            </Button>
                          ) : property.status === '2' ? (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditProperty(property)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          ) : (
                            <Button 
                              size="sm" 
                              variant="ghost"
                              onClick={() => handleEditProperty(property)}
                            >
                              <Edit className="w-4 h-4" />
                            </Button>
                          )}
                        </div>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </div>

          {!loading && !error && filteredInvestments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No properties with status "1" or "2" found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

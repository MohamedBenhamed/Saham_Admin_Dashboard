import React, { useState } from 'react'
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
  Trash2,
  Plus,
  Building2,
  MapPin,
  DollarSign,
  TrendingUp,
  Users,
} from 'lucide-react'
import { formatDate, formatCurrency, formatNumber, getStatusColor } from '@/lib/utils'

// Mock data
const investments = [
  {
    id: 1,
    name: 'Downtown Office Building',
    location: 'New York, NY',
    type: 'Commercial',
    status: 'active',
    totalValue: 2500000,
    sharesAvailable: 1250,
    totalShares: 2500,
    pricePerShare: 1000,
    roi: 12.5,
    investors: 45,
    startDate: '2024-01-15',
    endDate: '2026-01-15',
    description: 'Premium office building in the heart of Manhattan',
  },
  {
    id: 2,
    name: 'Residential Complex',
    location: 'Los Angeles, CA',
    type: 'Residential',
    status: 'active',
    totalValue: 1800000,
    sharesAvailable: 900,
    totalShares: 1800,
    pricePerShare: 1000,
    roi: 8.7,
    investors: 32,
    startDate: '2024-02-01',
    endDate: '2025-12-31',
    description: 'Modern residential complex with luxury amenities',
  },
  {
    id: 3,
    name: 'Retail Plaza',
    location: 'Chicago, IL',
    type: 'Retail',
    status: 'funding',
    totalValue: 3200000,
    sharesAvailable: 1600,
    totalShares: 3200,
    pricePerShare: 1000,
    roi: 15.2,
    investors: 28,
    startDate: '2024-03-01',
    endDate: '2027-03-01',
    description: 'Shopping plaza with major retail tenants',
  },
  {
    id: 4,
    name: 'Industrial Warehouse',
    location: 'Houston, TX',
    type: 'Industrial',
    status: 'completed',
    totalValue: 1200000,
    sharesAvailable: 0,
    totalShares: 1200,
    pricePerShare: 1000,
    roi: 18.3,
    investors: 67,
    startDate: '2023-06-01',
    endDate: '2024-06-01',
    description: 'Large industrial warehouse facility',
  },
  {
    id: 5,
    name: 'Mixed-Use Development',
    location: 'Miami, FL',
    type: 'Mixed-Use',
    status: 'pending',
    totalValue: 4500000,
    sharesAvailable: 2250,
    totalShares: 4500,
    pricePerShare: 1000,
    roi: 11.8,
    investors: 0,
    startDate: '2024-06-01',
    endDate: '2028-06-01',
    description: 'Mixed-use development with residential and commercial spaces',
  },
]

const statusOptions = ['all', 'active', 'funding', 'completed', 'pending', 'cancelled']
const typeOptions = ['all', 'Commercial', 'Residential', 'Retail', 'Industrial', 'Mixed-Use']

export function Investments() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [typeFilter, setTypeFilter] = useState('all')

  const filteredInvestments = investments.filter(investment => {
    const matchesSearch = investment.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         investment.location.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || investment.status === statusFilter
    const matchesType = typeFilter === 'all' || investment.type === typeFilter
    
    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusBadgeVariant = (status: string) => {
    switch (status) {
      case 'active':
        return 'success'
      case 'funding':
        return 'warning'
      case 'completed':
        return 'info'
      case 'pending':
        return 'secondary'
      case 'cancelled':
        return 'error'
      default:
        return 'secondary'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Commercial':
        return '🏢'
      case 'Residential':
        return '🏠'
      case 'Retail':
        return '🛍️'
      case 'Industrial':
        return '🏭'
      case 'Mixed-Use':
        return '🏘️'
      default:
        return '🏗️'
    }
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
            <CardTitle className="text-sm font-medium text-gray-600">Total Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{investments.length}</div>
            <p className="text-xs text-gray-500">+3 this month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Investments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {investments.filter(i => i.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">Currently available</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Value</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {formatCurrency(investments.reduce((sum, i) => sum + i.totalValue, 0))}
            </div>
            <p className="text-xs text-gray-500">Across all investments</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Investors</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {investments.reduce((sum, i) => sum + i.investors, 0)}
            </div>
            <p className="text-xs text-gray-500">Active participants</p>
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

          {/* Investments Table */}
          <div className="border border-gray-200 rounded-large overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Investment</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Total Value</TableHead>
                  <TableHead>Shares</TableHead>
                  <TableHead>ROI</TableHead>
                  <TableHead>Investors</TableHead>
                  <TableHead>Start Date</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredInvestments.map((investment) => (
                  <TableRow key={investment.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900 flex items-center">
                          <span className="mr-2">{getTypeIcon(investment.type)}</span>
                          {investment.name}
                        </div>
                        <div className="text-sm text-gray-500 flex items-center">
                          <MapPin className="w-3 h-3 mr-1" />
                          {investment.location}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant="outline">{investment.type}</Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getStatusBadgeVariant(investment.status) as any}>
                        {investment.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {formatCurrency(investment.totalValue)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {formatCurrency(investment.pricePerShare)}/share
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="font-medium text-gray-900">
                        {formatNumber(investment.sharesAvailable)}/{formatNumber(investment.totalShares)}
                      </div>
                      <div className="text-sm text-gray-500">
                        {((investment.sharesAvailable / investment.totalShares) * 100).toFixed(1)}% available
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center text-success">
                        <TrendingUp className="w-4 h-4 mr-1" />
                        {investment.roi}%
                      </div>
                    </TableCell>
                    <TableCell>
                      <div className="flex items-center">
                        <Users className="w-4 h-4 mr-1 text-gray-400" />
                        {investment.investors}
                      </div>
                    </TableCell>
                    <TableCell>
                      {formatDate(investment.startDate)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost" className="text-error">
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>

          {filteredInvestments.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No investments found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

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
  MoreHorizontal,
  UserCheck,
  UserX,
} from 'lucide-react'
import { formatDate, formatCurrency, getStatusColor } from '@/lib/utils'

// Mock data
const users = [
  {
    id: 1,
    name: 'John Doe',
    email: 'john.doe@example.com',
    phone: '+1 (555) 123-4567',
    status: 'active',
    role: 'investor',
    joinDate: '2024-01-15',
    totalInvestments: 3,
    totalAmount: 125000,
    lastLogin: '2024-09-14T10:30:00Z',
  },
  {
    id: 2,
    name: 'Sarah Wilson',
    email: 'sarah.wilson@example.com',
    phone: '+1 (555) 234-5678',
    status: 'pending',
    role: 'investor',
    joinDate: '2024-09-10',
    totalInvestments: 0,
    totalAmount: 0,
    lastLogin: '2024-09-12T14:20:00Z',
  },
  {
    id: 3,
    name: 'Michael Chen',
    email: 'michael.chen@example.com',
    phone: '+1 (555) 345-6789',
    status: 'active',
    role: 'premium',
    joinDate: '2023-11-22',
    totalInvestments: 8,
    totalAmount: 450000,
    lastLogin: '2024-09-14T08:15:00Z',
  },
  {
    id: 4,
    name: 'Emily Rodriguez',
    email: 'emily.rodriguez@example.com',
    phone: '+1 (555) 456-7890',
    status: 'inactive',
    role: 'investor',
    joinDate: '2024-02-28',
    totalInvestments: 1,
    totalAmount: 25000,
    lastLogin: '2024-08-15T16:45:00Z',
  },
  {
    id: 5,
    name: 'David Kim',
    email: 'david.kim@example.com',
    phone: '+1 (555) 567-8901',
    status: 'active',
    role: 'investor',
    joinDate: '2024-03-10',
    totalInvestments: 5,
    totalAmount: 180000,
    lastLogin: '2024-09-14T12:30:00Z',
  },
]

const statusOptions = ['all', 'active', 'pending', 'inactive']
const roleOptions = ['all', 'investor', 'premium', 'admin']

export function Users() {
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState('all')
  const [roleFilter, setRoleFilter] = useState('all')

  const filteredUsers = users.filter(user => {
    const matchesSearch = user.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         user.email.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || user.status === statusFilter
    const matchesRole = roleFilter === 'all' || user.role === roleFilter
    
    return matchesSearch && matchesStatus && matchesRole
  })

  const getRoleBadgeVariant = (role: string) => {
    switch (role) {
      case 'premium':
        return 'info'
      case 'admin':
        return 'warning'
      default:
        return 'secondary'
    }
  }

  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Users</h1>
          <p className="text-gray-600 mt-1">Manage platform users and their accounts</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            Add User
          </Button>
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Total Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">{users.length}</div>
            <p className="text-xs text-gray-500">+12% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Active Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.status === 'active').length}
            </div>
            <p className="text-xs text-gray-500">+8% from last month</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Pending Verification</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.status === 'pending').length}
            </div>
            <p className="text-xs text-gray-500">Requires attention</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="pb-2">
            <CardTitle className="text-sm font-medium text-gray-600">Premium Users</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-gray-900">
              {users.filter(u => u.role === 'premium').length}
            </div>
            <p className="text-xs text-gray-500">+15% from last month</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters and Search */}
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>Search and filter users by various criteria</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col sm:flex-row gap-4 mb-6">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400" />
                <Input
                  placeholder="Search users by name or email..."
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
                value={roleFilter}
                onChange={(e) => setRoleFilter(e.target.value)}
                className="px-3 py-2 border border-gray-300 rounded-medium focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
              >
                {roleOptions.map(option => (
                  <option key={option} value={option}>
                    {option.charAt(0).toUpperCase() + option.slice(1)} Role
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Users Table */}
          <div className="border border-gray-200 rounded-large overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>User</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Role</TableHead>
                  <TableHead>Investments</TableHead>
                  <TableHead>Total Amount</TableHead>
                  <TableHead>Join Date</TableHead>
                  <TableHead>Last Login</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredUsers.map((user) => (
                  <TableRow key={user.id}>
                    <TableCell>
                      <div>
                        <div className="font-medium text-gray-900">{user.name}</div>
                        <div className="text-sm text-gray-500">{user.email}</div>
                        <div className="text-sm text-gray-500">{user.phone}</div>
                      </div>
                    </TableCell>
                    <TableCell>
                      <Badge variant={user.status as any} className={getStatusColor(user.status)}>
                        {user.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      <Badge variant={getRoleBadgeVariant(user.role)}>
                        {user.role}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-center">
                      {user.totalInvestments}
                    </TableCell>
                    <TableCell>
                      {formatCurrency(user.totalAmount)}
                    </TableCell>
                    <TableCell>
                      {formatDate(user.joinDate)}
                    </TableCell>
                    <TableCell>
                      {formatDate(user.lastLogin)}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <Button size="sm" variant="ghost">
                          <Eye className="w-4 h-4" />
                        </Button>
                        <Button size="sm" variant="ghost">
                          <Edit className="w-4 h-4" />
                        </Button>
                        {user.status === 'pending' && (
                          <Button size="sm" variant="ghost" className="text-success">
                            <UserCheck className="w-4 h-4" />
                          </Button>
                        )}
                        {user.status === 'active' && (
                          <Button size="sm" variant="ghost" className="text-warning">
                            <UserX className="w-4 h-4" />
                          </Button>
                        )}
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

          {filteredUsers.length === 0 && (
            <div className="text-center py-8">
              <p className="text-gray-500">No users found matching your criteria.</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  )
}

import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { LanguageProvider } from '@/contexts/LanguageContext'
import { AuthProvider } from '@/contexts/AuthContext'
import { ProtectedRoute } from '@/components/ProtectedRoute'
import { AdminLayout } from '@/components/layout/AdminLayout'
import { Dashboard } from '@/pages/Dashboard'
import { Users } from '@/pages/Users'
import { Investments } from '@/pages/Investments'
import { LoginPage } from '@/pages/LoginPage'
import { PropertyListPage } from '@/features/property/presentation/pages/PropertyListPage'
import { PropertyAddPage } from '@/features/property/presentation/pages/PropertyAddPage'
import { PropertyViewPage } from '@/features/property/presentation/pages/PropertyViewPage'
import { AddInvestmentPage } from '@/features/investment/presentation/pages/AddInvestmentPage'
import { Cities } from '@/pages/Cities'
import { AddCity } from '@/pages/AddCity'
import { PropertyTypes } from '@/pages/PropertyTypes'
import { AddPropertyType } from '@/pages/AddPropertyType'

// Placeholder components for other routes
const Wallets = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Wallets</h1>
      <p className="text-gray-600 mt-1">Manage user digital wallets and transactions</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Wallets management page coming soon...</p>
    </div>
  </div>
)

const Transactions = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
      <p className="text-gray-600 mt-1">View and manage all platform transactions</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Transactions management page coming soon...</p>
    </div>
  </div>
)

const Analytics = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Analytics</h1>
      <p className="text-gray-600 mt-1">Platform analytics and insights</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Analytics dashboard coming soon...</p>
    </div>
  </div>
)

const Reports = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
      <p className="text-gray-600 mt-1">Generate and view platform reports</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Reports page coming soon...</p>
    </div>
  </div>
)

const Notifications = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Notifications</h1>
      <p className="text-gray-600 mt-1">Manage platform notifications</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Notifications management coming soon...</p>
    </div>
  </div>
)

const Settings = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Settings</h1>
      <p className="text-gray-600 mt-1">Platform configuration and settings</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Settings page coming soon...</p>
    </div>
  </div>
)

const Help = () => (
  <div className="space-y-6">
    <div>
      <h1 className="text-3xl font-bold text-gray-900">Help & Support</h1>
      <p className="text-gray-600 mt-1">Get help and support for the admin dashboard</p>
    </div>
    <div className="text-center py-12">
      <p className="text-gray-500">Help documentation coming soon...</p>
    </div>
  </div>
)

function App() {
  return (
    <LanguageProvider>
      <AuthProvider>
        <Router>
          <div className="App">
            <Routes>
              {/* Public routes */}
              <Route path="/login" element={<LoginPage />} />
              
              {/* Protected admin routes */}
              <Route path="/admin" element={
                <ProtectedRoute>
                  <AdminLayout />
                </ProtectedRoute>
              }>
                <Route index element={<Dashboard />} />
                <Route path="users" element={<Users />} />
                <Route path="investments" element={<Investments />} />
                <Route path="properties" element={<PropertyListPage />} />
                <Route path="properties/add" element={<PropertyAddPage />} />
                <Route path="properties/view/:id" element={<PropertyViewPage />} />
                <Route path="investments/add/:propertyId" element={<AddInvestmentPage />} />
                <Route path="settings/cities" element={<Cities />} />
                <Route path="settings/cities/add" element={<AddCity />} />
                <Route path="settings/property-types" element={<PropertyTypes />} />
                <Route path="settings/property-types/add" element={<AddPropertyType />} />
                <Route path="wallets" element={<Wallets />} />
                <Route path="transactions" element={<Transactions />} />
                <Route path="analytics" element={<Analytics />} />
                <Route path="reports" element={<Reports />} />
                <Route path="notifications" element={<Notifications />} />
                <Route path="settings" element={<Settings />} />
                <Route path="help" element={<Help />} />
              </Route>
              
              {/* Default redirects */}
              <Route path="/" element={<Navigate to="/admin" replace />} />
              <Route path="*" element={<Navigate to="/admin" replace />} />
            </Routes>
          </div>
        </Router>
      </AuthProvider>
    </LanguageProvider>
  )
}

export default App

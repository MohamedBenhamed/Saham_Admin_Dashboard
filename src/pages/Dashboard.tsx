import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { useTranslation } from '@/hooks/useTranslation'
import {
  Users,
  Building2,
  DollarSign,
  TrendingUp,
  Activity,
  Eye,
  Plus,
  ArrowUpRight,
  ArrowDownRight,
} from 'lucide-react'
import { formatCurrency, formatNumber } from '@/lib/utils'

// Mock data - in a real app, this would come from an API
const getStats = (t: (key: string) => string) => [
  {
    title: t('totalUsers'),
    value: '2,543',
    change: '+12.5%',
    changeType: 'positive' as const,
    icon: Users,
    description: t('activeRegisteredUsers'),
  },
  {
    title: t('totalInvestments'),
    value: '1,247',
    change: '+8.2%',
    changeType: 'positive' as const,
    icon: Building2,
    description: t('activeInvestmentProperties'),
  },
  {
    title: t('totalVolume'),
    value: '$12.4M',
    change: '+15.3%',
    changeType: 'positive' as const,
    icon: DollarSign,
    description: t('totalInvestmentVolume'),
  },
  {
    title: t('revenue'),
    value: '$2.1M',
    change: '+5.7%',
    changeType: 'positive' as const,
    icon: TrendingUp,
    description: t('platformRevenue'),
  },
]

const recentActivities = [
  {
    id: 1,
    type: 'user_registration',
    message: 'New user registered: John Doe',
    time: '2 minutes ago',
    status: 'success',
  },
  {
    id: 2,
    type: 'investment_created',
    message: 'New investment property added: Downtown Office Building',
    time: '15 minutes ago',
    status: 'info',
  },
  {
    id: 3,
    type: 'transaction',
    message: 'Large transaction processed: $50,000',
    time: '1 hour ago',
    status: 'success',
  },
  {
    id: 4,
    type: 'user_verification',
    message: 'User verification pending: Sarah Wilson',
    time: '2 hours ago',
    status: 'warning',
  },
]

const topInvestments = [
  {
    id: 1,
    name: 'Downtown Office Building',
    location: 'New York, NY',
    totalValue: 2500000,
    sharesSold: 1250,
    totalShares: 2500,
    roi: 12.5,
  },
  {
    id: 2,
    name: 'Residential Complex',
    location: 'Los Angeles, CA',
    totalValue: 1800000,
    sharesSold: 900,
    totalShares: 1800,
    roi: 8.7,
  },
  {
    id: 3,
    name: 'Retail Plaza',
    location: 'Chicago, IL',
    totalValue: 3200000,
    sharesSold: 1600,
    totalShares: 3200,
    roi: 15.2,
  },
]

export function Dashboard() {
  const { t } = useTranslation()
  
  return (
    <div className="space-y-6">
      {/* Page Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">{t('dashboard')}</h1>
          <p className="text-gray-600 mt-1">{t('welcomeBack')}</p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline">
            <Eye className="w-4 h-4 mr-2" />
            {t('viewReports')}
          </Button>
          <Button>
            <Plus className="w-4 h-4 mr-2" />
            {t('addInvestment')}
          </Button>
        </div>
      </div>

      {/* Simple test content */}
      <div className="bg-white p-6 rounded-lg shadow">
        <h2 className="text-xl font-semibold mb-4">Dashboard Content</h2>
        <p className="text-gray-600">This is the main dashboard content area.</p>
      </div>


      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {getStats(t).map((stat) => (
          <Card key={stat.title} className="admin-card admin-card-hover">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium text-gray-600">
                {stat.title}
              </CardTitle>
              <stat.icon className="h-4 w-4 text-gray-400" />
            </CardHeader>
            <CardContent>
              <div className="text-2xl font-bold text-gray-900">{stat.value}</div>
              <div className="flex items-center space-x-2 mt-1">
                {stat.changeType === 'positive' ? (
                  <ArrowUpRight className="h-4 w-4 text-success" />
                ) : (
                  <ArrowDownRight className="h-4 w-4 text-error" />
                )}
                <span className={`text-sm ${
                  stat.changeType === 'positive' ? 'text-success' : 'text-error'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-gray-500">{t('fromLastMonth')}</span>
              </div>
              <p className="text-xs text-gray-500 mt-2">{stat.description}</p>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Recent Activity */}
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Recent Activity</CardTitle>
            <CardDescription>Latest platform activities and events</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-center space-x-4">
                  <div className={`w-2 h-2 rounded-full ${
                    activity.status === 'success' ? 'bg-success' :
                    activity.status === 'warning' ? 'bg-warning' :
                    activity.status === 'info' ? 'bg-info' : 'bg-gray-400'
                  }`} />
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.message}</p>
                    <p className="text-xs text-gray-500">{activity.time}</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Actions */}
        <Card>
          <CardHeader>
            <CardTitle>Quick Actions</CardTitle>
            <CardDescription>Common administrative tasks</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            <Button className="w-full justify-start" variant="outline">
              <Users className="w-4 h-4 mr-2" />
              Manage Users
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Building2 className="w-4 h-4 mr-2" />
              Add Investment
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <Activity className="w-4 h-4 mr-2" />
              View Analytics
            </Button>
            <Button className="w-full justify-start" variant="outline">
              <DollarSign className="w-4 h-4 mr-2" />
              Process Transactions
            </Button>
          </CardContent>
        </Card>
      </div>

      {/* Top Investments */}
      <Card>
        <CardHeader>
          <CardTitle>Top Performing Investments</CardTitle>
          <CardDescription>Most popular and profitable investment properties</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {topInvestments.map((investment) => (
              <div key={investment.id} className="flex items-center justify-between p-4 border border-gray-200 rounded-medium">
                <div className="flex-1">
                  <h3 className="font-medium text-gray-900">{investment.name}</h3>
                  <p className="text-sm text-gray-500">{investment.location}</p>
                </div>
                <div className="flex items-center space-x-6">
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatCurrency(investment.totalValue)}
                    </p>
                    <p className="text-xs text-gray-500">Total Value</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-gray-900">
                      {formatNumber(investment.sharesSold)}/{formatNumber(investment.totalShares)}
                    </p>
                    <p className="text-xs text-gray-500">Shares Sold</p>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-success">
                      {investment.roi}%
                    </p>
                    <p className="text-xs text-gray-500">ROI</p>
                  </div>
                  <Button size="sm" variant="outline">
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}

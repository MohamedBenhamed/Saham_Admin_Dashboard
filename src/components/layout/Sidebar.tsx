import { Link, useLocation } from 'react-router-dom'
import { cn } from '@/lib/utils'
import { useTranslation } from '@/hooks/useTranslation'
import {
  LayoutDashboard,
  Users,
  Building2,
  Wallet,
  FileText,
  Settings,
  BarChart3,
  CreditCard,
  Bell,
  HelpCircle,
  LogOut,
  X
} from 'lucide-react'
import { Button } from '@/components/ui/button'

interface SidebarProps {
  isOpen: boolean
  onToggle: () => void
  isCollapsed?: boolean
}

const navigationItems = [
  {
    nameKey: 'dashboard' as const,
    href: '/admin',
    icon: LayoutDashboard,
    current: false,
  },
  {
    nameKey: 'users' as const,
    href: '/admin/users',
    icon: Users,
    current: false,
  },
  {
    nameKey: 'investments' as const,
    href: '/admin/investments',
    icon: Building2,
    current: false,
  },
  {
    nameKey: 'properties' as const,
    href: '/admin/properties',
    icon: Building2,
    current: false,
  },
  {
    nameKey: 'wallets' as const,
    href: '/admin/wallets',
    icon: Wallet,
    current: false,
  },
  {
    nameKey: 'transactions' as const,
    href: '/admin/transactions',
    icon: CreditCard,
    current: false,
  },
  {
    nameKey: 'analytics' as const,
    href: '/admin/analytics',
    icon: BarChart3,
    current: false,
  },
  {
    nameKey: 'reports' as const,
    href: '/admin/reports',
    icon: FileText,
    current: false,
  },
  {
    nameKey: 'notifications' as const,
    href: '/admin/notifications',
    icon: Bell,
    current: false,
  },
]

const secondaryItems = [
  {
    nameKey: 'settings' as const,
    href: '/admin/settings',
    icon: Settings,
  },
  {
    nameKey: 'help' as const,
    href: '/admin/help',
    icon: HelpCircle,
  },
]

export function Sidebar({ isOpen, onToggle, isCollapsed = false }: SidebarProps) {
  const location = useLocation()
  const { t } = useTranslation()

  return (
    <>
      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-gray-600 bg-opacity-75 lg:hidden"
          onClick={onToggle}
        />
      )}

      {/* Sidebar */}
      <div
        className={cn(
          "fixed inset-y-0 left-0 z-50 bg-slate-800 border-r border-slate-700 transform transition-all duration-300 ease-in-out lg:translate-x-0 lg:static lg:inset-0 lg:flex-shrink-0",
          isOpen ? "translate-x-0" : "-translate-x-full",
          isCollapsed ? "w-16" : "w-64"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Header */}
          <div className={cn(
            "flex items-center h-16 border-b border-slate-700",
            isCollapsed ? "justify-center px-2" : "justify-between px-6"
          )}>
            <div className="flex items-center space-x-3">
              <div className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center">
                <Building2 className="w-5 h-5 text-white" />
              </div>
              {!isCollapsed && (
                <div>
                  <h1 className="text-lg font-bold text-white">Saham Admin</h1>
                  <p className="text-xs text-slate-300">{t('dashboard')}</p>
                </div>
              )}
            </div>
            {!isCollapsed && (
              <Button
                variant="ghost"
                size="icon"
                className="lg:hidden text-slate-300 hover:text-white hover:bg-slate-700"
                onClick={onToggle}
              >
                <X className="w-5 h-5" />
              </Button>
            )}
          </div>

          {/* Navigation */}
          <nav className={cn(
            "flex-1 py-6 space-y-2 overflow-y-auto admin-scrollbar",
            isCollapsed ? "px-2" : "px-4"
          )}>
            {navigationItems.map((item) => {
              const isActive = location.pathname === item.href
              return (
                <Link
                  key={item.nameKey}
                  to={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium rounded-medium transition-colors",
                    isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2",
                    isActive
                      ? "bg-blue-600 text-white"
                      : "text-slate-300 hover:bg-slate-700 hover:text-white"
                  )}
                  title={isCollapsed ? t(item.nameKey) : undefined}
                >
                  <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && t(item.nameKey)}
                </Link>
              )
            })}
          </nav>

          {/* Secondary Navigation */}
          <div className={cn(
            "py-4 border-t border-slate-700",
            isCollapsed ? "px-2" : "px-4"
          )}>
            <div className="space-y-2">
              {secondaryItems.map((item) => (
                <Link
                  key={item.nameKey}
                  to={item.href}
                  className={cn(
                    "flex items-center text-sm font-medium text-slate-300 rounded-medium hover:bg-slate-700 hover:text-white transition-colors",
                    isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2"
                  )}
                  title={isCollapsed ? t(item.nameKey) : undefined}
                >
                  <item.icon className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                  {!isCollapsed && t(item.nameKey)}
                </Link>
              ))}
              <button className={cn(
                "flex items-center w-full text-sm font-medium text-slate-300 rounded-medium hover:bg-slate-700 hover:text-white transition-colors",
                isCollapsed ? "px-2 py-2 justify-center" : "px-3 py-2"
              )}
              title={isCollapsed ? t('signOut') : undefined}
              >
                <LogOut className={cn("w-5 h-5", !isCollapsed && "mr-3")} />
                {!isCollapsed && t('signOut')}
              </button>
            </div>
          </div>
        </div>
      </div>
    </>
  )
}

export const translations = {
  en: {
    // Navigation
    dashboard: 'Dashboard',
    users: 'Users',
    investments: 'Investments',
    properties: 'Properties',
    wallets: 'Wallets',
    transactions: 'Transactions',
    analytics: 'Analytics',
    reports: 'Reports',
    notifications: 'Notifications',
    settings: 'Settings',
    systemManagement: 'System Management',
    cities: 'Cities',
    propertyTypes: 'Property Types',
    help: 'Help',
    signOut: 'Sign Out',
    
    // Header
    searchPlaceholder: 'Search users, investments, transactions...',
    adminUser: 'Admin User',
    adminEmail: 'admin@saham.com',
    
    // Dashboard
    welcomeBack: 'Welcome back! Here\'s what\'s happening with your platform.',
    viewReports: 'View Reports',
    addInvestment: 'Add Investment',
    totalUsers: 'Total Users',
    totalInvestments: 'Total Investments',
    totalVolume: 'Total Volume',
    revenue: 'Revenue',
    activeRegisteredUsers: 'Active registered users',
    activeInvestmentProperties: 'Active investment properties',
    totalInvestmentVolume: 'Total investment volume',
    platformRevenue: 'Platform revenue',
    fromLastMonth: 'from last month',
    
    // Recent Activity
    recentActivity: 'Recent Activity',
    latestPlatformActivities: 'Latest platform activities and events',
    newUserRegistered: 'New user registered: John Doe',
    newInvestmentProperty: 'New investment property added: Downtown Office Building',
    largeTransactionProcessed: 'Large transaction processed: $50,000',
    userVerificationPending: 'User verification pending: Sarah Wilson',
    minutesAgo: 'minutes ago',
    hourAgo: 'hour ago',
    hoursAgo: 'hours ago',
    
    // Quick Actions
    quickActions: 'Quick Actions',
    commonAdministrativeTasks: 'Common administrative tasks',
    manageUsers: 'Manage Users',
    addInvestment: 'Add Investment',
    viewAnalytics: 'View Analytics',
    processTransactions: 'Process Transactions',
    
    // Top Investments
    topPerformingInvestments: 'Top Performing Investments',
    mostPopularAndProfitable: 'Most popular and profitable investment properties',
    totalValue: 'Total Value',
    sharesSold: 'Shares Sold',
    viewDetails: 'View Details',
  },
  ar: {
    // Navigation
    dashboard: 'لوحة التحكم',
    users: 'المستخدمون',
    investments: 'الاستثمارات',
    properties: 'العقارات',
    wallets: 'المحافظ',
    transactions: 'المعاملات',
    analytics: 'التحليلات',
    reports: 'التقارير',
    notifications: 'الإشعارات',
    settings: 'الإعدادات',
    systemManagement: 'إدارة النظام',
    cities: 'المدن',
    propertyTypes: 'أنواع العقارات',
    help: 'المساعدة',
    signOut: 'تسجيل الخروج',
    
    // Header
    searchPlaceholder: 'البحث عن المستخدمين والاستثمارات والمعاملات...',
    adminUser: 'مستخدم الإدارة',
    adminEmail: 'admin@saham.com',
    
    // Dashboard
    welcomeBack: 'مرحباً بعودتك! إليك ما يحدث في منصتك.',
    viewReports: 'عرض التقارير',
    addInvestment: 'إضافة استثمار',
    totalUsers: 'إجمالي المستخدمين',
    totalInvestments: 'إجمالي الاستثمارات',
    totalVolume: 'إجمالي الحجم',
    revenue: 'الإيرادات',
    activeRegisteredUsers: 'المستخدمون المسجلون النشطون',
    activeInvestmentProperties: 'عقارات الاستثمار النشطة',
    totalInvestmentVolume: 'إجمالي حجم الاستثمار',
    platformRevenue: 'إيرادات المنصة',
    fromLastMonth: 'من الشهر الماضي',
    
    // Recent Activity
    recentActivity: 'النشاط الأخير',
    latestPlatformActivities: 'أحدث أنشطة وأحداث المنصة',
    newUserRegistered: 'مستخدم جديد مسجل: جون دو',
    newInvestmentProperty: 'عقار استثماري جديد مضاف: مبنى مكتبي وسط المدينة',
    largeTransactionProcessed: 'معاملة كبيرة معالجة: $50,000',
    userVerificationPending: 'تحقق المستخدم معلق: سارة ويلسون',
    minutesAgo: 'دقائق مضت',
    hourAgo: 'ساعة مضت',
    hoursAgo: 'ساعات مضت',
    
    // Quick Actions
    quickActions: 'الإجراءات السريعة',
    commonAdministrativeTasks: 'المهام الإدارية الشائعة',
    manageUsers: 'إدارة المستخدمين',
    addInvestment: 'إضافة استثمار',
    viewAnalytics: 'عرض التحليلات',
    processTransactions: 'معالجة المعاملات',
    
    // Top Investments
    topPerformingInvestments: 'أفضل الاستثمارات أداءً',
    mostPopularAndProfitable: 'أشهر وأربح عقارات الاستثمار',
    totalValue: 'القيمة الإجمالية',
    sharesSold: 'الأسهم المباعة',
    viewDetails: 'عرض التفاصيل',
  },
}

export type TranslationKey = keyof typeof translations.en

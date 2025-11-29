'use client'

import { QuickActionCard, WelcomeBanner } from '@/components/admin/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import {
  FileText, Image, Settings, TrendingUp
} from 'lucide-react'

export default function DashboardPage() {
  // Mock data - replace with real API calls
  // const stats = [
  //   {
  //     title: 'Total Users',
  //     value: '1,234',
  //     icon: Users,
  //     trend: { value: 12.5, isPositive: true },
  //     color: 'primary' as const
  //   },
  //   {
  //     title: 'Total Pages',
  //     value: '89',
  //     icon: FileText,
  //     trend: { value: 8.2, isPositive: true },
  //     color: 'accent' as const
  //   },
  //   {
  //     title: 'Comments',
  //     value: '567',
  //     icon: MessageSquare,
  //     trend: { value: 3.1, isPositive: false },
  //     color: 'success' as const
  //   },
  //   {
  //     title: 'Conversion Rate',
  //     value: '3.2%',
  //     icon: TrendingUp,
  //     trend: { value: 15.8, isPositive: true },
  //     color: 'warning' as const
  //   }
  // ]

  const quickActions = [
    {
      title: 'Create New Page',
      description: 'Add a new page to your website with the page builder',
      icon: FileText,
      href: '/admin/pages/create',
      color: 'primary' as const
    },
    {
      title: 'Manage Settings',
      description: 'Configure site settings, appearance, and preferences',
      icon: Settings,
      href: '/admin/settings',
      color: 'accent' as const
    },
    {
      title: 'Upload Media',
      description: 'Add images, videos, and files to your media library',
      icon: Image,
      href: '/admin/media',
      color: 'success' as const
    },
    {
      title: 'View Analytics',
      description: 'Check website performance and visitor statistics',
      icon: TrendingUp,
      href: '/admin/dashboard',
      color: 'warning' as const
    }
  ]

  // const cmsFeatures = [
  //   {
  //     id: 'pages',
  //     title: 'Pages',
  //     description: 'Manage all your website pages and content',
  //     icon: FileText,
  //     href: '/admin/pages',
  //     badge: '89',
  //     color: 'primary' as const
  //   },
  //   {
  //     id: 'homepage',
  //     title: 'Homepage Settings',
  //     description: 'Customize your homepage sections and layout',
  //     icon: Layout,
  //     href: '/admin/homepage-settings',
  //     color: 'accent' as const
  //   },
  //   {
  //     id: 'menu',
  //     title: 'Menu Builder',
  //     description: 'Create and manage navigation menus',
  //     icon: Menu,
  //     href: '/admin/menus',
  //     color: 'success' as const
  //   },
  //   {
  //     id: 'media',
  //     title: 'Media Library',
  //     description: 'Browse and manage uploaded files',
  //     icon: Image,
  //     href: '/admin/media',
  //     badge: '453',
  //     color: 'warning' as const
  //   },
  //   {
  //     id: 'users',
  //     title: 'Users',
  //     description: 'Manage user accounts and permissions',
  //     icon: Users,
  //     href: '/admin/users',
  //     badge: '1,234',
  //     color: 'purple' as const
  //   },
  //   {
  //     id: 'appearance',
  //     title: 'Appearance',
  //     description: 'Customize theme colors and styles',
  //     icon: Palette,
  //     href: '/admin/appearance',
  //     color: 'pink' as const
  //   },
  //   {
  //     id: 'categories',
  //     title: 'Categories',
  //     description: 'Organize content with categories',
  //     icon: FolderTree,
  //     href: '/admin/categories',
  //     badge: '24',
  //     color: 'primary' as const
  //   },
  //   {
  //     id: 'seo',
  //     title: 'SEO Settings',
  //     description: 'Optimize your site for search engines',
  //     icon: Globe,
  //     href: '/admin/seo',
  //     color: 'accent' as const
  //   },
  //   {
  //     id: 'database',
  //     title: 'Database',
  //     description: 'Backup and manage database',
  //     icon: Database,
  //     href: '/admin/database',
  //     color: 'success' as const
  //   },
  //   {
  //     id: 'email',
  //     title: 'Email Templates',
  //     description: 'Configure email notifications',
  //     icon: Mail,
  //     href: '/admin/emails',
  //     color: 'warning' as const
  //   },
  //   {
  //     id: 'security',
  //     title: 'Security',
  //     description: 'Manage security and access control',
  //     icon: Shield,
  //     href: '/admin/security',
  //     color: 'purple' as const
  //   },
  //   {
  //     id: 'notifications',
  //     title: 'Notifications',
  //     description: 'View and manage system notifications',
  //     icon: Bell,
  //     href: '/admin/notifications',
  //     badge: '12',
  //     color: 'pink' as const
  //   }
  // ]

  // const recentActivities = [
  //   {
  //     id: '1',
  //     user: 'John Doe',
  //     action: 'Created new page',
  //     target: 'About Us',
  //     timestamp: '2 minutes ago',
  //     type: 'create' as const
  //   },
  //   {
  //     id: '2',
  //     user: 'Jane Smith',
  //     action: 'Updated content',
  //     target: 'Homepage Banner',
  //     timestamp: '15 minutes ago',
  //     type: 'update' as const
  //   },
  //   {
  //     id: '3',
  //     user: 'Admin',
  //     action: 'Deleted post',
  //     target: 'Old Announcement',
  //     timestamp: '1 hour ago',
  //     type: 'delete' as const
  //   },
  //   {
  //     id: '4',
  //     user: 'Sarah Johnson',
  //     action: 'Uploaded image',
  //     target: 'hero-banner.jpg',
  //     timestamp: '2 hours ago',
  //     type: 'create' as const
  //   },
  //   {
  //     id: '5',
  //     user: 'Mike Wilson',
  //     action: 'Updated settings',
  //     target: 'Site Configuration',
  //     timestamp: '3 hours ago',
  //     type: 'update' as const
  //   }
  // ]

  // const systemMetrics = [
  //   {
  //     label: 'CPU Usage',
  //     value: 45,
  //     status: 'healthy' as const,
  //     unit: '%'
  //   },
  //   {
  //     label: 'Memory Usage',
  //     value: 68,
  //     status: 'warning' as const,
  //     unit: '%'
  //   },
  //   {
  //     label: 'Storage',
  //     value: 32,
  //     status: 'healthy' as const,
  //     unit: '%'
  //   },
  //   {
  //     label: 'Database Size',
  //     value: 78,
  //     status: 'warning' as const,
  //     unit: '%'
  //   }
  // ]

  // const analyticsData = [
  //   { label: 'Homepage', value: 15420 },
  //   { label: 'About Us', value: 8350 },
  //   { label: 'Services', value: 6240 },
  //   { label: 'Contact', value: 4180 },
  //   { label: 'Article', value: 3920 }
  // ]

  return (
    <div className='flex flex-col flex-1 gap-6 p-4 pt-0'>
      {/* Welcome Banner */}
      <WelcomeBanner userName='Admin' />

      {/* Quick Stats */}
      {/* <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <QuickStatsCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div> */}

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className='flex items-center gap-2'>
            <TrendingUp className='w-5 h-5 text-primary' />
            Quick Actions
          </CardTitle>
          <CardDescription>Common tasks and shortcuts for quick access</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4'>
            {quickActions.map((action, index) => (
              <QuickActionCard key={action.title} {...action} delay={index * 0.1} />
            ))}
          </div>
        </CardContent>
      </Card>

      {/* CMS Features Grid */}
      {/* <Card className='shadow-sm border-2'>
        <CardHeader className='bg-linear-to-r from-accent/5 to-transparent'>
          <CardTitle className='flex items-center gap-2'>
            <Layout className='w-5 h-5 text-accent' />
            CMS Features
          </CardTitle>
          <CardDescription>
            Access all content management features and tools
          </CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <FeatureGrid features={cmsFeatures} columns={4} />
        </CardContent>
      </Card> */}

      {/* Activity & Health */}
      {/* <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
        <RecentActivityCard activities={recentActivities} />
        <SystemHealthCard metrics={systemMetrics} />
      </div> */}

      {/* Analytics Chart */}
      {/* <AnalyticsChartCard
        title='Page Views This Week'
        description='Most visited pages on your website'
        data={analyticsData}
        trend={{ value: 12.5, isPositive: true }}
        totalValue='38.1K'
      /> */}
    </div>
  )
}

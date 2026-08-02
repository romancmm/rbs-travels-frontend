'use client'

import type { Feature } from '@/components/admin/dashboard'
import {
  AnalyticsChartCard,
  FeatureGrid,
  QuickStatsCard,
  RecentActivityCard,
  WelcomeBanner
} from '@/components/admin/dashboard'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import useAsync from '@/hooks/useAsync'
import type { PaginatedResponse } from '@/hooks/useFilter'
import { formatDistanceToNow } from 'date-fns'
import {
  FileText,
  FolderTree,
  Image,
  Layers,
  Menu,
  Settings,
  Shield,
  Users,
  Wrench
} from 'lucide-react'

export default function DashboardPage() {
  const { data: articlesData, loading: articlesLoading } = useAsync<PaginatedResponse<Article>>(
    '/admin/articles/posts?limit=1'
  )
  const { data: pagesData, loading: pagesLoading } =
    useAsync<PaginatedResponse<unknown>>('/admin/pages?limit=1')
  const { data: categoriesData, loading: categoriesLoading } = useAsync<PaginatedResponse<unknown>>(
    '/admin/articles/categories?limit=1'
  )
  const { data: adminsData, loading: adminsLoading } = useAsync<PaginatedResponse<unknown>>(
    '/admin/user/admins?limit=1'
  )
  const { data: recentArticlesData, loading: recentLoading } = useAsync<PaginatedResponse<Article>>(
    '/admin/articles/posts?limit=5&sortBy=createdAt&sortOrder=desc'
  )

  const articlesCount = articlesData?.pagination?.totalItems
  const pagesCount = pagesData?.pagination?.totalItems
  const categoriesCount = categoriesData?.pagination?.totalItems
  const adminsCount = adminsData?.pagination?.totalItems

  const stats = [
    {
      title: 'Total Articles',
      value: articlesLoading ? '—' : (articlesCount ?? 0),
      icon: FileText,
      color: 'primary' as const
    },
    {
      title: 'Total Pages',
      value: pagesLoading ? '—' : (pagesCount ?? 0),
      icon: Layers,
      color: 'blue' as const
    },
    {
      title: 'Categories',
      value: categoriesLoading ? '—' : (categoriesCount ?? 0),
      icon: FolderTree,
      color: 'success' as const
    },
    {
      title: 'Admin Users',
      value: adminsLoading ? '—' : (adminsCount ?? 0),
      icon: Users,
      color: 'warning' as const
    }
  ]

  const cmsFeatures: Feature[] = [
    {
      id: 'articles',
      title: 'Articles',
      description: 'Write, edit, and publish blog articles',
      icon: FileText,
      href: '/admin/articles',
      badge: articlesLoading ? undefined : articlesCount?.toString(),
      color: 'primary'
    },
    {
      id: 'pages',
      title: 'Pages',
      description: 'Manage all your website pages and content',
      icon: Layers,
      href: '/admin/pages',
      badge: pagesLoading ? undefined : pagesCount?.toString(),
      color: 'blue'
    },
    {
      id: 'categories',
      title: 'Categories',
      description: 'Organize articles with categories',
      icon: FolderTree,
      href: '/admin/articles/categories',
      badge: categoriesLoading ? undefined : categoriesCount?.toString(),
      color: 'success'
    },
    {
      id: 'menu',
      title: 'Menu Manager',
      description: 'Create and manage header and footer navigation',
      icon: Menu,
      href: '/admin/menu-manager',
      color: 'warning'
    },
    {
      id: 'media',
      title: 'File Manager',
      description: 'Browse and manage uploaded media files',
      icon: Image,
      href: '/admin/file-manager',
      color: 'sky'
    },
    {
      id: 'admins',
      title: 'Admin Users',
      description: 'Manage admin accounts and access',
      icon: Users,
      href: '/admin/administration/admins',
      badge: adminsLoading ? undefined : adminsCount?.toString(),
      color: 'purple'
    },
    {
      id: 'roles',
      title: 'Roles & Permissions',
      description: 'Control what each admin role can access',
      icon: Shield,
      href: '/admin/administration/roles',
      color: 'pink'
    },
    {
      id: 'settings',
      title: 'Site Settings',
      description: 'Configure branding, contact info, and SEO',
      icon: Settings,
      href: '/admin/settings',
      color: 'primary'
    },
    {
      id: 'system-tools',
      title: 'System Tools',
      description: 'Maintenance utilities and system diagnostics',
      icon: Wrench,
      href: '/admin/system-tools',
      color: 'warning'
    }
  ]

  const recentActivities =
    recentArticlesData?.data?.items?.map((article) => ({
      id: String(article.id),
      user: article.author
        ? [article.author.firstName, article.author.lastName].filter(Boolean).join(' ') ||
          article.author.username ||
          article.author.email
        : 'Unknown',
      action: article.isPublished ? 'Published article' : 'Drafted article',
      target: article.title,
      timestamp: article.createdAt
        ? formatDistanceToNow(new Date(article.createdAt), { addSuffix: true })
        : '',
      type: 'create' as const
    })) ?? []

  const contentOverview = [
    { label: 'Articles', value: articlesCount ?? 0, color: '#2a78d6' },
    { label: 'Pages', value: pagesCount ?? 0, color: '#eb6834' },
    { label: 'Categories', value: categoriesCount ?? 0, color: '#1baf7a' },
    { label: 'Admin Users', value: adminsCount ?? 0, color: '#eda100' }
  ]
  const contentTotal = contentOverview.reduce((sum, item) => sum + item.value, 0)

  return (
    <div className='flex flex-col flex-1 gap-6 p-4 pt-0'>
      {/* Welcome Banner */}
      <WelcomeBanner userName='Admin' />

      {/* Quick Stats */}
      <div className='gap-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
        {stats.map((stat, index) => (
          <QuickStatsCard key={stat.title} {...stat} delay={index * 0.1} />
        ))}
      </div>

      {/* CMS Features Grid */}
      <Card className='shadow-sm border-2'>
        <CardHeader className='bg-linear-to-r from-primary/5 to-transparent'>
          <CardTitle className='flex items-center gap-2'>
            <Layers className='w-5 h-5 text-primary' />
            CMS Features
          </CardTitle>
          <CardDescription>Access all content management features and tools</CardDescription>
        </CardHeader>
        <Separator />
        <CardContent>
          <FeatureGrid features={cmsFeatures} columns={3} />
        </CardContent>
      </Card>

      {/* Recent Activity & Content Overview */}
      <div className='gap-4 grid grid-cols-1 lg:grid-cols-2'>
        <RecentActivityCard activities={recentLoading ? [] : recentActivities} />
        <AnalyticsChartCard
          title='Content Overview'
          description='Total items by content type'
          data={contentOverview}
          totalValue={contentTotal.toLocaleString()}
        />
      </div>
    </div>
  )
}

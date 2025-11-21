import {
  FileCog,
  FileText,
  FolderOpen,
  LayoutDashboard,
  LayoutTemplate,
  ListTodo,
  LucideIcon,
  Settings,
  ShieldAlert,
  TrendingUp
} from 'lucide-react'

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  children?: Omit<NavItem, 'icon' | 'children'>[]
  permission?: { resource: string; action?: string }
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard
  },

  // Blogs & Content
  {
    title: 'Blog & Content',
    href: '',
    icon: FileText,
    // permission: { resource: 'blogs', action: 'index' },
    children: [
      {
        title: 'Categories',
        href: '/admin/blogs/categories'
        // permission: { resource: 'blogs', action: 'index' }
      },
      {
        title: 'Posts',
        href: '/admin/blogs'
        // permission: { resource: 'blogs', action: 'index' }
      }
    ]
  },

  // Menu Manger
  {
    title: 'Menu Manager',
    href: '/admin/menu-manager',
    icon: ListTodo
  },

  // Page Builder
  {
    title: 'Page Builder',
    href: '/admin/pages',
    icon: LayoutTemplate
  },

  // File Manager
  {
    title: 'File Manager',
    href: '/admin/file-manager',
    icon: FolderOpen
  },

  // SEO Settings
  {
    title: 'SEO Settings',
    href: '',
    icon: TrendingUp,
    permission: { resource: 'seo', action: 'index' },
    children: [
      {
        title: 'Page Meta',
        href: '/admin/seo/page-meta',
        permission: { resource: 'seo', action: 'index' }
      },
      {
        title: 'Analytics Scripts',
        href: '/admin/seo/analytics-scripts',
        permission: { resource: 'seo', action: 'index' }
      }
    ]
  },

  // Site Settings
  {
    title: 'Site Settings',
    href: '',
    icon: Settings,
    // permission: { resource: 'dashboard', action: 'index' },
    children: [
      {
        title: 'Logo Management',
        href: '/admin/settings/logo-management'
        // permission: { resource: 'settings', action: 'update' }
      },
      {
        title: 'General Settings',
        href: '/admin/settings'
        // permission: { resource: 'settings', action: 'update' }
      },
      {
        title: 'Theme Settings',
        href: '/admin/settings/theme-settings'
        // permission: { resource: 'settings', action: 'update' }
      },
      {
        title: 'Social Links',
        href: '/admin/settings/social-links'
        // permission: { resource: 'settings', action: 'update' }
      }
    ]
  },

  // Homepage Builder
  {
    title: 'Homepage Builder',
    href: '',
    icon: FileCog,
    // permission: { resource: 'settings', action: 'index' },
    children: [
      {
        title: 'Banner Management',
        href: '/admin/homepage-settings/banners'
        // permission: { resource: 'settings', action: 'index' }
      },
      {
        title: 'About Us',
        href: '/admin/homepage-settings/about'
      },
      {
        title: 'Who we are',
        href: '/admin/homepage-settings/who-we-are'
      },
      {
        title: 'Top Countries',
        href: '/admin/homepage-settings/top-countries'
      },
      // {
      //   title: 'News & Events',
      //   href: '/admin/homepage-settings/news-and-events'
      // },
      {
        title: 'Testimonials',
        href: '/admin/homepage-settings/testimonials'
      },
      {
        title: 'Faqs',
        href: '/admin/homepage-settings/faqs'
      }
    ]
  },

  // Administration
  {
    title: 'Administration',
    href: '',
    icon: ShieldAlert,
    // permission: { resource: 'accounts', action: 'index' },
    children: [
      {
        title: 'Manage Admins',
        href: '/admin/administration/admins'
        // permission: { resource: 'accounts', action: 'index' }
      },
      {
        title: 'Roles & Permissions',
        href: '/admin/administration/roles'
        // permission: { resource: 'accounts', action: 'index' }
      },
      {
        title: 'Permissions',
        href: '/admin/administration/permissions'
        // permission: { resource: 'accounts', action: 'index' }
      }
    ]
  }

  // {
  //   title: 'Customers',
  //   href: '',
  //   icon: Users2,
  //   permission: { resource: 'customers', action: 'index' },
  //   children: [
  //     {
  //       title: 'Customer List',
  //       href: '/admin/customers/list',
  //       permission: { resource: 'customers', action: 'index' }
  //     },
  //     {
  //       title: 'Bookings',
  //       href: '/admin/customers/bookings',
  //       permission: { resource: 'customers', action: 'index' }
  //     },
  //     {
  //       title: 'Feedbacks',
  //       href: '/admin/customers/feedbacks',
  //       permission: { resource: 'customers', action: 'index' }
  //     }
  //   ]
  // },
  // {
  //   title: 'Flight Management',
  //   href: '',
  //   icon: Plane,
  //   permission: { resource: 'flights', action: 'index' },
  //   children: [
  //     {
  //       title: 'All Flights',
  //       href: '/admin/flights',
  //       permission: { resource: 'flights', action: 'index' }
  //     },
  //     {
  //       title: 'Add New Flight',
  //       href: '/admin/flights/add',
  //       permission: { resource: 'flights', action: 'create' }
  //     },
  //     {
  //       title: 'Airlines',
  //       href: '/admin/flights/airlines',
  //       permission: { resource: 'flights', action: 'index' }
  //     }
  //   ]
  // },
  // {
  //   title: 'Tour Packages',
  //   href: '',
  //   icon: Globe,
  //   permission: { resource: 'tours', action: 'index' },
  //   children: [
  //     {
  //       title: 'All Packages',
  //       href: '/admin/tours',
  //       permission: { resource: 'tours', action: 'index' }
  //     },
  //     {
  //       title: 'Add New Package',
  //       href: '/admin/tours/add',
  //       permission: { resource: 'tours', action: 'create' }
  //     },
  //     {
  //       title: 'Destinations',
  //       href: '/admin/tours/destinations',
  //       permission: { resource: 'tours', action: 'index' }
  //     }
  //   ]
  // },
  // {
  //   title: 'Hotel Management',
  //   href: '',
  //   icon: Hotel,
  //   permission: { resource: 'hotels', action: 'index' },
  //   children: [
  //     {
  //       title: 'All Hotels',
  //       href: '/admin/hotels',
  //       permission: { resource: 'hotels', action: 'index' }
  //     },
  //     {
  //       title: 'Add New Hotel',
  //       href: '/admin/hotels/add',
  //       permission: { resource: 'hotels', action: 'create' }
  //     }
  //   ]
  // },
  // {
  //   title: 'Visa Services',
  //   href: '',
  //   icon: Globe,
  //   permission: { resource: 'visas', action: 'index' },
  //   children: [
  //     {
  //       title: 'Visa List',
  //       href: '/admin/visa',
  //       permission: { resource: 'visas', action: 'index' }
  //     },
  //     {
  //       title: 'Applications',
  //       href: '/admin/visa/applications',
  //       permission: { resource: 'visas', action: 'index' }
  //     }
  //   ]
  // },
  // {
  //   title: 'Bookings',
  //   href: '',
  //   icon: CreditCard,
  //   permission: { resource: 'bookings', action: 'index' },
  //   children: [
  //     {
  //       title: 'All Bookings',
  //       href: '/admin/bookings',
  //       permission: { resource: 'bookings', action: 'index' }
  //     },
  //     {
  //       title: 'Pending Bookings',
  //       href: '/admin/bookings?status=PENDING',
  //       permission: { resource: 'bookings', action: 'index' }
  //     },
  //     {
  //       title: 'Confirmed Bookings',
  //       href: '/admin/bookings?status=CONFIRMED',
  //       permission: { resource: 'bookings', action: 'index' }
  //     },
  //     {
  //       title: 'Cancelled Bookings',
  //       href: '/admin/bookings?status=CANCELLED',
  //       permission: { resource: 'bookings', action: 'index' }
  //     }
  //   ]
  // },
]

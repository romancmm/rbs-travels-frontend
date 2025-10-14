import {
  BarChart3,
  CreditCard,
  FileText,
  Gift,
  Globe,
  Hotel,
  LayoutDashboard,
  LucideIcon,
  Mail,
  Plane,
  Settings,
  ShieldAlert,
  TrendingUp,
  Users2
} from 'lucide-react'

type NavItem = {
  title: string
  href: string
  icon: LucideIcon
  children: Omit<NavItem, 'icon' | 'children'>[]
  permission?: { resource: string; action?: string }
}
export const siteConfig = {
  name: 'RBS TRAVELS',
  description:
    'Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.',
  logo: {
    default: '/logo.svg',
    dark: '/logo.svg'
  },
  phone: '+88017 123 456 78',
  email: 'info@rbstravels.com',
  address: 'House #00, Road #00, Dhanmondi, Dhaka, Bangladesh',
  socialLinks: [
    {
      name: 'facebook',
      url: 'https://www.facebook.com/rbstravels',
      icon: '/images/social-icon/facebook.svg'
    },
    {
      name: 'X',
      url: 'https://x.com/rbstravels',
      icon: '/images/social-icon/x.svg'
    },
    {
      name: 'instagram',
      url: 'https://instagram.com/rbstravels',
      icon: '/images/social-icon/instagram.svg'
    },
    {
      name: 'linkedin',
      url: 'https://linkedin.com/company/rbstravels',
      icon: '/images/social-icon/linkedin.svg'
    },
    {
      name: 'youtube',
      url: 'https://youtube.com/@rbstravels',
      icon: '/images/social-icon/youtube.svg'
    },
    {
      name: 'google',
      url: 'https://maps.google.com/?q=RBS+TRAVELS',
      icon: '/images/social-icon/google.svg'
    }
  ],
  mainNav: [
    { title: 'Home', href: '/' },
    { title: 'About Us', href: '/page/about' },
    { title: 'Jobs', href: '/page/jobs' },
    {
      title: 'Services',
      href: '/page/services',
      children: [
        { title: 'Flights', href: '/page/flights' },
        { title: 'Tours & Packages', href: '/page/tours' },
        { title: 'Visa Services', href: '/page/visa-services' },
        { title: 'Hotels', href: '/page/hotels' }
      ]
    },
    // { title: 'Flights', href: '/flights' },
    // { title: 'Tours & Packages', href: '/tours' },
    // { title: 'Visa Services', href: '/visa-services' },
    // { title: 'Hotels', href: '/hotels' },
    { title: 'Gallery', href: '/page/gallery' },
    { title: 'Contact Us', href: '/page/contact' }
  ],
  footerNav: [
    {
      title: 'Company',
      children: [
        { title: 'About Us', href: '/page/about' },
        { title: 'FAQ', href: '/page/faq' },
        { title: 'Testimonials', href: '/page/testimonials' },
        { title: 'Terms & Conditions', href: '/page/terms' },
        { title: 'Privacy Policy', href: '/page/privacy-policy' }
      ]
    },
    {
      title: 'Services',
      children: [
        { title: 'Air Ticket Booking', href: '/page/flights' },
        { title: 'Holiday Packages', href: '/page/tours' },
        { title: 'Visa Assistance', href: '/page/visa-services' },
        { title: 'Hotel Reservations', href: '/page/hotels' },
        { title: 'Travel Insurance', href: '/page/travel-insurance' }
      ]
    }
  ],
  footer: {
    copyright: '© RBS TRAVELS | All rights reserved.'
  }
}

export const navItems: NavItem[] = [
  {
    title: 'Dashboard',
    href: '/admin/dashboard',
    icon: LayoutDashboard,
    children: []
  },
  {
    title: 'Customers',
    href: '',
    icon: Users2,
    permission: { resource: 'customers', action: 'index' },
    children: [
      {
        title: 'Customer List',
        href: '/admin/customers/list',
        permission: { resource: 'customers', action: 'index' }
      },
      {
        title: 'Bookings',
        href: '/admin/customers/bookings',
        permission: { resource: 'customers', action: 'index' }
      },
      {
        title: 'Feedbacks',
        href: '/admin/customers/feedbacks',
        permission: { resource: 'customers', action: 'index' }
      }
    ]
  },
  {
    title: 'Flight Management',
    href: '',
    icon: Plane,
    permission: { resource: 'flights', action: 'index' },
    children: [
      {
        title: 'All Flights',
        href: '/admin/flights',
        permission: { resource: 'flights', action: 'index' }
      },
      {
        title: 'Add New Flight',
        href: '/admin/flights/add',
        permission: { resource: 'flights', action: 'create' }
      },
      {
        title: 'Airlines',
        href: '/admin/flights/airlines',
        permission: { resource: 'flights', action: 'index' }
      }
    ]
  },
  {
    title: 'Tour Packages',
    href: '',
    icon: Globe,
    permission: { resource: 'tours', action: 'index' },
    children: [
      {
        title: 'All Packages',
        href: '/admin/tours',
        permission: { resource: 'tours', action: 'index' }
      },
      {
        title: 'Add New Package',
        href: '/admin/tours/add',
        permission: { resource: 'tours', action: 'create' }
      },
      {
        title: 'Destinations',
        href: '/admin/tours/destinations',
        permission: { resource: 'tours', action: 'index' }
      }
    ]
  },
  {
    title: 'Hotel Management',
    href: '',
    icon: Hotel,
    permission: { resource: 'hotels', action: 'index' },
    children: [
      {
        title: 'All Hotels',
        href: '/admin/hotels',
        permission: { resource: 'hotels', action: 'index' }
      },
      {
        title: 'Add New Hotel',
        href: '/admin/hotels/add',
        permission: { resource: 'hotels', action: 'create' }
      }
    ]
  },
  {
    title: 'Visa Services',
    href: '',
    icon: Globe,
    permission: { resource: 'visas', action: 'index' },
    children: [
      {
        title: 'Visa List',
        href: '/admin/visa',
        permission: { resource: 'visas', action: 'index' }
      },
      {
        title: 'Applications',
        href: '/admin/visa/applications',
        permission: { resource: 'visas', action: 'index' }
      }
    ]
  },
  {
    title: 'Bookings',
    href: '',
    icon: CreditCard,
    permission: { resource: 'bookings', action: 'index' },
    children: [
      {
        title: 'All Bookings',
        href: '/admin/bookings',
        permission: { resource: 'bookings', action: 'index' }
      },
      {
        title: 'Pending Bookings',
        href: '/admin/bookings?status=PENDING',
        permission: { resource: 'bookings', action: 'index' }
      },
      {
        title: 'Confirmed Bookings',
        href: '/admin/bookings?status=CONFIRMED',
        permission: { resource: 'bookings', action: 'index' }
      },
      {
        title: 'Cancelled Bookings',
        href: '/admin/bookings?status=CANCELLED',
        permission: { resource: 'bookings', action: 'index' }
      }
    ]
  },
  {
    title: 'Coupons & Offers',
    href: '/admin/coupons',
    icon: Gift,
    permission: { resource: 'coupons', action: 'index' },
    children: []
  },
  {
    title: 'Blog & Content',
    href: '',
    icon: FileText,
    permission: { resource: 'blogs', action: 'index' },
    children: [
      {
        title: 'Categories',
        href: '/admin/blogs/categories',
        permission: { resource: 'blogs', action: 'index' }
      },
      {
        title: 'Posts',
        href: '/admin/blogs',
        permission: { resource: 'blogs', action: 'index' }
      }
    ]
  },
  {
    title: 'Support Tickets',
    href: '/admin/tickets',
    icon: Mail,
    permission: { resource: 'tickets', action: 'index' },
    children: []
  },
  {
    title: 'Analytics',
    href: '',
    icon: BarChart3,
    permission: { resource: 'analytics', action: 'index' },
    children: [
      {
        title: 'Sales Analytics',
        href: '/admin/analytics/sales',
        permission: { resource: 'analytics', action: 'index' }
      },
      {
        title: 'Traffic Analytics',
        href: '/admin/analytics/traffic',
        permission: { resource: 'analytics', action: 'index' }
      }
    ]
  },
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
  {
    title: 'Site Settings',
    href: '',
    icon: Settings,
    permission: { resource: 'settings', action: 'index' },
    children: [
      {
        title: 'General Settings',
        href: '/admin/settings/general',
        permission: { resource: 'settings', action: 'update' }
      },
      {
        title: 'Email Settings',
        href: '/admin/settings/email',
        permission: { resource: 'settings', action: 'update' }
      },
      {
        title: 'Payment Methods',
        href: '/admin/settings/payments',
        permission: { resource: 'settings', action: 'update' }
      },
      {
        title: 'Social Links',
        href: '/admin/settings/social-links',
        permission: { resource: 'settings', action: 'update' }
      }
    ]
  },
  {
    title: 'Administration',
    href: '',
    icon: ShieldAlert,
    permission: { resource: 'accounts', action: 'index' },
    children: [
      {
        title: 'Manage Admins',
        href: '/admin/administration/admins',
        permission: { resource: 'accounts', action: 'index' }
      },
      {
        title: 'Roles & Permissions',
        href: '/admin/administration/roles',
        permission: { resource: 'accounts', action: 'index' }
      }
    ]
  }
]

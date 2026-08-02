import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import { MenuItem } from '@/types/menu.types'

// Shared with site-theme-provider's pre-paint script so the "no settings yet"
// look is defined once instead of drifting between two hardcoded palettes.
export const DEFAULT_THEME_COLORS: Record<string, string> = {
  primary: '#1677FF',
  secondary: '#001529',
  accent: '#FAAD14',
  text: '#1F1F1F',
  'header-background': '#F5F5F5',
  'header-color': '#1F1F1F',
  'footer-background': '#0f1e32',
  'footer-color': '#FFFFFF'
}

// Baseline `system_site_settings` value, used whenever the backend has no
// record yet or the request fails - see getSiteConfig() in src/action/data.ts.
export const DEFAULT_SITE_CONFIG: SiteSettings = {
  name: 'Dynamic CMS',
  shortDescription:
    'Your trusted travel agency for air tickets, holiday packages, and visa assistance worldwide.',
  logo: {
    default: '/logo.svg',
    dark: '/logo.svg'
  },
  hotline: '+1 (800) 555-0100',
  phone: '+1 (555) 123-4567',
  email: 'contact@example.com',
  address: '123 Main Street, Suite 400, Springfield, ST 12345',
  workingHours: 'Mon - Fri: 9:00 AM - 6:00 PM',
  promoText: [],
  addresses: [
    {
      title: 'Corporate Office',
      address: '123 Main Street, Suite 400, Springfield, ST 12345',
      phone: '+1 (555) 123-4567',
      email: 'contact@example.com'
    }
  ],
  socialLinks: {
    facebook: 'https://facebook.com/yourpage',
    twitter: 'https://twitter.com/username',
    linkedin: 'https://linkedin.com/company/yourcompany',
    youtube: 'https://youtube.com/channel/yourchannel'
  },
  theme: {
    color: DEFAULT_THEME_COLORS,
    darkMode: false
  },
  footer: {
    copyright: '© Dynamic CMS | All rights reserved.'
  },
  locale: 'en-US',
  maintenanceMode: false
}

// Fallback header nav, used in src/app/(front)/layout.tsx whenever the
// `/menus/main-menu` request fails or the Menu Manager has no items yet.
export const DEFAULT_MAIN_MENU_ITEMS: MenuItem[] = [
  {
    id: 'default-home',
    menuId: 'default-main-menu',
    title: 'Home',
    slug: '',
    type: 'custom-link',
    url: '/',
    order: 1,
    isPublished: true
  },
  {
    id: 'default-about',
    menuId: 'default-main-menu',
    title: 'About Us',
    slug: 'about',
    type: 'custom-link',
    url: '/about',
    order: 2,
    isPublished: true
  },
  {
    id: 'default-services',
    menuId: 'default-main-menu',
    title: 'Services',
    slug: 'services',
    type: 'custom-link',
    url: '/services',
    order: 3,
    isPublished: true,
    children: [
      {
        id: 'default-services-consulting',
        menuId: 'default-main-menu',
        parentId: 'default-services',
        title: 'Consulting',
        slug: 'consulting',
        type: 'custom-link',
        url: '/services/consulting',
        order: 1,
        isPublished: true
      },
      {
        id: 'default-services-support',
        menuId: 'default-main-menu',
        parentId: 'default-services',
        title: 'Support',
        slug: 'support',
        type: 'custom-link',
        url: '/services/support',
        order: 2,
        isPublished: true
      }
    ]
  },
  {
    id: 'default-blog',
    menuId: 'default-main-menu',
    title: 'Blog',
    slug: 'blog',
    type: 'custom-link',
    url: '/blog',
    order: 4,
    isPublished: true
  },
  {
    id: 'default-contact',
    menuId: 'default-main-menu',
    title: 'Contact Us',
    slug: 'contact',
    type: 'custom-link',
    url: '/contact',
    order: 5,
    isPublished: true
  }
]

// Fallback footer nav, used in src/app/(front)/layout.tsx whenever the
// `/menus/footer-menu` request fails or the Menu Manager has no items yet.
export const DEFAULT_FOOTER_MENU_ITEMS: MenuItem[] = [
  {
    id: 'default-footer-company',
    menuId: 'default-footer-menu',
    title: 'Company',
    slug: 'company',
    type: 'custom-link',
    order: 1,
    isPublished: true,
    children: [
      {
        id: 'default-footer-about',
        menuId: 'default-footer-menu',
        parentId: 'default-footer-company',
        title: 'About Us',
        slug: 'about',
        type: 'custom-link',
        url: '/about',
        order: 1,
        isPublished: true
      },
      {
        id: 'default-footer-contact',
        menuId: 'default-footer-menu',
        parentId: 'default-footer-company',
        title: 'Contact Us',
        slug: 'contact',
        type: 'custom-link',
        url: '/contact',
        order: 2,
        isPublished: true
      },
      {
        id: 'default-footer-faq',
        menuId: 'default-footer-menu',
        parentId: 'default-footer-company',
        title: 'FAQ',
        slug: 'faq',
        type: 'custom-link',
        url: '/faq',
        order: 3,
        isPublished: true
      }
    ]
  },
  {
    id: 'default-footer-legal',
    menuId: 'default-footer-menu',
    title: 'Legal',
    slug: 'legal',
    type: 'custom-link',
    order: 2,
    isPublished: true,
    children: [
      {
        id: 'default-footer-privacy',
        menuId: 'default-footer-menu',
        parentId: 'default-footer-legal',
        title: 'Privacy Policy',
        slug: 'privacy-policy',
        type: 'custom-link',
        url: '/privacy-policy',
        order: 1,
        isPublished: true
      },
      {
        id: 'default-footer-terms',
        menuId: 'default-footer-menu',
        parentId: 'default-footer-legal',
        title: 'Terms & Conditions',
        slug: 'terms',
        type: 'custom-link',
        url: '/terms',
        order: 2,
        isPublished: true
      }
    ]
  }
]

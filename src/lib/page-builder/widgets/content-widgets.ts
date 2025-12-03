/**
 * Content Display Widgets - Grid, Blog, Products, Services, Packages, etc.
 */

import { z } from 'zod'
import { componentRegistry } from '../component-registry'

/**
 * UNIFIED GRID WIDGET
 * Flexible grid that can:
 * 1. Fetch data from API and render with specified card type
 * 2. Manually define grid items with different card components
 */
componentRegistry.register({
  type: 'grid',
  label: 'Grid',
  icon: 'Grid3x3',
  category: 'layout',
  description: 'Flexible grid layout - API-driven or manual items with custom card components',
  tags: ['grid', 'layout', 'cards', 'dynamic', 'api', 'blog', 'products', 'services'],

  defaultProps: {
    title: 'Grid Section',
    subtitle: '',
    showTitle: true,

    // Layout
    columns: 3,
    gap: '24',
    layout: 'grid', // grid | masonry

    // Data Source
    dataSource: 'api', // api | manual

    // API Mode
    apiEndpoint: '/api/blog',
    apiParams: {},
    itemsPerPage: 6,
    enablePagination: true,
    cardType: 'BlogCard', // Which card component to render

    // Manual Mode
    gridItems: [],

    // Card Display
    cardProps: {},
    cardStyle: 'default', // default | minimal | bordered | elevated
    hoverEffect: 'lift', // none | lift | zoom | glow

    // Responsive
    columnsMobile: 1,
    columnsTablet: 2,
    columnsDesktop: 3
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    showTitle: z.boolean().optional(),
    columns: z.number().min(1).max(6),
    gap: z.string().optional(),
    layout: z.enum(['grid', 'masonry']).optional(),
    dataSource: z.enum(['api', 'manual']),
    apiEndpoint: z.string().optional(),
    apiParams: z.record(z.string(), z.any()).optional(),
    itemsPerPage: z.number().optional(),
    enablePagination: z.boolean().optional(),
    cardType: z.string().optional(),
    gridItems: z
      .array(
        z.object({
          id: z.string(),
          order: z.number(),
          cardType: z.string(),
          props: z.record(z.string(), z.any())
        })
      )
      .optional(),
    cardProps: z.record(z.string(), z.any()).optional(),
    cardStyle: z.string().optional(),
    hoverEffect: z.string().optional(),
    columnsMobile: z.number().optional(),
    columnsTablet: z.number().optional(),
    columnsDesktop: z.number().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Section Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'showTitle', label: 'Show Title', type: 'toggle' }
      ]
    },
    {
      id: 'data-source',
      label: 'Data Source',
      fields: [
        {
          name: 'dataSource',
          label: 'Data Source',
          type: 'select',
          options: [
            { label: 'API (Dynamic)', value: 'api' },
            { label: 'Manual (Custom Items)', value: 'manual' }
          ]
        }
      ]
    },
    {
      id: 'api-settings',
      label: 'API Settings',
      fields: [
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text', placeholder: '/api/blog' },
        { name: 'itemsPerPage', label: 'Items Per Page', type: 'number' },
        { name: 'enablePagination', label: 'Enable Pagination', type: 'toggle' },
        {
          name: 'cardType',
          label: 'Card Type',
          type: 'select',
          options: [
            { label: 'Blog Card', value: 'BlogCard' },
            { label: 'Product Card', value: 'ProductCard' },
            { label: 'Service Card', value: 'ServiceCard' },
            { label: 'Tour Package Card', value: 'TourPackageCard' },
            { label: 'Testimonial Card', value: 'TestimonialCard' },
            { label: 'Team Member Card', value: 'TeamMemberCard' },
            { label: 'Pricing Card', value: 'PricingCard' },
            { label: 'Icon Box', value: 'IconBox' },
            { label: 'Feature Card', value: 'FeatureCard' },
            { label: 'Portfolio Card', value: 'PortfolioCard' }
          ]
        }
      ]
    },
    {
      id: 'layout',
      label: 'Layout',
      fields: [
        {
          name: 'layout',
          label: 'Layout Type',
          type: 'select',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'Masonry', value: 'masonry' }
          ]
        },
        { name: 'columns', label: 'Columns (Desktop)', type: 'number', min: 1, max: 6 },
        { name: 'columnsTablet', label: 'Columns (Tablet)', type: 'number', min: 1, max: 4 },
        { name: 'columnsMobile', label: 'Columns (Mobile)', type: 'number', min: 1, max: 2 },
        { name: 'gap', label: 'Gap (px)', type: 'text', placeholder: '24' }
      ]
    },
    {
      id: 'card-style',
      label: 'Card Styling',
      fields: [
        {
          name: 'cardStyle',
          label: 'Card Style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Minimal', value: 'minimal' },
            { label: 'Bordered', value: 'bordered' },
            { label: 'Elevated', value: 'elevated' }
          ]
        },
        {
          name: 'hoverEffect',
          label: 'Hover Effect',
          type: 'select',
          options: [
            { label: 'None', value: 'none' },
            { label: 'Lift', value: 'lift' },
            { label: 'Zoom', value: 'zoom' },
            { label: 'Glow', value: 'glow' }
          ]
        }
      ]
    }
  ]
})

/**
 * BLOG/ARTICLES CAROUSEL WIDGET
 */
componentRegistry.register({
  type: 'blog-carousel',
  label: 'Blog Carousel',
  icon: 'Newspaper',
  category: 'dynamic',
  description: 'Blog posts in carousel/slider',
  tags: ['blog', 'carousel', 'slider', 'posts'],

  defaultProps: {
    title: 'Featured Articles',
    postsToShow: 6,
    slidesPerView: 3, // 1 | 2 | 3 | 4
    autoplay: true,
    autoplayDelay: 5000,
    loop: true,
    showNavigation: true,
    showPagination: true,
    spaceBetween: 20,
    showFeaturedImage: true,
    showExcerpt: true,
    showDate: true,
    showCategory: true,
    imageAspectRatio: '16:9',
    apiEndpoint: '/api/blog',
    categoryFilter: '',
    cardType: 'BlogCard'
  },

  propsSchema: z.object({
    title: z.string().optional(),
    postsToShow: z.number().min(1),
    slidesPerView: z.number().min(1).max(4),
    autoplay: z.boolean().optional(),
    autoplayDelay: z.number().optional(),
    loop: z.boolean().optional(),
    showNavigation: z.boolean().optional(),
    showPagination: z.boolean().optional(),
    spaceBetween: z.number().optional(),
    showFeaturedImage: z.boolean().optional(),
    showExcerpt: z.boolean().optional(),
    showDate: z.boolean().optional(),
    showCategory: z.boolean().optional(),
    imageAspectRatio: z.string().optional(),
    apiEndpoint: z.string(),
    categoryFilter: z.string().optional(),
    cardType: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'postsToShow', label: 'Number of Posts', type: 'number' },
        {
          name: 'cardType',
          label: 'Card Type',
          type: 'select',
          options: [
            { label: 'Blog Card', value: 'BlogCard' },
            { label: 'Product Card', value: 'ProductCard' },
            { label: 'Service Card', value: 'ServiceCard' }
          ]
        }
      ]
    },
    {
      id: 'carousel',
      label: 'Carousel Settings',
      fields: [
        { name: 'slidesPerView', label: 'Slides Per View', type: 'number' },
        { name: 'autoplay', label: 'Autoplay', type: 'toggle' },
        { name: 'autoplayDelay', label: 'Autoplay Delay (ms)', type: 'number' },
        { name: 'loop', label: 'Loop', type: 'toggle' },
        { name: 'showNavigation', label: 'Show Navigation Arrows', type: 'toggle' },
        { name: 'showPagination', label: 'Show Pagination Dots', type: 'toggle' }
      ]
    },
    {
      id: 'api',
      label: 'API Settings',
      fields: [
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text' },
        { name: 'categoryFilter', label: 'Category Filter', type: 'text' }
      ]
    }
  ]
})

/**
 * PACKAGES/TOURS WIDGET (Travel Industry Specific)
 */
componentRegistry.register({
  type: 'tour-packages',
  label: 'Tour Packages',
  icon: 'Plane',
  category: 'dynamic',
  description: 'Display travel packages and tours',
  tags: ['tour', 'package', 'travel', 'destination'],

  defaultProps: {
    title: 'Popular Tour Packages',
    subtitle: 'Explore our curated travel experiences',
    layout: 'grid',
    columns: 3,
    packagesPerPage: 6,
    showImage: true,
    showDuration: true,
    showPrice: true,
    showDestination: true,
    showRating: true,
    showBookNow: true,
    bookNowText: 'Book Now',
    imageAspectRatio: '16:9',
    apiEndpoint: '/api/packages',
    destinationFilter: '',
    durationFilter: '', // all | 1-3 | 4-7 | 7+
    priceFilter: '',
    sortBy: 'popular',
    cardStyle: 'elevated'
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    layout: z.enum(['grid', 'list']).optional(),
    columns: z.number().min(1).max(4),
    packagesPerPage: z.number().min(1),
    showImage: z.boolean().optional(),
    showDuration: z.boolean().optional(),
    showPrice: z.boolean().optional(),
    showDestination: z.boolean().optional(),
    showRating: z.boolean().optional(),
    showBookNow: z.boolean().optional(),
    bookNowText: z.string().optional(),
    imageAspectRatio: z.string().optional(),
    apiEndpoint: z.string(),
    destinationFilter: z.string().optional(),
    durationFilter: z.string().optional(),
    priceFilter: z.string().optional(),
    sortBy: z.string().optional(),
    cardStyle: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' }
      ]
    },
    {
      id: 'layout',
      label: 'Layout',
      fields: [
        {
          name: 'columns',
          label: 'Columns',
          type: 'select',
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 }
          ]
        },
        { name: 'packagesPerPage', label: 'Packages Per Page', type: 'number' }
      ]
    },
    {
      id: 'filters',
      label: 'Filters',
      fields: [
        { name: 'destinationFilter', label: 'Destination Filter', type: 'text' },
        { name: 'durationFilter', label: 'Duration Filter', type: 'text' },
        { name: 'priceFilter', label: 'Price Filter', type: 'text' },
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text' }
      ]
    }
  ]
})

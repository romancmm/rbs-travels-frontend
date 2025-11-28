/**
 * Content Display Widgets - Blog, Products, Services, Packages, etc.
 */

import { z } from 'zod'
import { componentRegistry } from '../component-registry'

/**
 * BLOG/ARTICLES GRID WIDGET
 */
componentRegistry.register({
  type: 'blog-grid',
  label: 'Blog Grid',
  icon: 'Newspaper',
  category: 'dynamic',
  description: 'Display blog posts in grid layout',
  tags: ['blog', 'articles', 'posts', 'news', 'grid'],

  defaultProps: {
    title: 'Latest Blog Posts',
    subtitle: 'Read our latest articles and insights',
    showTitle: true,
    layout: 'grid', // grid | list | masonry
    columns: 3, // 2 | 3 | 4
    postsPerPage: 6,
    showFeaturedImage: true,
    showExcerpt: true,
    showAuthor: true,
    showDate: true,
    showCategory: true,
    showReadMore: true,
    readMoreText: 'Read More',
    imageAspectRatio: '16:9', // 16:9 | 4:3 | 1:1 | 3:2
    excerptLength: 150,
    apiEndpoint: '/api/blog',
    categoryFilter: '', // empty = all, or specific category slug
    sortBy: 'date-desc', // date-desc | date-asc | title | views
    enablePagination: true,
    enableLoadMore: false,
    cardStyle: 'default', // default | minimal | bordered | elevated
    hoverEffect: 'lift' // none | lift | zoom
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    showTitle: z.boolean().optional(),
    layout: z.enum(['grid', 'list', 'masonry']).optional(),
    columns: z.number().min(1).max(4).optional(),
    postsPerPage: z.number().min(1),
    showFeaturedImage: z.boolean().optional(),
    showExcerpt: z.boolean().optional(),
    showAuthor: z.boolean().optional(),
    showDate: z.boolean().optional(),
    showCategory: z.boolean().optional(),
    showReadMore: z.boolean().optional(),
    readMoreText: z.string().optional(),
    imageAspectRatio: z.string().optional(),
    excerptLength: z.number().optional(),
    apiEndpoint: z.string(),
    categoryFilter: z.string().optional(),
    sortBy: z.string().optional(),
    enablePagination: z.boolean().optional(),
    enableLoadMore: z.boolean().optional(),
    cardStyle: z.string().optional(),
    hoverEffect: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'showTitle', label: 'Show Title', type: 'toggle' }
      ]
    },
    {
      id: 'layout',
      label: 'Layout',
      fields: [
        {
          name: 'layout',
          label: 'Layout Style',
          type: 'select',
          options: [
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' },
            { label: 'Masonry', value: 'masonry' }
          ]
        },
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
        }
      ]
    },
    {
      id: 'display',
      label: 'Display Options',
      fields: [
        { name: 'showFeaturedImage', label: 'Show Featured Image', type: 'toggle' },
        { name: 'showExcerpt', label: 'Show Excerpt', type: 'toggle' },
        { name: 'showAuthor', label: 'Show Author', type: 'toggle' },
        { name: 'showDate', label: 'Show Date', type: 'toggle' },
        { name: 'showCategory', label: 'Show Category', type: 'toggle' },
        { name: 'showReadMore', label: 'Show Read More', type: 'toggle' }
      ]
    },
    {
      id: 'query',
      label: 'Query Settings',
      fields: [
        { name: 'postsPerPage', label: 'Posts Per Page', type: 'number' },
        { name: 'categoryFilter', label: 'Category Filter', type: 'text' },
        {
          name: 'sortBy',
          label: 'Sort By',
          type: 'select',
          options: [
            { label: 'Newest First', value: 'date-desc' },
            { label: 'Oldest First', value: 'date-asc' },
            { label: 'Title (A-Z)', value: 'title' },
            { label: 'Most Viewed', value: 'views' }
          ]
        },
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text' }
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
    categoryFilter: ''
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
    categoryFilter: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'postsToShow', label: 'Number of Posts', type: 'number' }
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
    }
  ]
})

/**
 * PRODUCTS/SERVICES GRID WIDGET
 */
componentRegistry.register({
  type: 'product-grid',
  label: 'Product Grid',
  icon: 'ShoppingBag',
  category: 'dynamic',
  description: 'Display products/services in grid',
  tags: ['product', 'service', 'shop', 'ecommerce', 'grid'],

  defaultProps: {
    title: 'Our Products',
    subtitle: 'Browse our collection',
    contentType: 'products', // products | services | packages
    layout: 'grid',
    columns: 3,
    itemsPerPage: 9,
    showImage: true,
    showTitle: true,
    showPrice: true,
    showDescription: true,
    showRating: true,
    showAddToCart: true,
    addToCartText: 'Add to Cart',
    imageAspectRatio: '1:1',
    apiEndpoint: '/api/products',
    categoryFilter: '',
    priceFilter: '', // all | 0-100 | 100-500 | 500+
    sortBy: 'featured',
    cardStyle: 'default',
    hoverEffect: 'lift'
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    contentType: z.enum(['products', 'services', 'packages']),
    layout: z.enum(['grid', 'list']).optional(),
    columns: z.number().min(1).max(4),
    itemsPerPage: z.number().min(1),
    showImage: z.boolean().optional(),
    showTitle: z.boolean().optional(),
    showPrice: z.boolean().optional(),
    showDescription: z.boolean().optional(),
    showRating: z.boolean().optional(),
    showAddToCart: z.boolean().optional(),
    addToCartText: z.string().optional(),
    imageAspectRatio: z.string().optional(),
    apiEndpoint: z.string(),
    categoryFilter: z.string().optional(),
    priceFilter: z.string().optional(),
    sortBy: z.string().optional(),
    cardStyle: z.string().optional(),
    hoverEffect: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        {
          name: 'contentType',
          label: 'Content Type',
          type: 'select',
          options: [
            { label: 'Products', value: 'products' },
            { label: 'Services', value: 'services' },
            { label: 'Packages', value: 'packages' }
          ]
        }
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
        { name: 'itemsPerPage', label: 'Items Per Page', type: 'number' }
      ]
    },
    {
      id: 'display',
      label: 'Display Options',
      fields: [
        { name: 'showImage', label: 'Show Image', type: 'toggle' },
        { name: 'showTitle', label: 'Show Title', type: 'toggle' },
        { name: 'showPrice', label: 'Show Price', type: 'toggle' },
        { name: 'showDescription', label: 'Show Description', type: 'toggle' },
        { name: 'showRating', label: 'Show Rating', type: 'toggle' },
        { name: 'showAddToCart', label: 'Show Add to Cart', type: 'toggle' }
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

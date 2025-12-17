/**
 * Interactive Widgets - Testimonials, FAQ, Stats, Gallery, Map, etc.
 */

import { z } from 'zod'
import { componentRegistry } from '../component-registry'

/**
 * TESTIMONIALS WIDGET
 */
componentRegistry.register({
  type: 'testimonials',
  label: 'Testimonials',
  icon: 'MessageSquareQuote',
  category: 'dynamic',
  description: 'Customer testimonials and reviews',
  tags: ['testimonial', 'review', 'feedback', 'quote'],

  defaultProps: {
    title: 'What Our Customers Say',
    subtitle: 'Real experiences from real travelers',
    layout: 'grid', // grid | carousel | list | masonry
    columns: 3,
    testimonialsToShow: 6,
    showAvatar: true,
    showName: true,
    showRole: true,
    showRating: true,
    showDate: true,
    showQuoteIcon: true,
    cardStyle: 'default', // default | minimal | bordered | elevated
    avatarStyle: 'circle', // circle | square | rounded
    apiEndpoint: '/api/testimonials',
    autoplay: false,
    autoplayDelay: 5000
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    layout: z.enum(['grid', 'carousel', 'list', 'masonry']).optional(),
    columns: z.number().min(1).max(4),
    testimonialsToShow: z.number().min(1),
    showAvatar: z.boolean().optional(),
    showName: z.boolean().optional(),
    showRole: z.boolean().optional(),
    showRating: z.boolean().optional(),
    showDate: z.boolean().optional(),
    showQuoteIcon: z.boolean().optional(),
    cardStyle: z.string().optional(),
    avatarStyle: z.string().optional(),
    apiEndpoint: z.string(),
    autoplay: z.boolean().optional(),
    autoplayDelay: z.number().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'testimonialsToShow', label: 'Number to Show', type: 'number' }
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
            { label: 'Carousel', value: 'carousel' },
            { label: 'List', value: 'list' },
            { label: 'Masonry', value: 'masonry' }
          ]
        },
        {
          name: 'columns',
          label: 'Columns (Grid)',
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
        { name: 'showAvatar', label: 'Show Avatar', type: 'toggle' },
        { name: 'showName', label: 'Show Name', type: 'toggle' },
        { name: 'showRole', label: 'Show Role/Company', type: 'toggle' },
        { name: 'showRating', label: 'Show Rating', type: 'toggle' },
        { name: 'showDate', label: 'Show Date', type: 'toggle' },
        { name: 'showQuoteIcon', label: 'Show Quote Icon', type: 'toggle' }
      ]
    }
  ]
})

/**
 * FAQ WIDGET
 */
componentRegistry.register({
  type: 'faq',
  label: 'FAQ',
  icon: 'HelpCircle',
  category: 'dynamic',
  description: 'Frequently Asked Questions accordion',
  tags: ['faq', 'questions', 'accordion', 'help'],

  defaultProps: {
    title: 'Frequently Asked Questions',
    subtitle: 'Find answers to common questions',
    layout: 'accordion', // accordion | grid | list
    columns: 2, // for grid layout
    allowMultipleOpen: false,
    defaultOpenIndex: 0,
    showSearchBar: true,
    searchPlaceholder: 'Search questions...',
    apiEndpoint: '/api/faq',
    categoryFilter: '',
    itemsToShow: 10,
    accordionStyle: 'default', // default | bordered | minimal
    iconPosition: 'right' // left | right
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    layout: z.enum(['accordion', 'grid', 'list']).optional(),
    columns: z.number().min(1).max(3).optional(),
    allowMultipleOpen: z.boolean().optional(),
    defaultOpenIndex: z.number().optional(),
    showSearchBar: z.boolean().optional(),
    searchPlaceholder: z.string().optional(),
    apiEndpoint: z.string(),
    categoryFilter: z.string().optional(),
    itemsToShow: z.number().min(1),
    accordionStyle: z.string().optional(),
    iconPosition: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'itemsToShow', label: 'Number of FAQs', type: 'number' }
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
            { label: 'Accordion', value: 'accordion' },
            { label: 'Grid', value: 'grid' },
            { label: 'List', value: 'list' }
          ]
        },
        {
          name: 'accordionStyle',
          label: 'Accordion Style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Bordered', value: 'bordered' },
            { label: 'Minimal', value: 'minimal' }
          ]
        },
        { name: 'allowMultipleOpen', label: 'Allow Multiple Open', type: 'toggle' },
        { name: 'showSearchBar', label: 'Show Search Bar', type: 'toggle' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        { name: 'apiEndpoint', label: 'API Endpoint', type: 'text' },
        { name: 'categoryFilter', label: 'Category Filter', type: 'text' }
      ]
    }
  ]
})

/**
 * STATS/COUNTER WIDGET
 */
componentRegistry.register({
  type: 'stats',
  label: 'Stats Counter',
  icon: 'BarChart3',
  category: 'dynamic',
  description: 'Animated statistics and counters',
  tags: ['stats', 'counter', 'numbers', 'metrics', 'achievements'],

  defaultProps: {
    title: 'Our Achievements',
    subtitle: 'Numbers that speak for themselves',
    layout: 'grid', // grid | row | vertical
    columns: 4,
    stats: [
      { label: 'Happy Customers', value: 5000, suffix: '+', prefix: '', icon: 'Users' },
      { label: 'Countries Covered', value: 50, suffix: '+', prefix: '', icon: 'Globe' },
      { label: 'Tour Packages', value: 200, suffix: '+', prefix: '', icon: 'MapPin' },
      { label: 'Years Experience', value: 15, suffix: '+', prefix: '', icon: 'Award' }
    ],
    animateOnScroll: true,
    animationDuration: 2000,
    showIcons: true,
    iconPosition: 'top', // top | left | right
    cardStyle: 'default', // default | minimal | bordered | elevated
    numberColor: 'primary',
    numberSize: 'large' // small | medium | large | xlarge
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    layout: z.enum(['grid', 'row', 'vertical']).optional(),
    columns: z.number().min(1).max(6),
    stats: z.array(
      z.object({
        label: z.string(),
        value: z.number(),
        suffix: z.string().optional(),
        prefix: z.string().optional(),
        icon: z.string().optional()
      })
    ),
    animateOnScroll: z.boolean().optional(),
    animationDuration: z.number().optional(),
    showIcons: z.boolean().optional(),
    iconPosition: z.string().optional(),
    cardStyle: z.string().optional(),
    numberColor: z.string().optional(),
    numberSize: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'stats', label: 'Statistics Items', type: 'repeater' }
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
            { label: 'Row', value: 'row' },
            { label: 'Vertical', value: 'vertical' }
          ]
        },
        {
          name: 'columns',
          label: 'Columns',
          type: 'select',
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
            { label: '5 Columns', value: 5 },
            { label: '6 Columns', value: 6 }
          ]
        }
      ]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        { name: 'showIcons', label: 'Show Icons', type: 'toggle' },
        { name: 'animateOnScroll', label: 'Animate on Scroll', type: 'toggle' },
        { name: 'animationDuration', label: 'Animation Duration (ms)', type: 'number' }
      ]
    }
  ]
})

/**
 * PHOTO GALLERY WIDGET
 */
componentRegistry.register({
  type: 'gallery',
  label: 'Photo Gallery',
  icon: 'Images',
  category: 'media',
  description: 'Image gallery with lightbox',
  tags: ['gallery', 'photos', 'images', 'portfolio', 'lightbox'],

  defaultProps: {
    title: 'Photo Gallery',
    subtitle: 'Browse our collection',
    layout: 'grid', // grid | masonry | justified
    columns: 4,
    gap: 'medium', // small | medium | large
    aspectRatio: '1:1', // 1:1 | 16:9 | 4:3 | 3:2 | auto
    hoverEffect: 'zoom', // zoom | fade | lift | none
    enableLightbox: true,
    enableCaptions: true,
    enableFilter: false,
    filterCategories: [],
    imagesPerPage: 12,
    enableLoadMore: true,
    loadMoreText: 'Load More',
    apiEndpoint: '/api/gallery',
    categoryFilter: ''
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    layout: z.enum(['grid', 'masonry', 'justified']).optional(),
    columns: z.number().min(1).max(6),
    gap: z.enum(['small', 'medium', 'large']).optional(),
    aspectRatio: z.string().optional(),
    hoverEffect: z.string().optional(),
    enableLightbox: z.boolean().optional(),
    enableCaptions: z.boolean().optional(),
    enableFilter: z.boolean().optional(),
    filterCategories: z.array(z.string()).optional(),
    imagesPerPage: z.number().min(1),
    enableLoadMore: z.boolean().optional(),
    loadMoreText: z.string().optional(),
    apiEndpoint: z.string(),
    categoryFilter: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'imagesPerPage', label: 'Images Per Page', type: 'number' }
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
            { label: 'Masonry', value: 'masonry' },
            { label: 'Justified', value: 'justified' }
          ]
        },
        {
          name: 'columns',
          label: 'Columns',
          type: 'select',
          options: [
            { label: '2 Columns', value: 2 },
            { label: '3 Columns', value: 3 },
            { label: '4 Columns', value: 4 },
            { label: '5 Columns', value: 5 },
            { label: '6 Columns', value: 6 }
          ]
        },
        {
          name: 'gap',
          label: 'Gap Size',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]
        }
      ]
    },
    {
      id: 'features',
      label: 'Features',
      fields: [
        { name: 'enableLightbox', label: 'Enable Lightbox', type: 'toggle' },
        { name: 'enableCaptions', label: 'Show Captions', type: 'toggle' },
        { name: 'enableFilter', label: 'Enable Category Filter', type: 'toggle' },
        { name: 'enableLoadMore', label: 'Enable Load More', type: 'toggle' }
      ]
    }
  ]
})

/**
 * GOOGLE MAP WIDGET
 */
componentRegistry.register({
  type: 'map',
  label: 'Google Map',
  icon: 'Map',
  category: 'media',
  description: 'Embedded Google Map with markers',
  tags: ['map', 'location', 'google', 'directions', 'address'],

  defaultProps: {
    latitude: 40.7128,
    longitude: -74.006,
    zoom: 12,
    mapType: 'roadmap', // roadmap | satellite | hybrid | terrain
    height: '400px',
    showMarker: true,
    markerTitle: 'Our Location',
    markerDescription: '',
    enableZoom: true,
    enableStreetView: true,
    enableFullscreen: true,
    style: 'default', // default | silver | dark | retro | night
    apiKey: '' // Will be set in env
  },

  propsSchema: z.object({
    latitude: z.number(),
    longitude: z.number(),
    zoom: z.number().min(1).max(20),
    mapType: z.enum(['roadmap', 'satellite', 'hybrid', 'terrain']).optional(),
    height: z.string(),
    showMarker: z.boolean().optional(),
    markerTitle: z.string().optional(),
    markerDescription: z.string().optional(),
    enableZoom: z.boolean().optional(),
    enableStreetView: z.boolean().optional(),
    enableFullscreen: z.boolean().optional(),
    style: z.string().optional(),
    apiKey: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'location',
      label: 'Location',
      fields: [
        { name: 'latitude', label: 'Latitude', type: 'number', required: true },
        { name: 'longitude', label: 'Longitude', type: 'number', required: true },
        { name: 'zoom', label: 'Zoom Level', type: 'number' },
        { name: 'markerTitle', label: 'Marker Title', type: 'text' }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        {
          name: 'mapType',
          label: 'Map Type',
          type: 'select',
          options: [
            { label: 'Roadmap', value: 'roadmap' },
            { label: 'Satellite', value: 'satellite' },
            { label: 'Hybrid', value: 'hybrid' },
            { label: 'Terrain', value: 'terrain' }
          ]
        },
        { name: 'height', label: 'Height', type: 'text' },
        { name: 'showMarker', label: 'Show Marker', type: 'toggle' },
        { name: 'enableZoom', label: 'Enable Zoom', type: 'toggle' },
        { name: 'enableStreetView', label: 'Enable Street View', type: 'toggle' }
      ]
    }
  ]
})

/**
 * COUNTDOWN TIMER WIDGET
 */
componentRegistry.register({
  type: 'countdown',
  label: 'Countdown Timer',
  icon: 'Clock',
  category: 'advanced',
  description: 'Countdown timer for events/offers',
  tags: ['countdown', 'timer', 'deadline', 'event'],

  defaultProps: {
    title: 'Limited Time Offer',
    subtitle: 'Hurry up! Deal ends in:',
    targetDate: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // 7 days from now
    showDays: true,
    showHours: true,
    showMinutes: true,
    showSeconds: true,
    layout: 'horizontal', // horizontal | vertical | compact
    size: 'large', // small | medium | large
    displayStyle: 'boxes', // boxes | circles | minimal
    expiredMessage: 'This offer has ended',
    redirectOnExpire: false,
    redirectUrl: ''
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    targetDate: z.string(),
    showDays: z.boolean().optional(),
    showHours: z.boolean().optional(),
    showMinutes: z.boolean().optional(),
    showSeconds: z.boolean().optional(),
    layout: z.enum(['horizontal', 'vertical', 'compact']).optional(),
    size: z.enum(['small', 'medium', 'large']).optional(),
    displayStyle: z.string().optional(),
    expiredMessage: z.string().optional(),
    redirectOnExpire: z.boolean().optional(),
    redirectUrl: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'targetDate', label: 'Target Date & Time', type: 'datetime', required: true },
        { name: 'expiredMessage', label: 'Expired Message', type: 'text' }
      ]
    },
    {
      id: 'display',
      label: 'Display',
      fields: [
        { name: 'showDays', label: 'Show Days', type: 'toggle' },
        { name: 'showHours', label: 'Show Hours', type: 'toggle' },
        { name: 'showMinutes', label: 'Show Minutes', type: 'toggle' },
        { name: 'showSeconds', label: 'Show Seconds', type: 'toggle' }
      ]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'layout',
          label: 'Layout',
          type: 'select',
          options: [
            { label: 'Horizontal', value: 'horizontal' },
            { label: 'Vertical', value: 'vertical' },
            { label: 'Compact', value: 'compact' }
          ]
        },
        {
          name: 'size',
          label: 'Size',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' }
          ]
        }
      ]
    }
  ]
})

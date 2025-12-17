/**
 * Social & Integration Widgets
 */

import { z } from 'zod'
import { componentRegistry } from '../component-registry'

/**
 * SOCIAL SHARE WIDGET
 */
componentRegistry.register({
  type: 'social-share',
  label: 'Social Share',
  icon: 'Share2',
  category: 'advanced',
  description: 'Social media share buttons',
  tags: ['social', 'share', 'facebook', 'twitter', 'linkedin'],

  defaultProps: {
    title: 'Share This',
    platforms: ['facebook', 'twitter', 'linkedin', 'whatsapp', 'email'],
    layout: 'horizontal', // horizontal | vertical | floating
    style: 'icons', // icons | buttons | labels
    size: 'medium', // small | medium | large
    shape: 'rounded', // circle | rounded | square
    showLabels: false,
    showCounts: false,
    position: 'left' // left | right | center (for floating)
  },

  propsSchema: z.object({
    title: z.string().optional(),
    platforms: z.array(z.string()),
    layout: z.enum(['horizontal', 'vertical', 'floating']).optional(),
    style: z.enum(['icons', 'buttons', 'labels']).optional(),
    size: z.enum(['small', 'medium', 'large']).optional(),
    shape: z.enum(['circle', 'rounded', 'square']).optional(),
    showLabels: z.boolean().optional(),
    showCounts: z.boolean().optional(),
    position: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Title', type: 'text' },
        {
          name: 'platforms',
          label: 'Platforms',
          type: 'multi-select',
          options: [
            { label: 'Facebook', value: 'facebook' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'LinkedIn', value: 'linkedin' },
            { label: 'WhatsApp', value: 'whatsapp' },
            { label: 'Email', value: 'email' },
            { label: 'Pinterest', value: 'pinterest' }
          ]
        }
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
            { label: 'Floating', value: 'floating' }
          ]
        },
        { name: 'showLabels', label: 'Show Labels', type: 'toggle' },
        { name: 'showCounts', label: 'Show Share Counts', type: 'toggle' }
      ]
    }
  ]
})

/**
 * SOCIAL FEED WIDGET
 */
componentRegistry.register({
  type: 'social-feed',
  label: 'Social Feed',
  icon: 'Rss',
  category: 'advanced',
  description: 'Display social media posts',
  tags: ['social', 'feed', 'instagram', 'twitter', 'posts'],

  defaultProps: {
    title: 'Follow Us',
    platform: 'instagram', // instagram | twitter | facebook
    username: '',
    postsToShow: 6,
    layout: 'grid', // grid | carousel | list
    columns: 3,
    showCaption: true,
    showLikes: true,
    showComments: true,
    showDate: true,
    apiEndpoint: '/api/social-feed',
    cacheTime: 3600 // seconds
  },

  propsSchema: z.object({
    title: z.string().optional(),
    platform: z.enum(['instagram', 'twitter', 'facebook']),
    username: z.string(),
    postsToShow: z.number().min(1).max(20),
    layout: z.enum(['grid', 'carousel', 'list']).optional(),
    columns: z.number().min(1).max(6).optional(),
    showCaption: z.boolean().optional(),
    showLikes: z.boolean().optional(),
    showComments: z.boolean().optional(),
    showDate: z.boolean().optional(),
    apiEndpoint: z.string(),
    cacheTime: z.number().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        {
          name: 'platform',
          label: 'Platform',
          type: 'select',
          options: [
            { label: 'Instagram', value: 'instagram' },
            { label: 'Twitter', value: 'twitter' },
            { label: 'Facebook', value: 'facebook' }
          ]
        },
        { name: 'username', label: 'Username/Handle', type: 'text', required: true },
        { name: 'postsToShow', label: 'Posts to Show', type: 'number' }
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
            { label: 'List', value: 'list' }
          ]
        },
        { name: 'columns', label: 'Columns', type: 'number' }
      ]
    }
  ]
})

/**
 * PRICING TABLE WIDGET
 */
componentRegistry.register({
  type: 'pricing',
  label: 'Pricing Table',
  icon: 'DollarSign',
  category: 'advanced',
  description: 'Pricing plans comparison table',
  tags: ['pricing', 'plans', 'packages', 'subscription'],

  defaultProps: {
    title: 'Choose Your Plan',
    subtitle: 'Select the perfect plan for your needs',
    columns: 3,
    layout: 'cards', // cards | table
    plans: [
      {
        name: 'Basic',
        price: 29,
        currency: '$',
        period: 'month',
        description: 'Perfect for individuals',
        features: ['Feature 1', 'Feature 2', 'Feature 3'],
        buttonText: 'Get Started',
        buttonUrl: '/signup',
        highlighted: false
      },
      {
        name: 'Pro',
        price: 59,
        currency: '$',
        period: 'month',
        description: 'Best for professionals',
        features: ['All Basic features', 'Feature 4', 'Feature 5', 'Feature 6'],
        buttonText: 'Get Started',
        buttonUrl: '/signup',
        highlighted: true
      },
      {
        name: 'Enterprise',
        price: 99,
        currency: '$',
        period: 'month',
        description: 'For large teams',
        features: ['All Pro features', 'Feature 7', 'Feature 8', 'Feature 9'],
        buttonText: 'Contact Sales',
        buttonUrl: '/contact',
        highlighted: false
      }
    ],
    showToggle: false, // monthly/yearly toggle
    highlightPopular: true,
    cardStyle: 'elevated'
  },

  propsSchema: z.object({
    title: z.string().optional(),
    subtitle: z.string().optional(),
    columns: z.number().min(1).max(4),
    layout: z.enum(['cards', 'table']).optional(),
    plans: z.array(
      z.object({
        name: z.string(),
        price: z.number(),
        currency: z.string(),
        period: z.string(),
        description: z.string().optional(),
        features: z.array(z.string()),
        buttonText: z.string(),
        buttonUrl: z.string(),
        highlighted: z.boolean().optional()
      })
    ),
    showToggle: z.boolean().optional(),
    highlightPopular: z.boolean().optional(),
    cardStyle: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        { name: 'title', label: 'Widget Title', type: 'text' },
        { name: 'subtitle', label: 'Subtitle', type: 'text' },
        { name: 'plans', label: 'Pricing Plans', type: 'repeater' }
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
            { label: 'Cards', value: 'cards' },
            { label: 'Table', value: 'table' }
          ]
        },
        { name: 'columns', label: 'Columns', type: 'number' },
        { name: 'highlightPopular', label: 'Highlight Popular Plan', type: 'toggle' }
      ]
    }
  ]
})

/**
 * ICON BOX WIDGET
 */
componentRegistry.register({
  type: 'icon-box',
  label: 'Icon Box',
  icon: 'Box',
  category: 'basic',
  description: 'Icon with title and description',
  tags: ['icon', 'feature', 'service', 'box'],

  defaultProps: {
    icon: 'Star',
    iconType: 'icon', // icon | image
    iconSize: 'large',
    iconColor: 'primary',
    iconStyle: 'default', // default | circle | square | outline
    title: 'Feature Title',
    description: 'Feature description goes here',
    link: '',
    linkText: 'Learn More',
    layout: 'vertical', // vertical | horizontal
    alignment: 'center', // left | center | right
    hoverEffect: 'lift' // none | lift | scale
  },

  propsSchema: z.object({
    icon: z.string(),
    iconType: z.enum(['icon', 'image']).optional(),
    iconSize: z.enum(['small', 'medium', 'large', 'xlarge']).optional(),
    iconColor: z.string().optional(),
    iconStyle: z.string().optional(),
    title: z.string(),
    description: z.string(),
    link: z.string().optional(),
    linkText: z.string().optional(),
    layout: z.enum(['vertical', 'horizontal']).optional(),
    alignment: z.enum(['left', 'center', 'right']).optional(),
    hoverEffect: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          name: 'iconType',
          label: 'Icon Type',
          type: 'select',
          options: [
            { label: 'Icon', value: 'icon' },
            { label: 'Image', value: 'image' }
          ]
        },
        { name: 'icon', label: 'Icon', type: 'icon-picker' },
        { name: 'title', label: 'Title', type: 'text', required: true },
        { name: 'description', label: 'Description', type: 'textarea', required: true },
        { name: 'link', label: 'Link URL', type: 'url' },
        { name: 'linkText', label: 'Link Text', type: 'text' }
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
            { label: 'Vertical', value: 'vertical' },
            { label: 'Horizontal', value: 'horizontal' }
          ]
        },
        {
          name: 'alignment',
          label: 'Alignment',
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        {
          name: 'iconSize',
          label: 'Icon Size',
          type: 'select',
          options: [
            { label: 'Small', value: 'small' },
            { label: 'Medium', value: 'medium' },
            { label: 'Large', value: 'large' },
            { label: 'Extra Large', value: 'xlarge' }
          ]
        }
      ]
    }
  ]
})

/**
 * TABS WIDGET
 */
componentRegistry.register({
  type: 'tabs',
  label: 'Tabs',
  icon: 'Folder',
  category: 'layout',
  description: 'Tabbed content sections',
  tags: ['tabs', 'accordion', 'content'],

  defaultProps: {
    tabs: [
      { title: 'Tab 1', content: 'Content for tab 1', icon: '' },
      { title: 'Tab 2', content: 'Content for tab 2', icon: '' },
      { title: 'Tab 3', content: 'Content for tab 3', icon: '' }
    ],
    style: 'default', // default | pills | underline
    alignment: 'left', // left | center | right
    showIcons: false,
    defaultTab: 0
  },

  propsSchema: z.object({
    tabs: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
        icon: z.string().optional()
      })
    ),
    style: z.enum(['default', 'pills', 'underline']).optional(),
    alignment: z.enum(['left', 'center', 'right']).optional(),
    showIcons: z.boolean().optional(),
    defaultTab: z.number().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [{ name: 'tabs', label: 'Tab Items', type: 'repeater' }]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'style',
          label: 'Tab Style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Pills', value: 'pills' },
            { label: 'Underline', value: 'underline' }
          ]
        },
        {
          name: 'alignment',
          label: 'Alignment',
          type: 'select',
          options: [
            { label: 'Left', value: 'left' },
            { label: 'Center', value: 'center' },
            { label: 'Right', value: 'right' }
          ]
        },
        { name: 'showIcons', label: 'Show Icons', type: 'toggle' }
      ]
    }
  ]
})

/**
 * ACCORDION WIDGET
 */
componentRegistry.register({
  type: 'accordion',
  label: 'Accordion',
  icon: 'ChevronDown',
  category: 'layout',
  description: 'Collapsible content sections',
  tags: ['accordion', 'collapse', 'expand'],

  defaultProps: {
    items: [
      { title: 'Item 1', content: 'Content for item 1', icon: '' },
      { title: 'Item 2', content: 'Content for item 2', icon: '' },
      { title: 'Item 3', content: 'Content for item 3', icon: '' }
    ],
    allowMultiple: false,
    defaultOpen: 0,
    style: 'default', // default | bordered | minimal
    showIcons: true,
    iconPosition: 'right' // left | right
  },

  propsSchema: z.object({
    items: z.array(
      z.object({
        title: z.string(),
        content: z.string(),
        icon: z.string().optional()
      })
    ),
    allowMultiple: z.boolean().optional(),
    defaultOpen: z.number().optional(),
    style: z.enum(['default', 'bordered', 'minimal']).optional(),
    showIcons: z.boolean().optional(),
    iconPosition: z.enum(['left', 'right']).optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [{ name: 'items', label: 'Accordion Items', type: 'repeater' }]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        { name: 'allowMultiple', label: 'Allow Multiple Open', type: 'toggle' },
        { name: 'defaultOpen', label: 'Default Open Index', type: 'number' },
        {
          name: 'style',
          label: 'Style',
          type: 'select',
          options: [
            { label: 'Default', value: 'default' },
            { label: 'Bordered', value: 'bordered' },
            { label: 'Minimal', value: 'minimal' }
          ]
        }
      ]
    }
  ]
})

/**
 * Component Registry
 * Central registry for all page builder components
 * Factory pattern for component creation and management
 */

import type { ComponentDefinition, ComponentType } from '@/types/page-builder'
import { z } from 'zod'

/**
 * Component Registry Class
 */
class ComponentRegistry {
  private components: Map<ComponentType, ComponentDefinition> = new Map()

  /**
   * Register a component
   */
  register(definition: ComponentDefinition): void {
    this.components.set(definition.type, definition)
  }

  /**
   * Get component definition
   */
  get(type: ComponentType): ComponentDefinition | undefined {
    return this.components.get(type)
  }

  /**
   * Get all components
   */
  getAll(): ComponentDefinition[] {
    return Array.from(this.components.values())
  }

  /**
   * Get components by category
   */
  getByCategory(category: string): ComponentDefinition[] {
    return this.getAll().filter((comp) => comp.category === category)
  }

  /**
   * Search components
   */
  search(query: string): ComponentDefinition[] {
    const lowerQuery = query.toLowerCase()
    return this.getAll().filter(
      (comp) =>
        comp.label.toLowerCase().includes(lowerQuery) ||
        comp.description.toLowerCase().includes(lowerQuery) ||
        comp.tags?.some((tag) => tag.toLowerCase().includes(lowerQuery))
    )
  }

  /**
   * Create component instance with default props
   */
  createInstance(type: ComponentType, id: string) {
    const definition = this.get(type)
    if (!definition) {
      throw new Error(`Component type "${type}" not found in registry`)
    }

    return {
      id,
      type,
      order: 0,
      props: { ...definition.defaultProps },
      settings: {} // Initialize empty settings object
    }
  }

  /**
   * Validate component props
   */
  validateProps(type: ComponentType, props: any): boolean {
    const definition = this.get(type)
    if (!definition) return false

    try {
      definition.propsSchema.parse(props)
      return true
    } catch {
      return false
    }
  }
}

// Create singleton instance
export const componentRegistry = new ComponentRegistry()

// ==================== COMPONENT DEFINITIONS ====================

/**
 * HEADING COMPONENT
 */
componentRegistry.register({
  type: 'heading',
  label: 'Heading',
  icon: 'Type',
  category: 'basic',
  description: 'H1-H6 heading text',
  tags: ['text', 'title', 'h1', 'h2', 'h3'],

  defaultProps: {
    text: 'Heading Text',
    level: 'h2',
    align: 'left',
    color: '#000000',
    fontSize: '32px',
    fontWeight: '700',
    lineHeight: '1.2'
  },

  propsSchema: z.object({
    text: z.string().min(1),
    level: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6']),
    align: z.enum(['left', 'center', 'right', 'justify']).optional(),
    color: z.string().optional(),
    fontSize: z.string().optional(),
    fontWeight: z.string().optional(),
    lineHeight: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          name: 'text',
          label: 'Heading Text',
          type: 'text',
          required: true
        },
        {
          name: 'level',
          label: 'Heading Level',
          type: 'select',
          options: [
            { label: 'H1', value: 'h1' },
            { label: 'H2', value: 'h2' },
            { label: 'H3', value: 'h3' },
            { label: 'H4', value: 'h4' },
            { label: 'H5', value: 'h5' },
            { label: 'H6', value: 'h6' }
          ]
        }
      ]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'align',
          label: 'Alignment',
          type: 'alignment'
        },
        {
          name: 'color',
          label: 'Text Color',
          type: 'color'
        },
        {
          name: 'fontSize',
          label: 'Font Size',
          type: 'text',
          placeholder: 'e.g., 32px, 2rem'
        },
        {
          name: 'fontWeight',
          label: 'Font Weight',
          type: 'select',
          options: [
            { label: 'Normal', value: '400' },
            { label: 'Medium', value: '500' },
            { label: 'Semi Bold', value: '600' },
            { label: 'Bold', value: '700' },
            { label: 'Extra Bold', value: '800' }
          ]
        }
      ]
    }
  ]
})

/**
 * TEXT/PARAGRAPH COMPONENT
 */
componentRegistry.register({
  type: 'text',
  label: 'Text',
  icon: 'AlignLeft',
  category: 'basic',
  description: 'Paragraph text content',
  tags: ['text', 'paragraph', 'content'],

  defaultProps: {
    text: 'Enter your text here...',
    align: 'left',
    color: '#333333',
    fontSize: '16px',
    lineHeight: '1.6'
  },

  propsSchema: z.object({
    text: z.string(),
    align: z.enum(['left', 'center', 'right', 'justify']).optional(),
    color: z.string().optional(),
    fontSize: z.string().optional(),
    lineHeight: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          name: 'text',
          label: 'Text Content',
          type: 'textarea',
          required: true
        }
      ]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'align',
          label: 'Alignment',
          type: 'alignment'
        },
        {
          name: 'color',
          label: 'Text Color',
          type: 'color'
        },
        {
          name: 'fontSize',
          label: 'Font Size',
          type: 'text'
        }
      ]
    }
  ]
})

/**
 * BUTTON COMPONENT
 */
componentRegistry.register({
  type: 'button',
  label: 'Button',
  icon: 'MousePointerClick',
  category: 'basic',
  description: 'Call-to-action button',
  tags: ['button', 'cta', 'link'],

  defaultProps: {
    text: 'Click Me',
    url: '#',
    variant: 'primary',
    size: 'medium',
    fullWidth: false,
    openInNewTab: false,
    align: 'left'
  },

  propsSchema: z.object({
    text: z.string().min(1),
    url: z
      .string()
      .url()
      .or(z.string().startsWith('#').or(z.string().startsWith('/'))),
    variant: z.enum(['primary', 'secondary', 'outline', 'ghost', 'link']).optional(),
    size: z.enum(['small', 'medium', 'large']).optional(),
    fullWidth: z.boolean().optional(),
    openInNewTab: z.boolean().optional(),
    align: z.enum(['left', 'center', 'right']).optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          name: 'text',
          label: 'Button Text',
          type: 'text',
          required: true
        },
        {
          name: 'url',
          label: 'Link URL',
          type: 'url',
          required: true,
          placeholder: 'https://example.com'
        },
        {
          name: 'openInNewTab',
          label: 'Open in New Tab',
          type: 'toggle'
        }
      ]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'variant',
          label: 'Button Style',
          type: 'select',
          options: [
            { label: 'Primary', value: 'primary' },
            { label: 'Secondary', value: 'secondary' },
            { label: 'Outline', value: 'outline' },
            { label: 'Ghost', value: 'ghost' },
            { label: 'Link', value: 'link' }
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
        },
        {
          name: 'fullWidth',
          label: 'Full Width',
          type: 'toggle'
        },
        {
          name: 'align',
          label: 'Alignment',
          type: 'alignment'
        }
      ]
    }
  ]
})

/**
 * IMAGE COMPONENT
 */
componentRegistry.register({
  type: 'image',
  label: 'Image',
  icon: 'ImageIcon',
  category: 'media',
  description: 'Single image with options',
  tags: ['image', 'picture', 'photo'],

  defaultProps: {
    src: '/placeholder-image.jpg',
    alt: 'Image description',
    width: '100%',
    height: 'auto',
    objectFit: 'cover',
    align: 'center',
    link: '',
    openInNewTab: false,
    lazyLoad: true
  },

  propsSchema: z.object({
    src: z.string().url().or(z.string().startsWith('/')),
    alt: z.string(),
    width: z.string().optional(),
    height: z.string().optional(),
    objectFit: z.enum(['cover', 'contain', 'fill', 'none', 'scale-down']).optional(),
    align: z.enum(['left', 'center', 'right']).optional(),
    link: z.string().optional(),
    openInNewTab: z.boolean().optional(),
    lazyLoad: z.boolean().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          name: 'src',
          label: 'Image Source',
          type: 'image-upload',
          required: true
        },
        {
          name: 'alt',
          label: 'Alt Text',
          type: 'text',
          description: 'Describe the image for accessibility',
          required: true
        },
        {
          name: 'link',
          label: 'Link URL',
          type: 'url',
          placeholder: 'Optional link when clicked'
        }
      ]
    },
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'width',
          label: 'Width',
          type: 'text',
          placeholder: 'e.g., 100%, 500px'
        },
        {
          name: 'height',
          label: 'Height',
          type: 'text',
          placeholder: 'e.g., auto, 300px'
        },
        {
          name: 'objectFit',
          label: 'Object Fit',
          type: 'select',
          options: [
            { label: 'Cover', value: 'cover' },
            { label: 'Contain', value: 'contain' },
            { label: 'Fill', value: 'fill' },
            { label: 'None', value: 'none' }
          ]
        },
        {
          name: 'align',
          label: 'Alignment',
          type: 'alignment'
        }
      ]
    }
  ]
})

/**
 * SPACER COMPONENT
 */
componentRegistry.register({
  type: 'spacer',
  label: 'Spacer',
  icon: 'Square',
  category: 'basic',
  description: 'Vertical spacing',
  tags: ['space', 'gap', 'margin'],

  defaultProps: {
    height: '40px'
  },

  propsSchema: z.object({
    height: z.string()
  }),

  propertyPanels: [
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'height',
          label: 'Height',
          type: 'text',
          placeholder: 'e.g., 40px, 2rem',
          required: true
        }
      ]
    }
  ]
})

/**
 * DIVIDER COMPONENT
 */
componentRegistry.register({
  type: 'divider',
  label: 'Divider',
  icon: 'Minus',
  category: 'basic',
  description: 'Horizontal line separator',
  tags: ['divider', 'line', 'separator', 'hr'],

  defaultProps: {
    width: '100%',
    height: '1px',
    color: '#e5e7eb',
    style: 'solid',
    align: 'center'
  },

  propsSchema: z.object({
    width: z.string().optional(),
    height: z.string().optional(),
    color: z.string().optional(),
    style: z.enum(['solid', 'dashed', 'dotted']).optional(),
    align: z.enum(['left', 'center', 'right']).optional()
  }),

  propertyPanels: [
    {
      id: 'style',
      label: 'Style',
      fields: [
        {
          name: 'width',
          label: 'Width',
          type: 'text',
          placeholder: 'e.g., 100%, 300px'
        },
        {
          name: 'height',
          label: 'Thickness',
          type: 'text',
          placeholder: 'e.g., 1px, 2px'
        },
        {
          name: 'color',
          label: 'Color',
          type: 'color'
        },
        {
          name: 'style',
          label: 'Line Style',
          type: 'select',
          options: [
            { label: 'Solid', value: 'solid' },
            { label: 'Dashed', value: 'dashed' },
            { label: 'Dotted', value: 'dotted' }
          ]
        },
        {
          name: 'align',
          label: 'Alignment',
          type: 'alignment'
        }
      ]
    }
  ]
})

/**
 * VIDEO COMPONENT
 */
componentRegistry.register({
  type: 'video',
  label: 'Video',
  icon: 'Video',
  category: 'media',
  description: 'Embed videos from YouTube, Vimeo, or upload',
  tags: ['video', 'youtube', 'vimeo', 'embed'],

  defaultProps: {
    url: '',
    type: 'youtube',
    autoplay: false,
    controls: true,
    loop: false,
    muted: false,
    aspectRatio: '16:9'
  },

  propsSchema: z.object({
    url: z.string().url(),
    type: z.enum(['youtube', 'vimeo', 'upload']).optional(),
    autoplay: z.boolean().optional(),
    controls: z.boolean().optional(),
    loop: z.boolean().optional(),
    muted: z.boolean().optional(),
    aspectRatio: z.string().optional()
  }),

  propertyPanels: [
    {
      id: 'content',
      label: 'Content',
      fields: [
        {
          name: 'url',
          label: 'Video URL',
          type: 'url',
          required: true,
          placeholder: 'https://youtube.com/watch?v=...'
        },
        {
          name: 'type',
          label: 'Video Type',
          type: 'select',
          options: [
            { label: 'YouTube', value: 'youtube' },
            { label: 'Vimeo', value: 'vimeo' },
            { label: 'Upload', value: 'upload' }
          ]
        }
      ]
    },
    {
      id: 'settings',
      label: 'Settings',
      fields: [
        {
          name: 'autoplay',
          label: 'Autoplay',
          type: 'toggle'
        },
        {
          name: 'controls',
          label: 'Show Controls',
          type: 'toggle'
        },
        {
          name: 'loop',
          label: 'Loop',
          type: 'toggle'
        },
        {
          name: 'muted',
          label: 'Muted',
          type: 'toggle'
        }
      ]
    }
  ]
})

// Export component categories for UI
export const COMPONENT_CATEGORIES = [
  { id: 'basic', label: 'Basic', icon: 'Layout' },
  { id: 'media', label: 'Media', icon: 'Image' },
  { id: 'layout', label: 'Layout', icon: 'Grid3x3' },
  { id: 'dynamic', label: 'Dynamic', icon: 'Zap' },
  { id: 'form', label: 'Forms', icon: 'Mail' },
  { id: 'advanced', label: 'Advanced', icon: 'Settings' }
] as const

export default componentRegistry

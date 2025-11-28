/**
 * Page Builder Type Definitions
 * Professional-grade type system for drag-and-drop page builder
 */

import { z } from 'zod'

// ==================== COMPONENT TYPES ====================

/**
 * Component Categories for UI organization
 */
export type ComponentCategory = 'basic' | 'media' | 'layout' | 'dynamic' | 'form' | 'advanced'

/**
 * All available component types
 */
export type ComponentType =
  // Basic Elements
  | 'heading'
  | 'text'
  | 'paragraph'
  | 'button'
  | 'spacer'
  | 'divider'
  | 'icon'
  | 'icon-box'
  // Media Elements
  | 'image'
  | 'video'
  | 'gallery'
  | 'audio'
  | 'map'
  // Layout Elements
  | 'container'
  | 'grid'
  | 'card'
  | 'accordion'
  | 'tabs'
  | 'carousel'
  // Dynamic Content
  | 'blog-grid'
  | 'blog-carousel'
  | 'product-grid'
  | 'tour-packages'
  | 'testimonials'
  | 'team-members'
  | 'pricing-table'
  | 'pricing'
  | 'faq'
  | 'stats'
  // Form Elements
  | 'contact-form'
  | 'newsletter'
  | 'search-bar'
  | 'search'
  // Advanced
  | 'html'
  | 'code'
  | 'countdown'
  | 'social-share'
  | 'social-feed'

/**
 * Base component interface
 */
export interface BaseComponent {
  id: string
  type: ComponentType
  order: number
  props: Record<string, any>
  settings?: ComponentSettings
}

/**
 * Component settings (styling, behavior)
 * All visual styling is configured through className using Tailwind CSS
 */
export interface ComponentSettings {
  // Visibility
  visible?: boolean
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean

  // Animation
  animation?: {
    type?: 'fade' | 'slide' | 'zoom' | 'bounce' | 'none'
    duration?: number
    delay?: number
    easing?: 'linear' | 'ease' | 'ease-in' | 'ease-out' | 'ease-in-out'
  }

  // Styling - Only className (Tailwind CSS utilities)
  className?: string
  customId?: string
}

/**
 * Component definition for registry
 */
export interface ComponentDefinition {
  type: ComponentType
  label: string
  icon: string // Lucide icon name
  category: ComponentCategory
  description: string
  previewImage?: string
  tags?: string[]

  // Default props when component is added
  defaultProps: Record<string, any>

  // Validation schema
  propsSchema: z.ZodSchema

  // Property panel configuration
  propertyPanels: PropertyPanel[]

  // Constraints
  constraints?: {
    allowedParents?: string[]
    allowedChildren?: string[]
    maxInstances?: number
    requiresParent?: boolean
  }
}

/**
 * Property panel configuration
 */
export interface PropertyPanel {
  id: string
  label: string
  icon?: string
  fields: PropertyField[]
}

/**
 * Property field types
 */
export type PropertyFieldType =
  | 'text'
  | 'textarea'
  | 'number'
  | 'color'
  | 'select'
  | 'toggle'
  | 'slider'
  | 'image-upload'
  | 'url'
  | 'rich-text'
  | 'spacing'
  | 'alignment'
  | 'font-picker'
  | 'icon-picker'
  | 'multi-select'
  | 'repeater'
  | 'datetime'

/**
 * Property field configuration
 */
export interface PropertyField {
  name: string
  label: string
  type: PropertyFieldType
  defaultValue?: any
  placeholder?: string
  description?: string
  required?: boolean
  options?: Array<{ label: string; value: any }>
  min?: number
  max?: number
  step?: number
  validation?: z.ZodSchema
}

// ==================== LAYOUT STRUCTURE ====================

/**
 * Column in a row
 */
export interface Column {
  id: string
  width: number // 1-12 (Bootstrap grid)
  order: number
  settings?: ColumnSettings
  components: BaseComponent[]
}

/**
 * Column settings
 * All visual styling is configured through className using Tailwind CSS
 */
export interface ColumnSettings {
  // Layout (minimal, structural only)
  verticalAlign?: 'top' | 'center' | 'bottom' | 'stretch'
  horizontalAlign?: 'left' | 'center' | 'right'

  // Styling - Only className (Tailwind CSS utilities)
  className?: string
}

/**
 * Row containing columns
 */
export interface Row {
  id: string
  order: number
  settings?: RowSettings
  columns: Column[]
}

/**
 * Row settings
 * All visual styling is configured through className using Tailwind CSS
 */
export interface RowSettings {
  // Layout (minimal, structural only)
  columnsGap?: string // Kept for backward compatibility, but should use className gap-*
  alignment?: 'left' | 'center' | 'right'
  reverseOnMobile?: boolean

  // Container
  containerWidth?: 'full' | 'boxed'
  maxWidth?: string

  // Styling - Only className (Tailwind CSS utilities)
  className?: string
}

/**
 * Section containing rows
 */
export interface Section {
  id: string
  name: string
  order: number
  settings?: SectionSettings
  rows: Row[]
}

/**
 * Section settings
 * All visual styling is configured through className using Tailwind CSS
 */
export interface SectionSettings {
  // Layout (minimal, structural only)
  containerWidth?: 'full' | 'boxed'
  maxWidth?: string
  minHeight?: string

  // Effects
  parallax?: boolean
  parallaxSpeed?: number

  // Visibility
  visible?: boolean
  hideOnMobile?: boolean
  hideOnTablet?: boolean
  hideOnDesktop?: boolean

  // Styling - Only className (Tailwind CSS utilities)
  className?: string
  customId?: string
}

/**
 * Complete page content structure
 */
export interface PageContent {
  sections: Section[]
  globalSettings?: GlobalSettings
}

/**
 * Global page settings
 */
export interface GlobalSettings {
  // Typography
  fontFamily?: string
  fontSize?: string
  lineHeight?: string
  fontWeight?: string

  // Colors
  primaryColor?: string
  secondaryColor?: string
  textColor?: string
  backgroundColor?: string

  // Spacing
  contentMaxWidth?: string
  sectionSpacing?: string

  // Custom CSS
  customCss?: string
}

// ==================== DRAG & DROP ====================

/**
 * Draggable element types
 */
export type DraggableType = 'component' | 'section' | 'row' | 'column'

/**
 * Drop zone types
 */
export type DropZoneType = 'section' | 'row' | 'column' | 'component'

/**
 * Drag state
 */
export interface DragState {
  isDragging: boolean
  draggedItem: DraggedItem | null
  draggedItemType: DraggableType | null
  overId: string | null
  overType: DropZoneType | null
}

/**
 * Dragged item data
 */
export interface DraggedItem {
  id: string
  type: DraggableType
  componentType?: ComponentType
  sourceParentId?: string
  sourceIndex?: number
}

/**
 * Drop result
 */
export interface DropResult {
  targetId: string
  targetType: DropZoneType
  targetIndex: number
  action: 'move' | 'copy' | 'insert'
}

// ==================== BUILDER STATE ====================

/**
 * Selection state
 */
export interface SelectionState {
  selectedId: string | null
  selectedType: 'section' | 'row' | 'column' | 'component' | null
  hoveredId: string | null
  hoveredType: 'section' | 'row' | 'column' | 'component' | null
}

/**
 * History state for undo/redo
 */
export interface HistoryState {
  past: PageContent[]
  present: PageContent
  future: PageContent[]
  canUndo: boolean
  canRedo: boolean
  maxHistory: number
}

/**
 * Clipboard state
 */
export interface ClipboardState {
  copiedItem: any | null
  copiedType: DraggableType | null
  canPaste: boolean
}

/**
 * UI state
 */
export interface UIState {
  // Preview modes
  previewMode: 'desktop' | 'tablet' | 'mobile'
  deviceWidth: number

  // Canvas controls
  zoom: number
  showGrid: boolean
  showOutlines: boolean
  showSpacing: boolean

  // Panels
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  bottomPanelOpen: boolean

  // Active tabs
  activePropertyTab: 'content' | 'style' | 'advanced'
  activeLeftTab: 'components' | 'layers' | 'templates'
}

/**
 * Complete builder state
 */
export interface BuilderState {
  // Core data
  pageId: string | null
  content: PageContent
  originalContent: PageContent | null

  // State management
  selection: SelectionState
  history: HistoryState
  clipboard: ClipboardState
  drag: DragState
  ui: UIState

  // Status
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  lastSaved: Date | null
  errors: BuilderError[]
}

/**
 * Builder error
 */
export interface BuilderError {
  id: string
  type: 'validation' | 'save' | 'load' | 'render'
  message: string
  componentId?: string
  timestamp: Date
}

// ==================== BUILDER ACTIONS ====================

/**
 * Builder action types
 */
export type BuilderActionType =
  // Content operations
  | 'ADD_SECTION'
  | 'DELETE_SECTION'
  | 'MOVE_SECTION'
  | 'UPDATE_SECTION'
  | 'ADD_ROW'
  | 'DELETE_ROW'
  | 'MOVE_ROW'
  | 'UPDATE_ROW'
  | 'ADD_COLUMN'
  | 'DELETE_COLUMN'
  | 'MOVE_COLUMN'
  | 'UPDATE_COLUMN'
  | 'ADD_COMPONENT'
  | 'DELETE_COMPONENT'
  | 'MOVE_COMPONENT'
  | 'UPDATE_COMPONENT'
  // Bulk operations
  | 'DUPLICATE_ELEMENT'
  | 'COPY_ELEMENT'
  | 'PASTE_ELEMENT'
  // History operations
  | 'UNDO'
  | 'REDO'
  | 'RESET'
  // Page operations
  | 'SAVE_DRAFT'
  | 'PUBLISH'
  | 'LOAD_PAGE'

/**
 * Builder command for history tracking
 */
export interface BuilderCommand {
  type: BuilderActionType
  timestamp: Date
  payload: any
  undo?: () => void
  redo?: () => void
}

// ==================== VALIDATION SCHEMAS ====================

/**
 * Zod schemas for runtime validation
 */

export const ComponentSettingsSchema = z.object({
  visible: z.boolean().optional(),
  hideOnMobile: z.boolean().optional(),
  hideOnTablet: z.boolean().optional(),
  hideOnDesktop: z.boolean().optional(),
  animation: z
    .object({
      type: z.enum(['fade', 'slide', 'zoom', 'bounce', 'none']).optional(),
      duration: z.number().optional(),
      delay: z.number().optional(),
      easing: z.enum(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']).optional()
    })
    .optional(),
  className: z.string().optional(),
  customId: z.string().optional()
})

export const ComponentSchema = z.object({
  id: z.string().uuid(),
  type: z.string(),
  order: z.number().min(0),
  props: z.record(z.string(), z.any()),
  settings: ComponentSettingsSchema.optional()
})

export const ColumnSchema = z.object({
  id: z.string().uuid(),
  width: z.number().min(1).max(12),
  order: z.number().min(0),
  settings: z.record(z.string(), z.any()).optional(),
  components: z.array(ComponentSchema)
})

export const RowSchema = z.object({
  id: z.string().uuid(),
  order: z.number().min(0),
  settings: z.record(z.string(), z.any()).optional(),
  columns: z.array(ColumnSchema).min(1)
})

export const SectionSchema = z.object({
  id: z.string().uuid(),
  name: z.string().min(1),
  order: z.number().min(0),
  settings: z.record(z.string(), z.any()).optional(),
  rows: z.array(RowSchema).min(1)
})

export const PageContentSchema = z.object({
  sections: z.array(SectionSchema),
  globalSettings: z.record(z.string(), z.any()).optional()
})

// ==================== HELPER TYPES ====================

/**
 * Column layout presets
 */
export interface ColumnLayoutPreset {
  id: string
  label: string
  icon: string
  description: string
  widths: number[]
}

/**
 * Component template
 */
export interface ComponentTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  content: Section | Row | Column | BaseComponent
  tags: string[]
}

/**
 * Page template
 */
export interface PageTemplate {
  id: string
  name: string
  description: string
  thumbnail: string
  category: string
  content: PageContent
  tags: string[]
  previewUrl?: string
}

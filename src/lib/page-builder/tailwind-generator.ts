/**
 * Tailwind Class Generator
 * Converts visual configuration options to Tailwind CSS utility classes
 */

// ==================== SPACING GENERATOR ====================

export interface SpacingConfig {
  padding?: {
    all?: string
    x?: string
    y?: string
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  margin?: {
    all?: string
    x?: string
    y?: string
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  gap?: {
    all?: string
    x?: string
    y?: string
  }
}

export function generateSpacingClasses(config: SpacingConfig): string {
  const classes: string[] = []

  // Padding
  if (config.padding) {
    const { all, x, y, top, right, bottom, left } = config.padding
    if (all) classes.push(`p-${all}`)
    if (x) classes.push(`px-${x}`)
    if (y) classes.push(`py-${y}`)
    if (top) classes.push(`pt-${top}`)
    if (right) classes.push(`pr-${right}`)
    if (bottom) classes.push(`pb-${bottom}`)
    if (left) classes.push(`pl-${left}`)
  }

  // Margin
  if (config.margin) {
    const { all, x, y, top, right, bottom, left } = config.margin
    if (all) classes.push(`m-${all}`)
    if (x) classes.push(`mx-${x}`)
    if (y) classes.push(`my-${y}`)
    if (top) classes.push(`mt-${top}`)
    if (right) classes.push(`mr-${right}`)
    if (bottom) classes.push(`mb-${bottom}`)
    if (left) classes.push(`ml-${left}`)
  }

  // Gap
  if (config.gap) {
    const { all, x, y } = config.gap
    if (all) classes.push(`gap-${all}`)
    if (x) classes.push(`gap-x-${x}`)
    if (y) classes.push(`gap-y-${y}`)
  }

  return classes.join(' ')
}

// ==================== BACKGROUND GENERATOR ====================

export interface BackgroundConfig {
  type?: 'color' | 'gradient' | 'image'
  color?: string // bg-blue-500, bg-[#ff0000]
  gradient?: {
    direction?: 'to-r' | 'to-l' | 'to-t' | 'to-b' | 'to-tr' | 'to-tl' | 'to-br' | 'to-bl'
    from?: string
    via?: string
    to?: string
  }
  image?: {
    url?: string // Custom property, not a class - use inline style instead
    size?: 'cover' | 'contain' | 'auto'
    position?: 'center' | 'top' | 'bottom' | 'left' | 'right'
    repeat?: 'repeat' | 'no-repeat' | 'repeat-x' | 'repeat-y'
    attachment?: 'fixed' | 'local' | 'scroll'
  }
}

export function generateBackgroundClasses(config: BackgroundConfig): string {
  const classes: string[] = []

  if (!config.type) return ''

  switch (config.type) {
    case 'color':
      if (config.color) classes.push(config.color)
      break

    case 'gradient':
      if (config.gradient) {
        if (config.gradient.direction) classes.push(`bg-gradient-${config.gradient.direction}`)
        if (config.gradient.from) classes.push(`from-${config.gradient.from}`)
        if (config.gradient.via) classes.push(`via-${config.gradient.via}`)
        if (config.gradient.to) classes.push(`to-${config.gradient.to}`)
      }
      break

    case 'image':
      if (config.image) {
        // Note: Image URL should be handled via inline style, not className
        // Only generate utility classes for size, position, repeat, attachment
        if (config.image.size) classes.push(`bg-${config.image.size}`)
        if (config.image.position) classes.push(`bg-${config.image.position}`)
        if (config.image.repeat) classes.push(`bg-${config.image.repeat}`)
        if (config.image.attachment) classes.push(`bg-${config.image.attachment}`)
      }
      break
  }

  return classes.join(' ')
}

// ==================== BORDER GENERATOR ====================

export interface BorderConfig {
  width?: {
    all?: string
    x?: string
    y?: string
    top?: string
    right?: string
    bottom?: string
    left?: string
  }
  style?: 'solid' | 'dashed' | 'dotted' | 'double' | 'none'
  color?: string
  radius?: {
    all?: string
    top?: string
    bottom?: string
    left?: string
    right?: string
    tl?: string
    tr?: string
    bl?: string
    br?: string
  }
}

export function generateBorderClasses(config: BorderConfig): string {
  const classes: string[] = []

  // Border width
  if (config.width) {
    const { all, x, y, top, right, bottom, left } = config.width
    if (all) classes.push(all === '0' ? 'border-0' : `border-${all}`)
    if (x) classes.push(`border-x-${x}`)
    if (y) classes.push(`border-y-${y}`)
    if (top) classes.push(`border-t-${top}`)
    if (right) classes.push(`border-r-${right}`)
    if (bottom) classes.push(`border-b-${bottom}`)
    if (left) classes.push(`border-l-${left}`)
  }

  // Border style
  if (config.style && config.style !== 'none') {
    classes.push(`border-${config.style}`)
  }

  // Border color
  if (config.color) {
    classes.push(config.color)
  }

  // Border radius
  if (config.radius) {
    const { all, top, bottom, left, right, tl, tr, bl, br } = config.radius
    if (all) classes.push(all === 'none' ? 'rounded-none' : `rounded-${all}`)
    if (top) classes.push(`rounded-t-${top}`)
    if (bottom) classes.push(`rounded-b-${bottom}`)
    if (left) classes.push(`rounded-l-${left}`)
    if (right) classes.push(`rounded-r-${right}`)
    if (tl) classes.push(`rounded-tl-${tl}`)
    if (tr) classes.push(`rounded-tr-${tr}`)
    if (bl) classes.push(`rounded-bl-${bl}`)
    if (br) classes.push(`rounded-br-${br}`)
  }

  return classes.join(' ')
}

// ==================== SHADOW GENERATOR ====================

export type ShadowPreset = 'none' | 'sm' | 'md' | 'lg' | 'xl' | '2xl' | 'inner'

export function generateShadowClass(preset: ShadowPreset): string {
  if (preset === 'none') return 'shadow-none'
  if (preset === 'md') return 'shadow'
  return `shadow-${preset}`
}

// ==================== LAYOUT GENERATOR ====================

export interface FlexConfig {
  direction?: 'row' | 'row-reverse' | 'col' | 'col-reverse'
  wrap?: 'wrap' | 'wrap-reverse' | 'nowrap'
  justify?: 'start' | 'end' | 'center' | 'between' | 'around' | 'evenly'
  align?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
  gap?: string
}

export function generateFlexClasses(config: FlexConfig): string {
  const classes: string[] = ['flex']

  if (config.direction) classes.push(`flex-${config.direction}`)
  if (config.wrap) classes.push(`flex-${config.wrap}`)
  if (config.justify) classes.push(`justify-${config.justify}`)
  if (config.align) classes.push(`items-${config.align}`)
  if (config.gap) classes.push(`gap-${config.gap}`)

  return classes.join(' ')
}

export interface GridConfig {
  cols?: string | number
  rows?: string | number
  gap?: string
  justifyItems?: 'start' | 'end' | 'center' | 'stretch'
  alignItems?: 'start' | 'end' | 'center' | 'baseline' | 'stretch'
}

export function generateGridClasses(config: GridConfig): string {
  const classes: string[] = ['grid']

  if (config.cols) {
    if (typeof config.cols === 'number') {
      classes.push(`grid-cols-${config.cols}`)
    } else {
      classes.push(config.cols)
    }
  }

  if (config.rows) {
    if (typeof config.rows === 'number') {
      classes.push(`grid-rows-${config.rows}`)
    } else {
      classes.push(config.rows)
    }
  }

  if (config.gap) classes.push(`gap-${config.gap}`)
  if (config.justifyItems) classes.push(`justify-items-${config.justifyItems}`)
  if (config.alignItems) classes.push(`items-${config.alignItems}`)

  return classes.join(' ')
}

// ==================== POSITIONING GENERATOR ====================

export interface PositionConfig {
  type?: 'static' | 'relative' | 'absolute' | 'fixed' | 'sticky'
  top?: string
  right?: string
  bottom?: string
  left?: string
  zIndex?: string | number
}

export function generatePositionClasses(config: PositionConfig): string {
  const classes: string[] = []

  if (config.type) classes.push(config.type)
  if (config.top) classes.push(`top-${config.top}`)
  if (config.right) classes.push(`right-${config.right}`)
  if (config.bottom) classes.push(`bottom-${config.bottom}`)
  if (config.left) classes.push(`left-${config.left}`)
  if (config.zIndex !== undefined) classes.push(`z-${config.zIndex}`)

  return classes.join(' ')
}

// ==================== SIZE GENERATOR ====================

export interface SizeConfig {
  width?: string
  minWidth?: string
  maxWidth?: string
  height?: string
  minHeight?: string
  maxHeight?: string
}

export function generateSizeClasses(config: SizeConfig): string {
  const classes: string[] = []

  if (config.width) classes.push(`w-${config.width}`)
  if (config.minWidth) classes.push(`min-w-${config.minWidth}`)
  if (config.maxWidth) classes.push(`max-w-${config.maxWidth}`)
  if (config.height) classes.push(`h-${config.height}`)
  if (config.minHeight) classes.push(`min-h-${config.minHeight}`)
  if (config.maxHeight) classes.push(`max-h-${config.maxHeight}`)

  return classes.join(' ')
}

// ==================== MASTER GENERATOR ====================

export interface VisualConfig {
  spacing?: SpacingConfig
  background?: BackgroundConfig
  border?: BorderConfig
  shadow?: ShadowPreset
  layout?: {
    type?: 'flex' | 'grid' | 'block'
    flex?: FlexConfig
    grid?: GridConfig
  }
  position?: PositionConfig
  size?: SizeConfig
  customClasses?: string
}

/**
 * Master function to generate complete className from visual configuration
 */
export function generateClassName(config: VisualConfig): string {
  const parts: string[] = []

  // Spacing
  if (config.spacing) {
    parts.push(generateSpacingClasses(config.spacing))
  }

  // Background
  if (config.background) {
    parts.push(generateBackgroundClasses(config.background))
  }

  // Border
  if (config.border) {
    parts.push(generateBorderClasses(config.border))
  }

  // Shadow
  if (config.shadow) {
    parts.push(generateShadowClass(config.shadow))
  }

  // Layout
  if (config.layout) {
    if (config.layout.type === 'flex' && config.layout.flex) {
      parts.push(generateFlexClasses(config.layout.flex))
    } else if (config.layout.type === 'grid' && config.layout.grid) {
      parts.push(generateGridClasses(config.layout.grid))
    }
  }

  // Position
  if (config.position) {
    parts.push(generatePositionClasses(config.position))
  }

  // Size
  if (config.size) {
    parts.push(generateSizeClasses(config.size))
  }

  // Custom classes
  if (config.customClasses) {
    parts.push(config.customClasses)
  }

  return parts.filter(Boolean).join(' ').trim()
}

/**
 * Merge existing className with new classes (preserves custom classes)
 */
export function mergeClassNames(existingClassName: string = '', newClasses: string): string {
  const existing = existingClassName.split(' ').filter(Boolean)
  const newClassArray = newClasses.split(' ').filter(Boolean)

  // Create a Set to prevent duplicates
  const merged = new Set([...existing, ...newClassArray])

  return Array.from(merged).join(' ')
}

/**
 * Update specific aspect of className
 */
export function updateClassNameAspect(
  currentClassName: string = '',
  aspectConfig: Partial<VisualConfig>
): string {
  // Generate classes for the specific aspect
  const newAspectClasses = generateClassName(aspectConfig)

  // Remove old classes of the same type, then add new ones
  // This is a simplified approach - for production, you'd want more sophisticated class replacement
  return mergeClassNames(currentClassName, newAspectClasses)
}

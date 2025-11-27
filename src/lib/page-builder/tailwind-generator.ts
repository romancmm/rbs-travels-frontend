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
 * Parse className string to extract visual config values
 * This allows visual controls to show current values
 */
export function parseClassNameToConfig(className: string = ''): Partial<VisualConfig> {
  const classes = className.split(' ').filter(Boolean)
  const config: Partial<VisualConfig> = {}

  // Parse spacing
  const spacing: any = { padding: {}, margin: {}, gap: {} }
  classes.forEach((cls) => {
    // Padding
    if (/^p-\d+$/.test(cls)) spacing.padding.all = cls.replace('p-', '')
    else if (/^pt-\d+$/.test(cls)) spacing.padding.top = cls.replace('pt-', '')
    else if (/^pr-\d+$/.test(cls)) spacing.padding.right = cls.replace('pr-', '')
    else if (/^pb-\d+$/.test(cls)) spacing.padding.bottom = cls.replace('pb-', '')
    else if (/^pl-\d+$/.test(cls)) spacing.padding.left = cls.replace('pl-', '')
    else if (/^px-\d+$/.test(cls)) spacing.padding.x = cls.replace('px-', '')
    else if (/^py-\d+$/.test(cls)) spacing.padding.y = cls.replace('py-', '')
    // Margin
    else if (/^m-\d+$/.test(cls)) spacing.margin.all = cls.replace('m-', '')
    else if (/^mt-\d+$/.test(cls)) spacing.margin.top = cls.replace('mt-', '')
    else if (/^mr-\d+$/.test(cls)) spacing.margin.right = cls.replace('mr-', '')
    else if (/^mb-\d+$/.test(cls)) spacing.margin.bottom = cls.replace('mb-', '')
    else if (/^ml-\d+$/.test(cls)) spacing.margin.left = cls.replace('ml-', '')
    else if (/^mx-\d+$/.test(cls)) spacing.margin.x = cls.replace('mx-', '')
    else if (/^my-\d+$/.test(cls)) spacing.margin.y = cls.replace('my-', '')
    // Gap
    else if (/^gap-\d+$/.test(cls)) spacing.gap.all = cls.replace('gap-', '')
    else if (/^gap-x-\d+$/.test(cls)) spacing.gap.x = cls.replace('gap-x-', '')
    else if (/^gap-y-\d+$/.test(cls)) spacing.gap.y = cls.replace('gap-y-', '')
  })
  if (Object.keys(spacing.padding).length)
    config.spacing = { ...config.spacing, padding: spacing.padding }
  if (Object.keys(spacing.margin).length)
    config.spacing = { ...config.spacing, margin: spacing.margin }
  if (Object.keys(spacing.gap).length) config.spacing = { ...config.spacing, gap: spacing.gap }

  // Parse background
  const background: any = {}
  classes.forEach((cls) => {
    if (
      /^bg-(?!linear|radial|conic|cover|contain|auto|center|top|bottom|left|right|repeat|no-repeat|repeat-x|repeat-y|fixed|scroll)/.test(
        cls
      )
    ) {
      background.type = 'color'
      background.color = cls
    } else if (/^from-/.test(cls)) {
      background.type = 'gradient'
      if (!background.gradient) background.gradient = {}
      background.gradient.from = cls.replace('from-', '')
    } else if (/^via-/.test(cls)) {
      if (!background.gradient) background.gradient = {}
      background.gradient.via = cls.replace('via-', '')
    } else if (/^to-/.test(cls)) {
      if (!background.gradient) background.gradient = {}
      background.gradient.to = cls.replace('to-', '')
    } else if (/^bg-linear-to-/.test(cls)) {
      if (!background.gradient) background.gradient = {}
      background.gradient.direction = cls.replace('bg-linear-', '')
    }
  })
  if (Object.keys(background).length) config.background = background

  // Parse border
  const border: any = { width: {}, radius: {} }
  classes.forEach((cls) => {
    // Border width
    if (/^border-(\d+)$/.test(cls)) border.width.all = cls.replace('border-', '')
    else if (/^border-t-(\d+)$/.test(cls)) border.width.top = cls.replace('border-t-', '')
    else if (/^border-r-(\d+)$/.test(cls)) border.width.right = cls.replace('border-r-', '')
    else if (/^border-b-(\d+)$/.test(cls)) border.width.bottom = cls.replace('border-b-', '')
    else if (/^border-l-(\d+)$/.test(cls)) border.width.left = cls.replace('border-l-', '')
    // Border style
    else if (/^border-(solid|dashed|dotted|double)$/.test(cls))
      border.style = cls.replace('border-', '')
    // Border color
    else if (/^border-(?!(\d+|solid|dashed|dotted|double|none|t-|r-|b-|l-|x-|y-))/.test(cls))
      border.color = cls
    // Border radius
    else if (/^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)) {
      border.radius.all = cls === 'rounded' ? 'md' : cls.replace('rounded-', '')
    }
  })
  if (
    Object.keys(border.width).length ||
    border.style ||
    border.color ||
    Object.keys(border.radius).length
  ) {
    config.border = border
  }

  // Parse shadow
  classes.forEach((cls) => {
    if (/^shadow(-none|-sm|-md|-lg|-xl|-2xl|-inner)?$/.test(cls)) {
      config.shadow = cls === 'shadow' ? 'md' : (cls.replace('shadow-', '') as ShadowPreset)
    }
  })

  // Parse layout
  const layout: any = {}
  classes.forEach((cls) => {
    if (cls === 'flex' || cls === 'inline-flex') {
      layout.type = 'flex'
      if (!layout.flex) layout.flex = {}
    } else if (cls === 'grid' || cls === 'inline-grid') {
      layout.type = 'grid'
      if (!layout.grid) layout.grid = {}
    } else if (cls === 'block') {
      layout.type = 'block'
    }
    // Flex properties
    else if (/^flex-(row|row-reverse|col|col-reverse)$/.test(cls)) {
      if (!layout.flex) layout.flex = {}
      layout.flex.direction = cls.replace('flex-', '')
    } else if (/^flex-(wrap|wrap-reverse|nowrap)$/.test(cls)) {
      if (!layout.flex) layout.flex = {}
      layout.flex.wrap = cls.replace('flex-', '')
    } else if (/^justify-(start|end|center|between|around|evenly)$/.test(cls)) {
      if (!layout.flex) layout.flex = {}
      layout.flex.justify = cls.replace('justify-', '')
    } else if (/^items-(start|end|center|baseline|stretch)$/.test(cls)) {
      if (!layout.flex) layout.flex = {}
      layout.flex.align = cls.replace('items-', '')
    }
    // Grid properties
    else if (/^grid-cols-\d+$/.test(cls)) {
      if (!layout.grid) layout.grid = {}
      layout.grid.cols = parseInt(cls.replace('grid-cols-', ''))
    } else if (/^grid-rows-\d+$/.test(cls)) {
      if (!layout.grid) layout.grid = {}
      layout.grid.rows = parseInt(cls.replace('grid-rows-', ''))
    }
  })
  if (Object.keys(layout).length) config.layout = layout

  return config
}

/**
 * Smart class replacement - only replaces classes in the same sub-category
 * Works like Tailwind's conflict resolution
 */
function removeConflictingClasses(existingClasses: string[], newClasses: string[]): string[] {
  let filtered = [...existingClasses]

  // For each new class, remove only the conflicting ones from existing
  newClasses.forEach((newClass) => {
    // Spacing - Padding (each direction separately)
    if (/^p-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^p-\d+$/.test(cls))
    else if (/^pt-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^pt-\d+$/.test(cls))
    else if (/^pr-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^pr-\d+$/.test(cls))
    else if (/^pb-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^pb-\d+$/.test(cls))
    else if (/^pl-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^pl-\d+$/.test(cls))
    else if (/^px-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^px-\d+$/.test(cls))
    else if (/^py-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^py-\d+$/.test(cls))
    // Spacing - Margin (each direction separately)
    else if (/^m-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^m-\d+$/.test(cls))
    else if (/^mt-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^mt-\d+$/.test(cls))
    else if (/^mr-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^mr-\d+$/.test(cls))
    else if (/^mb-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^mb-\d+$/.test(cls))
    else if (/^ml-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^ml-\d+$/.test(cls))
    else if (/^mx-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^mx-\d+$/.test(cls))
    else if (/^my-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^my-\d+$/.test(cls))
    // Spacing - Gap (each direction separately)
    else if (/^gap-\d+$/.test(newClass)) filtered = filtered.filter((cls) => !/^gap-\d+$/.test(cls))
    else if (/^gap-x-\d+$/.test(newClass))
      filtered = filtered.filter((cls) => !/^gap-x-\d+$/.test(cls))
    else if (/^gap-y-\d+$/.test(newClass))
      filtered = filtered.filter((cls) => !/^gap-y-\d+$/.test(cls))
    // Background - Color only (not bg-properties like bg-cover, bg-center, etc.)
    else if (
      /^bg-(?!linear|radial|conic|cover|contain|auto|center|top|bottom|left|right|repeat|no-repeat|repeat-x|repeat-y|fixed|scroll)/.test(
        newClass
      )
    ) {
      filtered = filtered.filter(
        (cls) =>
          !/^bg-(?!linear|radial|conic|cover|contain|auto|center|top|bottom|left|right|repeat|no-repeat|repeat-x|repeat-y|fixed|scroll)/.test(
            cls
          )
      )
    }

    // Background - Gradient type/direction
    else if (/^bg-linear-to-/.test(newClass))
      filtered = filtered.filter((cls) => !/^bg-linear-to-/.test(cls))
    else if (/^bg-radial-/.test(newClass))
      filtered = filtered.filter((cls) => !/^bg-radial-/.test(cls))
    // Background - Gradient colors (separate for from/via/to)
    else if (/^from-/.test(newClass)) filtered = filtered.filter((cls) => !/^from-/.test(cls))
    else if (/^via-/.test(newClass)) filtered = filtered.filter((cls) => !/^via-/.test(cls))
    else if (/^to-/.test(newClass)) filtered = filtered.filter((cls) => !/^to-/.test(cls))
    // Background - Size
    else if (/^bg-(cover|contain|auto)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^bg-(cover|contain|auto)$/.test(cls))
    }

    // Background - Position
    else if (/^bg-(center|top|bottom|left|right)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^bg-(center|top|bottom|left|right)$/.test(cls))
    }

    // Background - Repeat
    else if (/^bg-(repeat|no-repeat|repeat-x|repeat-y)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^bg-(repeat|no-repeat|repeat-x|repeat-y)$/.test(cls))
    }

    // Background - Attachment
    else if (/^bg-(fixed|scroll)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^bg-(fixed|scroll)$/.test(cls))
    }

    // Border - Width (each side separately)
    else if (/^border-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-(\d+)$/.test(cls))
    else if (/^border-t-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-t-(\d+)$/.test(cls))
    else if (/^border-r-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-r-(\d+)$/.test(cls))
    else if (/^border-b-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-b-(\d+)$/.test(cls))
    else if (/^border-l-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-l-(\d+)$/.test(cls))
    else if (/^border-x-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-x-(\d+)$/.test(cls))
    else if (/^border-y-(\d+)$/.test(newClass))
      filtered = filtered.filter((cls) => !/^border-y-(\d+)$/.test(cls))
    // Border - Style (only one style applies to all borders)
    else if (/^border-(solid|dashed|dotted|double|none)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^border-(solid|dashed|dotted|double|none)$/.test(cls))
    }

    // Border - Color (only border-color, not border-width or border-style)
    else if (/^border-(?!(\d+|solid|dashed|dotted|double|none|t-|r-|b-|l-|x-|y-))/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^border-(?!(\d+|solid|dashed|dotted|double|none|t-|r-|b-|l-|x-|y-))/.test(cls)
      )
    }

    // Border - Radius (each corner separately)
    else if (/^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-t(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-t(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-r(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-r(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-b(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-b(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-l(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-l(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-tl(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-tl(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-tr(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-tr(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-bl(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-bl(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    } else if (/^rounded-br(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^rounded-br(-none|-sm|-md|-lg|-xl|-2xl|-3xl|-full)?$/.test(cls)
      )
    }

    // Shadow (only one shadow can apply)
    else if (/^shadow(-none|-sm|-md|-lg|-xl|-2xl|-inner)?$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^shadow(-none|-sm|-md|-lg|-xl|-2xl|-inner)?$/.test(cls))
    }

    // Layout - Display type (only one display type)
    else if (
      /^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)$/.test(newClass)
    ) {
      filtered = filtered.filter(
        (cls) => !/^(block|inline-block|inline|flex|inline-flex|grid|inline-grid|hidden)$/.test(cls)
      )
    }

    // Flex - Direction
    else if (/^flex-(row|row-reverse|col|col-reverse)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^flex-(row|row-reverse|col|col-reverse)$/.test(cls))
    }

    // Flex - Wrap
    else if (/^flex-(wrap|wrap-reverse|nowrap)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^flex-(wrap|wrap-reverse|nowrap)$/.test(cls))
    }

    // Flex - Justify content
    else if (/^justify-(start|end|center|between|around|evenly)$/.test(newClass)) {
      filtered = filtered.filter(
        (cls) => !/^justify-(start|end|center|between|around|evenly)$/.test(cls)
      )
    }

    // Flex - Align items
    else if (/^items-(start|end|center|baseline|stretch)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^items-(start|end|center|baseline|stretch)$/.test(cls))
    }

    // Grid - Columns
    else if (/^grid-cols-\d+$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^grid-cols-\d+$/.test(cls))
    }

    // Grid - Rows
    else if (/^grid-rows-\d+$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^grid-rows-\d+$/.test(cls))
    }

    // Grid - Justify items
    else if (/^justify-items-(start|end|center|stretch)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^justify-items-(start|end|center|stretch)$/.test(cls))
    }

    // Position type
    else if (/^(static|fixed|absolute|relative|sticky)$/.test(newClass)) {
      filtered = filtered.filter((cls) => !/^(static|fixed|absolute|relative|sticky)$/.test(cls))
    }

    // Size - Width
    else if (/^w-/.test(newClass)) filtered = filtered.filter((cls) => !/^w-/.test(cls))
    else if (/^min-w-/.test(newClass)) filtered = filtered.filter((cls) => !/^min-w-/.test(cls))
    else if (/^max-w-/.test(newClass)) filtered = filtered.filter((cls) => !/^max-w-/.test(cls))
    // Size - Height
    else if (/^h-/.test(newClass)) filtered = filtered.filter((cls) => !/^h-/.test(cls))
    else if (/^min-h-/.test(newClass)) filtered = filtered.filter((cls) => !/^min-h-/.test(cls))
    else if (/^max-h-/.test(newClass)) filtered = filtered.filter((cls) => !/^max-h-/.test(cls))
  })

  return filtered
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
  const existingClasses = currentClassName.split(' ').filter(Boolean)
  const newAspectClasses = generateClassName(aspectConfig).split(' ').filter(Boolean)

  // Smart removal - only remove conflicting classes
  const cleanedClasses = removeConflictingClasses(existingClasses, newAspectClasses)

  // Merge cleaned classes with new ones
  const finalClasses = [...cleanedClasses, ...newAspectClasses]

  // Remove duplicates while preserving order
  return finalClasses
    .filter((cls, idx) => finalClasses.indexOf(cls) === idx)
    .join(' ')
    .trim()
}

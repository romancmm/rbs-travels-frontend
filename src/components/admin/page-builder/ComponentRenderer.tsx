'use client'

import { useSortable } from '@dnd-kit/sortable'
import { CSS } from '@dnd-kit/utilities'
import { Copy, GripVertical, Settings, Trash2 } from 'lucide-react'

import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { componentRegistry } from '@/lib/page-builder/widgets'
import { cn } from '@/lib/utils'
import type { BaseComponent } from '@/types/page-builder'
import { useDndContext } from '@dnd-kit/core'

interface ComponentRendererProps {
  component: BaseComponent
  sectionId: string
  rowId: string
  columnId: string
}

export function ComponentRenderer({
  component,
  sectionId,
  rowId,
  columnId
}: ComponentRendererProps) {
  const selectedId = useBuilderStore((state) => state.selection.selectedId)
  const hoveredId = useBuilderStore((state) => state.selection.hoveredId)
  const selectElement = useBuilderStore((state) => state.selectElement)
  const hoverElement = useBuilderStore((state) => state.hoverElement)
  const duplicateComponent = useBuilderStore((state) => state.duplicateComponent)
  const deleteComponent = useBuilderStore((state) => state.deleteComponent)

  const isSelected = selectedId === component.id
  const isHovered = hoveredId === component.id

  // Get drag context to show drop indicator
  const { active, over } = useDndContext()
  const isOverThisComponent = over?.id === component.id
  const isDraggingNewComponent = active?.id && String(active.id).startsWith('new-')

  const { attributes, listeners, setNodeRef, transform, transition, isDragging } = useSortable({
    id: component.id,
    data: {
      type: 'component',
      component,
      sectionId,
      rowId,
      columnId
    }
  })

  const style = {
    transform: CSS.Transform.toString(transform),
    transition
  }

  // Get component definition from registry
  const componentDef = componentRegistry.get(component.type)

  return (
    <div
      ref={setNodeRef}
      style={style}
      className={cn(
        'group/component relative transition-all duration-200',
        isDragging && 'opacity-50',
        isSelected && 'ring-2 ring-orange-500 ring-offset-2',
        isHovered && !isSelected && 'ring-2 ring-orange-300 ring-offset-2'
      )}
      onClick={(e) => {
        e.stopPropagation()
        selectElement(component.id, 'component')
      }}
      onMouseEnter={(e) => {
        e.stopPropagation()
        hoverElement(component.id, 'component')
      }}
      onMouseLeave={(e) => {
        e.stopPropagation()
        hoverElement(null)
      }}
    >
      {/* Drop Indicator - Shows when dragging new component over this component */}
      {isOverThisComponent && isDraggingNewComponent && (
        <div className='-top-2 right-0 left-0 z-50 absolute flex justify-center'>
          <div className='bg-blue-500 shadow-lg px-3 py-1 rounded-lg'>
            <span className='font-medium text-white text-xs'>Drop here to insert before</span>
          </div>
        </div>
      )}

      {/* Component Toolbar - Shows on hover/select */}
      <div
        className={cn(
          '-top-8 right-0 left-0 z-40 absolute flex items-center gap-2 opacity-0 w-fit transition-opacity',
          (isHovered || isSelected) && 'opacity-100'
        )}
      >
        <div className='flex items-center gap-1 bg-white shadow-sm px-2 py-1 border rounded-md'>
          {/* Drag Handle */}
          <button
            {...attributes}
            {...listeners}
            className='hover:bg-gray-100 p-1 cursor-grab active:cursor-grabbing'
            title='Drag to reorder'
          >
            <GripVertical className='w-4 h-4 text-gray-500' />
          </button>

          {/* Component Label */}
          <span className='px-2 font-medium text-gray-700 text-xs'>
            {componentDef?.label || component.type}
          </span>

          {/* Divider */}
          <div className='bg-gray-200 w-px h-4' />

          {/* Actions */}
          <Button
            variant='ghost'
            size='sm'
            className='p-0 w-7 h-7'
            onClick={(e) => {
              e.stopPropagation()
              selectElement(component.id, 'component')
            }}
            title='Component settings'
          >
            <Settings className='w-3.5 h-3.5' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='p-0 w-7 h-7'
            onClick={(e) => {
              e.stopPropagation()
              duplicateComponent(component.id)
            }}
            title='Duplicate component'
          >
            <Copy className='w-3.5 h-3.5' />
          </Button>

          <Button
            variant='ghost'
            size='sm'
            className='hover:bg-red-50 p-0 w-7 h-7 text-red-600 hover:text-red-700'
            onClick={(e) => {
              e.stopPropagation()
              deleteComponent(component.id)
            }}
            title='Delete component'
          >
            <Trash2 className='w-3.5 h-3.5' />
          </Button>
        </div>
      </div>

      {/* Component Content Preview */}
      <div className={cn('bg-white p-4 rounded', component.settings?.className)}>
        {componentDef ? (
          <ComponentPreview component={component} definition={componentDef} />
        ) : (
          <div className='text-gray-500 text-sm'>Unknown component: {component.type}</div>
        )}
      </div>
    </div>
  )
}

/**
 * Component Preview
 * Renders a visual preview of the component based on its type and props
 */
function ComponentPreview({
  component,
  definition
}: {
  component: BaseComponent
  definition: ReturnType<typeof componentRegistry.get>
}) {
  if (!definition) return null

  // Render based on component type
  switch (component.type) {
    case 'heading': {
      const {
        level = 'h2',
        text = 'Heading',
        alignment = 'left',
        weight = 'bold'
      } = component.props as any
      const componentClassName = component.settings?.className || ''

      return (
        <Typography
          variant={level as any}
          as={level as any}
          weight={weight as any}
          align={alignment as any}
          className={componentClassName}
        >
          {text}
        </Typography>
      )
    }

    case 'text': {
      const {
        text = 'Lorem ipsum dolor sit amet...',
        alignment = 'left',
        variant = 'body1',
        weight = 'normal'
      } = component.props as any
      const componentClassName = component.settings?.className || ''

      return (
        <Typography
          variant={variant as any}
          weight={weight as any}
          align={alignment as any}
          className={componentClassName}
        >
          {text}
        </Typography>
      )
    }

    case 'button': {
      const {
        text = 'Button',
        variant = 'primary',
        size = 'medium',
        alignment = 'left'
      } = component.props as any

      return (
        <div
          className={cn(
            alignment === 'center' && 'text-center',
            alignment === 'right' && 'text-right'
          )}
        >
          <button
            className={cn(
              'px-4 py-2 rounded font-medium transition-colors',
              variant === 'primary' && 'bg-blue-600 text-white hover:bg-blue-700',
              variant === 'secondary' && 'bg-gray-600 text-white hover:bg-gray-700',
              variant === 'outline' && 'border-2 border-blue-600 text-blue-600 hover:bg-blue-50',
              variant === 'ghost' && 'text-blue-600 hover:bg-blue-50',
              variant === 'link' && 'text-blue-600 underline hover:text-blue-700',
              size === 'small' && 'px-3 py-1 text-sm',
              size === 'large' && 'px-6 py-3 text-lg'
            )}
          >
            {text}
          </button>
        </div>
      )
    }

    case 'image': {
      const { src, alt = 'Image', width, height } = component.props as any
      return (
        <div className='relative'>
          {src ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={src} alt={alt} width={width} height={height} className='max-w-full h-auto' />
          ) : (
            <div className='flex justify-center items-center bg-gray-100 aspect-video'>
              <span className='text-gray-400 text-sm'>No image</span>
            </div>
          )}
        </div>
      )
    }

    case 'video': {
      const { url, provider = 'youtube', aspectRatio = '16/9' } = component.props as any

      // Extract video embed URL
      const getVideoEmbedUrl = (videoUrl: string, videoProvider: string) => {
        if (!videoUrl) return null

        try {
          if (videoProvider === 'youtube') {
            // Handle various YouTube URL formats
            let videoId = ''
            if (videoUrl.includes('youtube.com/watch?v=')) {
              videoId = videoUrl.split('v=')[1]?.split('&')[0]
            } else if (videoUrl.includes('youtu.be/')) {
              videoId = videoUrl.split('youtu.be/')[1]?.split('?')[0]
            } else if (videoUrl.includes('youtube.com/embed/')) {
              videoId = videoUrl.split('embed/')[1]?.split('?')[0]
            }
            return videoId ? `https://www.youtube.com/embed/${videoId}` : null
          } else if (videoProvider === 'vimeo') {
            // Handle Vimeo URLs
            const match = videoUrl.match(/vimeo\.com\/(\d+)/)
            return match ? `https://player.vimeo.com/video/${match[1]}` : null
          } else if (videoProvider === 'direct') {
            // Direct video URL
            return videoUrl
          }
        } catch (error) {
          console.error('Error parsing video URL:', error)
        }
        return null
      }

      const embedUrl = getVideoEmbedUrl(url, provider)

      // Convert aspectRatio to Tailwind classes
      const aspectClass =
        aspectRatio === '4/3'
          ? 'aspect-[4/3]'
          : aspectRatio === '1/1'
          ? 'aspect-square'
          : aspectRatio === '21/9'
          ? 'aspect-[21/9]'
          : 'aspect-video' // Default 16/9

      return (
        <div className='relative bg-black rounded-lg overflow-hidden'>
          {embedUrl ? (
            <div className={cn('relative w-full', aspectClass)}>
              {provider === 'direct' ? (
                <video src={embedUrl} controls className='absolute inset-0 w-full h-full'>
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  src={embedUrl}
                  className='absolute inset-0 w-full h-full'
                  allow='accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture'
                  allowFullScreen
                  title='Video preview'
                />
              )}
            </div>
          ) : (
            <div className='flex justify-center items-center bg-gray-100 aspect-video'>
              <span className='text-gray-400 text-sm'>
                {url ? 'Invalid video URL' : 'No video URL'}
              </span>
            </div>
          )}
        </div>
      )
    }

    case 'spacer': {
      const { height = '40px' } = component.props as any

      // Convert height to Tailwind classes
      const getHeightClass = (h: string) => {
        const heightMap: Record<string, string> = {
          '20px': 'h-5',
          '40px': 'h-10',
          '60px': 'h-15',
          '80px': 'h-20',
          '100px': 'h-25',
          '120px': 'h-30'
        }
        return heightMap[h] || 'h-10'
      }

      return (
        <div className={cn('bg-gray-50', getHeightClass(height))}>
          <div className='flex justify-center items-center h-full'>
            <span className='text-gray-400 text-xs'>Spacer ({height})</span>
          </div>
        </div>
      )
    }

    case 'divider': {
      const { style = 'solid', thickness = '1px' } = component.props as any

      // Convert style to Tailwind classes
      const styleClass =
        style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted' : 'border-solid'

      // Convert thickness to Tailwind classes
      const thicknessClass =
        thickness === '2px' ? 'border-t-2' : thickness === '4px' ? 'border-t-4' : 'border-t'

      return <hr className={cn('my-4', styleClass, thicknessClass)} />
    }

    // ==================== FORM WIDGETS ====================
    case 'contact-form':
      return (
        <div className='space-y-4 bg-gray-50 p-6 border-2 border-gray-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Contact Form</div>
          <p className='text-muted-foreground text-sm'>Form fields will render here</p>
        </div>
      )

    case 'newsletter':
      return (
        <div className='space-y-3 bg-gray-50 p-6 border-2 border-gray-300 border-dashed rounded-lg'>
          <div className='font-semibold'>Newsletter Subscribe</div>
          <div className='flex gap-2'>
            <div className='flex-1 bg-white px-3 py-2 border rounded text-sm'>Email address</div>
            <button className='bg-blue-600 px-4 py-2 rounded text-white text-sm'>Subscribe</button>
          </div>
        </div>
      )

    case 'search':
      return (
        <div className='bg-gray-50 p-6 border-2 border-gray-300 border-dashed rounded-lg'>
          <div className='flex gap-2'>
            <div className='flex-1 bg-white px-3 py-2 border rounded text-sm'>Search...</div>
            <button className='bg-gray-800 px-4 py-2 rounded text-white text-sm'>Search</button>
          </div>
        </div>
      )

    // ==================== CONTENT WIDGETS ====================
    case 'grid': {
      const {
        title = 'Grid Section',
        dataSource = 'api',
        cardType = 'BlogCard',
        columns = 3,
        gridItems = []
      } = (component.props || {}) as any

      return (
        <div className='space-y-4 bg-blue-50 p-6 border-2 border-blue-300 border-dashed rounded-lg'>
          <div className='flex justify-between items-center'>
            <div>
              <div className='font-semibold text-lg'>{title}</div>
              <div className='text-muted-foreground text-xs'>
                {dataSource === 'api'
                  ? `API Mode: ${cardType}`
                  : `Manual Mode: ${gridItems.length} items - Click to edit grid items in Properties Panel`}
              </div>
            </div>
            <div className='bg-blue-200 px-2 py-1 rounded font-medium text-blue-700 text-xs'>
              {columns} columns
            </div>
          </div>
          <div className={cn('gap-4 grid', `grid-cols-${Math.min(columns, 3)}`)}>
            {dataSource === 'api'
              ? // API Mode Preview
                [1, 2, 3].map((i) => (
                  <div key={i} className='space-y-2 bg-white p-3 border rounded'>
                    <div className='bg-gray-200 rounded aspect-video'></div>
                    <div className='font-medium text-sm'>
                      {cardType} {i}
                    </div>
                    <div className='text-muted-foreground text-xs'>Preview from API...</div>
                  </div>
                ))
              : // Manual Mode Preview
                gridItems.slice(0, 3).map((item: any, i: number) => (
                  <div key={i} className='space-y-2 bg-white p-3 border rounded min-h-[100px]'>
                    <div className='flex justify-between items-center'>
                      <div className='font-medium text-sm'>Grid Item {i + 1}</div>
                      <div className='bg-blue-100 px-2 py-0.5 rounded font-medium text-[10px] text-blue-700'>
                        {item.components?.length || 0} components
                      </div>
                    </div>
                    {item.components && item.components.length > 0 ? (
                      <div className='space-y-1 text-[10px] text-muted-foreground'>
                        {item.components.slice(0, 3).map((comp: any, idx: number) => (
                          <div key={idx} className='bg-gray-100 px-2 py-1 rounded truncate'>
                            {comp.type}
                          </div>
                        ))}
                        {item.components.length > 3 && (
                          <div className='text-center'>+{item.components.length - 3} more</div>
                        )}
                      </div>
                    ) : (
                      <div className='py-4 text-muted-foreground text-xs text-center'>Empty</div>
                    )}
                  </div>
                ))}
          </div>
        </div>
      )
    }

    case 'blog-carousel':
      return (
        <div className='space-y-4 bg-blue-50 p-6 border-2 border-blue-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Blog Carousel</div>
          <div className='gap-4 grid grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='space-y-2 bg-white p-3 border rounded'>
                <div className='bg-gray-200 rounded aspect-video'></div>
                <div className='font-medium text-sm'>Blog Post {i}</div>
                <div className='text-muted-foreground text-xs'>Preview text...</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'tour-packages':
      return (
        <div className='space-y-4 bg-purple-50 p-6 border-2 border-purple-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Tour Packages</div>
          <div className='gap-4 grid grid-cols-2'>
            {[1, 2].map((i) => (
              <div key={i} className='space-y-2 bg-white p-3 border rounded'>
                <div className='bg-gray-200 rounded aspect-video'></div>
                <div className='font-medium text-sm'>Package {i}</div>
                <div className='text-muted-foreground text-xs'>5 Days / 4 Nights</div>
              </div>
            ))}
          </div>
        </div>
      )

    // ==================== INTERACTIVE WIDGETS ====================
    case 'testimonials':
      return (
        <div className='space-y-4 bg-yellow-50 p-6 border-2 border-yellow-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Testimonials</div>
          <div className='space-y-3'>
            {[1, 2].map((i) => (
              <div key={i} className='space-y-2 bg-white p-4 border rounded'>
                <p className='text-sm italic'>&quot;Great service and experience!&quot;</p>
                <div className='font-medium text-xs'>- Customer {i}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'faq':
      return (
        <div className='space-y-4 bg-indigo-50 p-6 border-2 border-indigo-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>FAQ</div>
          <div className='space-y-2'>
            {[1, 2, 3].map((i) => (
              <div key={i} className='bg-white p-3 border rounded'>
                <div className='font-medium text-sm'>Question {i}</div>
                <div className='mt-1 text-muted-foreground text-xs'>Answer text...</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'stats':
      return (
        <div className='bg-red-50 p-6 border-2 border-red-300 border-dashed rounded-lg'>
          <div className='gap-4 grid grid-cols-4 text-center'>
            {[1, 2, 3, 4].map((i) => (
              <div key={i} className='bg-white p-4 border rounded'>
                <div className='font-bold text-2xl'>100+</div>
                <div className='text-muted-foreground text-xs'>Stat {i}</div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'gallery':
      return (
        <div className='space-y-4 bg-pink-50 p-6 border-2 border-pink-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Photo Gallery</div>
          <div className='gap-2 grid grid-cols-4'>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className='bg-gray-200 rounded aspect-square'></div>
            ))}
          </div>
        </div>
      )

    case 'map':
      return (
        <div className='bg-teal-50 p-6 border-2 border-teal-300 border-dashed rounded-lg'>
          <div className='flex justify-center items-center bg-gray-200 rounded aspect-video'>
            <span className='text-gray-500 text-sm'>Google Map</span>
          </div>
        </div>
      )

    case 'countdown':
      return (
        <div className='bg-orange-50 p-6 border-2 border-orange-300 border-dashed rounded-lg'>
          <div className='gap-4 grid grid-cols-4 text-center'>
            <div className='bg-white p-4 border rounded'>
              <div className='font-bold text-2xl'>10</div>
              <div className='text-xs'>Days</div>
            </div>
            <div className='bg-white p-4 border rounded'>
              <div className='font-bold text-2xl'>05</div>
              <div className='text-xs'>Hours</div>
            </div>
            <div className='bg-white p-4 border rounded'>
              <div className='font-bold text-2xl'>30</div>
              <div className='text-xs'>Minutes</div>
            </div>
            <div className='bg-white p-4 border rounded'>
              <div className='font-bold text-2xl'>45</div>
              <div className='text-xs'>Seconds</div>
            </div>
          </div>
        </div>
      )

    // ==================== LAYOUT WIDGETS ====================
    case 'tabs':
      return (
        <div className='space-y-4 bg-cyan-50 p-6 border-2 border-cyan-300 border-dashed rounded-lg'>
          <div className='flex gap-2 border-b'>
            <div className='px-4 py-2 border-blue-600 border-b-2 font-medium text-sm'>Tab 1</div>
            <div className='px-4 py-2 text-muted-foreground text-sm'>Tab 2</div>
            <div className='px-4 py-2 text-muted-foreground text-sm'>Tab 3</div>
          </div>
          <div className='bg-white p-4 rounded'>Tab content goes here</div>
        </div>
      )

    case 'accordion':
      return (
        <div className='space-y-2 bg-violet-50 p-6 border-2 border-violet-300 border-dashed rounded-lg'>
          <div className='mb-2 font-semibold text-lg'>Accordion</div>
          {[1, 2, 3].map((i) => (
            <div key={i} className='bg-white border rounded'>
              <div className='p-3 font-medium text-sm'>Accordion Item {i}</div>
            </div>
          ))}
        </div>
      )

    // ==================== SOCIAL/ADVANCED WIDGETS ====================
    case 'social-share':
      return (
        <div className='bg-blue-50 p-6 border-2 border-blue-300 border-dashed rounded-lg'>
          <div className='flex justify-center gap-2'>
            {['Facebook', 'Twitter', 'LinkedIn'].map((platform) => (
              <div key={platform} className='bg-white px-4 py-2 border rounded text-sm'>
                {platform}
              </div>
            ))}
          </div>
        </div>
      )

    case 'social-feed':
      return (
        <div className='space-y-4 bg-sky-50 p-6 border-2 border-sky-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Social Feed</div>
          <div className='space-y-2'>
            {[1, 2].map((i) => (
              <div key={i} className='space-y-2 bg-white p-3 border rounded'>
                <div className='text-sm'>Post {i}</div>
                <div className='bg-gray-200 rounded aspect-video'></div>
              </div>
            ))}
          </div>
        </div>
      )

    case 'pricing':
      return (
        <div className='space-y-4 bg-emerald-50 p-6 border-2 border-emerald-300 border-dashed rounded-lg'>
          <div className='font-semibold text-lg'>Pricing Table</div>
          <div className='gap-4 grid grid-cols-3'>
            {['Basic', 'Pro', 'Enterprise'].map((plan) => (
              <div key={plan} className='space-y-2 bg-white p-4 border rounded text-center'>
                <div className='font-bold'>{plan}</div>
                <div className='font-bold text-green-600 text-2xl'>$99</div>
                <button className='bg-blue-600 px-4 py-2 rounded w-full text-white text-sm'>
                  Choose
                </button>
              </div>
            ))}
          </div>
        </div>
      )

    case 'icon-box':
      return (
        <div className='bg-amber-50 p-6 border-2 border-amber-300 border-dashed rounded-lg'>
          <div className='flex items-center gap-4'>
            <div className='flex justify-center items-center bg-blue-100 rounded-full w-16 h-16'>
              <span className='text-2xl'>📦</span>
            </div>
            <div className='flex-1'>
              <div className='font-bold'>Icon Box Title</div>
              <p className='text-muted-foreground text-sm'>Description text here</p>
            </div>
          </div>
        </div>
      )

    default:
      return <div className='text-gray-500 text-sm'>Component: {component.type}</div>
  }
}

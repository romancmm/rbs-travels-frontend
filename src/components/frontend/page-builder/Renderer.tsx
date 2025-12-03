'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import GridWithAPI from '@/components/frontend/page-builder/GridWithAPI'
import { cn } from '@/lib/utils'
import type {
  BaseComponent,
  Column as ColumnType,
  PageContent,
  Row as RowType,
  Section as SectionType
} from '@/types/page-builder'
import parse from 'html-react-parser'

// Global col-span map
const COL_SPAN: Record<number, string> = {
  1: 'col-span-12 sm:col-span-1',
  2: 'col-span-12 sm:col-span-2',
  3: 'col-span-12 sm:col-span-3',
  4: 'col-span-12 sm:col-span-4',
  5: 'col-span-12 sm:col-span-5',
  6: 'col-span-12 sm:col-span-6',
  7: 'col-span-12 sm:col-span-7',
  8: 'col-span-12 sm:col-span-8',
  9: 'col-span-12 sm:col-span-9',
  10: 'col-span-12 sm:col-span-10',
  11: 'col-span-12 sm:col-span-11',
  12: 'col-span-12'
}

function getColumnSpanClasses(column: ColumnType) {
  const resp = (column as any).settings?.responsive?.widths
  if (resp && typeof resp === 'object') {
    const parts: string[] = []
    if (resp.base) parts.push(COL_SPAN[resp.base] ?? 'col-span-12')
    if (resp.sm) parts.push(`sm:${COL_SPAN[resp.sm] ?? 'col-span-12'}`)
    if (resp.md) parts.push(`md:${COL_SPAN[resp.md] ?? 'col-span-12'}`)
    if (resp.lg) parts.push(`lg:${COL_SPAN[resp.lg] ?? 'col-span-12'}`)
    if (resp.xl) parts.push(`xl:${COL_SPAN[resp.xl] ?? 'col-span-12'}`)
    return parts.join(' ')
  }

  const width = (column as any).width ?? 12
  return COL_SPAN[width] ?? 'col-span-12'
}

function getVisibilityClasses(settings?: any) {
  if (!settings) return ''
  const classes: string[] = []
  if (settings.hideOnMobile) classes.push('hidden', 'sm:block')
  if (settings.hideOnTablet) classes.push('hidden', 'lg:block')
  if (settings.hideOnDesktop) classes.push('lg:hidden')
  return classes.join(' ')
}

function renderComponent(component: BaseComponent) {
  const props = component.props || {}
  const componentClassName = (component as any).settings?.className || ''

  // Basic rendering mirroring admin previews (no editor chrome)
  switch (component.type) {
    case 'heading': {
      const { level = 'h2', text = '', alignment = 'left', weight = 'bold' } = props as any
      return (
        <Typography
          key={component.id}
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
        text = '',
        alignment = 'left',
        variant = 'body1',
        weight = 'normal',
        isRichText = false
      } = props as any
      return (
        <Typography
          key={component.id}
          variant={variant as any}
          weight={weight as any}
          align={alignment as any}
          className={componentClassName}
        >
          {isRichText ? parse(text) : text}
        </Typography>
      )
    }
    case 'button': {
      const {
        text = 'Click',
        url = '#',
        openInNewTab = false,
        variant = 'primary',
        size = 'medium'
      } = props as any

      const variantClass =
        variant === 'primary'
          ? 'bg-primary text-white hover:bg-primary/90'
          : variant === 'secondary'
          ? 'bg-secondary text-white hover:opacity-95'
          : variant === 'outline'
          ? 'border border-gray-300 text-gray-700 bg-transparent'
          : 'bg-gray-100 text-gray-800'

      const sizeClass =
        size === 'small'
          ? 'px-3 py-1 text-sm'
          : size === 'large'
          ? 'px-6 py-3 text-lg'
          : 'px-4 py-2'

      return (
        <div key={component.id} className={componentClassName}>
          <CustomLink
            href={url}
            className={`inline-block rounded ${variantClass} ${sizeClass}`}
            target={openInNewTab ? '_blank' : undefined}
          >
            {text}
          </CustomLink>
        </div>
      )
    }

    case 'image': {
      const { src, alt = '', link = '', openInNewTab = false } = props as any

      // Prepare props for CustomImage (prefer numeric values). If builder provides
      // percentage or 'auto' values, apply them via wrapper styles instead.
      const imageProps: any = {}
      const imgElement = (
        <div className='max-w-full' key={component.id}>
          <CustomImage
            src={src}
            alt={alt}
            className={cn('w-full h-auto', componentClassName)}
            {...imageProps}
          />
        </div>
      )

      return link ? (
        <CustomLink href={link} target={openInNewTab ? '_blank' : undefined}>
          {imgElement}
        </CustomLink>
      ) : (
        imgElement
      )
    }

    case 'video': {
      const { url } = props as any
      // reuse simple embed for youtube/vimeo
      const getEmbed = (u: string) => {
        if (!u) return null
        if (u.includes('youtube') || u.includes('youtu.be')) {
          let id = ''
          if (u.includes('v=')) id = u.split('v=')[1]?.split('&')[0]
          else if (u.includes('youtu.be/')) id = u.split('youtu.be/')[1]?.split('?')[0]
          else if (u.includes('embed/')) id = u.split('embed/')[1]?.split('?')[0]
          return id ? `https://www.youtube.com/embed/${id}` : null
        }
        if (u.includes('vimeo')) {
          const m = u.match(/vimeo\.com\/(\d+)/)
          return m ? `https://player.vimeo.com/video/${m[1]}` : null
        }
        return null
      }

      const embed = getEmbed(url)

      // Convert aspectRatio to Tailwind classes (if aspectRatio prop is added later)
      const aspectClass = 'aspect-video' // Default 16/9

      return (
        <div key={component.id} className={cn('w-full', componentClassName)}>
          {embed ? (
            <div className={cn('relative w-full', aspectClass)}>
              <iframe
                src={embed}
                className='absolute inset-0 w-full h-full'
                allowFullScreen
                title={`video-${component.id}`}
              />
            </div>
          ) : (
            <div className='bg-gray-100 p-4 text-gray-500 text-sm'>No video</div>
          )}
        </div>
      )
    }

    case 'divider': {
      const { style = 'solid', thickness = '1px' } = props as any

      // Convert style to Tailwind classes
      const styleClass =
        style === 'dashed' ? 'border-dashed' : style === 'dotted' ? 'border-dotted' : 'border-solid'

      // Convert thickness to Tailwind classes
      const thicknessClass =
        thickness === '2px' ? 'border-t-2' : thickness === '4px' ? 'border-t-4' : 'border-t'

      return (
        <hr
          key={component.id}
          className={cn('my-4', styleClass, thicknessClass, componentClassName)}
        />
      )
    }

    case 'spacer': {
      const { height = '40px' } = props as any

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

      return <div key={component.id} className={cn(getHeightClass(height), componentClassName)} />
    }

    // ==================== FORM WIDGETS ====================
    case 'contact-form': {
      const {
        title = 'Contact Us',
        subtitle,
        showLabels = true,
        buttonText = 'Send Message'
      } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <Typography variant='h3' weight='bold'>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant='body1' className='text-gray-600'>
              {subtitle}
            </Typography>
          )}
          <form className='space-y-4'>
            <div>
              {showLabels && <label className='block mb-1 font-medium text-sm'>Name</label>}
              <input
                type='text'
                placeholder='Your name'
                className='px-4 py-2 border rounded-lg w-full'
              />
            </div>
            <div>
              {showLabels && <label className='block mb-1 font-medium text-sm'>Email</label>}
              <input
                type='email'
                placeholder='Your email'
                className='px-4 py-2 border rounded-lg w-full'
              />
            </div>
            <div>
              {showLabels && <label className='block mb-1 font-medium text-sm'>Message</label>}
              <textarea
                placeholder='Your message'
                rows={4}
                className='px-4 py-2 border rounded-lg w-full'
              />
            </div>
            <button
              type='submit'
              className='bg-primary hover:bg-primary/90 px-6 py-3 rounded-lg text-white'
            >
              {buttonText}
            </button>
          </form>
        </div>
      )
    }

    case 'newsletter': {
      const {
        title = 'Subscribe to Newsletter',
        subtitle,
        placeholder = 'Enter your email',
        buttonText = 'Subscribe'
      } = props as any
      return (
        <div key={component.id} className={cn('space-y-4', componentClassName)}>
          {title && (
            <Typography variant='h4' weight='bold'>
              {title}
            </Typography>
          )}
          {subtitle && (
            <Typography variant='body2' className='text-gray-600'>
              {subtitle}
            </Typography>
          )}
          <form className='flex gap-2'>
            <input
              type='email'
              placeholder={placeholder}
              className='flex-1 px-4 py-2 border rounded-lg'
            />
            <button
              type='submit'
              className='bg-primary hover:bg-primary/90 px-6 py-2 rounded-lg text-white whitespace-nowrap'
            >
              {buttonText}
            </button>
          </form>
        </div>
      )
    }

    case 'search': {
      const { placeholder = 'Search...', buttonText = 'Search' } = props as any
      return (
        <div key={component.id} className={cn('', componentClassName)}>
          <form className='flex gap-2'>
            <input
              type='text'
              placeholder={placeholder}
              className='flex-1 px-4 py-2 border rounded-lg'
            />
            <button
              type='submit'
              className='bg-gray-800 hover:bg-gray-900 px-6 py-2 rounded-lg text-white whitespace-nowrap'
            >
              {buttonText}
            </button>
          </form>
        </div>
      )
    }

    // ==================== CONTENT WIDGETS ====================
    case 'grid': {
      const {
        title,
        subtitle,
        showTitle = true,
        columns = 3,
        gap = '24',
        dataSource = 'api',
        apiEndpoint,
        apiParams = {},
        apiResponsePath = 'data.items',
        cardType = 'BlogCard',
        gridItems = [],
        cardStyle = 'default',
        hoverEffect = 'lift',
        enablePagination = false,
        itemsPerPage = 10,
        columnsMobile = 1,
        columnsTablet = 2,
        columnsDesktop = 3
      } = props as any

      // API Mode - Use GridWithAPI component
      if (dataSource === 'api') {
        return (
          <GridWithAPI
            key={component.id}
            title={title}
            subtitle={subtitle}
            showTitle={showTitle}
            gap={gap}
            apiEndpoint={apiEndpoint}
            apiParams={apiParams}
            apiResponsePath={apiResponsePath}
            cardType={cardType}
            cardStyle={cardStyle}
            hoverEffect={hoverEffect}
            enablePagination={enablePagination}
            itemsPerPage={itemsPerPage}
            columnsMobile={columnsMobile}
            columnsTablet={columnsTablet}
            columnsDesktop={columnsDesktop}
            className={componentClassName}
          />
        )
      }

      // Manual Mode - Render components in each grid item
      const getHoverClass = () => {
        switch (hoverEffect) {
          case 'lift':
            return 'hover:-translate-y-2 hover:shadow-xl'
          case 'zoom':
            return 'hover:scale-105'
          case 'glow':
            return 'hover:shadow-2xl hover:shadow-primary/20'
          default:
            return ''
        }
      }

      const getCardClass = () => {
        const base = 'bg-white rounded-lg overflow-hidden transition-all duration-300'
        const hover = getHoverClass()
        switch (cardStyle) {
          case 'minimal':
            return `${base} ${hover}`
          case 'bordered':
            return `${base} border-2 ${hover}`
          case 'elevated':
            return `${base} shadow-lg ${hover}`
          default:
            return `${base} border ${hover}`
        }
      }

      const items = gridItems

      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {showTitle && title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div
            className={cn('grid')}
            style={{
              gap: `${gap}px`,
              gridTemplateColumns: `repeat(auto-fill, minmax(min(300px, 100%), 1fr))`,
              ...(columns && {
                gridTemplateColumns: `repeat(${columns}, 1fr)`
              })
            }}
          >
            {items.length > 0 ? (
              items.map((item: any, i: number) => (
                <div
                  key={item.id || i}
                  className={cn(
                    getCardClass(),
                    item.settings?.className,
                    // Alignment classes
                    item.settings?.verticalAlign === 'center' && 'flex items-center',
                    item.settings?.verticalAlign === 'bottom' && 'flex items-end',
                    item.settings?.horizontalAlign === 'center' && 'justify-center text-center',
                    item.settings?.horizontalAlign === 'right' && 'justify-end text-right'
                  )}
                >
                  {/* Render components in this grid item */}
                  {item.components && item.components.length > 0 ? (
                    <div className='space-y-4 w-full'>
                      {item.components.map((comp: any) => renderComponent(comp))}
                    </div>
                  ) : (
                    <div className='p-4 text-gray-400 text-center'>
                      <Typography variant='body2'>Empty grid item</Typography>
                    </div>
                  )}
                </div>
              ))
            ) : (
              <div className='col-span-full py-12 text-gray-500 text-center'>
                <Typography variant='body1'>No grid items added yet</Typography>
              </div>
            )}
          </div>
        </div>
      )
    }

    case 'blog-carousel': {
      const { title, subtitle, showTitle = true, cardType = 'BlogCard' } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {showTitle && title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
            {[1, 2, 3].map((i) => (
              <div
                key={i}
                className='bg-white hover:shadow-lg border rounded-lg overflow-hidden transition-shadow'
              >
                <div className='bg-gray-200 aspect-video' />
                <div className='space-y-2 p-4'>
                  <Typography variant='h5' weight='semibold'>
                    {cardType} {i}
                  </Typography>
                  <Typography variant='body2' className='text-gray-600'>
                    Preview excerpt of the content goes here...
                  </Typography>
                  <CustomLink href='#' className='text-primary text-sm hover:underline'>
                    Read More →
                  </CustomLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    case 'tour-packages': {
      const { title, subtitle, columns = 2 } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div className={cn('gap-6 grid', `grid-cols-1 md:grid-cols-${columns}`)}>
            {[1, 2].map((i) => (
              <div
                key={i}
                className='bg-white hover:shadow-lg border rounded-lg overflow-hidden transition-shadow'
              >
                <div className='bg-gray-200 aspect-video' />
                <div className='space-y-3 p-4'>
                  <Typography variant='h5' weight='semibold'>
                    Amazing Tour Package {i}
                  </Typography>
                  <Typography variant='body2' className='text-gray-600'>
                    5 Days / 4 Nights
                  </Typography>
                  <div className='flex justify-between items-center'>
                    <Typography variant='h4' weight='bold' className='text-primary'>
                      $599
                    </Typography>
                    <button className='bg-primary hover:bg-primary/90 px-4 py-2 rounded-lg text-white'>
                      Book Now
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // ==================== INTERACTIVE WIDGETS ====================
    case 'testimonials': {
      const { title, subtitle, columns = 2 } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div className={cn('gap-6 grid', `grid-cols-1 md:grid-cols-${columns}`)}>
            {[1, 2].map((i) => (
              <div key={i} className='space-y-4 bg-white p-6 border rounded-lg'>
                <div className='flex items-center gap-2'>
                  {[1, 2, 3, 4, 5].map((star) => (
                    <span key={star} className='text-yellow-400'>
                      ★
                    </span>
                  ))}
                </div>
                <Typography variant='body1' className='text-gray-700 italic'>
                  &quot;Excellent service! Highly recommend to everyone. The experience was amazing
                  and unforgettable.&quot;
                </Typography>
                <div className='flex items-center gap-3'>
                  <div className='bg-gray-200 rounded-full w-12 h-12' />
                  <div>
                    <Typography variant='body1' weight='semibold'>
                      Customer Name
                    </Typography>
                    <Typography variant='body2' className='text-gray-500'>
                      Verified Customer
                    </Typography>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    }

    case 'faq': {
      const { title, subtitle } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div className='space-y-3'>
            {[1, 2, 3].map((i) => (
              <details key={i} className='group bg-white p-4 border rounded-lg'>
                <summary className='flex justify-between items-center font-semibold cursor-pointer list-none'>
                  Frequently Asked Question {i}?
                  <span className='text-gray-400 group-open:rotate-180 transition-transform'>
                    ▼
                  </span>
                </summary>
                <Typography variant='body2' className='mt-3 text-gray-600'>
                  This is the answer to the frequently asked question. It provides detailed
                  information to help users.
                </Typography>
              </details>
            ))}
          </div>
        </div>
      )
    }

    case 'stats': {
      const { title, columns = 4 } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <Typography variant='h3' weight='bold' align='center'>
              {title}
            </Typography>
          )}
          <div className={cn('gap-6 grid text-center', `grid-cols-2 md:grid-cols-${columns}`)}>
            {[
              { number: '1000+', label: 'Happy Customers' },
              { number: '50+', label: 'Destinations' },
              { number: '10+', label: 'Years Experience' },
              { number: '24/7', label: 'Support' }
            ].map((stat, i) => (
              <div key={i} className='space-y-2'>
                <Typography variant='h2' weight='bold' className='text-primary'>
                  {stat.number}
                </Typography>
                <Typography variant='body1' className='text-gray-600'>
                  {stat.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )
    }

    case 'gallery': {
      const { title, subtitle, columns = 4 } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div className={cn('gap-4 grid', `grid-cols-2 md:grid-cols-${columns}`)}>
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div
                key={i}
                className='bg-gray-200 hover:opacity-80 rounded-lg aspect-square transition-opacity cursor-pointer'
              />
            ))}
          </div>
        </div>
      )
    }

    case 'map': {
      const { title, address = 'Your Location' } = props as any
      return (
        <div key={component.id} className={cn('space-y-4', componentClassName)}>
          {title && (
            <Typography variant='h3' weight='bold'>
              {title}
            </Typography>
          )}
          <div className='flex justify-center items-center bg-gray-200 rounded-lg h-[400px]'>
            <div className='space-y-2 text-center'>
              <Typography variant='h5' className='text-gray-500'>
                📍 Map Location
              </Typography>
              <Typography variant='body2' className='text-gray-400'>
                {address}
              </Typography>
            </div>
          </div>
        </div>
      )
    }

    case 'countdown': {
      const { title } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <Typography variant='h3' weight='bold' align='center'>
              {title}
            </Typography>
          )}
          <div className='gap-4 grid grid-cols-4 text-center'>
            {[
              { value: '10', label: 'Days' },
              { value: '05', label: 'Hours' },
              { value: '30', label: 'Minutes' },
              { value: '45', label: 'Seconds' }
            ].map((unit, i) => (
              <div key={i} className='space-y-2 bg-white p-4 border rounded-lg'>
                <Typography variant='h2' weight='bold' className='text-primary'>
                  {unit.value}
                </Typography>
                <Typography variant='body2' className='text-gray-600'>
                  {unit.label}
                </Typography>
              </div>
            ))}
          </div>
        </div>
      )
    }

    // ==================== LAYOUT WIDGETS ====================
    case 'tabs': {
      const { tabs = [] } = props as any
      const defaultTabs =
        tabs.length > 0
          ? tabs
          : [
              { title: 'Tab 1', content: 'Content for tab 1' },
              { title: 'Tab 2', content: 'Content for tab 2' },
              { title: 'Tab 3', content: 'Content for tab 3' }
            ]
      return (
        <div key={component.id} className={cn('space-y-4', componentClassName)}>
          <div className='flex gap-2 border-b'>
            {defaultTabs.map((tab: any, i: number) => (
              <button
                key={i}
                className={cn(
                  'px-4 py-2 font-medium transition-colors',
                  i === 0
                    ? 'border-b-2 border-primary text-primary'
                    : 'text-gray-600 hover:text-gray-900'
                )}
              >
                {tab.title}
              </button>
            ))}
          </div>
          <div className='bg-white p-4 border rounded-lg'>
            <Typography variant='body1'>{defaultTabs[0]?.content}</Typography>
          </div>
        </div>
      )
    }

    case 'accordion': {
      const { title, items = [] } = props as any
      const defaultItems =
        items.length > 0
          ? items
          : [
              { title: 'Accordion Item 1', content: 'Content for accordion item 1' },
              { title: 'Accordion Item 2', content: 'Content for accordion item 2' },
              { title: 'Accordion Item 3', content: 'Content for accordion item 3' }
            ]
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <Typography variant='h3' weight='bold'>
              {title}
            </Typography>
          )}
          <div className='space-y-2'>
            {defaultItems.map((item: any, i: number) => (
              <details key={i} className='group bg-white p-4 border rounded-lg'>
                <summary className='flex justify-between items-center font-semibold cursor-pointer list-none'>
                  {item.title}
                  <span className='text-gray-400 group-open:rotate-180 transition-transform'>
                    ▼
                  </span>
                </summary>
                <Typography variant='body2' className='mt-3 text-gray-600'>
                  {item.content}
                </Typography>
              </details>
            ))}
          </div>
        </div>
      )
    }

    // ==================== SOCIAL/ADVANCED WIDGETS ====================
    case 'social-share': {
      const { title, platforms = ['facebook', 'twitter', 'linkedin', 'whatsapp'] } = props as any
      return (
        <div key={component.id} className={cn('space-y-4', componentClassName)}>
          {title && (
            <Typography variant='h5' weight='semibold'>
              {title}
            </Typography>
          )}
          <div className='flex gap-3'>
            {platforms.map((platform: string) => (
              <button
                key={platform}
                className='flex justify-center items-center bg-gray-100 hover:bg-gray-200 rounded-full w-10 h-10 transition-colors'
                title={`Share on ${platform}`}
              >
                <span className='text-xl'>{platform[0].toUpperCase()}</span>
              </button>
            ))}
          </div>
        </div>
      )
    }

    case 'social-feed': {
      const { title, postsToShow = 6 } = props as any
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <Typography variant='h3' weight='bold' align='center'>
              {title}
            </Typography>
          )}
          <div className='gap-4 grid grid-cols-2 md:grid-cols-3'>
            {Array.from({ length: postsToShow }).map((_, i) => (
              <div
                key={i}
                className='bg-gray-200 hover:opacity-80 rounded-lg aspect-square transition-opacity cursor-pointer'
              />
            ))}
          </div>
        </div>
      )
    }

    case 'pricing': {
      const { title, subtitle, plans = [] } = props as any
      const defaultPlans =
        plans.length > 0
          ? plans
          : [
              { name: 'Basic', price: '$29', features: ['Feature 1', 'Feature 2', 'Feature 3'] },
              {
                name: 'Pro',
                price: '$59',
                features: ['All Basic', 'Feature 4', 'Feature 5'],
                highlighted: true
              },
              { name: 'Enterprise', price: '$99', features: ['All Pro', 'Feature 6', 'Feature 7'] }
            ]
      return (
        <div key={component.id} className={cn('space-y-6', componentClassName)}>
          {title && (
            <div className='space-y-2 text-center'>
              <Typography variant='h3' weight='bold'>
                {title}
              </Typography>
              {subtitle && (
                <Typography variant='body1' className='text-gray-600'>
                  {subtitle}
                </Typography>
              )}
            </div>
          )}
          <div className='gap-6 grid grid-cols-1 md:grid-cols-3'>
            {defaultPlans.map((plan: any, i: number) => (
              <div
                key={i}
                className={cn(
                  'space-y-4 bg-white p-6 border rounded-lg text-center',
                  plan.highlighted && 'ring-2 ring-primary shadow-lg scale-105'
                )}
              >
                <Typography variant='h4' weight='bold'>
                  {plan.name}
                </Typography>
                <Typography variant='h2' weight='bold' className='text-primary'>
                  {plan.price}
                </Typography>
                <div className='space-y-2'>
                  {plan.features.map((feature: string, j: number) => (
                    <Typography key={j} variant='body2' className='text-gray-600'>
                      ✓ {feature}
                    </Typography>
                  ))}
                </div>
                <button className='bg-primary hover:bg-primary/90 py-3 rounded-lg w-full text-white'>
                  Choose Plan
                </button>
              </div>
            ))}
          </div>
        </div>
      )
    }

    case 'icon-box': {
      const {
        icon = '📦',
        title = 'Icon Box Title',
        description = 'Description text goes here',
        layout = 'horizontal'
      } = props as any
      return (
        <div
          key={component.id}
          className={cn(
            'bg-white p-6 border rounded-lg',
            layout === 'horizontal' ? 'flex items-center gap-4' : 'space-y-4 text-center',
            componentClassName
          )}
        >
          <div className='text-5xl shrink-0'>{icon}</div>
          <div className='space-y-2'>
            <Typography variant='h4' weight='bold'>
              {title}
            </Typography>
            <Typography variant='body2' className='text-gray-600'>
              {description}
            </Typography>
          </div>
        </div>
      )
    }

    default:
      return (
        <div key={component.id} className={cn('text-gray-500 text-sm', componentClassName)}>
          {component.type}
        </div>
      )
  }
}

function ColumnRenderer({ column }: { column: ColumnType }) {
  const spanClass = getColumnSpanClasses(column)
  const columnSettings = (column as any).settings
  const columnClassName = columnSettings?.className || ''
  const visClass = getVisibilityClasses(columnSettings)

  return (
    <div className={cn('items-center', spanClass, visClass, columnClassName)}>
      {column.components?.map((c, index) => (
        <div key={index}>{renderComponent(c)}</div>
      ))}
    </div>
  )
}

function RowRenderer({ row }: { row: RowType }) {
  const rowSettings = (row as any).settings
  const rowClassName = rowSettings?.className || ''
  const visClass = getVisibilityClasses(rowSettings)

  return (
    <div className={cn('gap-4 grid grid-cols-12', visClass, rowClassName)}>
      {row.columns.map((col) => (
        <ColumnRenderer key={col.id} column={col} />
      ))}
    </div>
  )
}

function SectionRenderer({ section }: { section: SectionType }) {
  const sectionSettings = (section as any).settings
  const sectionClassName = sectionSettings?.className || ''
  const visClass = getVisibilityClasses(sectionSettings)

  return (
    <Section className={cn('w-full', visClass, sectionClassName)}>
      <Container>
        {section.rows.map((r) => (
          <div key={r.id} className='mb-6'>
            <RowRenderer row={r} />
          </div>
        ))}
      </Container>
    </Section>
  )
}

export default function PageBuilderRenderer({ content }: { content: PageContent }) {
  if (!content || !content.sections || content.sections.length === 0) return null

  return (
    <div>
      {content.sections.map((section) => (
        <SectionRenderer key={section.id} section={section} />
      ))}
    </div>
  )
}

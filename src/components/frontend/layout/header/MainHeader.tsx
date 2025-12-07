'use client'

import CustomLink from '@/components/common/CustomLink'
import SiteLogo from '@/components/common/SiteLogo'
import { containerVariants } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
// import { siteConfig } from '@/data/siteConfig'
import { useSiteConfig } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import { ChevronDown, Phone } from 'lucide-react'
import { useRef, useState } from 'react'
import MobileNav from './MobileNav'

export default function MainHeader({ data }: { data: any }) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)
  const [hoveredChild, setHoveredChild] = useState<string | null>(null)
  const [isMoreHovered, setIsMoreHovered] = useState(false)
  const parentRefs = useRef<{ [key: string]: HTMLDivElement | null }>({})
  const { siteConfig } = useSiteConfig()

  const publishedItems = data?.filter((i: any) => i.isPublished) ?? []
  const visibleItems = publishedItems.length > 5 ? publishedItems.slice(0, 6) : publishedItems
  const moreItems = publishedItems.length > 5 ? publishedItems.slice(6) : []

  const getDropdownPosition = (parentKey: string, isNested: boolean = false) => {
    const parentEl = parentRefs.current[parentKey]
    if (!parentEl) return isNested ? 'left' : 'left'

    const parentRect = parentEl.getBoundingClientRect()
    const windowWidth = window.innerWidth
    const dropdownWidth = 256 // w-64 = 16rem = 256px
    const padding = 20

    if (isNested) {
      // For nested dropdowns (children/grandchildren), check right side space
      const spaceOnRight = windowWidth - parentRect.right
      const spaceOnLeft = parentRect.left

      // If not enough space on right, try left
      return spaceOnRight < dropdownWidth + padding && spaceOnLeft > dropdownWidth + padding
        ? 'right'
        : 'left'
    } else {
      // For first-level dropdowns, check if it would overflow right edge
      const wouldOverflowRight = parentRect.left + dropdownWidth > windowWidth - padding
      return wouldOverflowRight ? 'right' : 'left'
    }
  }

  return (
    <div className={cn(containerVariants())}>
      <div className='flex flex-row justify-between items-center gap-x-4 min-h-20 text-header-color'>
        {/* Logo Section */}
        <SiteLogo />

        {/* Main Navigation (dynamic) */}
        {publishedItems.length > 0 && (
          <nav className='hidden xl:flex items-center gap-4 ml-10'>
            {visibleItems.map((item: any, index: number) => {
              const publishedChildren = item.children?.filter((c: any) => c.isPublished) ?? []

              return (
                <div
                  key={item.id ?? index}
                  ref={(el) => {
                    parentRefs.current[`level1-${index}`] = el
                  }}
                  className='relative'
                  onMouseEnter={() => setHoveredItem(index)}
                  onMouseLeave={() => setHoveredItem(null)}
                >
                  <CustomLink
                    href={item?.slug || '#'}
                    className='group flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300'
                  >
                    <Typography
                      variant='body1'
                      weight='medium'
                      className='text-header-color group-hover:text-header-color/90 transition-colors duration-300'
                    >
                      {item.title}
                    </Typography>
                    {publishedChildren.length > 0 && (
                      <ChevronDown
                        className={`w-4 h-4 transition-transform duration-300 ${hoveredItem === index ? 'rotate-180' : ''
                          }`}
                      />
                    )}
                  </CustomLink>

                  {/* Dropdown Menu for Services */}
                  {publishedChildren.length > 0 && hoveredItem === index && (
                    <div
                      className={cn(
                        'top-full z-50 absolute bg-white slide-in-from-top-2 shadow-2xl backdrop-blur-sm border border-gray-200/50 rounded-2xl w-64 animate-in duration-300 fade-in-0',
                        getDropdownPosition(`level1-${index}`) === 'right' ? 'right-0' : 'left-0'
                      )}
                    >
                      <div className='py-2'>
                        {publishedChildren.map((child: any, childIndex: number) => {
                          const childPublishedChildren =
                            child.children?.filter((c: any) => c.isPublished) ?? []
                          const childKey = `${item.id}-${child.id ?? childIndex}`

                          return (
                            <div
                              key={child.id ?? childIndex}
                              ref={(el) => {
                                parentRefs.current[childKey] = el
                              }}
                              className='relative'
                              onMouseEnter={() => setHoveredChild(childKey)}
                              onMouseLeave={() => setHoveredChild(null)}
                            >
                              <CustomLink
                                href={child?.slug || '#'}
                                className='group flex justify-between items-center hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/5 mx-2 px-4 py-3 rounded-xl text-header-color hover:text-primary transition-all duration-200'
                              >
                                <Typography
                                  variant='body2'
                                  weight='medium'
                                  className='transition-transform group-hover:translate-x-1 duration-200'
                                >
                                  {child.title}
                                </Typography>
                                {childPublishedChildren.length > 0 && (
                                  <ChevronDown className='w-4 h-4 group-hover:text-primary -rotate-90 transition-colors' />
                                )}
                              </CustomLink>
                              {/* Third Level Dropdown */}
                              {childPublishedChildren.length > 0 && hoveredChild === childKey && (
                                <div
                                  className={cn(
                                    'top-0 z-50 absolute bg-header-background shadow-2xl backdrop-blur-sm border border-gray-200/50 rounded-2xl w-64 animate-in duration-300 fade-in-0',
                                    getDropdownPosition(childKey, true) === 'right'
                                      ? 'right-full mr-2 slide-in-from-right-2'
                                      : 'left-full ml-2 slide-in-from-left-2'
                                  )}
                                >
                                  <div className='py-2'>
                                    {childPublishedChildren.map(
                                      (grandChild: any, grandChildIndex: number) => (
                                        <CustomLink
                                          key={grandChild.id ?? grandChildIndex}
                                          href={grandChild?.slug || '#'}
                                          className='group flex items-center hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/5 mx-2 px-4 py-3 rounded-xl text-header-color hover:text-primary transition-all duration-200'
                                        >
                                          <Typography
                                            variant='body2'
                                            weight='medium'
                                            className='transition-transform group-hover:translate-x-1 duration-200'
                                          >
                                            {grandChild.title}
                                          </Typography>
                                        </CustomLink>
                                      )
                                    )}
                                  </div>
                                </div>
                              )
                              }
                            </div>
                          )
                        })}
                      </div>
                    </div>
                  )
                  }
                </div>
              )
            })}

            {/* More Dropdown */}
            {moreItems.length > 0 && (
              <div
                ref={(el) => {
                  parentRefs.current['more-menu'] = el
                }}
                className='relative'
                onMouseEnter={() => setIsMoreHovered(true)}
                onMouseLeave={() => setIsMoreHovered(false)}
              >
                {' '}
                <button className='group flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300'>
                  <Typography
                    variant='body1'
                    weight='medium'
                    className='text-header-color group-hover:text-header-color/90 transition-colors duration-300'
                  >
                    More
                  </Typography>
                  <ChevronDown
                    className={`w-4 h-4 transition-transform duration-300 ${isMoreHovered ? 'rotate-180' : ''
                      }`}
                  />
                </button>
                {isMoreHovered && (
                  <div
                    className={cn(
                      'top-full z-50 absolute bg-header-background slide-in-from-top-2 shadow-2xl backdrop-blur-sm border border-gray-200/50 rounded-2xl w-64 animate-in duration-300 fade-in-0',
                      getDropdownPosition('more-menu') === 'right' ? 'right-0' : 'left-0'
                    )}
                  >
                    <div className='py-2'>
                      {moreItems.map((item: any, itemIndex: number) => {
                        const publishedChildren =
                          item.children?.filter((c: any) => c.isPublished) ?? []
                        const moreItemKey = `more-${item.id ?? itemIndex}`

                        return (
                          <div
                            key={item.id ?? itemIndex}
                            ref={(el) => {
                              parentRefs.current[moreItemKey] = el
                            }}
                            className='relative'
                            onMouseEnter={() => setHoveredChild(moreItemKey)}
                            onMouseLeave={() => setHoveredChild(null)}
                          >
                            <CustomLink
                              href={item?.slug || '#'}
                              className='group flex justify-between items-center hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/5 mx-2 px-4 py-3 rounded-xl text-header-color hover:text-primary transition-all duration-200'
                            >
                              <Typography
                                variant='body2'
                                weight='medium'
                                className='transition-transform group-hover:translate-x-1 duration-200'
                              >
                                {item.title}
                              </Typography>
                              {publishedChildren.length > 0 && (
                                <ChevronDown className='w-4 h-4 group-hover:text-primary -rotate-90 transition-colors' />
                              )}
                            </CustomLink>

                            {/* Second Level Dropdown from More */}
                            {publishedChildren.length > 0 && hoveredChild === moreItemKey && (
                              <div
                                className={cn(
                                  'top-0 z-50 absolute bg-white shadow-2xl backdrop-blur-sm rounded-2xl w-64 animate-in duration-300 fade-in-0',
                                  getDropdownPosition(moreItemKey, true) === 'right'
                                    ? 'right-full mr-2 slide-in-from-right-2'
                                    : 'left-full ml-2 slide-in-from-left-2'
                                )}
                              >
                                <div className='py-2'>
                                  {publishedChildren.map((child: any, childIndex: number) => {
                                    const childPublishedChildren =
                                      child.children?.filter((c: any) => c.isPublished) ?? []
                                    const nestedKey = `${moreItemKey}-${child.id ?? childIndex}`

                                    return (
                                      <div
                                        key={child.id ?? childIndex}
                                        ref={(el) => {
                                          parentRefs.current[nestedKey] = el
                                        }}
                                        className='relative'
                                        onMouseEnter={() => setHoveredChild(nestedKey)}
                                        onMouseLeave={() => setHoveredChild(null)}
                                      >
                                        <CustomLink
                                          href={child?.slug || '#'}
                                          className='group flex justify-between items-center hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/5 mx-2 px-4 py-3 rounded-xl text-header-color hover:text-primary transition-all duration-200'
                                        >
                                          <Typography
                                            variant='body2'
                                            weight='medium'
                                            className='transition-transform group-hover:translate-x-1 duration-200'
                                          >
                                            {child.title}
                                          </Typography>
                                          {childPublishedChildren.length > 0 && (
                                            <ChevronDown className='w-4 h-4 group-hover:text-primary -rotate-90 transition-colors' />
                                          )}
                                        </CustomLink>

                                        {/* Third Level Dropdown */}
                                        {childPublishedChildren.length > 0 &&
                                          hoveredChild === nestedKey && (
                                            <div
                                              className={cn(
                                                'top-0 z-50 absolute bg-white shadow-2xl backdrop-blur-sm rounded-2xl w-64 animate-in duration-300 fade-in-0',
                                                getDropdownPosition(nestedKey, true) === 'right'
                                                  ? 'right-full mr-2 slide-in-from-right-2'
                                                  : 'left-full ml-2 slide-in-from-left-2'
                                              )}
                                            >
                                              <div className='py-2'>
                                                {childPublishedChildren.map(
                                                  (grandChild: any, grandChildIndex: number) => (
                                                    <CustomLink
                                                      key={grandChild.id ?? grandChildIndex}
                                                      href={grandChild?.slug || '#'}
                                                      className='group flex items-center hover:bg-linear-to-r hover:from-primary/10 hover:to-primary/5 mx-2 px-4 py-3 rounded-xl text-header-color hover:text-primary transition-all duration-200'
                                                    >
                                                      <Typography
                                                        variant='body2'
                                                        weight='medium'
                                                        className='transition-transform group-hover:translate-x-1 duration-200'
                                                      >
                                                        {grandChild.title}
                                                      </Typography>
                                                    </CustomLink>
                                                  )
                                                )}
                                              </div>
                                            </div>
                                          )}
                                      </div>
                                    )
                                  })}
                                </div>
                              </div>
                            )}
                          </div>
                        )
                      })}
                    </div>
                  </div>
                )}
              </div>
            )}
          </nav>
        )}

        {/* Contact & CTA Section */}
        {siteConfig && (
          <div className='hidden xl:flex items-center gap-4'>
            {/* Phone Number */}
            <div className='flex items-center gap-2 text-header-color/90 hover:text-header-color transition-colors'>
              <div className='flex justify-center items-center bg-primary/20 rounded-lg w-10 h-10'>
                <Phone className='w-5 h-5' />
              </div>
              <div className='text-sm'>
                <Typography variant='caption' className='text-header-color/70'>
                  Call us
                </Typography>

                <Typography
                  href={`tel:${siteConfig.hotline?.replace(' ', '')}`}
                  variant='body2'
                  weight='semibold'
                >
                  {siteConfig.hotline?.replace('+88', '')}
                </Typography>
              </div>
            </div>
          </div>
        )}

        {/* Mobile Navigation */}
        <MobileNav items={data} />
      </div>
    </div >
  )
}

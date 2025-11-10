'use client'

import CustomLink from '@/components/common/CustomLink'
import SiteLogo from '@/components/common/SiteLogo'
import { containerVariants } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
import { siteConfig } from '@/data/siteConfig'
import { cn } from '@/lib/utils'
import { ChevronDown, Phone } from 'lucide-react'
import { useState } from 'react'
import MobileNav from './MobileNav'

export default function MainHeader({ data }: { data: any }) {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className={cn(containerVariants())}>
      <div className='flex flex-row justify-between items-center gap-x-4 min-h-20 text-white'>
        {/* Logo Section */}
        <SiteLogo />

        {/* Main Navigation (dynamic) */}
        {data?.filter((i: any) => i.isPublished).length > 0 && (
          <nav className='hidden xl:flex items-center gap-4 ml-10'>
            {data
              .filter((i: any) => i.isPublished)
              .map((item: any, index: number) => {
                const publishedChildren = item.children?.filter((c: any) => c.isPublished) ?? []

                return (
                  <div
                    key={item.id ?? index}
                    className='relative'
                    onMouseEnter={() => setHoveredItem(index)}
                    onMouseLeave={() => setHoveredItem(null)}
                  >
                    <CustomLink
                      href={item?.type === 'custom-link' ? item.link : `/page/${item.slug}`}
                      className='group flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300'
                    >
                      <Typography
                        variant='body1'
                        weight='medium'
                        className='text-white group-hover:text-white transition-colors duration-300'
                      >
                        {item.title}
                      </Typography>
                      {publishedChildren.length > 0 && (
                        <ChevronDown
                          className={`w-4 h-4 transition-transform duration-300 ${
                            hoveredItem === index ? 'rotate-180' : ''
                          }`}
                        />
                      )}
                    </CustomLink>

                    {/* Dropdown Menu for Services */}
                    {publishedChildren.length > 0 && hoveredItem === index && (
                      <div className='top-full left-0 z-50 absolute bg-white slide-in-from-top-2 shadow-xl border border-gray-100 rounded-xl w-56 animate-in duration-200'>
                        {publishedChildren.map((child: any, childIndex: number) => (
                          <CustomLink
                            key={child.id ?? childIndex}
                            href={
                              child?.type === 'custom-link' ? child.link : `/page/${child.slug}`
                            }
                            className='block hover:bg-primary/10 px-4 py-3 text-gray-700 hover:text-primary transition-colors duration-200'
                          >
                            <Typography variant='body2' weight='medium'>
                              {child.title}
                            </Typography>
                          </CustomLink>
                        ))}
                      </div>
                    )}
                  </div>
                )
              })}
          </nav>
        )}

        {/* Contact & CTA Section */}
        <div className='hidden lg:flex items-center gap-4'>
          {/* Phone Number */}
          <div className='flex items-center gap-2 text-white/90 hover:text-white transition-colors'>
            <div className='flex justify-center items-center bg-primary/20 rounded-lg w-10 h-10'>
              <Phone className='w-5 h-5' />
            </div>
            <div className='text-sm'>
              <Typography variant='caption' className='text-white/70'>
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

          {/* CTA Button */}
          {/* <Button className='bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300'>
            Book Now
          </Button> */}
        </div>

        {/* Mobile Navigation */}
        <MobileNav items={data} />
      </div>
    </div>
  )
}

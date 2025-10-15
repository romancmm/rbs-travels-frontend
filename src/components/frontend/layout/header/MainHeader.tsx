'use client'

import CustomLink from '@/components/common/CustomLink'
import SiteLogo from '@/components/common/SiteLogo'
import { containerVariants } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
import { siteConfig } from '@/data/siteConfig'
import { ChevronDown, Phone } from 'lucide-react'
import { useState } from 'react'
import MobileNav from './MobileNav'

export default function MainHeader() {
  const [hoveredItem, setHoveredItem] = useState<number | null>(null)

  return (
    <div className={containerVariants()}>
      <div className='flex flex-row justify-between items-center gap-x-4 min-h-[80px] text-white'>
        {/* Logo Section */}
        <SiteLogo />

        {/* Main Navigation */}
        {siteConfig.mainNav?.length > 0 && (
          <nav className='hidden xl:flex items-center gap-4 ml-10'>
            {siteConfig.mainNav.map((item: any, index: number) => (
              <div
                key={index}
                className='relative'
                onMouseEnter={() => setHoveredItem(index)}
                onMouseLeave={() => setHoveredItem(null)}
              >
                <CustomLink
                  href={item.href ?? '#'}
                  className='group flex items-center gap-1 hover:bg-white/10 px-3 py-2 rounded-lg transition-all duration-300'
                >
                  <Typography
                    variant='body1'
                    weight='medium'
                    className='text-white group-hover:text-white transition-colors duration-300'
                  >
                    {item.title}
                  </Typography>
                  {item.children && (
                    <ChevronDown
                      className={`w-4 h-4 transition-transform duration-300 ${hoveredItem === index ? 'rotate-180' : ''
                        }`}
                    />
                  )}
                </CustomLink>

                {/* Dropdown Menu for Services */}
                {item.children && hoveredItem === index && (
                  <div className='top-full left-0 z-50 absolute bg-white slide-in-from-top-2 shadow-xl border border-gray-100 rounded-xl w-56 animate-in duration-200'>
                    {item.children.map((child: any, childIndex: number) => (
                      <CustomLink
                        key={childIndex}
                        href={child.href ?? '#'}
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
            ))}
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

              <Typography href={`tel:${siteConfig.phone?.replace(' ', '')}`} variant='body2' weight='semibold'>
                {siteConfig.phone?.replace('+88', '')}
              </Typography>
            </div>
          </div>

          {/* CTA Button */}
          {/* <Button className='bg-primary hover:bg-primary/90 shadow-lg hover:shadow-xl px-6 py-2.5 rounded-lg font-semibold text-white hover:scale-105 transition-all duration-300'>
            Book Now
          </Button> */}
        </div>

        {/* Mobile Navigation */}
        <MobileNav items={siteConfig.mainNav} />
      </div>
    </div>
  )
}

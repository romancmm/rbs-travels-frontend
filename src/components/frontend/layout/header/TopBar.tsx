'use client'

import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { siteConfig } from '@/data/siteConfig'
import { Clock, Mail, Phone, X } from 'lucide-react'
import { useState } from 'react'

export default function TopBar() {
  const [isVisible, setIsVisible] = useState(true)

  if (!isVisible) return null

  return (
    <div className='relative bg-primary py-2 text-white'>
      <Container>
        <div className='flex justify-between items-center'>
          {/* Left side - Contact info */}
          <div className='hidden md:flex items-center gap-6 text-sm'>
            <div className='flex items-center gap-2'>
              <Phone className='w-3 h-3' />
              <CustomLink
                href={`tel:${siteConfig.phone}`}
                className='hover:text-primary-foreground/80 transition-colors'
              >
                {siteConfig.phone}
              </CustomLink>
            </div>
            <div className='flex items-center gap-2'>
              <Mail className='w-3 h-3' />
              <CustomLink
                href={`mailto:${siteConfig.email}`}
                className='hover:text-primary-foreground/80 transition-colors'
              >
                {siteConfig.email}
              </CustomLink>
            </div>
            <div className='flex items-center gap-2'>
              <Clock className='w-3 h-3' />
              <span>Mon - Fri: 9:00 AM - 6:00 PM</span>
            </div>
          </div>

          {/* Center - Announcement */}
          <div className='flex flex-1'>
            <Typography variant='body2' className='font-medium lg:text-end'>
              ✈️ Special Offer: Get 20% off on international flights!
              {/* <CustomLink href='/page/offers' className='ml-2 underline hover:no-underline'>
                Book Now
              </CustomLink> */}
            </Typography>
          </div>

          {/* Right side - Close button */}
          <button
            onClick={() => setIsVisible(false)}
            className='top-1.5 right-2 absolute flex justify-center items-center hover:bg-white/20 rounded-full w-6 h-6 transition-colors'
            aria-label='Close announcement'
          >
            <X className='w-3 h-3' />
          </button>
        </div>
      </Container>
    </div>
  )
}

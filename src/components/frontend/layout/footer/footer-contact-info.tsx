'use client'

import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { Mail, Phone } from 'lucide-react'

interface Address {
  title?: string
  address?: string
  phone?: string
  email?: string
}

interface FooterContactInfoProps {
  addresses?: Address[]
  className?: string
}

export function FooterContactInfo({ addresses, className }: FooterContactInfoProps) {
  if (!addresses || addresses.length === 0) return null

  return (
    <div className={cn('space-y-6', className)}>
      <Typography variant='h6' weight='semibold' className='text-white'>
        Get in Touch
      </Typography>

      <div
        className={cn('flex flex-wrap gap-8 w-full', {
          'flex-col sm:flex-row sm:gap-12 *:lg:max-w-[calc(50%-3rem)]': addresses.length <= 1
        })}
      >
        {addresses.map((office, index) => (
          <div key={index} className='flex gap-2.5 align-start'>
            {office.title && (
              <Typography
                variant='body1'
                weight='semibold'
                className='bg-gray-900/20 px-2 py-1 font-cursive text-footer-color/30 text-center uppercase tracking-wide [writing-mode:sideways-lr]'
              >
                {office.title}
              </Typography>
            )}

            <div className='space-y-2'>
              {office.address && (
                <div className='flex items-start gap-3 text-footer-color/90 hover:text-footer-color/80 transition-colors'>
                  <Typography variant='body2' className='leading-relaxed'>
                    {office.address}
                  </Typography>
                </div>
              )}

              {office.phone && (
                <div className='flex items-center gap-3 text-footer-color/90 hover:text-footer-color/80 transition-colors'>
                  <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0'>
                    <Phone className='w-4 h-4' />
                  </div>
                  <CustomLink
                    href={`tel:${office.phone.replace(/\s+/g, '')}`}
                    className='hover:text-footer-color/80 transition-colors'
                  >
                    <Typography variant='body2'>{office.phone}</Typography>
                  </CustomLink>
                </div>
              )}

              {office.email && (
                <div className='flex items-center gap-3 text-footer-color/90 hover:text-footer-color/80 transition-colors'>
                  <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0'>
                    <Mail className='w-4 h-4' />
                  </div>
                  <CustomLink
                    href={`mailto:${office.email}`}
                    className='hover:text-footer-color/80 transition-colors'
                  >
                    <Typography variant='body2'>{office.email}</Typography>
                  </CustomLink>
                </div>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}

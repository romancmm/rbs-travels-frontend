'use client'

import SocialLinks from '@/components/common/SocialLinks'
import { Typography } from '@/components/common/typography'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'

interface FooterCompanyInfoProps {
  siteConfig?: SiteSettings
}

export function FooterCompanyInfo({ siteConfig }: FooterCompanyInfoProps) {
  return (
    <div className='space-y-6'>
      <div className='flex items-center gap-3'>
        <Typography variant='h6' weight='bold' className='text-footer-color'>
          {siteConfig?.name}
        </Typography>
      </div>

      <Typography variant='body1' className='max-w-sm text-footer-color/90 leading-relaxed'>
        {siteConfig?.shortDescription}
      </Typography>

      <div>
        <Typography variant='h6' weight='semibold' className='mb-3 text-white'>
          Follow Us
        </Typography>
        <SocialLinks />
      </div>
    </div>
  )
}

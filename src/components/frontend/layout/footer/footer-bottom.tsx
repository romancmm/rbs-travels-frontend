'use client'

import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'

interface FooterBottomProps {
  siteConfig?: SiteSettings
}

export function FooterBottom({ siteConfig }: FooterBottomProps) {
  return (
    <div className='bg-slate-900/50 backdrop-blur-sm py-6 border-slate-700 border-t'>
      <Container>
        <div className='flex md:flex-row flex-col justify-between items-center gap-4 text-slate-400 text-sm'>
          <Typography variant='body2' className='md:text-left text-center'>
            {siteConfig?.footer?.copyright}
            {siteConfig?.footer?.credit?.showCredit && (
              <span className='text-slate-400'>
                {' '}
                Developed by{' '}
                <CustomLink href={siteConfig?.footer?.credit?.url ?? '#'}>
                  {siteConfig?.footer?.credit?.companyName}
                </CustomLink>
              </span>
            )}
          </Typography>
        </div>
      </Container>
    </div>
  )
}

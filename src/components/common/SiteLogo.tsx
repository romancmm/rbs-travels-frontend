'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { AppLogo } from '../icons/logo'
import { useSiteConfig } from '../providers/store-provider'
import CustomLink from './CustomLink'

export default function SiteLogo({ className }: { className?: string }) {
  const { siteConfig } = useSiteConfig()
  const logoSrc = siteConfig?.logo?.default

  if (!logoSrc) {
    return (
      <CustomLink href={'/'}>
        <div className='relative overflow-hidden'>
          <AppLogo className={cn('object-contain', className)} />
        </div>
      </CustomLink>
    )
  }

  return (
    <CustomLink href={'/'}>
      <div className='relative overflow-hidden'>
        <Image
          src={logoSrc || '/logo.svg'}
          width={200}
          height={65}
          alt={siteConfig.name || 'Dynamic CMS'}
          className={cn('object-contain', className)}
          priority
        />
      </div>
    </CustomLink>
  )
}

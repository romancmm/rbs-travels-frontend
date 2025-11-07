'use client'
import { cn } from '@/lib/utils'
import Image from 'next/image'
import { useSiteConfig } from '../providers/store-provider'
import CustomLink from './CustomLink'

export default function SiteLogo({ className }: { className?: string }) {
  const { siteConfig } = useSiteConfig()

  const logoSrc = siteConfig?.logo?.default
    ? siteConfig.logo.default
    : '/logo.svg'

  return (
    <CustomLink href={'/'}>
      <div className='relative overflow-hidden'>
        <Image
          src={logoSrc}
          width={250}
          height={75}
          alt={'RBS Travels Logo'}
          className={cn('object-contain', className)}
          priority
        />
      </div>
    </CustomLink>
  )
}

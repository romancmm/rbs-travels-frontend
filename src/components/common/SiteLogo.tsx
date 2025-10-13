import { cn } from '@/lib/utils'
import Image from 'next/image'
import CustomLink from './CustomLink'

export default async function SiteLogo({ className }: { className?: string }) {
  // const siteConfig = await getSiteConfig()
  return (
    <CustomLink href={'/'} className={cn(className)}>
      <Image
        // src={
        //   siteConfig?.logo?.default
        //     ? process.env.NEXT_PUBLIC_BASE_API + siteConfig?.logo?.default
        //     : '/images/logo.svg'
        // }
        src={'/logo.jpeg'}
        width={280}
        height={50}
        alt={'logo'}
      />
    </CustomLink>
  )
}

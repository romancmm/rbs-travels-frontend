import { cn } from '@/lib/utils'
import Image from 'next/image'
import CustomLink from './CustomLink'

export default function SiteLogo({ className }: { className?: string }) {
  return (
    <CustomLink
      href={'/'}
    >
      <div className='relative overflow-hidden'>
        <Image
          src={'/logo.png'}
          width={250}
          height={75}
          alt={'RBS Travels Logo'}
          className={cn('object-contain',
            className
          )}
          priority
        />
      </div>
    </CustomLink>
  )
}

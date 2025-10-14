import { cn } from '@/lib/utils'
import Image from 'next/image'
import CustomLink from './CustomLink'

export default function SiteLogo({ className }: { className?: string }) {
  return (
    <CustomLink
      href={'/'}
      className={cn(
        'group flex items-center hover:scale-105 transition-transform duration-300',
        className
      )}
    >
      <div className='relative overflow-hidden'>
        <Image
          src={'/logo.png'}
          width={250}
          height={75}
          alt={'RBS Travels Logo'}
          className='object-contain group-hover:scale-110 transition-transform duration-300'
          priority
        />
      </div>
    </CustomLink>
  )
}

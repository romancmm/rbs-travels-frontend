'use client'
import { ArrowLeft } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Typography } from './typography'

interface SectionHeaderProps {
  title: string
  description?: string
  className?: string
}

export default function PageBreadcrumb({ title, description, className }: SectionHeaderProps) {
  const router = useRouter()
  return (
    <div className={`flex flex-col gap-2 lg:mb-2 ${className}`}>
      <Typography variant={'h3'} as={'h1'} weight={'semibold'} className='flex items-center gap-2'>
        {typeof window !== 'undefined' && window.history.length > 1 && (
          <button onClick={() => router.back()}>
            <ArrowLeft className='size-5 lg:size-7 cursor-pointer' />
          </button>
        )}
        {title}
      </Typography>
      <Typography variant={'h5'} weight={'normal'} className='leading-tight'>
        {description}
      </Typography>
    </div>
  )
}

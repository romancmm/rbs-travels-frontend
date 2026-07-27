import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'

interface SectionHeaderProps {
  title: string
  subTitle?: string
  children?: React.ReactNode
  extra?: React.ReactNode
  className?: string
}

export default function PageHeader({
  title,
  subTitle,
  children,
  extra,
  className = ''
}: SectionHeaderProps) {
  return (
    <div className={`flex flex-col gap-3 ${className} mb-6`}>
      <div className='flex lg:flex-row flex-col lg:justify-between lg:items-center gap-3'>
        <div className={cn('flex flex-col shrink-0', { 'gap-1': !subTitle })}>
          {title && (
            <Typography variant='h5' weight='bold'>
              {title}
            </Typography>
          )}
          {subTitle && (
            <Typography variant={'subtitle2'} weight={'normal'}>
              {subTitle}
            </Typography>
          )}
        </div>
        {extra && (
          <div className='flex flex-wrap items-center gap-3 lg:justify-end'>{extra}</div>
        )}
      </div>
      {children}
    </div>
  )
}

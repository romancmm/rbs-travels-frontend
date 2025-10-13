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
    <div className={`flex flex-col gap-2 ${className} mb-6`}>
      <div className='flex md:flex-row flex-col md:justify-between md:items-center gap-2'>
        <div className={cn('flex flex-col', { 'gap-2': !subTitle })}>
          {title && (
            <Typography variant='h5' weight='bold'>
              {title}
            </Typography>
          )}
          {subTitle && (
            <Typography
              variant={'subtitle2'}
              weight={'normal'}
              className={cn('text-muted-foreground')}
            >
              {subTitle}
            </Typography>
          )}
        </div>
        <div className='flex flex-wrap items-center gap-4'>{extra}</div>
      </div>
      {children}
    </div>
  )
}

import AnimatedCounter from '@/components/common/AnimatedCounter'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { StatItemProps } from '@/types/stats'
import * as LucideIcons from 'lucide-react'

/**
 * Individual stat item component with icon, value, and label
 */
const StatItem = ({ value, label, icon, className, index = 0 }: StatItemProps) => {
  const LucideIcon = icon && (LucideIcons as any)[icon]
  return (
    <div
      className={cn('group flex items-center gap-2 p-2 lg:p-4 w-full', className)}
      role='region'
      aria-labelledby={`stat-${index}-label`}
    >
      {/* Icon Container */}
      <div className='flex justify-center items-center size-16 sm:size-20 shrink-0'>
        <LucideIcon
          color='#0f6578'
          className={cn(
            'w-10 sm:w-12 h-10 sm:h-12 text-primary transition-all duration-700 ease-in-out'
          )}
          aria-hidden='true'
        />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <Typography variant='h4' weight='bold' className='mb-1 text-foreground' aria-live='polite'>
          <AnimatedCounter value={value} />
        </Typography>
        <Typography id={`stat-${index}-label`} variant='body2' className='leading-tight'>
          {label}
        </Typography>
      </div>
    </div>
  )
}

StatItem.displayName = 'StatItem'

export default StatItem

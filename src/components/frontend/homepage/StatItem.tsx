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
      className={cn(
        'group flex items-center gap-4 lg:gap-6',
        'px-6 py-8 lg:px-8 lg:py-10',
        'transition-all duration-300',
        'hover:bg-muted/10',
        className
      )}
      role='region'
      aria-labelledby={`stat-${index}-label`}
    >
      {/* Icon Container */}
      <div className='shrink-0'>
        <div className='relative flex justify-center items-center bg-primary/5 group-hover:bg-primary/10 rounded-xl w-14 lg:w-16 h-14 lg:h-16 transition-colors duration-300'>
          <LucideIcon
            className='w-7 lg:w-8 h-7 lg:h-8 text-gray-800'
            strokeWidth={2}
            aria-hidden='true'
          />
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <Typography variant='h3' weight='bold' className='mb-1 text-foreground' aria-live='polite'>
          <AnimatedCounter value={value ?? ''} />
        </Typography>
        <Typography id={`stat-${index}-label`} variant='body2' className='text-muted-foreground'>
          {label}
        </Typography>
      </div>
    </div>
  )
}

StatItem.displayName = 'StatItem'

export default StatItem

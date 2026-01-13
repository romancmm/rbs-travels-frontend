import AnimatedCounter from '@/components/common/AnimatedCounter'
import { IconOrImage } from '@/components/common/IconOrImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { StatItemProps } from '@/types/stats'

/**
 * Individual stat item component with icon, value, and label
 */
const StatItem = ({ value, label, icon, className, index = 0 }: StatItemProps) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-4',
        'p-4 lg:p-4',
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
          <IconOrImage
            icon={icon}
            alt={label}
            size='lg'
            className='text-gray-800'
            strokeWidth={1.2}
          />
        </div>
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <Typography variant='h5' weight='bold' className='mb-1 text-foreground' aria-live='polite'>
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

import AnimatedCounter from '@/components/common/AnimatedCounter'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { StatItemProps } from '@/types/stats'

/**
 * Individual stat item component with icon, value, and label
 */
const StatItem = ({ value, label, icon: Icon, className, index = 0 }: StatItemProps) => {
  return (
    <div
      className={cn(
        'group flex items-center gap-4 p-4 w-full',
        'hover:bg-accent/5 rounded-lg transition-colors duration-300',
        'animate-in fade-in slide-in-from-bottom-4',
        className
      )}
      style={{
        animationDelay: `${index * 100}ms`,
        animationFillMode: 'both'
      }}
      role='region'
      aria-labelledby={`stat-${index}-label`}
    >
      {/* Icon Container */}
      <div className='flex justify-center items-center size-16 sm:size-20 shrink-0'>
        <Icon
          color='#0f6578'
          className={cn(
            'w-10 sm:w-12 h-10 sm:h-12 text-primary transition-all duration-700 ease-in-out',
            'group-hover:text-primary/80 group-hover:scale-110'
          )}
          aria-hidden='true'
        />
      </div>

      {/* Content */}
      <div className='flex-1 min-w-0'>
        <Typography variant='h4' weight='bold' className='mb-1 text-foreground' aria-live='polite'>
          <AnimatedCounter value={value} />
        </Typography>
        <Typography
          id={`stat-${index}-label`}
          variant='body2'
          className='text-muted-foreground leading-tight'
        >
          {label}
        </Typography>
      </div>
    </div>
  )
}

StatItem.displayName = 'StatItem'

export default StatItem

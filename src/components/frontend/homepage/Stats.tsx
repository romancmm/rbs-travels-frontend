import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { StatsLoadingSkeleton } from '@/components/common/Skeleton'
import { cn } from '@/lib/utils'
import { StatsProps } from '@/types/stats'
import StatItem from './StatItem'

/**
 * Stats section component displaying key performance metrics
 * Features responsive grid, loading states, and accessibility
 */
const Stats = ({ data, isLoading = false, className }: StatsProps) => {
  return (
    <Section variant='none' className={className}>
      <Container>
        {isLoading ? (
          <StatsLoadingSkeleton count={data?.length || 4} />
        ) : !data || data.length === 0 ? (
          <EmptyState
            title='No statistics available'
            description='Statistics will appear here once data is loaded.'
            className='py-12'
          />
        ) : (
          <div
            className={cn(
              'gap-3 lg:gap-6 grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4',
              'py-6 lg:py-8 px-4 lg:px-6 rounded-3xl w-full relative overflow-hidden',
              'bg-linear-to-br from-primary/8 via-primary/12 to-primary/8',
              'border-2 border-primary/20 shadow-2xl shadow-primary/10',
              'backdrop-blur-sm',
              'animate-in fade-in slide-in-from-bottom-4 duration-700'
            )}
            role='region'
            aria-label='Company statistics'
          >
            {/* Decorative gradient overlays */}
            <div className='absolute inset-0 bg-linear-to-tr from-white/40 via-transparent to-white/20 pointer-events-none' />
            <div className='absolute -top-20 -right-20 bg-primary/15 blur-3xl rounded-full w-40 h-40 pointer-events-none' />
            <div className='absolute -bottom-20 -left-20 bg-primary/15 blur-3xl rounded-full w-40 h-40 pointer-events-none' />
            
            {/* Content with z-index */}
            <div className='relative z-10 col-span-2 lg:col-span-4 gap-3 lg:gap-6 grid grid-cols-2 lg:grid-cols-4'>
              {data.map((item, index) => (
                <StatItem
                  key={`stat-${index}-${item.label}`}
                  value={item.value}
                  label={item.label}
                  icon={item.icon}
                  index={index}
                />
              ))}
            </div>
          </div>
        )}
      </Container>
    </Section>
  )
}

Stats.displayName = 'Stats'

export default Stats

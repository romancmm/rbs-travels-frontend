import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { StatsLoadingSkeleton } from '@/components/common/Skeleton'
import { EmptyState } from '@/components/common/EmptyState'
import StatItem from './StatItem'
import { StatsProps } from '@/types/stats'
import { cn } from '@/lib/utils'

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
              'gap-4 lg:gap-6 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4',
              'py-6 lg:py-8 border-y border-border/50 w-full',
              'bg-gradient-to-r from-background via-accent/5 to-background'
            )}
            role='region'
            aria-label='Company statistics'
          >
            {data.map((item, index) => (
              <StatItem
                key={`stat-${index}-${item.label}`}
                value={item.value}
                label={item.label}
                icon={item.icon}
                index={index}
                className='border border-border/20 hover:border-border/40 rounded-lg'
              />
            ))}
          </div>
        )}
      </Container>
    </Section>
  )
}

Stats.displayName = 'Stats'

export default Stats

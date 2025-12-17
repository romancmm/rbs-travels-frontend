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
              'relative w-full overflow-hidden',
              'bg-card border border-border rounded-2xl',
              'shadow-lg',
              'animate-in fade-in slide-in-from-bottom-4 duration-700'
            )}
            role='region'
            aria-label='Company statistics'
          >
            {/* Stats grid - horizontal bar layout */}
            <div className='grid grid-cols-2 lg:grid-cols-4 divide-x divide-border'>
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

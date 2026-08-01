'use client'

import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { StatsLoadingSkeleton } from '@/components/common/Skeleton'
import { cn } from '@/lib/utils'
import { StatsProps } from '@/types/stats'
import { motion } from 'motion/react'
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
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, ease: 'easeOut' }}
            className={cn('relative bg-white rounded-t-3xl w-full overflow-hidden')}
            role='region'
            aria-label='Company statistics'
          >
            {/* Stats grid - horizontal bar layout */}
            <div className='z-10 relative grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x divide-y sm:divide-y-0 divide-border/50'>
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
          </motion.div>
        )}
      </Container>
    </Section>
  )
}

Stats.displayName = 'Stats'

export default Stats

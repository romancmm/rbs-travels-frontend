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
            className={cn(
              'relative w-full overflow-hidden',
              'bg-gradient-to-br from-card via-card to-card/95',
              'border border-border/50',
              'rounded-3xl',
              'shadow-2xl shadow-primary/5',
              'backdrop-blur-sm'
            )}
            role='region'
            aria-label='Company statistics'
          >
            {/* Animated gradient background */}
            <div className='absolute inset-0 overflow-hidden pointer-events-none'>
              <div
                className='top-0 right-0 absolute bg-primary/5 opacity-50 blur-3xl rounded-full w-72 h-72 animate-pulse'
                style={{ animationDuration: '8s' }}
              />
              <div
                className='bottom-0 left-0 absolute bg-primary/3 opacity-50 blur-3xl rounded-full w-96 h-96 animate-pulse'
                style={{ animationDuration: '10s', animationDelay: '2s' }}
              />
            </div>

            {/* Subtle grid pattern overlay */}
            <div
              className='absolute inset-0 opacity-[0.02] pointer-events-none'
              style={{
                backgroundImage: `url("data:image/svg+xml,%3Csvg width='40' height='40' viewBox='0 0 40 40' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='1'%3E%3Cpath d='M0 0h1v1H0V0zm20 0h1v1h-1V0zm0 20h1v1h-1v-1zM0 20h1v1H0v-1z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
              }}
            />

            {/* Top border glow */}
            <div className='top-0 absolute inset-x-0 bg-gradient-to-b from-primary/10 to-transparent h-px' />

            {/* Stats grid - horizontal bar layout */}
            <div className='z-10 relative grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 sm:divide-x divide-y sm:divide-y-0 divide-border/50'>
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

            {/* Bottom border glow */}
            <div className='bottom-0 absolute inset-x-0 bg-gradient-to-t from-primary/5 to-transparent h-px' />
          </motion.div>
        )}
      </Container>
    </Section>
  )
}

Stats.displayName = 'Stats'

export default Stats

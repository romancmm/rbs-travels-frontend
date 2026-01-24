'use client'

import AnimatedCounter from '@/components/common/AnimatedCounter'
import { IconOrImage } from '@/components/common/IconOrImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { StatItemProps } from '@/types/stats'
import { motion } from 'motion/react'

/**
 * Individual stat item component with icon, value, and label
 */
const StatItem = ({ value, label, icon, className, index = 0 }: StatItemProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * 0.1 }}
      className={cn(
        'group relative flex items-center gap-4',
        'p-4 lg:p-4',
        'transition-all duration-500',
        'hover:bg-linear-to-br hover:from-primary/5 hover:via-primary/2 hover:to-transparent',
        'before:absolute before:inset-0 before:bg-linear-to-br before:from-primary/2 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100',
        className
      )}
      role='region'
      aria-labelledby={`stat-${index}-label`}
    >
      {/* Decorative gradient orb */}
      <div className='top-0 right-0 absolute bg-primary/5 opacity-0 group-hover:opacity-100 blur-2xl rounded-full w-20 h-20 transition-opacity duration-700' />

      {/* Icon Container */}
      <div className='z-10 relative shrink-0'>
        <motion.div
          whileHover={{ scale: 1.1, rotate: 5 }}
          transition={{ type: 'spring', stiffness: 400, damping: 10 }}
          className={cn(
            'relative flex justify-center items-center rounded-2xl w-16 lg:w-20 h-16 lg:h-20',
            'bg-linear-to-br from-primary/10 via-primary/5 to-primary/2',
            'group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-primary/5',
            'shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20',
            'transition-all duration-500',
            'before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-br before:from-white/20 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity'
          )}
        >
          <IconOrImage
            icon={icon}
            alt={label}
            size='lg'
            className='z-10 relative text-primary group-hover:scale-110 transition-transform duration-300'
            strokeWidth={1.5}
          />

          {/* Shine effect */}
          <div className='top-0 -right-2 absolute bg-white/40 opacity-0 group-hover:opacity-100 blur-md rounded-full w-8 h-8 transition-opacity duration-500' />
        </motion.div>
      </div>

      {/* Content */}
      <div className='z-10 relative flex-1 min-w-0'>
        <Typography
          variant='h5'
          weight='bold'
          className={cn(
            'bg-clip-text bg-linear-to-br from-foreground to-foreground/70 mb-1 text-transparent',
            'group-hover:from-primary group-hover:to-primary/70 transition-all duration-500'
          )}
          aria-live='polite'
        >
          <AnimatedCounter value={value ?? ''} />
        </Typography>
        <Typography
          id={`stat-${index}-label`}
          variant='body2'
          className='text-muted-foreground group-hover:text-foreground/80 transition-colors duration-300'
        >
          {label}
        </Typography>
      </div>

      {/* Bottom border accent */}
      {/* <div className='right-0 bottom-0 left-0 absolute bg-linear-to-r from-transparent via-primary/50 to-transparent opacity-0 group-hover:opacity-100 w-full h-px transition-opacity duration-500' /> */}
    </motion.div>
  )
}

StatItem.displayName = 'StatItem'

export default StatItem

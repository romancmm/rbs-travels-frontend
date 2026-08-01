'use client'

import AnimatedCounter from '@/components/common/AnimatedCounter'
import { IconOrImage } from '@/components/common/IconOrImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { StatItemProps } from '@/types/stats'
import { motion } from 'motion/react'

// Fade-in-up entrance, staggered per item via `index * STAGGER_DELAY`
const FADE_IN_UP = {
  hidden: { opacity: 0, y: 20 },
  visible: { opacity: 1, y: 0 }
}
const STAGGER_DELAY = 0.1

const ICON_HOVER = { scale: 1.1, rotate: 5 }
const ICON_HOVER_TRANSITION = { type: 'spring', stiffness: 400, damping: 10 } as const

const containerClassName = cn(
  'group relative flex lg:flex-row flex-col items-center gap-3',
  'p-4 lg:p-6',
  'transition-all duration-500',
  'hover:bg-linear-to-br hover:from-primary/5 hover:via-primary/2 hover:to-transparent',
  'before:absolute before:inset-0 before:bg-linear-to-br before:from-primary/2 before:to-transparent before:opacity-0 before:transition-opacity before:duration-500 hover:before:opacity-100'
)

const iconWrapperClassName = cn(
  'relative flex justify-center items-center rounded-2xl w-10 lg:w-16 h-10 lg:h-16',
  'bg-linear-to-br from-primary/10 via-primary/5 to-primary/2',
  'group-hover:from-primary/20 group-hover:via-primary/10 group-hover:to-primary/5',
  'shadow-sm group-hover:shadow-lg group-hover:shadow-primary/20',
  'transition-all duration-500',
  'before:absolute before:inset-0 before:rounded-2xl before:bg-linear-to-br before:from-white/20 before:to-transparent before:opacity-0 group-hover:before:opacity-100 before:transition-opacity'
)

const valueClassName = cn(
  'bg-clip-text bg-linear-to-br from-foreground to-foreground/70 text-transparent leading-tight',
  'group-hover:from-primary group-hover:to-primary/90 transition-all duration-500'
)

/**
 * Icon bubble with hover-triggered lift, glow and shine effects.
 */
const StatIcon = ({ icon, label }: Pick<StatItemProps, 'icon' | 'label'>) => (
  <div className='z-10 relative shrink-0'>
    <motion.div
      whileHover={ICON_HOVER}
      transition={ICON_HOVER_TRANSITION}
      className={iconWrapperClassName}
    >
      <IconOrImage
        icon={icon}
        alt={label}
        size='md'
        className='z-10 relative text-primary group-hover:scale-110 transition-transform duration-300'
        strokeWidth={1.5}
      />

      {/* Shine effect */}
      <div className='top-0 -right-2 absolute bg-white/40 opacity-0 group-hover:opacity-100 blur-md rounded-full w-8 h-8 transition-opacity duration-500' />
    </motion.div>
  </div>
)

/**
 * Animated counter value paired with its label.
 */
const StatContent = ({
  value,
  label,
  index
}: Pick<StatItemProps, 'value' | 'label'> & { index: number }) => (
  <div className='z-10 relative flex-1 max-sm:text-center'>
    <Typography variant='h5' weight='bold' className={valueClassName} aria-live='polite'>
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
)

/**
 * Individual stat item component with icon, value, and label
 */
const StatItem = ({ value, label, icon, className, index = 0 }: StatItemProps) => {
  return (
    <motion.div
      initial={FADE_IN_UP.hidden}
      whileInView={FADE_IN_UP.visible}
      viewport={{ once: true }}
      transition={{ duration: 0.5, delay: index * STAGGER_DELAY }}
      className={cn(containerClassName, className)}
      role='region'
      aria-labelledby={`stat-${index}-label`}
    >
      <StatIcon icon={icon} label={label} />
      <StatContent value={value} label={label} index={index} />
    </motion.div>
  )
}

StatItem.displayName = 'StatItem'

export default StatItem

'use client'

import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { Quote, Star } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

interface Testimonial {
  id: number
  name: string
  location: string
  avatar?: string
  rating: number
  review: string
  tripType: string
  date: string
}

interface TestimonialCardProps {
  testimonial: Testimonial
  index: number
  className?: string
}

const StarRating = ({ rating }: { rating: number }) => {
  return (
    <div className='flex items-center gap-1'>
      {Array.from({ length: 5 }).map((_, index) => (
        <Star
          key={index}
          className={cn(
            'w-4 h-4 transition-colors duration-300',
            index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-muted-foreground/30'
          )}
        />
      ))}
      <span className='ml-2 font-medium text-muted-foreground text-sm'>{rating}.0</span>
    </div>
  )
}

const TestimonialCard = ({ testimonial, className }: TestimonialCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  // Generate avatar initials
  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map((part) => part.charAt(0))
      .join('')
      .toUpperCase()
      .slice(0, 2)
  }

  return (
    <motion.div
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative rounded-3xl overflow-hidden transition-all duration-300',
        'bg-linear-to-br from-card/90 to-card/70 backdrop-blur-sm',
        'border-2 border-border/80 border-dashed',
        'hover:shadow-xl hover:shadow-primary/8',
        'p-8 space-y-6',
        className
      )}
    >
      {/* Background Pattern */}
      {/* <div className='absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-300'>
        <div className='top-0 right-0 absolute bg-linear-to-br from-primary/8 to-transparent blur-3xl rounded-full w-32 h-32' />
        <div className='bottom-0 left-0 absolute bg-linear-to-tr from-accent/8 to-transparent blur-2xl rounded-full w-24 h-24' />
      </div> */}

      {/* Quote Icon */}
      <Quote className='text-border w-6 h-6' />

      {/* Review Text */}
      <div className='z-10 relative space-y-4'>
        <Typography variant='body1' className='text-foreground/90 italic leading-relaxed'>
          &ldquo;{testimonial.review}&rdquo;
        </Typography>

        {/* Rating */}
        <StarRating rating={testimonial.rating} />
      </div>

      {/* User Info */}
      <div className='z-10 relative flex items-center gap-4 pt-4 border-border/20 border-t'>
        {/* Avatar */}
        <div
          className={cn(
            'flex justify-center items-center rounded-full w-14 h-14 transition-all duration-300',
            'border border-border border-dashed overflow-hidden',
            isHovered ? 'scale-105 border-primary/50 shadow-md shadow-primary/15' : ''
          )}
        >
          {testimonial.avatar ? (
            <CustomImage
              src={testimonial.avatar}
              alt={testimonial.name}
              width={56}
              height={56}
              className='w-full h-full object-cover'
            />
          ) : (
            <span className='font-bold text-primary text-lg'>{getInitials(testimonial.name)}</span>
          )}
        </div>

        {/* User Details */}
        <div className='flex-1 min-w-0'>
          <Typography variant='h6' weight='semibold' className='truncate'>
            {testimonial.name}
          </Typography>
          <Typography variant='body2' className='truncate'>
            {testimonial.location}
          </Typography>
        </div>
      </div>
    </motion.div>
  )
}

export default TestimonialCard

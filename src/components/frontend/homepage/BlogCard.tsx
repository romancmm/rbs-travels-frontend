'use client'

import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { Calendar, Tag } from 'lucide-react'
import { motion } from 'motion/react'
import { useState } from 'react'

interface BlogPost {
  id: number
  title: string
  excerpt: string
  image: string
  date: string
  category: string
  author: string
  readTime: string
}

interface BlogCardProps {
  post: BlogPost
  index: number
  className?: string
}

const BlogCard = ({ post, index, className }: BlogCardProps) => {
  const [isHovered, setIsHovered] = useState(false)

  return (
    <motion.article
      initial={{ opacity: 0, y: 30 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.6 }}
      onHoverStart={() => setIsHovered(true)}
      onHoverEnd={() => setIsHovered(false)}
      className={cn(
        'group relative bg-card/80 backdrop-blur-sm rounded-3xl overflow-hidden',
        'border border-border/30 transition-all duration-500',
        'hover:border-primary/40 hover:shadow-2xl hover:shadow-primary/15',
        'hover:bg-gradient-to-br hover:from-card/90 hover:to-primary/5',
        className
      )}
    >
      {/* Image Section */}
      <div className='relative overflow-hidden'>
        <motion.div
          animate={{ scale: isHovered ? 1.05 : 1 }}
          transition={{ duration: 0.5, ease: 'easeOut' }}
          className='w-full aspect-[16/10]'
        >
          <CustomImage src={post.image} alt={post.title} fill className='object-cover' />
        </motion.div>

        {/* Category Badge */}
        <div className='top-4 left-4 absolute'>
          <motion.div
            initial={{ opacity: 0.8 }}
            animate={{ opacity: isHovered ? 1 : 0.8 }}
            className={cn(
              'flex items-center gap-2 px-3 py-1.5 rounded-full font-semibold text-xs',
              'bg-primary/90 text-white backdrop-blur-sm',
              'border border-white/20 shadow-lg'
            )}
          >
            <Tag className='w-3 h-3' />
            {post.category}
          </motion.div>
        </div>

        {/* Gradient Overlay */}
        <div className='absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent' />
      </div>

      {/* Content Section */}
      <div className='space-y-4 p-6'>
        {/* Meta Information */}
        <div className='flex items-center gap-4 text-sm'>
          <div className='flex items-center gap-1.5'>
            <Calendar className='w-4 h-4' />
            <span>{post.date}</span>
          </div>
          <div className='flex items-center gap-1.5'>
            <span>•</span>
            <span>{post.readTime}</span>
          </div>
        </div>

        {/* Title */}
        <Typography
          variant='h5'
          weight='bold'
          className={cn('line-clamp-2 transition-colors duration-300', 'group-hover:text-primary')}
        >
          {post.title}
        </Typography>

        {/* Excerpt */}
        <Typography variant='body2' className='line-clamp-3 leading-relaxed'>
          {post.excerpt}
        </Typography>

        {/* Author & Read More */}
        <div className='flex justify-between items-center pt-2'>
          <div className='flex items-center gap-2'>
            <div className='flex justify-center items-center bg-gradient-to-r from-primary/20 to-accent/20 rounded-full w-8 h-8'>
              <span className='font-semibold text-primary text-xs'>
                {post.author.charAt(0).toUpperCase()}
              </span>
            </div>
            <span className='text-sm'>{post.author}</span>
          </div>
        </div>
      </div>

      {/* Decorative Elements */}
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        transition={{ duration: 0.3 }}
        className='top-4 right-4 absolute bg-primary/60 blur-sm rounded-full w-2 h-2'
      />
      <motion.div
        animate={{
          opacity: isHovered ? 1 : 0,
          scale: isHovered ? 1 : 0.8
        }}
        transition={{ duration: 0.3, delay: 0.1 }}
        className='bottom-4 left-4 absolute bg-accent/60 blur-sm rounded-full w-1 h-1'
      />
    </motion.article>
  )
}

export default BlogCard

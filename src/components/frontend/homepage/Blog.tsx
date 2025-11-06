'use client'

import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { BlogLoadingSkeleton } from '@/components/common/Skeleton'
import { Typography } from '@/components/common/typography'
import { TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'
import BlogCard from './BlogCard'

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

interface BlogData {
  title: string
  subtitle: string
  posts: BlogPost[]
}

interface BlogProps {
  data?: BlogData
  isLoading?: boolean
  className?: string
}

const Blog = ({ data, isLoading = false, className }: BlogProps) => {
  if (isLoading) {
    return <BlogLoadingSkeleton />
  }

  if (!data || !data.posts?.length) {
    return (
      <Section variant='xl' className={className}>
        <Container>
          <EmptyState
            title='No Blog Posts Available'
            description='Stay tuned for exciting travel stories and tips coming soon!'
            imageSrc='/no-data.png'
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section variant='xl' className={className}>
      <Container>
        {/* Header Section */}
        <div className='mb-16 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className='space-y-4'
          >
            <div className='flex justify-center items-center gap-2 mb-3'>
              <motion.div
                animate={{ rotate: [0, 10, -10, 0] }}
                transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              >
                <TrendingUp className='w-5 h-5 text-primary' />
              </motion.div>
              <Typography
                variant='subtitle1'
                className='font-semibold text-primary uppercase tracking-wide'
              >
                {data.subtitle}
              </Typography>
            </div>

            <Typography
              variant='h2'
              as='h2'
              weight='bold'
              className='mx-auto max-w-3xl text-foreground leading-tight'
            >
              {data.title}
            </Typography>

            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '80px' }}
              transition={{ delay: 0.5, duration: 0.8 }}
              className='bg-linear-to-r from-primary to-accent mx-auto rounded-full h-1'
            />
          </motion.div>
        </div>

        {/* Blog Grid */}
        <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 mb-12'>
          {data.posts.slice(0, 3)?.map((post, index) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </div>

        {/* View All Button with Dynamic Arrow */}

        {/* <motion.button
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.8, duration: 0.6 }}
          className={cn(
            'group relative px-8 py-2.5 rounded-full overflow-hidden',
            'bg-linear-to-r from-primary/10 to-accent/10',
            'border-2 border-primary/30 transition-all duration-500',
            'hover:border-primary/60 hover:shadow-xl hover:shadow-primary/25 hover:from-primary/90 hover:to-primary',
            'text-primary font-semibold'
          )}
        >
          // {/* Background Animation * /}
          <motion.div
            initial={{ x: '-100%' }}
            whileHover={{ x: '0%' }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
            className='absolute inset-0 bg-linear-to-r from-primary to-primary/80'
          />

          {/* Button Content * /}
        <div className='z-10 relative flex items-center gap-3'>
          <span className='group-hover:text-white transition-colors duration-300'>
            View All
          </span>

          {/* Dynamic Arrow with Multiple Effects * /}
          <div className='relative'>
            {/* Main Arrow * /}
            <motion.div
              animate={{ x: [0, 3, 0] }}
              transition={{ duration: 2, repeat: Infinity, ease: 'easeInOut' }}
              className='group-hover:text-white transition-colors duration-300'
            >
              <ArrowRight className='w-5 h-5' />
            </motion.div>

            {/* Trail Arrows * /}
            <motion.div
              initial={{ opacity: 0, x: -10 }}
              whileHover={{
                opacity: [0, 1, 0],
                x: [-10, 0, 10]
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
                delay: 0.1
              }}
              className='absolute inset-0 text-white/60'
            >
              <ArrowRight className='w-5 h-5' />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -15 }}
              whileHover={{
                opacity: [0, 0.8, 0],
                x: [-15, -5, 5]
              }}
              transition={{
                duration: 0.6,
                times: [0, 0.5, 1],
                delay: 0.2
              }}
              className='absolute inset-0 text-white/40'
            >
              <ArrowRight className='w-4 h-4' />
            </motion.div>
          </div>
        </div>

        {/* Decorative Glow Effect /}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
          className='-z-10 absolute -inset-1 bg-linear-to-r from-primary/20 to-accent/20 blur-lg rounded-full'
        />
      </motion.button> */}
      </Container>
    </Section >
  )
}

export default Blog

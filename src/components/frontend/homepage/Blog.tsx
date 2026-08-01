'use client'

import CarouselWrapper from '@/components/common/carousel-wrapper'
import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ArticleLoadingSkeleton } from '@/components/common/Skeleton'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import BlogCard from '../../card/BlogCard'

interface ArticleProps {
  className?: string
}

const Blogs = ({ className }: ArticleProps) => {
  const { data, loading } = useAsync(() => '/articles/posts?categorySlugs=blogs')

  if (loading) {
    return <ArticleLoadingSkeleton />
  }

  if (!data || !data?.data?.items?.length) {
    return (
      <Section variant='md' className={cn(className)}>
        <Container>
          <EmptyState
            title='No Article Posts Available'
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
        <SectionHeading
          subtitle='Articles'
          title='Latest Travel Stories & Tips'
          variant='underline'
          alignment='center'
        />

        {/* Article Carousel */}
        <CarouselWrapper
          loop
          itemsPerView={{ default: 1, md: 2, lg: 3 }}
          contentClassName='pb-14'
        >
          {data.data.items.slice(0, 8).map((post: any, index: number) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </CarouselWrapper>
      </Container>
    </Section>
  )
}

export default Blogs

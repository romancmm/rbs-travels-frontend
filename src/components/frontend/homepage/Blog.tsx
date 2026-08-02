'use client'

import CarouselWrapper from '@/components/common/carousel-wrapper'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { ArticleLoadingSkeleton } from '@/components/common/Skeleton'
import useAsync from '@/hooks/useAsync'
import BlogCard from '../../card/BlogCard'

interface ArticleProps {
  className?: string
}

const Blogs = ({ className }: ArticleProps) => {
  const { data, loading } = useAsync(() => '/articles/posts?categorySlugs=blogs')

  if (loading) {
    return <ArticleLoadingSkeleton />
  }

  if (!data || !data?.data?.items?.length) return

  return (
    <Section variant='xl' className={className}>
      <Container>
        <SectionHeading
          subtitle='Articles'
          title='Latest Travel Stories & Tips'
          variant='gradient'
          alignment='center'
        />

        {/* Article Carousel */}
        <CarouselWrapper loop itemsPerView={{ default: 1, md: 2, lg: 3 }} dotsPosition='below'>
          {data.data.items?.map((post: any, index: number) => (
            <BlogCard key={post.id} post={post} index={index} />
          ))}
        </CarouselWrapper>
      </Container>
    </Section>
  )
}

export default Blogs

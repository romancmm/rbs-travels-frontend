'use client'

import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import EntityRail from '@/components/common/entity-rail'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { TestimonialsLoadingSkeleton } from '@/components/common/Skeleton'
import useAsync from '@/hooks/useAsync'
import { cn } from '@/lib/utils'
import { TestimonialsType } from '@/lib/validations/schemas/homepageSettings'
import TestimonialCard from './TestimonialCard'

interface TestimonialsProps {
  className?: string
}

const Testimonials = ({ className }: TestimonialsProps) => {
  const { data, loading } = useAsync(() => '/settings/home_testimonial_settings')
  const testimonialData: TestimonialsType | undefined = data?.data?.value

  if (loading) return <TestimonialsLoadingSkeleton />

  if (!testimonialData?.testimonials?.length) {
    return (
      <Section variant='md' className={className}>
        <Container>
          <EmptyState
            title='No Testimonials Available'
            description='Customer reviews will appear here once available.'
            imageSrc='/no-data.png'
          />
        </Container>
      </Section>
    )
  }

  return (
    <Section variant='xl' className={cn('bg-linear-to-b from-accent/5 to-background', className)}>
      <Container>
        <SectionHeading
          subtitle={testimonialData.subtitle}
          title={testimonialData.title || 'Testimonials'}
          alignment='center'
          className='mb-10'
        />

        {/* Bespoke centered header above owns the title, so the rail's own
            heading is hidden - this just needs the carousel plumbing. */}
        <EntityRail
          title={testimonialData.title || 'Testimonials'}
          hideHeading
          wrapInCard={false}
          items={testimonialData.testimonials}
          itemsPerView={{ default: 1, sm: 2, lg: 3 }}
          arrow={{ variant: 'round', size: 'md' }}
          loop
          showDots
          renderItem={(testimonial, index) => (
            <TestimonialCard key={index} testimonial={testimonial} index={index} />
          )}
        />
      </Container>
    </Section>
  )
}

export default Testimonials

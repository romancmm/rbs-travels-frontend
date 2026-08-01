import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { WhoWeAreLoadingSkeleton } from '@/components/common/Skeleton'
import { cn } from '@/lib/utils'
import { WhoWeAreType } from '@/lib/validations/schemas/homepageSettings'
import FeatureCard from './FeatureCard'

interface WhoWeAreProps {
  data?: WhoWeAreType
  isLoading?: boolean
  className?: string
}

const WhoWeAre = ({ data, isLoading = false, className }: WhoWeAreProps) => {
  return (
    <Section variant='lg' className={cn('relative overflow-hidden', className)}>
      {/* Ambient background accents for visual rhythm with neighboring sections */}
      <div className='top-0 right-0 absolute bg-primary/5 blur-3xl rounded-full w-96 h-96 -translate-y-1/2 translate-x-1/3 pointer-events-none' />
      <div className='bottom-0 left-0 absolute bg-accent/5 blur-3xl rounded-full w-80 h-80 -translate-x-1/3 translate-y-1/2 pointer-events-none' />

      <Container className='relative'>
        {isLoading ? (
          <WhoWeAreLoadingSkeleton count={data?.features?.length || 6} />
        ) : !data ? (
          <EmptyState
            title='Features information unavailable'
            description='Company features will appear here once loaded.'
            className='py-12'
          />
        ) : (
          <>
            <SectionHeading
              subtitle={data.subTitle}
              title={data.title ?? ''}
              description={data.desc}
              alignment='center'
              className='mx-auto max-w-2xl'
            />

            {/* Enhanced Features Grid */}
            <div
              className='gap-4 lg:gap-5 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
              role='region'
              aria-label='Company features and capabilities'
            >
              {data.features?.map((feature, index) => (
                <FeatureCard
                  key={`feature-${index}-${feature.title}`}
                  icon={feature.icon}
                  title={feature.title}
                  desc={feature.desc}
                  index={index}
                  className={cn('max-md:items-center', {
                    'max-md:flex-row-reverse': index % 2 !== 0
                  })}
                />
              ))}
            </div>
          </>
        )}
      </Container>
    </Section>
  )
}

export default WhoWeAre

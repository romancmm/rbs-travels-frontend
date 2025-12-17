import { Container } from '@/components/common/container'
import { EmptyState } from '@/components/common/EmptyState'
import { Section } from '@/components/common/section'
import { WhoWeAreLoadingSkeleton } from '@/components/common/Skeleton'
import { Typography } from '@/components/common/typography'
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
    <Section variant='xl' className={className}>
      <Container>
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
            {/* Enhanced Header Section */}
            <div
              className='slide-in-from-top-4 mb-12 text-center animate-in duration-700 fade-in'
              role='banner'
              aria-labelledby='whoweare-title'
            >
              {data.subTitle && (
                <Typography
                  variant='subtitle1'
                  className='mb-1 font-semibold text-primary uppercase tracking-wide animate-in duration-500 fade-in'
                  style={{ animationDelay: '100ms', animationFillMode: 'both' }}
                >
                  {data.subTitle}
                </Typography>
              )}
              {data.title && (
                <Typography
                  id='whoweare-title'
                  variant='h2'
                  as='h2'
                  weight='bold'
                  className='slide-in-from-top-6 text-foreground leading-tight animate-in duration-600 fade-in'
                  style={{ animationDelay: '200ms', animationFillMode: 'both' }}
                >
                  {data.title}
                </Typography>
              )}
              {data.desc && (
                <Typography
                  variant='body1'
                  className='mx-auto mt-4 max-w-3xl text-muted-foreground animate-in duration-700 fade-in'
                  style={{ animationDelay: '300ms', animationFillMode: 'both' }}
                >
                  {data.desc}
                </Typography>
              )}
            </div>

            {/* Enhanced Features Grid */}
            <div
              className='gap-6 lg:gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'
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
                  className={cn('max-md:items-center', { 'max-md:flex-row-reverse': index % 2 !== 0 })}
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

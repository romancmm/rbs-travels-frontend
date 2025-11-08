import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { AboutType } from '@/lib/validations/schemas/homepageSettings'
import * as LucideIcons from 'lucide-react'

const AboutUs = ({ data }: { data?: AboutType }) => {
  if (!data) return null

  return (
    <Section variant='xl'>
      <Container>
        <div className='flex sm:flex-row flex-col items-center gap-8 lg:gap-12'>
          {/* Content Section */}
          <div className='space-y-6 slide-in-from-left-6 w-full lg:w-1/2 animate-in duration-700 fade-in'>
            {/* Subtitle with enhanced styling */}
            <Typography
              variant='subtitle1'
              className={cn(
                'mb-0 font-semibold text-primary uppercase tracking-wider',
                'animate-in fade-in slide-in-from-left-4 duration-500'
              )}
              style={{ animationDelay: '100ms', animationFillMode: 'both' }}
            >
              {data.subTitle}
            </Typography>

            {/* Title with better typography */}
            <Typography
              variant='h2'
              as='h2'
              weight='bold'
              className={cn(
                'text-foreground leading-tight',
                'animate-in fade-in slide-in-from-left-6 duration-600'
              )}
              style={{ animationDelay: '200ms', animationFillMode: 'both' }}
            >
              {data.title}
            </Typography>

            {/* Description with better readability */}
            <Typography
              variant='body1'
              className={cn(
                'leading-relaxed',
                'animate-in fade-in slide-in-from-left-4 duration-500'
              )}
              style={{ animationDelay: '300ms', animationFillMode: 'both' }}
            >
              {data.desc}
            </Typography>

            {/* Enhanced Facilities Grid */}
            <div className='gap-4 lg:gap-5 grid grid-cols-2 pt-2'>
              {data.facilities?.map((facility, index) => {
                const row = Math.floor(index / 2)
                const col = index % 2
                const isAccent = (row + col) % 2 === 0

                // Check if icon is a Lucide icon name
                const iconName = facility.icon
                const LucideIcon = iconName && (LucideIcons as any)[iconName]
                // const isLucideIcon = !!LucideIcon && typeof LucideIcon === 'function'

                return (
                  <div
                    key={`facility-${index}-${facility.title}`}
                    className={cn(
                      'group relative p-4 rounded-lg overflow-hidden transition-all duration-500 ease-out',
                      'hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1',
                      'animate-in fade-in slide-in-from-bottom-4',
                      isAccent
                        ? 'bg-primary/8 hover:bg-primary/12 border border-primary/10'
                        : 'bg-muted hover:bg-muted/70 border border-border/40'
                    )}
                  >
                    <div className='relative flex md:flex-row flex-col items-center gap-3 lg:gap-4'>
                      {/* Enhanced icon container */}
                      <div className='flex justify-center items-center bg-white rounded-full w-12 lg:w-14 h-12 lg:h-14'>
                        <LucideIcon className='w-6 lg:w-7 h-6 lg:h-7 text-primary' />
                      </div>

                      {/* Enhanced typography */}
                      <Typography variant='body1' weight='semibold' className='flex-1 max-w-[90%] lg:max-w-[60%] max-md:text-center leading-tight'>
                        {facility.title}
                      </Typography>
                    </div>
                  </div>
                )
              })}
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div
            className='slide-in-from-right-6 relative w-full lg:w-1/2 animate-in duration-700 fade-in'
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <div className='group relative'>
              {/* Main image with enhanced effects */}
              <CustomImage
                src={data.image}
                height={425}
                width={530}
                alt='About RBS Travels - Company overview'
                className={cn('rounded-2xl')}
              />
            </div>

            {/* Enhanced Experience Badge */}
            {data?.experience &&
              <div
                className={cn(
                  'hidden -right-6 -bottom-6 absolute md:flex items-center gap-4 bg-primary shadow-2xl p-5 rounded-xl',
                  'text-white transform transition-all duration-500 hover:scale-105',
                  'animate-in fade-in slide-in-from-bottom-4 duration-600',
                  'max-w-64 backdrop-blur-sm border border-primary-foreground/10'
                )}
                style={{ animationDelay: '800ms', animationFillMode: 'both' }}
              >
                <div className='pr-4 border-white/20 border-r'>
                  <Typography variant='h3' weight='bold' className='text-white leading-none'>
                    {data?.experience?.years}
                  </Typography>
                </div>
                <div>
                  <Typography variant='h6' weight='semibold' className='text-white/90 leading-tight'>
                    {data?.experience?.text}
                  </Typography>
                </div>
              </div>
            }
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default AboutUs

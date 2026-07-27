import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { IconOrImage } from '@/components/common/IconOrImage'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { AboutType } from '@/lib/validations/schemas/homepageSettings'

const AboutUs = ({ data }: { data?: AboutType }) => {
  if (!data) return null

  return (
    <Section variant='xl' className='relative overflow-hidden'>
      {/* Ambient background accents for depth */}
      <div className='-top-24 -left-24 absolute bg-primary/5 blur-3xl rounded-full w-72 h-72 pointer-events-none' />
      <div className='-right-24 -bottom-24 absolute bg-accent/5 blur-3xl rounded-full w-80 h-80 pointer-events-none' />

      <Container className='relative'>
        <div className='flex sm:flex-row flex-col items-center gap-8 lg:gap-12'>
          {/* Content Section */}
          <div className='space-y-6 slide-in-from-left-6 w-full lg:w-1/2 animate-in duration-700 fade-in'>
            {/* Subtitle with enhanced styling */}
            <SectionHeading
              subtitle={data.subTitle}
              title={data?.title ?? ''}
              description={data.desc}
              variant='default'
              alignment='left'
            />

            {/* Facilities Grid — unified brand palette for a cohesive, professional look */}
            <div className='gap-4 lg:gap-5 grid grid-cols-2 pt-2'>
              {data.facilities?.map((facility, index) => (
                <div
                  key={`facility-${index}-${facility.title}`}
                  className={cn(
                    'group relative bg-card p-5 border border-border/70 rounded-2xl overflow-hidden transition-all duration-500 ease-out',
                    'hover:border-primary/30 hover:shadow-xl hover:shadow-primary/10 hover:-translate-y-1.5',
                    'animate-in fade-in slide-in-from-bottom-4'
                  )}
                  style={{
                    animationDelay: `${400 + index * 100}ms`,
                    animationFillMode: 'both'
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div className='absolute inset-0 bg-linear-to-br from-primary/0 via-primary/0 to-primary/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

                  <div className='relative flex md:flex-row flex-col items-center gap-4'>
                    {/* Icon container in consistent brand tone */}
                    <div
                      className={cn(
                        'flex justify-center items-center bg-linear-to-br from-primary to-primary/80 shadow-primary/25 shadow-xl rounded-2xl w-16 lg:w-14 h-16 lg:h-14 transition-all duration-500',
                        'group-hover:scale-110 group-hover:rotate-6'
                      )}
                    >
                      <IconOrImage
                        icon={facility.icon}
                        alt={facility.title}
                        size='sm'
                        color='white'
                        iconClassName='group-hover:scale-110 transition-transform duration-500'
                        strokeWidth={1.2}
                      />
                    </div>

                    {/* Typography */}
                    <Typography
                      variant='body1'
                      weight='semibold'
                      className='flex-1 max-w-[90%] lg:max-w-[65%] text-foreground/90 group-hover:text-foreground max-md:text-center leading-snug transition-colors duration-300'
                    >
                      {facility.title}
                    </Typography>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Enhanced Image Section */}
          <div
            className='slide-in-from-right-6 relative w-full lg:w-1/2 animate-in duration-700 fade-in'
            style={{ animationDelay: '400ms', animationFillMode: 'both' }}
          >
            <div className='group relative'>
              {/* Decorative gradient background */}
              <div className='absolute -inset-4 bg-linear-to-br from-primary/10 via-primary/5 to-transparent opacity-60 group-hover:opacity-80 blur-2xl rounded-3xl transition-opacity duration-500' />

              {/* Main image with enhanced effects */}
              <div className='relative shadow-2xl shadow-primary/10 ring-border/50 rounded-3xl ring-1 overflow-hidden'>
                <CustomImage
                  src={data.image}
                  height={425}
                  width={530}
                  alt='About'
                  className='size-full object-cover group-hover:scale-105 transition-transform duration-700'
                />
                {/* Image overlay gradient */}
                <div className='absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>
            </div>

            {/* Enhanced Experience Badge */}
            {data?.experience && (
              <div
                className={cn(
                  'md:-right-6 md:-bottom-6 md:absolute flex items-center gap-5 bg-linear-to-br from-primary via-primary to-primary/90 mx-auto md:mx-0 -mt-8 md:mt-0',
                  'shadow-2xl shadow-primary/30 p-3.5 rounded-2xl',
                  'text-white transform transition-all duration-500 hover:scale-110 hover:shadow-3xl hover:shadow-primary/40',
                  'animate-in fade-in slide-in-from-bottom-4 duration-600',
                  'max-w-72 w-fit backdrop-blur-md border-[6px] border-transparent ring-2 ring-primary/50 ring-offset-2 ring-offset-white/10'
                )}
                style={{ animationDelay: '800ms', animationFillMode: 'both' }}
              >
                {/* Decorative gradient overlay */}
                <div className='absolute inset-0 bg-linear-to-tr from-white/10 to-transparent rounded-2xl' />

                <div className='relative pr-5 border-white/30 border-r'>
                  <Typography
                    variant='h3'
                    weight='bold'
                    className='drop-shadow-lg text-white leading-none'
                  >
                    {data?.experience?.years}
                  </Typography>
                  <div className='bg-white/20 mt-1 rounded-full w-12 h-1' />
                </div>
                <div className='relative'>
                  <Typography
                    variant='h6'
                    weight='semibold'
                    className='drop-shadow-md text-white leading-tight'
                  >
                    {data?.experience?.text}
                  </Typography>
                </div>
              </div>
            )}
          </div>
        </div>
      </Container>
    </Section>
  )
}

export default AboutUs

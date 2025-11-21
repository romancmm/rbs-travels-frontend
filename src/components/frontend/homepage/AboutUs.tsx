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
    <Section variant='xl'>
      <Container>
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

            {/* Enhanced Facilities Grid */}
            <div className='gap-4 lg:gap-5 grid grid-cols-2 pt-2'>
              {data.facilities?.map((facility, index) => {
                // Color palette for variety
                const colorVariants = [
                  {
                    bg: 'bg-linear-to-br from-blue-50 via-blue-100/50 to-blue-50/30',
                    hoverBg: 'hover:from-blue-100 hover:via-blue-50 hover:to-blue-100/50',
                    border: 'border-blue-200/60',
                    shadow: 'shadow-blue-200/40',
                    iconBg: 'bg-linear-to-br from-blue-500 to-blue-600',
                    iconShadow: 'shadow-blue-500/30',
                    overlay: 'from-blue-500/0 via-blue-500/0 to-blue-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-purple-50 via-purple-100/50 to-purple-50/30',
                    hoverBg: 'hover:from-purple-100 hover:via-purple-50 hover:to-purple-100/50',
                    border: 'border-purple-200/60',
                    shadow: 'shadow-purple-200/40',
                    iconBg: 'bg-linear-to-br from-purple-500 to-purple-600',
                    iconShadow: 'shadow-purple-500/30',
                    overlay: 'from-purple-500/0 via-purple-500/0 to-purple-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-emerald-50 via-emerald-100/50 to-emerald-50/30',
                    hoverBg: 'hover:from-emerald-100 hover:via-emerald-50 hover:to-emerald-100/50',
                    border: 'border-emerald-200/60',
                    shadow: 'shadow-emerald-200/40',
                    iconBg: 'bg-linear-to-br from-emerald-500 to-emerald-600',
                    iconShadow: 'shadow-emerald-500/30',
                    overlay: 'from-emerald-500/0 via-emerald-500/0 to-emerald-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-amber-50 via-amber-100/50 to-amber-50/30',
                    hoverBg: 'hover:from-amber-100 hover:via-amber-50 hover:to-amber-100/50',
                    border: 'border-amber-200/60',
                    shadow: 'shadow-amber-200/40',
                    iconBg: 'bg-linear-to-br from-amber-500 to-amber-600',
                    iconShadow: 'shadow-amber-500/30',
                    overlay: 'from-amber-500/0 via-amber-500/0 to-amber-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-rose-50 via-rose-100/50 to-rose-50/30',
                    hoverBg: 'hover:from-rose-100 hover:via-rose-50 hover:to-rose-100/50',
                    border: 'border-rose-200/60',
                    shadow: 'shadow-rose-200/40',
                    iconBg: 'bg-linear-to-br from-rose-500 to-rose-600',
                    iconShadow: 'shadow-rose-500/30',
                    overlay: 'from-rose-500/0 via-rose-500/0 to-rose-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-cyan-50 via-cyan-100/50 to-cyan-50/30',
                    hoverBg: 'hover:from-cyan-100 hover:via-cyan-50 hover:to-cyan-100/50',
                    border: 'border-cyan-200/60',
                    shadow: 'shadow-cyan-200/40',
                    iconBg: 'bg-linear-to-br from-cyan-500 to-cyan-600',
                    iconShadow: 'shadow-cyan-500/30',
                    overlay: 'from-cyan-500/0 via-cyan-500/0 to-cyan-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-pink-50 via-pink-100/50 to-pink-50/30',
                    hoverBg: 'hover:from-pink-100 hover:via-pink-50 hover:to-pink-100/50',
                    border: 'border-pink-200/60',
                    shadow: 'shadow-pink-200/40',
                    iconBg: 'bg-linear-to-br from-pink-500 to-pink-600',
                    iconShadow: 'shadow-pink-500/30',
                    overlay: 'from-pink-500/0 via-pink-500/0 to-pink-500/10'
                  },
                  {
                    bg: 'bg-linear-to-br from-indigo-50 via-indigo-100/50 to-indigo-50/30',
                    hoverBg: 'hover:from-indigo-100 hover:via-indigo-50 hover:to-indigo-100/50',
                    border: 'border-indigo-200/60',
                    shadow: 'shadow-indigo-200/40',
                    iconBg: 'bg-linear-to-br from-indigo-500 to-indigo-600',
                    iconShadow: 'shadow-indigo-500/30',
                    overlay: 'from-indigo-500/0 via-indigo-500/0 to-indigo-500/10'
                  }
                ]

                const colorScheme = colorVariants[index % colorVariants.length]

                return (
                  <div
                    key={`facility-${index}-${facility.title}`}
                    className={cn(
                      'group relative p-5 rounded-2xl overflow-hidden transition-all duration-500 ease-out',
                      'hover:shadow-2xl hover:-translate-y-2 hover:scale-[1.02]',
                      'animate-in fade-in slide-in-from-bottom-4',
                      colorScheme.bg,
                      colorScheme.hoverBg,
                      colorScheme.border,
                      colorScheme.shadow,
                      'border-2'
                    )}
                    style={{
                      animationDelay: `${400 + index * 100}ms`,
                      animationFillMode: 'both'
                    }}
                  >
                    {/* Hover gradient overlay */}
                    <div
                      className={cn(
                        'absolute inset-0 bg-linear-to-br opacity-0 group-hover:opacity-100 transition-opacity duration-500',
                        colorScheme.overlay
                      )}
                    />

                    <div className='relative flex md:flex-row flex-col items-center gap-4'>
                      {/* Enhanced icon container with gradient */}
                      <div
                        className={cn(
                          'flex justify-center items-center rounded-2xl w-16 lg:w-14 h-16 lg:h-14 transition-all duration-500',
                          'group-hover:scale-110 group-hover:rotate-6 shadow-xl',
                          colorScheme.iconBg,
                          colorScheme.iconShadow
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

                      {/* Enhanced typography */}
                      <Typography
                        variant='body1'
                        weight='semibold'
                        className='flex-1 max-w-[90%] lg:max-w-[65%] text-foreground/90 group-hover:text-foreground max-md:text-center leading-snug transition-colors duration-300'
                      >
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
              {/* Decorative gradient background */}
              <div className='absolute -inset-4 bg-linear-to-br from-primary/10 via-primary/5 to-transparent opacity-60 group-hover:opacity-80 blur-2xl rounded-3xl transition-opacity duration-500' />

              {/* Main image with enhanced effects */}
              <div className='relative shadow-2xl shadow-primary/10 rounded-3xl ring-1 ring-gray-200/50 overflow-hidden'>
                <CustomImage
                  src={data.image}
                  height={425}
                  width={530}
                  alt='About'
                  className='group-hover:scale-105 transition-transform duration-700'
                />
                {/* Image overlay gradient */}
                <div className='absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500' />
              </div>
            </div>

            {/* Enhanced Experience Badge */}
            {data?.experience && (
              <div
                className={cn(
                  'hidden -right-6 -bottom-6 absolute md:flex items-center gap-5 bg-linear-to-br from-primary via-primary to-primary/90',
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

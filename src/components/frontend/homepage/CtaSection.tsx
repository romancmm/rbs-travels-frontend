import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import Image from 'next/image'

const CtaSection = () => {
  return (
    <Section variant='xxl' className='relative w-full overflow-hidden'>
      {/* Background Image */}
      <Image
        src='/images/bg.png'
        alt=''
        fill
        sizes='100vw'
        quality={90}
        className='object-center object-cover'
      />

      {/* Dark overlay */}
      <div className='absolute inset-0 bg-linear-to-b from-secondary/95 via-secondary/90 to-secondary/95' />

      {/* Content */}
      <Container className='relative flex flex-col items-center gap-6 text-center'>
        <Typography
          as='h2'
          variant='h2'
          weight='bold'
          className='slide-in-from-bottom-4 max-w-2xl text-white animate-in duration-700 fade-in'
        >
          Ready to Start your Adventure?
        </Typography>
        <Typography
          variant='body1'
          className='slide-in-from-bottom-4 fill-mode-both max-w-xl text-gray-50 leading-relaxed animate-in duration-700 delay-150 fade-in'
        >
          Let our travel experts help you plan the perfect getaway to any of these amazing
          destination
        </Typography>

        <div className='slide-in-from-bottom-4 flex flex-wrap justify-center items-center gap-4 fill-mode-both mt-2 animate-in duration-700 delay-300 fade-in'>
          <CustomLink
            href='/tours-travels'
            className={cn(
              buttonVariants({ size: 'lg' }),
              'rounded-full bg-primary hover:bg-primary/90 px-8 py-6 border-2 border-primary hover:border-primary/70 font-medium text-white text-base',
              'shadow-2xl hover:shadow-primary/30 transition-all duration-500 hover:-translate-y-1 hover:scale-105'
            )}
          >
            Plan My Journey
          </CustomLink>
          <CustomLink
            href='/contact'
            className={cn(
              buttonVariants({ size: 'lg', variant: 'outline' }),
              'bg-white hover:bg-white/90 px-8 py-6 border-0 rounded-full font-medium text-foreground text-base',
              'shadow-lg transition-all duration-500 hover:-translate-y-1 hover:scale-105'
            )}
          >
            Talk to expert
          </CustomLink>
        </div>
      </Container>
    </Section>
  )
}

export default CtaSection

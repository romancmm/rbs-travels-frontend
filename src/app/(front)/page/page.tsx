import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'

export default function PagesIndex() {
  return (
    <Section variant='xl' className='min-h-screen'>
      <Container>
        <div className='space-y-8'>
          {/* Header */}
          <div className='space-y-4 text-center'>
            <Typography variant='h1' as='h1' weight='bold' className='text-4xl md:text-5xl'>
              Help & Information
            </Typography>
            <Typography variant='h3' as='h2' className='text-xl md:text-2xl'>
              Browse all available pages to find the information you need.
            </Typography>

            <div className='gap-4 lg:gap-6 grid grid-cols-2 lg:grid-cols-4'></div>
          </div>

          {/* Help Section */}
          <div className='space-y-4 bg-card mt-12 p-8 border rounded-lg text-center'>
            <Typography variant='h2' as='h3' weight='semibold' className='text-2xl'>
              Need More Help?
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl'>
              Can&apos;t find what you&apos;re looking for? Our support team is here to help you
              with any questions or concerns.
            </Typography>
            <div className='flex sm:flex-row flex-col justify-center gap-4'>
              <Button variant='default' size='lg' className='text-background text-base'>
                Contact Support
              </Button>
              <Button variant='outline' size='lg' className='text-base'>
                Browse FAQ
              </Button>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}

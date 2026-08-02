import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Skeleton } from '@/components/ui/skeleton'

/**
 * Placeholder shown while the menu item behind a `[...menuSlug]` route resolves.
 */
export function MenuSlugSkeleton() {
  return (
    <>
      <Section className='bg-linear-to-r from-primary/90 to-primary/70'>
        <Container>
          <div className='py-12 text-center'>
            <Skeleton className='bg-white/20 mx-auto mb-4 w-3/4 h-12' />
            <Skeleton className='bg-white/20 mx-auto w-1/2 h-6' />
          </div>
        </Container>
      </Section>

      <Section variant={'xl'}>
        <Container>
          <div className='space-y-4'>
            <Skeleton className='w-full h-64' />
            <Skeleton className='w-full h-64' />
            <Skeleton className='w-full h-64' />
          </div>
        </Container>
      </Section>
    </>
  )
}

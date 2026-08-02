import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@/components/ui/breadcrumb'
import { Home } from 'lucide-react'
import Link from 'next/link'

const DEFAULT_HEADER_BG_IMAGE = '/images/bg/breadcrumb.jpg'

interface MenuPageHeaderProps {
  title: string
  bgImage?: string | null
  /** Present when the menu item has a parent; parent title/URL isn't resolved yet. */
  hasParent?: boolean
}

/**
 * Title + breadcrumb banner shown above menu-driven content.
 */
export function MenuPageHeader({ title, bgImage, hasParent }: MenuPageHeaderProps) {
  return (
    <Section
      className='relative bg-cover bg-no-repeat bg-center overflow-hidden'
      style={{
        backgroundImage: `linear-gradient(to right, rgba(1, 29, 38, 0.9), rgba(1, 29, 38, 0.8), rgba(1, 29, 38, 0.3)), url(${bgImage || DEFAULT_HEADER_BG_IMAGE})`
      }}
    >
      <Container className='z-10 relative'>
        <div className='space-y-3 py-4'>
          <Typography variant='h1' as='h1' weight='bold' className='text-white'>
            {title}
          </Typography>

          <Breadcrumb>
            <BreadcrumbList className='text-white/90'>
              <BreadcrumbItem>
                <BreadcrumbLink asChild>
                  <Link href='/' className='flex items-center gap-1 hover:text-white'>
                    <Home className='w-4 h-4' />
                    <span>Home</span>
                  </Link>
                </BreadcrumbLink>
              </BreadcrumbItem>

              {hasParent && (
                <>
                  <BreadcrumbSeparator className='text-white/60' />
                  <BreadcrumbItem>
                    <span className='text-white/70'>Parent</span>
                  </BreadcrumbItem>
                </>
              )}

              <BreadcrumbSeparator className='text-white/60' />
              <BreadcrumbItem>
                <BreadcrumbPage className='font-medium text-white'>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
        </div>
      </Container>
    </Section>
  )
}

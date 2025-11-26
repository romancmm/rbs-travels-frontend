import { fetchOnServer } from '@/action/data'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowRight, Clock, FileText } from 'lucide-react'
import type { Metadata } from 'next'
import Link from 'next/link'

export const metadata: Metadata = {
  title: 'Help & Information | Browse All Pages',
  description: 'Browse all available information pages and resources to find what you need.',
}

async function getPublishedPages() {
  const { data, error } = await fetchOnServer('/pages?status=published', 300)

  if (error || !data) {
    return []
  }

  return data?.items || []
}

export default async function PagesIndex() {
  const pages = await getPublishedPages()
  const featuredPages = pages.filter((page: any) => page.isFeatured).slice(0, 3)
  const regularPages = pages.filter((page: any) => !page.isFeatured)

  return (
    <Section variant='xl' className='bg-gradient-to-b from-background to-muted/20 min-h-screen'>
      <Container>
        <div className='space-y-12'>
          {/* Header */}
          <div className='space-y-6 text-center'>
            <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-medium text-primary text-sm'>
              <FileText className='w-4 h-4' />
              {pages.length} Page{pages.length !== 1 ? 's' : ''} Available
            </div>
            <Typography variant='h2' as='h1' weight='bold' className='bg-clip-text bg-gradient-to-r from-foreground to-foreground/70 text-4xl md:text-6xl'>
              Help & Information
            </Typography>
            <Typography variant='h5' as='h2' className='mx-auto max-w-3xl text-muted-foreground text-lg md:text-xl leading-relaxed'>
              Explore our comprehensive collection of guides, documentation, and resources designed to help you get the most out of our services.
            </Typography>
          </div>

          {/* Featured Pages */}
          {featuredPages.length > 0 && (
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-gradient-to-r from-primary to-primary/50 rounded-full w-1 h-8' />
                <Typography variant='h2' weight='semibold' className='text-2xl'>
                  Featured Pages
                </Typography>
              </div>
              <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {featuredPages.map((page: any) => (
                  <Link key={page.id} href={`/page/${page.slug}`}>
                    <Card className='group hover:shadow-2xl border-primary/20 h-full hover:scale-[1.02] transition-all duration-300'>
                      <CardHeader>
                        <div className='flex justify-between items-start mb-2'>
                          <Badge variant='secondary' className='bg-primary/10 text-primary'>
                            Featured
                          </Badge>
                          <ArrowRight className='opacity-0 group-hover:opacity-100 w-5 h-5 text-primary transition-all group-hover:translate-x-1' />
                        </div>
                        <div className='flex items-start gap-3'>
                          <div className='bg-gradient-to-br from-primary to-primary/70 shadow-lg p-3 rounded-xl'>
                            <FileText className='w-6 h-6 text-primary-foreground' />
                          </div>
                          <div className='flex-1'>
                            <CardTitle className='group-hover:text-primary text-xl leading-tight transition-colors'>
                              {page.title || page.name}
                            </CardTitle>
                          </div>
                        </div>
                        {page.description && (
                          <CardDescription className='mt-3 text-base'>
                            {page.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      {page.excerpt && (
                        <CardContent>
                          <Typography variant='body2' className='text-muted-foreground line-clamp-3'>
                            {page.excerpt}
                          </Typography>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* All Pages */}
          {regularPages.length > 0 && (
            <div className='space-y-6'>
              <div className='flex items-center gap-3'>
                <div className='bg-gradient-to-r from-foreground/70 to-foreground/30 rounded-full w-1 h-8' />
                <Typography variant='h5' weight='semibold' className='text-2xl'>
                  {featuredPages.length > 0 ? 'More Pages' : 'All Pages'}
                </Typography>
              </div>
              <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                {regularPages.map((page: any) => (
                  <Link key={page.id} href={`/page/${page.slug}`}>
                    <Card className='group hover:shadow-xl hover:border-primary/30 h-full transition-all duration-300'>
                      <CardHeader>
                        <div className='flex justify-between items-start'>
                          <div className='flex flex-1 items-start gap-3'>
                            <div className='bg-primary/10 p-2.5 rounded-lg'>
                              <FileText className='w-5 h-5 text-primary' />
                            </div>
                            <div className='flex-1'>
                              <CardTitle className='group-hover:text-primary text-lg leading-tight transition-colors'>
                                {page.title || page.name}
                              </CardTitle>
                              {page.updatedAt && (
                                <div className='flex items-center gap-1.5 mt-2 text-muted-foreground text-xs'>
                                  <Clock className='w-3.5 h-3.5' />
                                  <span>
                                    {new Date(page.updatedAt).toLocaleDateString('en-US', {
                                      month: 'short',
                                      day: 'numeric',
                                      year: 'numeric'
                                    })}
                                  </span>
                                </div>
                              )}
                            </div>
                          </div>
                          <ArrowRight className='flex-shrink-0 opacity-0 group-hover:opacity-100 w-5 h-5 text-primary transition-all group-hover:translate-x-1' />
                        </div>
                        {page.description && (
                          <CardDescription className='mt-3'>
                            {page.description}
                          </CardDescription>
                        )}
                      </CardHeader>
                      {page.excerpt && (
                        <CardContent>
                          <Typography variant='body2' className='text-muted-foreground line-clamp-2'>
                            {page.excerpt}
                          </Typography>
                        </CardContent>
                      )}
                    </Card>
                  </Link>
                ))}
              </div>
            </div>
          )}

          {/* Empty State */}
          {pages.length === 0 && (
            <div className='bg-muted/50 py-24 rounded-2xl text-center'>
              <div className='inline-flex bg-muted mb-6 p-4 rounded-full'>
                <FileText className='w-12 h-12 text-muted-foreground/50' />
              </div>
              <Typography variant='h3' weight='semibold' className='mb-3'>
                No Pages Available
              </Typography>
              <Typography variant='body1' className='mx-auto max-w-md text-muted-foreground'>
                There are currently no published pages to display. Check back soon for updates.
              </Typography>
            </div>
          )}

          {/* Help Section */}
          <div className='relative space-y-6 bg-gradient-to-br from-primary/10 via-primary/5 to-background mt-16 p-10 border rounded-2xl overflow-hidden text-center'>
            <div className='top-0 right-0 -z-10 absolute bg-primary/5 blur-3xl rounded-full w-64 h-64' />
            <div className='bottom-0 left-0 -z-10 absolute bg-primary/5 blur-3xl rounded-full w-64 h-64' />

            <div className='inline-flex bg-primary/10 mb-2 px-4 py-2 rounded-full font-medium text-primary text-sm'>
              Need Assistance?
            </div>
            <Typography variant='h4' as='h3' weight='bold'>
              Can&apos;t Find What You&apos;re Looking For?
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl text-muted-foreground text-lg'>
              Our dedicated support team is standing by to help answer your questions and provide guidance. We&apos;re here to ensure you have the best experience possible.
            </Typography>
            <div className='flex sm:flex-row flex-col justify-center gap-4 pt-2'>
              <Button variant='default' size='lg' className='shadow-lg text-base'>
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

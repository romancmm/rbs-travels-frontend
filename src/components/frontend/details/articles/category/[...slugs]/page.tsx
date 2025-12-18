'use client'
import BlogCard from '@/components/card/BlogCard'
import { Container } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
import { Skeleton } from '@/components/ui/skeleton'
import useAsync from '@/hooks/useAsync'

export default function CategoryArticlesPage({ slugs }: { slugs: string[] }) {
  const { data, loading } = useAsync(
    () => (slugs ? `/articles/posts?categorySlugs=${slugs?.join(',')}` : null),
    true
  )
  const articlesData = data?.data?.items

  if (loading) {
    return (
      <div className='bg-background py-12 md:py-20'>
        <Container>
          {/* Loading Header */}
          <div className='mb-12 text-center'>
            <Skeleton className='mx-auto mb-4 w-48 h-8' />
            <Skeleton className='mx-auto mb-4 w-64 h-10' />
            <Skeleton className='mx-auto w-32 h-6' />
          </div>

          {/* Loading Grid */}
          <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className='space-y-4'>
                <Skeleton className='rounded-xl w-full h-64' />
                <Skeleton className='w-3/4 h-6' />
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-full h-4' />
                <Skeleton className='w-1/2 h-4' />
              </div>
            ))}
          </div>
        </Container>
      </div>
    )
  }

  return (
    <div className='bg-background py-12 md:py-20'>
      <Container>
        {/* Header Section */}
        {/* <div className='mb-12 text-center'>
                    <div className='inline-flex items-center gap-2 bg-primary/10 mb-4 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                        <Layers className='w-4 h-4' />
                        {categorySlugs.length > 1 ? 'Multiple Categories' : 'Category'}
                    </div>

                    <Typography variant='h2' weight='bold' className='mb-4'>
                        {pageTitle}
                    </Typography>

                    {pageDescription && (
                        <Typography variant='body1' className='mb-4 text-muted-foreground'>
                            {pageDescription}
                        </Typography>
                    )}

                    <Typography variant='body2' className='text-muted-foreground'>
                        {articlesData.total > 0
                            ? `${articlesData.total} article${articlesData.total === 1 ? '' : 's'} found`
                            : 'No articles found'}
                    </Typography>
                </div> */}

        {/* Articles Grid */}
        {articlesData?.length > 0 ? (
          <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {articlesData?.map((article: any, index: number) => (
              <BlogCard key={article.id || index} post={article} index={index} />
            ))}
          </div>
        ) : (
          <div className='bg-muted/20 py-20 rounded-2xl text-center'>
            <Typography variant='h5' className='mb-2 text-muted-foreground'>
              No Articles Found
            </Typography>
            <Typography variant='body2' className='text-muted-foreground'>
              There are no articles in this category yet.
            </Typography>
          </div>
        )}
      </Container>
    </div>
  )
}

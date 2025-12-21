'use client'
import BlogCard from '@/components/card/BlogCard'
import { Container } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
import useAsync from '@/hooks/useAsync'
import { FileText } from 'lucide-react'
import { useSearchParams } from 'next/navigation'

export default function ArticlesPage() {
  const searchParams = useSearchParams()
  const categories = searchParams.get('categories')
  const categoriesParam = categories ? `?categories=${categories}` : ''

  const { data: articleData } = useAsync(() => `/articles/posts${categoriesParam}`, true)

  return (
    <div className='bg-background py-12 md:py-20'>
      <Container>
        {/* Header Section */}
        <div className='mb-12 text-center'>
          <div className='inline-flex items-center gap-2 bg-primary/10 mb-4 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
            <FileText className='w-4 h-4' />
            Articles
          </div>

          <Typography variant='h2' weight='bold' className='mb-4'>
            Latest Articles
          </Typography>

          <Typography variant='body1' className='text-muted-foreground'>
            {articleData.data?.total > 0
              ? `${articleData.data.total} article${
                  articleData.data.total === 1 ? '' : 's'
                } published`
              : 'No articles found'}
          </Typography>
        </div>

        {/* Articles Grid */}
        {articleData.data?.items.length > 0 ? (
          <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {articleData.data.items.map((article: any, index: number) => (
              <BlogCard key={article.id || index} post={article} index={index} />
            ))}
          </div>
        ) : (
          <div className='bg-muted/50 py-20 rounded-2xl text-center'>
            <Typography variant='h5' className='mb-2 text-muted-foreground'>
              No Articles Found
            </Typography>
            <Typography variant='body2' className='text-muted-foreground'>
              Check back later for new content.
            </Typography>
          </div>
        )}
      </Container>
    </div>
  )
}

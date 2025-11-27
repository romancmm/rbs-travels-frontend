import { fetchOnServer } from '@/action/data'
import BlogCard from '@/components/card/BlogCard'
import { Container } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
import { FileText } from 'lucide-react'

export default async function ArticlesPage({
    searchParams
}: {
    searchParams: Promise<{ categories?: string }>
}) {
    const { categories } = await searchParams
    const categoriesParam = categories ? `?categories=${categories}` : ''

    const articlesData = await fetchOnServer(`/articles/posts${categoriesParam}`, 300)
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
                        {articlesData.data?.total > 0
                            ? `${articlesData.data.total} article${articlesData.data.total === 1 ? '' : 's'} published`
                            : 'No articles found'}
                    </Typography>
                </div>

                {/* Articles Grid */}
                {articlesData.data?.items.length > 0 ? (
                    <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                        {articlesData.data.items.map((article: any, index: number) => (
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

import { fetchOnServer } from '@/action/data'
import BlogCard from '@/components/card/BlogCard'
import { Container } from '@/components/common/container'
import { Typography } from '@/components/common/typography'
import { Layers } from 'lucide-react'

// Fetch articles by category slugs
async function getArticlesByCategories(categorySlugs: string[]) {
    // Construct query string with multiple categorySlugs parameters
    const queryParams = categorySlugs.map(slug => `categorySlugs=${slug}`).join('&')

    const { data, error } = await fetchOnServer(
        `/articles/posts?${queryParams}`,
        300 // Revalidate every 300 seconds
    )

    if (error || !data) {
        return { items: [], total: 0 }
    }

    return {
        items: data?.items || [],
        total: data?.total || 0
    }
}

// Fetch category names for display
async function getCategoryNames(categorySlugs: string[]) {
    const categoryParam = categorySlugs.join(',')
    const { data, error } = await fetchOnServer(
        `/articles/categories?slugs=${categoryParam}`,
        300
    )

    if (error || !data) {
        return []
    }

    return data?.items || []
}

export default async function CategoryArticlesPage({
    params
}: {
    params: Promise<{ slugs: string[] }>
}) {
    const { slugs } = await params
    const categorySlugs = slugs ?? []

    const [articlesData, categories] = await Promise.all([
        getArticlesByCategories(categorySlugs),
        getCategoryNames(categorySlugs)
    ])

    const categoryNames = categories.map((cat: any) => cat.name || cat.title).join(', ')

    return (
        <div className='bg-background py-12 md:py-20'>
            <Container>
                {/* Header Section */}
                <div className='mb-12 text-center'>
                    <div className='inline-flex items-center gap-2 bg-primary/10 mb-4 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                        <Layers className='w-4 h-4' />
                        {categorySlugs.length > 1 ? 'Multiple Categories' : 'Category'}
                    </div>

                    <Typography variant='h2' weight='bold' className='mb-4'>
                        {categoryNames || 'Articles'}
                    </Typography>

                    <Typography variant='body1' className='text-muted-foreground'>
                        {articlesData.total > 0
                            ? `${articlesData.total} article${articlesData.total === 1 ? '' : 's'} found`
                            : 'No articles found'}
                    </Typography>
                </div>

                {/* Articles Grid */}
                {articlesData.items.length > 0 ? (
                    <div className='gap-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
                        {articlesData.items.map((article: any, index: number) => (
                            <BlogCard key={article.id || index} post={article} index={index} />
                        ))}
                    </div>
                ) : (
                    <div className='bg-muted/50 py-20 rounded-2xl text-center'>
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

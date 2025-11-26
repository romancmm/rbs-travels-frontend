import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import { format } from 'date-fns'
import { Calendar, Clock, Tag, User } from 'lucide-react'
import { notFound } from 'next/navigation'

// Fetch single article by slug
async function getArticle(slug: string) {
    try {
        const res = await fetch(
            `${process.env.NEXT_PUBLIC_APP_ROOT_API}/articles/posts/${slug}`,
            {
                next: { revalidate: 60 } // Revalidate every 60 seconds
            }
        )

        if (!res.ok) {
            return null
        }

        const data = await res.json()
        return data?.data
    } catch (error) {
        console.error('Error fetching article:', error)
        return null
    }
}

export default async function ArticlePage({ params }: { params: { slug: string } }) {
    const article = await getArticle(params.slug)

    if (!article) {
        notFound()
    }

    return (
        <div className='bg-background py-12 md:py-20'>
            <Container>
                {/* Article Header */}
                <div className='mx-auto mb-12 max-w-4xl'>
                    {/* Category Badge */}
                    {article.category && (
                        <div className='flex justify-center mb-6'>
                            <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                                <Tag className='w-4 h-4' />
                                {article.category.name || article.category.title}
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <Typography
                        variant='h1'
                        weight='bold'
                        className='mb-6 text-foreground text-center'
                    >
                        {article.title}
                    </Typography>

                    {/* Meta Information */}
                    <div className='flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm'>
                        {article.author && (
                            <div className='flex items-center gap-2'>
                                <User className='w-4 h-4' />
                                <span>{article.author}</span>
                            </div>
                        )}

                        {article.createdAt && (
                            <div className='flex items-center gap-2'>
                                <Calendar className='w-4 h-4' />
                                <span>{format(new Date(article.createdAt), 'MMMM dd, yyyy')}</span>
                            </div>
                        )}

                        {article.readTime && (
                            <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4' />
                                <span>{article.readTime}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured Image */}
                {article.thumbnail && (
                    <div className='relative mx-auto mb-12 rounded-2xl max-w-5xl overflow-hidden'>
                        <div className='relative w-full aspect-[16/9]'>
                            <CustomImage
                                src={article.thumbnail}
                                alt={article.title}
                                fill
                                className='object-cover'
                            />
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <article className='mx-auto max-w-4xl'>
                    {/* Excerpt */}
                    {article.excerpt && (
                        <Typography
                            variant='h5'
                            className='mb-8 text-muted-foreground leading-relaxed'
                        >
                            {article.excerpt}
                        </Typography>
                    )}

                    {/* Main Content */}
                    {article.content && (
                        <div
                            className='dark:prose-invert mx-auto max-w-none prose prose-lg'
                            dangerouslySetInnerHTML={{ __html: article.content }}
                        />
                    )}

                    {/* Tags */}
                    {article.tags && article.tags.length > 0 && (
                        <div className='flex flex-wrap items-center gap-3 mt-12 pt-8 border-border border-t'>
                            <Typography variant='body2' weight='semibold'>
                                Tags:
                            </Typography>
                            {article.tags.map((tag: string, index: number) => (
                                <span
                                    key={index}
                                    className='bg-muted hover:bg-muted/80 px-3 py-1 rounded-full text-muted-foreground text-sm transition-colors'
                                >
                                    {tag}
                                </span>
                            ))}
                        </div>
                    )}
                </article>
            </Container>
        </div>
    )
}

import { fetchOnServer } from '@/action/data'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import { format } from 'date-fns'
import { Calendar, Clock, Tag, User } from 'lucide-react'
import { notFound } from 'next/navigation'


export default async function ArticlePage({ slug, params }: { slug?: string; params?: Promise<{ slug: string }> }) {
    const resolvedSlug = slug || (params ? (await params).slug : null)

    if (!resolvedSlug) {
        notFound()
    }

    const articleData = await fetchOnServer(`/articles/posts/slug/${resolvedSlug}`, 300)

    if (!articleData?.data) {
        notFound()
    }

    return (
        <div className='bg-background py-12 md:py-20'>
            <Container>
                {/* Article Header */}
                <div className='mx-auto mb-12 max-w-4xl'>
                    {/* Category Badge */}
                    {articleData?.data?.category && (
                        <div className='flex justify-center mb-6'>
                            <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full font-semibold text-primary text-sm'>
                                <Tag className='w-4 h-4' />
                                {articleData?.data?.category.name || articleData?.data?.category.title}
                            </div>
                        </div>
                    )}

                    {/* Title */}
                    <Typography
                        variant='h2' as='h1'
                        weight='bold'
                        className='mb-6 text-foreground text-center'
                    >
                        {articleData?.data?.title}
                    </Typography>

                    {/* Meta Information */}
                    <div className='flex flex-wrap justify-center items-center gap-6 text-muted-foreground text-sm'>
                        {articleData?.data?.author && (
                            <div className='flex items-center gap-2'>
                                <User className='w-4 h-4' />
                                <span>{articleData?.data?.author?.name}</span>
                            </div>
                        )}

                        {articleData?.data?.createdAt && (
                            <div className='flex items-center gap-2'>
                                <Calendar className='w-4 h-4' />
                                <span>{format(new Date(articleData?.data?.createdAt), 'MMMM dd, yyyy')}</span>
                            </div>
                        )}

                        {articleData?.data?.readTime && (
                            <div className='flex items-center gap-2'>
                                <Clock className='w-4 h-4' />
                                <span>{articleData?.data?.readTime}</span>
                            </div>
                        )}
                    </div>
                </div>

                {/* Featured Image */}
                {articleData?.data?.thumbnail && (
                    <div className='relative mx-auto mb-12 rounded-2xl max-w-5xl overflow-hidden'>
                        <div className='relative w-full aspect-video'>
                            <CustomImage
                                src={articleData?.data?.thumbnail}
                                alt={articleData?.data?.title}
                                fill
                                className='object-cover'
                            />
                        </div>
                    </div>
                )}

                {/* Article Content */}
                <article className='mx-auto max-w-4xl'>
                    {/* Excerpt */}
                    {articleData?.data?.excerpt && (
                        <Typography
                            variant='h5'
                            className='mb-8 text-muted-foreground leading-relaxed'
                        >
                            {articleData?.data?.excerpt}
                        </Typography>
                    )}

                    {/* Main Content */}
                    {articleData?.data?.content && (
                        <div
                            className='dark:prose-invert mx-auto max-w-none prose prose-lg'
                            dangerouslySetInnerHTML={{ __html: articleData?.data?.content }}
                        />
                    )}

                    {/* Tags */}
                    {articleData?.data?.tags && articleData?.data?.tags.length > 0 && (
                        <div className='flex flex-wrap items-center gap-3 mt-12 pt-8 border-border border-t'>
                            <Typography variant='body2' weight='semibold'>
                                Tags:
                            </Typography>
                            {articleData?.data?.tags.map((tag: string, index: number) => (
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

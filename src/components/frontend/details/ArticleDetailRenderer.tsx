'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import ShareButtons from '@/components/common/ShareButtons'
import { Typography } from '@/components/common/typography'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Clock } from 'lucide-react'

type ArticleDetailProps = {
  data: Article
  relatedPosts?: Article[]
}

export default function ArticleDetailRenderer({ data, relatedPosts = [] }: ArticleDetailProps) {
  const currentUrl = typeof window !== 'undefined' ? window.location.href : ''
  return (
    <Section variant='xl'>
      <Container className='space-y-12'>
        <div className='space-y-4'>
          {data.category && (
            <Badge variant='secondary' className='mb-2 text-white'>
              {data.category?.name}
            </Badge>
          )}
          <Typography variant='h1' as='h1' weight='bold'>
            {data.title}
          </Typography>
          {data.excerpt && (
            <Typography variant='body1' className='max-w-3xl text-gray-700'>
              {data.excerpt}
            </Typography>
          )}

          {/* Meta Info */}
          <div className='flex flex-wrap items-center gap-4 pt-4 text-gray-400/80'>
            {data.publishedAt && (
              <div className='flex items-center gap-2'>
                <Calendar className='w-4 h-4' />
                <span className='text-sm'>
                  {new Date(data.publishedAt).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric'
                  })}
                </span>
              </div>
            )}
            {data.readTime && (
              <div className='flex items-center gap-2'>
                <Clock className='w-4 h-4' />
                <span className='text-sm'>{data.readTime} min read</span>
              </div>
            )}
          </div>
        </div>
        <div className='gap-8 grid lg:grid-cols-12'>
          {/* Main Content */}
          <article className='lg:col-span-8'>
            {/* Featured Image */}
            {data.thumbnail && (
              <div className='relative mb-8 rounded-xl w-full h-[400px] overflow-hidden'>
                <CustomImage src={data.thumbnail} alt={data.title} fill className='object-cover' />
              </div>
            )}

            {/* Article Content */}
            <div className='space-y-6 prose-img:rounded-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-p:text-gray-700 prose lg:prose-xl'>
              {data.content && <div dangerouslySetInnerHTML={{ __html: data.content }} />}
            </div>

            {/* Tags */}
            {data.tags && data.tags.length > 0 && (
              <div className='flex flex-wrap gap-2 mt-8 pt-8 border-t'>
                <Typography variant='body2' weight='medium' className='mr-2'>
                  Tags:
                </Typography>
                {data.tags.map((tag, index) => (
                  <Badge key={index} variant='outline'>
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </article>

          {/* Sidebar */}
          <aside className='lg:col-span-4'>
            <div className='top-24 sticky space-y-6'>
              {/* Share Section */}
              <ShareButtons url={currentUrl} title={data.title} variant='card' />

              {/* Related Posts */}
              {relatedPosts && relatedPosts.length > 0 && (
                <Card>
                  <CardContent className='pt-6'>
                    <Typography variant='h6' weight='semibold' className='mb-4'>
                      Related Posts
                    </Typography>
                    <div className='space-y-4'>
                      {relatedPosts.slice(0, 3).map((post) => (
                        <CustomLink
                          key={post.id}
                          href={`/page/${data.category?.slug}/${post.slug}`}
                          className='group block hover:bg-muted -m-2 p-2 rounded-lg transition-colors'
                        >
                          <div className='flex gap-3'>
                            {post.thumbnail && (
                              <div className='relative rounded-md w-20 h-20 overflow-hidden shrink-0'>
                                <CustomImage
                                  src={post.thumbnail}
                                  alt={post.title}
                                  fill
                                  className='object-cover'
                                />
                              </div>
                            )}
                            <div className='flex-1 min-w-0'>
                              <Typography
                                variant='body2'
                                weight='medium'
                                className='group-hover:text-primary line-clamp-2 transition-colors'
                              >
                                {post.title}
                              </Typography>
                              {post.publishedAt && (
                                <Typography
                                  variant='caption'
                                  className='mt-1 text-muted-foreground'
                                >
                                  {new Date(post.publishedAt).toLocaleDateString('en-US', {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric'
                                  })}
                                </Typography>
                              )}
                            </div>
                          </div>
                        </CustomLink>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              )}
            </div>
          </aside>
        </div>
      </Container>
    </Section>
  )
}

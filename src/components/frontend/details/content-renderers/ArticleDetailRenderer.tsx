import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'

interface ArticleDetailRendererProps {
  data: any
}

export default function ArticleDetailRenderer({ data }: ArticleDetailRendererProps) {
  return (
    <>
      {/* Hero Section */}
      <Section className='relative bg-linear-to-r from-gray-900/80 to-gray-900/40 bg-cover bg-center'>
        {data.featuredImage && (
          <div className='-z-10 absolute inset-0'>
            <CustomImage
              src={data.featuredImage}
              alt={data.title}
              className='w-full h-full object-cover'
            />
          </div>
        )}
        <Container>
          <div className='py-16'>
            <Typography variant='h1' weight='bold' className='mb-4 text-white'>
              {data.title}
            </Typography>
            {data.excerpt && (
              <Typography variant='body1' className='max-w-3xl text-gray-200'>
                {data.excerpt}
              </Typography>
            )}
            {data.publishedAt && (
              <p className='mt-4 text-gray-300 text-sm'>
                Published: {new Date(data.publishedAt).toLocaleDateString()}
              </p>
            )}
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section variant='lg'>
        <Container>
          <div className='mx-auto max-w-4xl'>
            <div
              className='max-w-none prose prose-lg'
              dangerouslySetInnerHTML={{ __html: data.content || data.body }}
            />
          </div>
        </Container>
      </Section>
    </>
  )
}

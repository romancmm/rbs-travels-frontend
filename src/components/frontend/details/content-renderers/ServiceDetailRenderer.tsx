import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'

interface ServiceDetailRendererProps {
  data: any
}

export default function ServiceDetailRenderer({ data }: ServiceDetailRendererProps) {
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
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section variant='lg'>
        <Container>
          <div className='gap-8 grid grid-cols-1 lg:grid-cols-3'>
            <div className='lg:col-span-2'>
              <div
                className='max-w-none prose prose-lg'
                dangerouslySetInnerHTML={{ __html: data.description || data.content }}
              />
            </div>

            {/* Sidebar */}
            <div className='space-y-6'>
              {data.price && (
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <Typography variant='h6' className='mb-2'>
                    Price
                  </Typography>
                  <Typography variant='h4' weight='bold' className='text-primary'>
                    ${data.price}
                  </Typography>
                </div>
              )}

              {data.features && data.features.length > 0 && (
                <div className='bg-gray-50 p-6 rounded-lg'>
                  <Typography variant='h6' className='mb-4'>
                    Features
                  </Typography>
                  <ul className='space-y-2'>
                    {data.features.map((feature: string, index: number) => (
                      <li key={index} className='flex items-start gap-2'>
                        <span className='mt-1 text-primary'>✓</span>
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

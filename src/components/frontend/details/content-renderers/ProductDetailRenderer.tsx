import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'

interface ProductDetailRendererProps {
  data: any
}

export default function ProductDetailRenderer({ data }: ProductDetailRendererProps) {
  return (
    <>
      <Section className='relative bg-linear-to-r from-gray-900/80 to-gray-900/40 bg-cover bg-center'>
        {data.images?.[0] && (
          <div className='-z-10 absolute inset-0'>
            <CustomImage
              src={data.images[0]}
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
          </div>
        </Container>
      </Section>

      <Section variant='lg'>
        <Container>
          <div className='gap-8 grid grid-cols-1 lg:grid-cols-2'>
            <div>
              {data.images && data.images.length > 0 && (
                <CustomImage src={data.images[0]} alt={data.title} className='rounded-lg w-full' />
              )}
            </div>
            <div>
              <Typography variant='h2' className='mb-4'>
                {data.title}
              </Typography>
              {data.price && (
                <Typography variant='h3' weight='bold' className='mb-4 text-primary'>
                  ${data.price}
                </Typography>
              )}
              <div
                className='max-w-none prose'
                dangerouslySetInnerHTML={{ __html: data.description }}
              />
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

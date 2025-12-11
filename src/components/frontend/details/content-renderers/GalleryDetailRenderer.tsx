import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'

interface GalleryDetailRendererProps {
  data: any
}

export default function GalleryDetailRenderer({ data }: GalleryDetailRendererProps) {
  return (
    <>
      <Section className='relative bg-linear-to-r from-gray-900/80 to-gray-900/40 bg-cover bg-center'>
        {data.coverImage && (
          <div className='-z-10 absolute inset-0'>
            <CustomImage
              src={data.coverImage}
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
            {data.description && (
              <Typography variant='body1' className='max-w-3xl text-gray-200'>
                {data.description}
              </Typography>
            )}
          </div>
        </Container>
      </Section>

      <Section variant='lg'>
        <Container>
          <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
            {data.images?.map((image: any, index: number) => (
              <div key={index} className='rounded-lg aspect-square overflow-hidden'>
                <CustomImage
                  src={typeof image === 'string' ? image : image.url}
                  alt={
                    typeof image === 'object' && image.caption
                      ? image.caption
                      : `Gallery image ${index + 1}`
                  }
                  className='w-full h-full object-cover hover:scale-110 transition-transform duration-300'
                />
              </div>
            ))}
          </div>
        </Container>
      </Section>
    </>
  )
}

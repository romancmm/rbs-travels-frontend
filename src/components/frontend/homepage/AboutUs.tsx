'use client'
import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
export default function AboutUs({ data }: { data?: any }) {
  return (
    <Section variant='xl'>
      <Container>
        <div className='flex sm:flex-row flex-col items-center gap-6 lg:gap-10'>
          <div className='space-y-4 w-full lg:w-1/2'>
            <Typography variant='subtitle1' className='text-primary'>
              {data?.subtitle}
            </Typography>
            <Typography variant='h2' as='h4' weight='bold' >
              {data?.title}
            </Typography>
            <Typography variant='body1'>
              {data?.description}
            </Typography>

            <div className="gap-4 grid grid-cols-2">
              {data?.facilities?.map((facility: any, index: number) => {
                const row = Math.floor(index / 2)
                const col = index % 2
                // Alternate diagonally (like checkerboard)
                const isAccent = (row + col) % 2 === 0
                const bgClass = isAccent
                  ? 'bg-primary/10'
                  : 'bg-muted-foreground/40'

                return (
                  <div
                    key={index}
                    className={`flex flex-col gap-2 hover:shadow-lg p-4 rounded-lg transition-all ${bgClass}`}
                  >
                    <div className="flex items-center gap-4">
                      <div className="flex justify-center items-center bg-white p-1.5 rounded-full w-16 h-16 aspect-square">
                        <CustomImage
                          src={facility.icon}
                          height={28}
                          width={28}
                          alt={facility.title}
                        />
                      </div>
                      <Typography variant="body1" as="h4" weight="bold">
                        {facility.title}
                      </Typography>
                    </div>
                  </div>
                )
              })}
            </div>

          </div>

          {/* Features list */}
          <div className='relative w-full lg:w-1/2'>
            <CustomImage
              src={data?.image}
              height={425}
              width={530}
              alt={'About RBS Travels'}
              className='rounded-lg'
            />

            <div className="-right-4 -bottom-4 absolute flex items-center gap-4 bg-primary shadow-lg p-3 rounded-lg divide-x max-w-56 text-primary-foreground">
              <div className="pr-3 font-bold text-5xl">05</div>
              <div className="font-bold text-lg">Years of experience</div>
            </div>
          </div>
        </div>
      </Container>
    </Section>
  )
}
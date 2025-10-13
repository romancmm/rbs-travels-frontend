import AnimatedCounter from '@/components/common/AnimatedCounter'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'

export default function Stats({ data }: { data?: any }) {
  return (
    <Section variant='none'>
      <Container>
        <div className='flex sm:flex-row flex-col justify-evenly items-center gap-6 lg:gap-10 py-4 border-y w-full'>
          {data?.map((item: any, index: number) => (
            <div key={index} className='flex items-center gap-4 p-3 w-full'>
              <div className="flex justify-center items-center size-20">
                <item.icon color="#0f6578" className="w-12 h-12 text-primary group-hover:text-white group-hover:rotate-45 transition-transform duration-700 ease-in-out delay-200" />
              </div>
              <div className="">
                <Typography className='' variant='h4' weight={'bold'}>
                  <AnimatedCounter value={item.value} />
                </Typography>
                <Typography className='text-gray-500 dark:text-gray-400 text-sm'>{item.label}</Typography>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section >
  )
}

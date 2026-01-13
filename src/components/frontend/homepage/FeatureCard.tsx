import { IconOrImage } from '@/components/common/IconOrImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'

interface FeatureCardProps {
  icon?: string
  title?: string
  desc?: string
  index: number
  className?: string
}

const FeatureCard = ({ icon, title, desc, index, className }: FeatureCardProps) => {
  return (
    <div
      key={index}
      className={cn(
        'group flex items-start gap-4 bg-white hover:bg-yellow-50/80 shadow-lg hover:shadow-xl px-4 py-5 rounded-lg transition-all duration-300 ease-in-out',
        className
      )}
    >
      <div className='space-y-2'>
        <div className='flex justify-start items-center gap-2'>
          {icon && (
            <div className='flex justify-center size-20! aspect-square! text-primary'>
              <IconOrImage
                icon={icon}
                alt={title || 'Feature icon'}
                size='xl'
                color='primary'
                iconClassName='group-hover:rotate-12 transition-transform duration-700 ease-in-out delay-200'
                strokeWidth={1}
              />
            </div>
          )}
          <Typography weight={'bold'} variant={'subtitle1'}>
            {title}
          </Typography>
        </div>
        <Typography className='text-gray-600'>{desc}</Typography>
      </div>
      {/* Subtle hover indicator */}
      <div className='bottom-0 left-1/2 absolute bg-linear-to-r from-primary to-primary/50 rounded-t-full w-0 group-hover:w-12 h-1 transition-all -translate-x-1/2 duration-300' />
    </div>
  )
}

export default FeatureCard

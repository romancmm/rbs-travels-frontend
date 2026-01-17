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
        'group relative bg-linear-to-br from-white to-gray-50/50 backdrop-blur-sm p-8 border border-gray-200/60 hover:border- rounded-2xl transition-all duration-300',
        'hover:shadow-[0_8px_30px_rgb(0,0,0,0.12)] hover:scale-[1.02] overflow-hidden',
        className
      )}
    >
      {/* Top corner accent */}
      <div className='-top-16 group-hover:top-0 -right-16 group-hover:right-0 absolute bg-linear-to-bl from-primary/10 via-primary/5 to-transparent opacity-85 group-hover:opacity-100 rounded-tr-2xl rounded-bl-[60px] w-24 h-24 transition-all duration-500' />

      {/* Icon - Centered at top */}
      {icon && (
        <div className='flex justify-center items-center bg-white shadow-lg group-hover:shadow-xl mx-auto mb-6 rounded-2xl ring ring-primary/10 group-hover:ring-primary/20 size-20 transition-all group-hover:-translate-y-2 duration-300'>
          <IconOrImage
            icon={icon}
            alt={title || 'Feature icon'}
            size='lg'
            color='primary'
            iconClassName='group-hover:scale-105 transition-transform duration-300'
            strokeWidth={2}
          />
        </div>
      )}

      {/* Content */}
      <div className='z-10 relative space-y-3 text-center'>
        <Typography
          weight={'bold'}
          variant={'h6'}
          className='text-gray-800 group-hover:text-primary transition-colors duration-300'
        >
          {title}
        </Typography>

        <Typography className='text-gray-600 text-sm leading-relaxed'>{desc}</Typography>
      </div>

      {/* Bottom shine effect */}
      <div className='bottom-0 left-0 absolute bg-linear-to-t from-primary/5 to-transparent opacity-0 group-hover:opacity-100 rounded-b-2xl w-full h-1/3 transition-opacity duration-500' />
    </div>
  )
}

export default FeatureCard

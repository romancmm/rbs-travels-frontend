import { Typography } from '@/components/common/typography';
import { cn } from '@/lib/utils';

interface FeatureCardProps {
  icon: React.ComponentType<{ className?: string; color?: string }>
  title: string
  desc: string
  index: number
  className?: string
}

const FeatureCard = ({ icon: Icon, title, desc, index, className }: FeatureCardProps) => {
  return (
    <div
      key={index}
      className={cn(
        'group flex items-start gap-4 bg-white hover:bg-muted-foreground shadow-lg hover:shadow-xl px-4 py-5 rounded-lg transition-all duration-300 ease-in-out',
        className
      )}
    >
      <div className='flex justify-center mt-2 !text-primary'>
        <Icon
          color='#0f6578'
          className='w-16 h-16 group-hover:text-white! group-hover:rotate-12 transition-transform duration-700 ease-in-out delay-200'
        />
      </div>
      <div className='space-y-2'>
        <Typography weight={'bold'} variant={'subtitle1'}>
          {title}
        </Typography>
        <Typography className='text-gray-600'>{desc}</Typography>
      </div>
      {/* Subtle hover indicator */}
      <div className='bottom-0 left-1/2 absolute bg-gradient-to-r from-primary to-primary/50 rounded-t-full w-0 group-hover:w-12 h-1 transition-all -translate-x-1/2 duration-300' />
    </div>
  )
}

export default FeatureCard

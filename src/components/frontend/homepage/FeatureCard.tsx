import CustomImage from '@/components/common/CustomImage'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import * as LucideIcons from 'lucide-react'

interface FeatureCardProps {
  icon?: string
  title?: string
  desc?: string
  index: number
  className?: string
}

const FeatureCard = ({ icon, title, desc, index, className }: FeatureCardProps) => {
  // Check if icon is a Lucide icon name
  const isLucideIcon = (iconName: string | undefined): iconName is keyof typeof LucideIcons => {
    if (!iconName) return false
    // Check exact match
    if (iconName in LucideIcons) return true
    // Check PascalCase version
    const pascalCase = iconName.charAt(0).toUpperCase() + iconName.slice(1)
    return pascalCase in LucideIcons
  }

  const renderIcon = () => {
    if (!icon) return null

    if (isLucideIcon(icon)) {
      const iconName = icon in LucideIcons ? icon : (icon.charAt(0).toUpperCase() + icon.slice(1))
      const IconComponent = LucideIcons[iconName as keyof typeof LucideIcons] as React.ComponentType<{
        className?: string
        color?: string
      }>
      return (
        <IconComponent
          color='#0f6578'
          className='w-16 h-16 group-hover:text-white! group-hover:rotate-12 transition-transform duration-700 ease-in-out delay-200'
        />
      )
    }

    // Render as image if not a Lucide icon
    return (
      <CustomImage
        src={icon}
        alt={title || 'Feature icon'}
        width={64}
        height={64}
        className='rounded-lg group-hover:rotate-12 transition-transform duration-700 ease-in-out delay-200'
      />
    )
  }

  return (
    <div
      key={index}
      className={cn(
        'group flex items-start gap-4 bg-white hover:bg-yellow-50/80 shadow-lg hover:shadow-xl px-4 py-5 rounded-lg transition-all duration-300 ease-in-out',
        className
      )}
    >
      <div className='flex justify-center mt-2 text-primary!'>{renderIcon()}</div>
      <div className='space-y-2'>
        <Typography weight={'bold'} variant={'subtitle1'}>
          {title}
        </Typography>
        <Typography className='text-gray-600'>{desc}</Typography>
      </div>
      {/* Subtle hover indicator */}
      <div className='bottom-0 left-1/2 absolute bg-linear-to-r from-primary to-primary/50 rounded-t-full w-0 group-hover:w-12 h-1 transition-all -translate-x-1/2 duration-300' />
    </div>
  )
}

export default FeatureCard

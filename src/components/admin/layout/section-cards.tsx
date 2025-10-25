import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import Image from 'next/image'

export function SectionCards() {
  const cardData = [
    {
      title: 'Orders Pending',
      count: '2',
      icon: '/images/dashboard-icons/time-management.png',
      iconSize: { width: 30, height: 30 }
    },
    {
      title: 'Orders Processing',
      count: '2',
      icon: '/images/dashboard-icons/ethics.png',
      iconSize: { width: 28, height: 28 }
    },
    {
      title: 'Orders Completed',
      count: '2',
      icon: '/images/dashboard-icons/completed-task.png',
      iconSize: { width: 28, height: 28 }
    },
    {
      title: 'Total Products',
      count: '2',
      icon: '/images/dashboard-icons/products.png',
      iconSize: { width: 31, height: 31 }
    },
    {
      title: 'Total Customers',
      count: '2',
      icon: '/images/dashboard-icons/customer-review.png',
      iconSize: { width: 30, height: 30 }
    },
    {
      title: 'Total Blogs',
      count: '2',
      icon: '/images/dashboard-icons/shared-post.png',
      iconSize: { width: 30, height: 30 }
    },
    {
      title: 'Total Earning',
      count: '2',
      icon: '/images/dashboard-icons/investment.png',
      iconSize: { width: 34, height: 34 }
    },
    {
      title: 'New Customers (Today)',
      count: '2',
      icon: '/images/dashboard-icons/end.png',
      iconSize: { width: 30, height: 30 }
    }
  ]

  return (
    <div className='gap-4 lg:gap-5 grid grid-cols-2 lg:grid-cols-4 text-center'>
      {cardData.map((card, index) => (
        <div
          key={index}
          className='flex flex-col items-center gap-3 bg-card shadow-primary/30 hover:shadow-md p-3 lg:p-5 border hover:border-primary/65 rounded-xl'
        >
          {/* Title */}
          <Typography className='font-rajdhani' weight={'semibold'}>
            {card.title}
          </Typography>

          {/* Icon Container */}
          <div className='flex justify-center items-center bg-card p-3 border border-primary rounded-full size-14'>
            <Image
              src={card.icon}
              alt={card.title}
              width={30}
              height={30}
              className='object-cover'
            />
          </div>

          {/* Count */}
          <div className='w-full h-[26.39px] font-rajdhani font-semibold text-[30px] text-center leading-[39px] tracking-[-1%]'>
            {card.count}
          </div>

          {/* View All Link */}
          <CustomLink href={'#'} className='w-full font-inter font-normal text-primary text-sm'>
            View All
          </CustomLink>
        </div>
      ))}
    </div>
  )
}

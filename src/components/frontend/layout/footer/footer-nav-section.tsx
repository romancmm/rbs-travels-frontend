'use client'

import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { getMenuItemUrl, MenuItem } from '@/types/menu.types'
import { ArrowRight } from 'lucide-react'

interface FooterNavSectionProps {
  title: string
  children: MenuItem[]
}

export function FooterNavSection({ title, children }: FooterNavSectionProps) {
  return (
    <div className='space-y-5'>
      <Typography variant='h6' weight='semibold' className='text-white'>
        {title}
      </Typography>
      <ul className='space-y-3'>
        {children?.map((child, idx) => (
          <li key={idx}>
            <CustomLink
              href={getMenuItemUrl(child)}
              className='group flex items-center text-footer-color/90 hover:text-footer-color/80 transition-colors duration-300'
            >
              <ArrowRight className='opacity-0 group-hover:opacity-100 mr-2 w-3 h-3 transition-all -translate-x-2 group-hover:translate-x-0 duration-300' />
              <Typography
                variant='body2'
                className='transition-transform group-hover:translate-x-1 duration-300'
              >
                {child.title}
              </Typography>
            </CustomLink>
          </li>
        ))}
      </ul>
    </div>
  )
}

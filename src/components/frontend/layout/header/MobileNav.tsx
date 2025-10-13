'use client'

import CustomLink from '@/components/common/CustomLink'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { siteConfig } from '@/data/siteConfig'
import { Mail, Menu, PhoneCall } from 'lucide-react'
import { useState } from 'react'

export default function MobileNav({ items }: { items: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  // const { siteConfig } = useSiteConfig()

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className='xl:hidden flex justify-center items-center rounded-md transition-colors cursor-pointer'>
          <Menu className='w-6 h-6' />
        </button>
      </SheetTrigger>
      <SheetContent side='right' className='p-0 border-0 w-80'>
        <SheetHeader className='flex justify-between items-center p-4'>
          <SheetTitle>Navigation Menu</SheetTitle>
        </SheetHeader>

        <div className='flex flex-col space-y-6 p-6 overflow-y-auto'>
          {/* Navigation Links - Simple Menu Style */}
          {items?.length > 0 && (
            <nav className='space-y-1'>
              {items.map((item, index) => (
                <CustomLink
                  key={index}
                  href={item.href ?? '#'}
                  onClick={() => setIsOpen(false)}
                  className='block py-1 font-medium text-sm'
                >
                  {item.title}
                </CustomLink>
              ))}
            </nav>
          )}

          {/* Contact Info */}
          <div className='pt-6'>
            <div className='space-y-2'>
              <p className='flex items-center gap-2'>
                <PhoneCall className='size-4' /> {siteConfig?.phone}
              </p>
              <p className='flex items-center gap-2'>
                <Mail className='size-4' /> {siteConfig?.email}
              </p>
            </div>
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

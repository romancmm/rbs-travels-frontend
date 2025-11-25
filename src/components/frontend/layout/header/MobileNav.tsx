'use client'

import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { useSiteConfig } from '@/components/providers/store-provider'
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from '@/components/ui/sheet'
import { getMenuItemUrl } from '@/types/menu.types'
import { ChevronRight, Mail, MapPin, Menu, PhoneCall, X } from 'lucide-react'
import { useState } from 'react'

export default function MobileNav({ items }: { items: any[] }) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedItem, setExpandedItem] = useState<number | null>(null)
  const { siteConfig } = useSiteConfig()

  const toggleExpanded = (index: number) => {
    setExpandedItem(expandedItem === index ? null : index)
  }

  return (
    <Sheet open={isOpen} onOpenChange={setIsOpen}>
      <SheetTrigger asChild>
        <button className='xl:hidden flex justify-center items-center bg-white/10 hover:bg-white/20 rounded-lg w-10 h-10 transition-colors cursor-pointer'>
          <Menu className='w-5 h-5' />
        </button>
      </SheetTrigger>
      <SheetContent
        side='right'
        className='bg-linear-to-b from-slate-900 to-slate-800 p-0 border-0 w-80'
      >
        <SheetHeader className='flex flex-row justify-between items-center p-6 border-white/10 border-b'>
          <SheetTitle className='text-white'>
            <Typography variant='h6' weight='semibold'>
              Menu
            </Typography>
          </SheetTitle>
          <button
            onClick={() => setIsOpen(false)}
            className='flex justify-center items-center bg-white/10 hover:bg-white/20 rounded-lg w-8 h-8 transition-colors'
          >
            <X className='w-4 h-4 text-white' />
          </button>
        </SheetHeader>

        <div className='flex flex-col h-full overflow-y-auto'>
          {/* Navigation Links */}
          {items?.length > 0 && (
            <nav className='flex-1 space-y-2 p-6'>
              {items.map((item, index) => (
                <div key={index} className='space-y-2'>
                  {item.children ? (
                    // Parent item with children
                    <div>
                      <button
                        onClick={() => toggleExpanded(index)}
                        className='flex justify-between items-center hover:bg-white/10 px-4 py-3 rounded-lg w-full text-white transition-colors'
                      >
                        <Typography variant='body1' weight='medium'>
                          {item.title}
                        </Typography>
                        {item.children?.length > 0 && (
                          <ChevronRight
                            className={`w-4 h-4 transition-transform duration-200 ${expandedItem === index ? 'rotate-90' : ''
                              }`}
                          />
                        )}
                      </button>

                      {/* Submenu */}
                      {expandedItem === index && (
                        <div className='space-y-1 ml-4 pl-4 border-white/20 border-l'>
                          {item.children.map((child: any, childIndex: number) => (
                            <CustomLink
                              key={childIndex}
                              href={getMenuItemUrl(child)}
                              onClick={() => setIsOpen(false)}
                              className='block hover:bg-white/10 px-3 py-2 rounded-lg text-slate-300 hover:text-white transition-colors'
                            >
                              <Typography variant='body2'>{child.title}</Typography>
                            </CustomLink>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    // Regular navigation item
                    <CustomLink
                      href={getMenuItemUrl(item)}
                      onClick={() => setIsOpen(false)}
                      className='block hover:bg-white/10 px-4 py-3 rounded-lg text-white transition-colors'
                    >
                      <Typography variant='body1' weight='medium'>
                        {item.title}
                      </Typography>
                    </CustomLink>
                  )}
                </div>
              ))}
            </nav>
          )}

          {/* Contact Section */}
          <div className='space-y-6 p-6 border-white/10 border-t'>
            {/* Contact Info */}
            <div className='space-y-4'>
              <Typography variant='h6' weight='semibold' className='text-white'>
                Contact Us
              </Typography>

              <div className='space-y-3'>
                <div className='flex items-center gap-3'>
                  <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8'>
                    <PhoneCall className='w-4 h-4 text-primary' />
                  </div>
                  <CustomLink
                    href={`tel:${siteConfig?.phone}`}
                    className='text-slate-300 hover:text-white transition-colors'
                  >
                    <Typography variant='body2'>{siteConfig?.phone}</Typography>
                  </CustomLink>
                </div>

                <div className='flex items-center gap-3'>
                  <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8'>
                    <Mail className='w-4 h-4 text-primary' />
                  </div>
                  <CustomLink
                    href={`mailto:${siteConfig?.email}`}
                    className='text-slate-300 hover:text-white transition-colors'
                  >
                    <Typography variant='body2'>{siteConfig?.email}</Typography>
                  </CustomLink>
                </div>

                <div className='flex flex-auto items-start gap-3'>
                  <div className='flex justify-center items-center bg-primary/20 mt-0.5 rounded-lg w-8 h-8'>
                    <MapPin className='w-4 h-4 text-primary' />
                  </div>
                  <div className='flex-1'>
                    <Typography variant='body2' className='text-slate-300 leading-relaxed'>
                      {siteConfig?.address}
                    </Typography>
                  </div>
                </div>
              </div>
            </div>

            {/* CTA Button */}
            {/* <Button
              onClick={() => setIsOpen(false)}
              className='bg-primary hover:bg-primary/90 shadow-lg py-3 rounded-lg w-full font-semibold text-white transition-all duration-300'
            >
              Book Your Trip Now
            </Button> */}
          </div>
        </div>
      </SheetContent>
    </Sheet>
  )
}

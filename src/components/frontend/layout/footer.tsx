'use client'

import { Container } from '@/components/common/container'
import CustomLink from '@/components/common/CustomLink'
import SocialLinks from '@/components/common/SocialLinks'
import { Typography } from '@/components/common/typography'
import { useSiteConfig } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import { getMenuItemUrl } from '@/types/menu.types'
import { ArrowRight, Mail, Phone } from 'lucide-react'
import { use } from 'react'

export default function Footer({ data }: { data: any }) {
  const { siteConfig } = useSiteConfig() as { siteConfig?: SiteSettings }
  const footerNav: any = use(data)

  return (
    <footer className='relative bg-footer-background bg-linear-to-br from-footer-background/90 via-footer-background/80 to-footer-background/90 overflow-hidden text-footer-color'>
      {/* Decorative Background Pattern */}
      <div
        className='absolute inset-0 opacity-5'
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
        }}
      />

      <div className='relative'>
        {/* Main Content */}
        <div className='pt-20 pb-12'>
          <Container>
            <div className='gap-10 lg:gap-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
              {/* 1️⃣ Company Info */}
              <div className='space-y-6'>
                <div className='flex items-center gap-3'>
                  {/* <div className="flex justify-center items-center bg-primary rounded-xl w-12 h-12">
                    <CustomImage
                      src="/logo3.jpeg"
                      width={28}
                      height={28}
                      alt={siteConfig.name}
                      className="object-contain"
                    />
                  </div> */}
                  <Typography variant='h6' weight='bold' className='text-white'>
                    {siteConfig?.name}
                  </Typography>
                </div>
                <Typography variant='body1' className='max-w-sm text-slate-300 leading-relaxed'>
                  {siteConfig?.shortDescription}
                </Typography>

                {/* Social Links */}
                <div>
                  <Typography variant='h6' weight='semibold' className='mb-3 text-white'>
                    Follow Us
                  </Typography>
                  <SocialLinks />
                </div>
              </div>

              {/* 2️⃣ Navigation Links */}
              {footerNav?.data?.items?.length > 0 &&
                footerNav?.data?.items?.slice(0, 2)?.map((nav: any, index: number) => (
                  <div key={index} className='space-y-5'>
                    <Typography variant='h6' weight='semibold' className='text-white'>
                      {nav.title}
                    </Typography>
                    <ul className='space-y-3'>
                      {nav.children?.map((child: any, idx: number) => (
                        <li key={idx}>
                          <CustomLink
                            href={getMenuItemUrl(child)}
                            className='group flex items-center text-slate-300 hover:text-primary transition-colors duration-300'
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
                ))}

              {/* 3️⃣ Contact Information */}
              <div
                className={cn('space-y-6', {
                  'lg:col-span-2': footerNav?.data?.items?.length <= 1
                })}
              >
                <Typography variant='h6' weight='semibold' className='text-white'>
                  Get in Touch
                </Typography>

                <div
                  className={cn('flex flex-wrap gap-8 w-full', {
                    'flex-col sm:flex-row sm:gap-12 *:lg:max-w-[calc(50%-3rem)]':
                      (siteConfig?.addresses?.length ?? 0) <= 1
                  })}
                >
                  {siteConfig?.addresses?.map((office, index) => (
                    <div key={index} className='flex align-start gap-2'>
                      {office.title && (
                        <Typography
                          variant='body1'
                          weight='semibold'
                          className='font-cursive text-primary uppercase tracking-wide rotate-90__ [writing-mode:sideways-lr'
                        >
                          {office.title}
                        </Typography>
                      )}

                      <div className='space-y-2'>
                        {/* Address */}
                        {office.address && (
                          <div className='flex items-start gap-3 text-slate-300 hover:text-white transition-colors'>
                            <Typography variant='body2' className='leading-relaxed'>
                              {office.address}
                            </Typography>
                          </div>
                        )}

                        {/* Phone */}
                        {office.phone && (
                          <div className='flex items-center gap-3 text-slate-300 hover:text-white transition-colors'>
                            <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0'>
                              <Phone className='w-4 h-4' />
                            </div>
                            <CustomLink
                              href={`tel:${office.phone.replace(/\s+/g, '')}`}
                              className='hover:text-primary transition-colors'
                            >
                              <Typography variant='body2'>{office.phone}</Typography>
                            </CustomLink>
                          </div>
                        )}

                        {/* Email */}
                        {office.email && (
                          <div className='flex items-center gap-3 text-slate-300 hover:text-white transition-colors'>
                            <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0'>
                              <Mail className='w-4 h-4' />
                            </div>
                            <CustomLink
                              href={`mailto:${office.email}`}
                              className='hover:text-primary transition-colors'
                            >
                              <Typography variant='body2'>{office.email}</Typography>
                            </CustomLink>
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Footer Bottom */}
        <div className='bg-slate-900/50 backdrop-blur-sm py-6 border-slate-700 border-t'>
          <Container>
            <div className='flex md:flex-row flex-col justify-between items-center gap-4 text-slate-400 text-sm'>
              <Typography variant='body2' className='md:text-left text-center'>
                {siteConfig?.footer?.copyright}
                {siteConfig?.footer?.credit?.showCredit && (
                  <span className='text-slate-400'>
                    {' '}
                    Developed by{' '}
                    <CustomLink href={siteConfig?.footer?.credit?.url ?? '#'}>
                      {siteConfig?.footer?.credit?.companyName}
                    </CustomLink>
                  </span>
                )}
              </Typography>

              {/* <div className="flex items-center gap-6">
                <div className="flex items-center gap-4">
                  <CustomLink href="/page/terms" className="hover:text-primary transition-colors">
                    Terms
                  </CustomLink>
                  <div className="bg-slate-600 rounded-full w-1 h-1" />
                  <CustomLink
                    href="/page/privacy-policy"
                    className="hover:text-primary transition-colors"
                  >
                    Privacy
                  </CustomLink>
                </div>
                <GotoTop />
              </div> */}
            </div>
          </Container>
        </div>
      </div>
    </footer>
  )
}

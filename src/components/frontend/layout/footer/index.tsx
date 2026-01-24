'use client'

import { Container } from '@/components/common/container'
import { useSiteConfig } from '@/components/providers/store-provider'
import { cn } from '@/lib/utils'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import { use } from 'react'
import { FooterBackground } from './footer-background'
import { FooterBottom } from './footer-bottom'
import { FooterCompanyInfo } from './footer-company-info'
import { FooterContactInfo } from './footer-contact-info'
import { FooterNavSection } from './footer-nav-section'

export default function Footer({ data }: { data: any }) {
  const { siteConfig } = useSiteConfig() as { siteConfig?: SiteSettings }
  const footerNav: any = use(data)

  return (
    <footer className='relative bg-footer-background bg-linear-to-br from-footer-background/90 via-footer-background/80 to-footer-background/90 overflow-hidden text-footer-color'>
      <FooterBackground />

      <div className='relative'>
        <div className='pt-20 pb-12'>
          <Container>
            <div className='gap-10 lg:gap-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4'>
              <FooterCompanyInfo siteConfig={siteConfig} />

              {footerNav?.data?.items?.length > 0 &&
                footerNav.data.items
                  .slice(0, 2)
                  .map((nav: any, index: number) => (
                    <FooterNavSection key={index} title={nav.title} children={nav.children} />
                  ))}

              <FooterContactInfo
                addresses={siteConfig?.addresses}
                className={cn({
                  'lg:col-span-2': footerNav?.data?.items?.length <= 1
                })}
              />
            </div>
          </Container>
        </div>

        <FooterBottom siteConfig={siteConfig} />
      </div>
    </footer>
  )
}

'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import GotoTop from '@/components/common/GotoTop'
import { Typography } from '@/components/common/typography'
import { siteConfig } from '@/data/siteConfig'
import { ArrowRight, Mail, Phone } from 'lucide-react'
import { use } from 'react'

export default function Footer({ data }: { data: any }) {
  const res: any = use(data)


  return (
    <footer className="relative bg-slate-900 bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden text-white">
      {/* Decorative Background Pattern */}
      <div
        className="absolute inset-0 opacity-5"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
        }}
      />

      <div className="relative">
        {/* Main Content */}
        <div className="pt-20 pb-12">
          <Container>
            <div className="gap-10 lg:gap-14 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
              {/* 1️⃣ Company Info */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  {/* <div className="flex justify-center items-center bg-primary rounded-xl w-12 h-12">
                    <CustomImage
                      src="/logo3.jpeg"
                      width={28}
                      height={28}
                      alt={siteConfig.name}
                      className="object-contain"
                    />
                  </div> */}
                  <Typography variant="h6" weight="bold" className="text-white">
                    {siteConfig.name}
                  </Typography>
                </div>
                <Typography variant="body1" className="max-w-sm text-slate-300 leading-relaxed">
                  {siteConfig.description}
                </Typography>

                {/* Social Links */}
                <div>
                  <Typography variant="h6" weight="semibold" className="mb-3 text-white">
                    Follow Us
                  </Typography>
                  <div className="flex flex-wrap gap-3">
                    {siteConfig?.socialLinks?.map((item, index) => (
                      <CustomLink
                        key={index}
                        href={item.url}
                        target="_blank"
                        rel="noreferrer"
                        className="group flex justify-center items-center bg-slate-800 hover:bg-primary rounded-xl w-10 h-10 hover:scale-110 transition-all duration-300"
                      >
                        <CustomImage
                          src={item.icon}
                          width={20}
                          height={20}
                          alt={item.name}
                          className="group-hover:brightness-0 group-hover:invert object-contain transition-all duration-300"
                        />
                      </CustomLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* 2️⃣ Navigation Links */}
              {res?.data?.items?.slice(0, 2)?.map((nav: any, index: number) => (
                <div key={index} className="space-y-5">
                  <Typography variant="h6" weight="semibold" className="text-white">
                    {nav.title}
                  </Typography>
                  <ul className="space-y-3">
                    {nav.children?.map((child: any, idx: number) => (
                      <li key={idx}>
                        <CustomLink
                          href={child.href ?? '#'}
                          className="group flex items-center text-slate-300 hover:text-primary transition-colors duration-300"
                        >
                          <ArrowRight className="opacity-0 group-hover:opacity-100 mr-2 w-3 h-3 transition-all -translate-x-2 group-hover:translate-x-0 duration-300" />
                          <Typography
                            variant="body2"
                            className="transition-transform group-hover:translate-x-1 duration-300"
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
              <div className="space-y-6">
                <Typography variant="h6" weight="semibold" className="text-white">
                  Get in Touch
                </Typography>

                {siteConfig.contact.offices.map((office, index) => (
                  <div key={index} className="space-y-3">
                    <Typography
                      variant="body1"
                      weight="semibold"
                      className="text-primary uppercase tracking-wide"
                    >
                      {office.country}
                    </Typography>

                    {/* Address */}
                    <div className="flex items-start gap-3 text-slate-300 hover:text-white transition-colors">
                      {/* <div className="flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0">
                        <MapPin className="w-4 h-4" />
                      </div> */}
                      <Typography variant="body2" className="leading-relaxed">
                        {office.address}
                      </Typography>
                    </div>

                    {/* Phone */}
                    <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                      <div className="flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0">
                        <Phone className="w-4 h-4" />
                      </div>
                      <CustomLink
                        href={`tel:${office.phone.replace(/\s+/g, '')}`}
                        className="hover:text-primary transition-colors"
                      >
                        <Typography variant="body2">{office.phone}</Typography>
                      </CustomLink>
                    </div>

                    {/* Email */}
                    <div className="flex items-center gap-3 text-slate-300 hover:text-white transition-colors">
                      <div className="flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8 shrink-0">
                        <Mail className="w-4 h-4" />
                      </div>
                      <CustomLink
                        href={`mailto:${office.email}`}
                        className="hover:text-primary transition-colors"
                      >
                        <Typography variant="body2">{office.email}</Typography>
                      </CustomLink>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </Container>
        </div>

        {/* Footer Bottom */}
        <div className="bg-slate-900/50 backdrop-blur-sm py-6 border-slate-700 border-t">
          <Container>
            <div className="flex md:flex-row flex-col justify-between items-center gap-4 text-slate-400 text-sm">
              <Typography variant="body2" className="md:text-left text-center">
                {siteConfig?.footer?.copyright}
              </Typography>

              <div className="flex items-center gap-6">
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
              </div>
            </div>
          </Container>
        </div>
      </div>
    </footer>

  )
}

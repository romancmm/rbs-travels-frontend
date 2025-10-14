'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import GotoTop from '@/components/common/GotoTop'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { siteConfig } from '@/data/siteConfig'
import { ArrowRight, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'

export default function Footer() {
  const [email, setEmail] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  const handleNewsletterSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email) return

    setIsSubmitting(true)
    // Simulate API call
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setIsSubmitting(false)
    setEmail('')
    // Show success message or handle the newsletter subscription
  }

  return (
    <footer className='relative bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 overflow-hidden text-white'>
      {/* Background Pattern */}
      <div className='absolute inset-0 opacity-5'>
        <div
          className='absolute inset-0'
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
          }}
        />
      </div>

      <div className='relative'>
        {/* Main Footer Content */}
        <div className='pt-16 pb-8'>
          <Container>
            <div className='gap-12 grid grid-cols-1 lg:grid-cols-4 mb-12'>
              {/* Company Info */}
              <div className='space-y-6 lg:col-span-2'>
                <div className='space-y-4'>
                  <div className='flex items-center space-x-3'>
                    <div className='flex justify-center items-center bg-primary rounded-xl w-10 h-10'>
                      <CustomImage
                        src='/logo.jpeg'
                        width={24}
                        height={24}
                        alt='RBS Travels'
                        className='object-contain'
                      />
                    </div>
                    <Typography variant='h4' weight='bold' className='text-white'>
                      {siteConfig.name}
                    </Typography>
                  </div>
                  <Typography variant='body1' className='max-w-md text-slate-300'>
                    {siteConfig.description}
                  </Typography>
                </div>

                {/* Contact Information */}
                <div className='space-y-4'>
                  <Typography variant='h6' weight='semibold' className='text-white'>
                    Get in Touch
                  </Typography>
                  <div className='space-y-3'>
                    <div className='flex items-center space-x-3 text-slate-300 hover:text-white transition-colors'>
                      <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8'>
                        <MapPin className='w-4 h-4' />
                      </div>
                      <Typography variant='body2'>{siteConfig.address}</Typography>
                    </div>
                    <div className='flex items-center space-x-3 text-slate-300 hover:text-white transition-colors'>
                      <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8'>
                        <Phone className='w-4 h-4' />
                      </div>
                      <CustomLink
                        href={`tel:${siteConfig.phone}`}
                        className='hover:text-primary transition-colors'
                      >
                        <Typography variant='body2'>{siteConfig.phone}</Typography>
                      </CustomLink>
                    </div>
                    <div className='flex items-center space-x-3 text-slate-300 hover:text-white transition-colors'>
                      <div className='flex justify-center items-center bg-primary/20 rounded-lg w-8 h-8'>
                        <Mail className='w-4 h-4' />
                      </div>
                      <CustomLink
                        href={`mailto:${siteConfig.email}`}
                        className='hover:text-primary transition-colors'
                      >
                        <Typography variant='body2'>{siteConfig.email}</Typography>
                      </CustomLink>
                    </div>
                  </div>
                </div>

                {/* Social Links */}
                <div className='space-y-4'>
                  <Typography variant='h6' weight='semibold' className='text-white'>
                    Follow Us
                  </Typography>
                  <div className='flex flex-wrap gap-3'>
                    {siteConfig?.socialLinks?.map((item, index) => (
                      <CustomLink
                        key={index}
                        href={item.url}
                        target='_blank'
                        rel='noreferrer'
                        className='group flex justify-center items-center bg-slate-800 hover:bg-primary rounded-xl w-10 h-10 hover:scale-110 transition-all duration-300'
                      >
                        <CustomImage
                          src={item.icon}
                          width={20}
                          height={20}
                          alt={item.name}
                          className='group-hover:brightness-0 group-hover:invert object-contain transition-all duration-300 filter'
                        />
                      </CustomLink>
                    ))}
                  </div>
                </div>
              </div>

              {/* Navigation Links */}
              {siteConfig?.footerNav?.map((nav: any, index: number) => (
                <div key={index} className='space-y-6'>
                  <Typography variant='h6' weight='semibold' className='text-white'>
                    {nav.title}
                  </Typography>
                  <div className='space-y-3'>
                    {nav.children?.map((child: any, idx: number) => (
                      <CustomLink
                        key={idx}
                        href={child.href ?? '#'}
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
                    ))}
                  </div>
                </div>
              ))}
            </div>

            {/* Newsletter Subscription */}
            <div className='mb-8 pt-8 border-slate-700 border-t'>
              <div className='mx-auto lg:mx-0 max-w-md'>
                <div className='space-y-4 lg:text-left text-center'>
                  <Typography variant='h6' weight='semibold' className='text-white'>
                    Stay Updated
                  </Typography>
                  <Typography variant='body2' className='text-slate-300'>
                    Subscribe to our newsletter for the latest travel deals and updates.
                  </Typography>
                  <form onSubmit={handleNewsletterSubmit} className='flex gap-2'>
                    <Input
                      type='email'
                      placeholder='Enter your email'
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className='flex-1 bg-slate-800 border-slate-600 focus:border-primary text-white placeholder:text-slate-400'
                    />
                    <Button
                      type='submit'
                      disabled={isSubmitting}
                      className='bg-primary hover:bg-primary/90 px-4 text-white'
                    >
                      {isSubmitting ? (
                        <div className='border-2 border-white/30 border-t-white rounded-full w-4 h-4 animate-spin' />
                      ) : (
                        <Send className='w-4 h-4' />
                      )}
                    </Button>
                  </form>
                </div>
              </div>
            </div>
          </Container>
        </div>

        {/* Footer Bottom */}
        <div className='bg-slate-900/50 backdrop-blur-sm py-6 border-slate-700 border-t'>
          <Container>
            <div className='flex md:flex-row flex-col justify-between items-center gap-4'>
              <Typography variant='body2' className='text-slate-400 md:text-left text-center'>
                {siteConfig?.footer?.copyright}
              </Typography>

              <div className='flex items-center gap-6'>
                <div className='flex items-center gap-4 text-slate-400 text-sm'>
                  <CustomLink href='/page/terms' className='hover:text-primary transition-colors'>
                    Terms
                  </CustomLink>
                  <div className='bg-slate-600 rounded-full w-1 h-1' />
                  <CustomLink
                    href='/page/privacy-policy'
                    className='hover:text-primary transition-colors'
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

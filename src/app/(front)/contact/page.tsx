'use client'

import { Container } from '@/components/common/container'
import CustomInput from '@/components/common/CustomInput'
import CustomLink from '@/components/common/CustomLink'
import { Section } from '@/components/common/section'
import { SectionHeading } from '@/components/common/SectionHeading'
import { Typography } from '@/components/common/typography'
import { useSiteConfig } from '@/components/providers/store-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { cn } from '@/lib/utils'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { ArrowUpRight, Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
import { useState } from 'react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'
import { z } from 'zod'

const contactSchema = z.object({
  name: z.string().min(2, 'Name must be at least 2 characters'),
  email: z.string().email('Invalid email address'),
  phone: z.string().min(10, 'Phone number must be at least 10 digits').optional().or(z.literal('')),
  subject: z.string().min(3, 'Subject must be at least 3 characters'),
  message: z.string().min(10, 'Message must be at least 10 characters')
})

type ContactFormData = z.infer<typeof contactSchema>

export default function ContactPage() {
  const { siteConfig } = useSiteConfig() as { siteConfig?: SiteSettings }

  const [isSubmitting, setIsSubmitting] = useState(false)

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors }
  } = useForm<ContactFormData>({
    resolver: zodResolver(contactSchema),
    defaultValues: {
      name: '',
      email: '',
      phone: '',
      subject: '',
      message: ''
    }
  })

  const onSubmit = async (data: ContactFormData) => {
    setIsSubmitting(true)
    try {
      const response = await requests.post('/contact', data)

      if (response?.success) {
        toast.success('Message sent successfully! We will get back to you soon.')
        reset()
      }
    } catch (error) {
      showError(error)
    } finally {
      setIsSubmitting(false)
    }
  }

  const mapQuery = siteConfig?.address || siteConfig?.name || 'our office'
  const mapSrc = `https://www.google.com/maps?q=${encodeURIComponent(mapQuery)}&output=embed`

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: siteConfig?.address,
      details: '',
      href: siteConfig?.address
        ? `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(siteConfig.address)}`
        : undefined,
      external: true
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: siteConfig?.phone,
      details: siteConfig?.hotline ? `Hotline: ${siteConfig.hotline}` : 'Mon-Fri: 9AM - 6PM',
      href: siteConfig?.phone ? `tel:${siteConfig.phone.replace(/\s+/g, '')}` : undefined
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: siteConfig?.email,
      details: 'We reply within 24 hours',
      href: siteConfig?.email ? `mailto:${siteConfig.email}` : undefined
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: siteConfig?.workingHours,
      details: siteConfig?.workingHours ? undefined : '9:00 AM - 6:00 PM'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <Section className='bg-linear-to-r from-primary/10 via-primary/5 to-background'>
        <Container>
          <div className='py-16'>
            <SectionHeading
              subtitle='Contact Us'
              title='Get In Touch'
              description="Have questions about our services? We'd love to hear from you. Send us a message and we'll respond as soon as possible."
              variant='gradient'
              alignment='center'
              className='mb-0'
            />
          </div>
        </Container>
      </Section>

      {/* Contact Info Cards */}
      <Section variant='lg'>
        <Container>
          <div className='gap-4 md:gap-6 grid grid-cols-2 lg:grid-cols-4 -mt-8'>
            {contactInfo.map((info, index) => {
              const isInteractive = !!info.href

              const cardBody = (
                <CardContent className='flex flex-col justify-center items-center h-full text-center'>
                  <div className='flex justify-center items-center bg-primary/10 group-hover:bg-primary/15 mb-4 rounded-full w-16 h-16 transition-colors duration-300'>
                    <info.icon className='w-8 h-8 text-primary group-hover:scale-110 transition-transform duration-300' />
                  </div>
                  <Typography variant='h6' weight='semibold' className='mb-2'>
                    {info.title}
                  </Typography>
                  {info.content && (
                    <Typography variant='body2' weight='medium' className='mb-1 wrap-break-word'>
                      {info.content}
                    </Typography>
                  )}
                  {info.details && info.details !== info.content && (
                    <Typography variant='caption' className='text-muted-foreground'>
                      {info.details}
                    </Typography>
                  )}
                </CardContent>
              )

              return (
                <Card
                  key={index}
                  className={cn(
                    'group relative border-border/50 transition-all duration-300',
                    isInteractive && 'hover:shadow-lg hover:-translate-y-1 hover:border-primary/30'
                  )}
                >
                  {isInteractive && (
                    <ArrowUpRight className='top-4 right-4 absolute opacity-0 group-hover:opacity-100 w-4 h-4 text-primary transition-opacity duration-300' />
                  )}
                  {info.href ? (
                    <CustomLink
                      href={info.href}
                      {...(info.external && { target: '_blank', rel: 'noopener noreferrer' })}
                      className='block rounded-xl focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/50 focus-visible:ring-offset-2 h-full'
                    >
                      {cardBody}
                    </CustomLink>
                  ) : (
                    cardBody
                  )}
                </Card>
              )
            })}
          </div>
        </Container>
      </Section>

      {/* Contact Form & Map */}
      <Section variant='xl'>
        <Container>
          <div className='gap-12 grid grid-cols-1 lg:grid-cols-2'>
            {/* Contact Form */}
            <div>
              <SectionHeading
                title='Send Us a Message'
                description='Fill out the form below and our team will get back to you within 24 hours.'
                // variant=''
                alignment='left'
                className='mb-8'
              />

              <form onSubmit={handleSubmit(onSubmit)} className='space-y-6'>
                <div className='gap-6 grid grid-cols-1 sm:grid-cols-2'>
                  <Controller
                    name='name'
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label='Full Name'
                        type='text'
                        placeholder='John Doe'
                        error={errors.name?.message}
                        required
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name='email'
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label='Email Address'
                        type='email'
                        placeholder='john@example.com'
                        error={errors.email?.message}
                        required
                        {...field}
                      />
                    )}
                  />
                </div>

                <div className='gap-6 grid grid-cols-1 sm:grid-cols-2'>
                  <Controller
                    name='phone'
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label='Phone Number'
                        type='tel'
                        placeholder='+1 (555) 123-4567'
                        error={errors.phone?.message}
                        {...field}
                      />
                    )}
                  />

                  <Controller
                    name='subject'
                    control={control}
                    render={({ field }) => (
                      <CustomInput
                        label='Subject'
                        type='text'
                        placeholder='How can we help?'
                        error={errors.subject?.message}
                        required
                        {...field}
                      />
                    )}
                  />
                </div>

                <Controller
                  name='message'
                  control={control}
                  render={({ field }) => (
                    <CustomInput
                      label='Message'
                      type='textarea'
                      placeholder='Tell us more about your inquiry...'
                      rows={6}
                      error={errors.message?.message}
                      required
                      {...field}
                    />
                  )}
                />

                <Button type='submit' size='lg' className='w-full' disabled={isSubmitting}>
                  {isSubmitting ? (
                    <>
                      <div className='mr-2 border-2 border-white border-t-transparent rounded-full w-4 h-4 animate-spin' />
                      Sending...
                    </>
                  ) : (
                    <>
                      <Send className='mr-2 w-4 h-4' />
                      Send Message
                    </>
                  )}
                </Button>
              </form>
            </div>

            {/* Map & Additional Info */}
            <div className='space-y-6'>
              {/* Map */}
              <Card className='p-0! overflow-hidden'>
                <iframe
                  src={mapSrc}
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Office Location'
                  className='inset-0 min-h-100'
                />
              </Card>

              {/* Additional Info: quick contact + social */}
              {/* <Card className='border-border/50'>
                <CardContent className='space-y-5 pt-6'>
                  <Typography variant='h6' weight='semibold'>
                    Prefer to reach us directly?
                  </Typography>

                  <div className='space-y-3'>
                    {siteConfig?.phone && (
                      <CustomLink
                        href={`tel:${siteConfig.phone.replace(/\s+/g, '')}`}
                        className='flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors'
                      >
                        <div className='flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9 shrink-0'>
                          <Phone className='w-4 h-4 text-primary' />
                        </div>
                        <Typography variant='body2'>{siteConfig.phone}</Typography>
                      </CustomLink>
                    )}

                    {siteConfig?.email && (
                      <CustomLink
                        href={`mailto:${siteConfig.email}`}
                        className='flex items-center gap-3 text-muted-foreground hover:text-primary transition-colors'
                      >
                        <div className='flex justify-center items-center bg-primary/10 rounded-lg w-9 h-9 shrink-0'>
                          <Mail className='w-4 h-4 text-primary' />
                        </div>
                        <Typography variant='body2'>{siteConfig.email}</Typography>
                      </CustomLink>
                    )}
                  </div>

                  <div className='pt-1 border-border/50 border-t'>
                    <Typography variant='caption' className='block mb-3 text-muted-foreground'>
                      Follow us
                    </Typography>
                    <SocialLinks variant='light' />
                  </div>
                </CardContent>
              </Card> */}
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

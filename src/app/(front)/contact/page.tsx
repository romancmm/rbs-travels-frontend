'use client'

import { Container } from '@/components/common/container'
import CustomInput from '@/components/common/CustomInput'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { useSiteConfig } from '@/components/providers/store-provider'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Textarea } from '@/components/ui/textarea'
import { showError } from '@/lib/errMsg'
import { SiteSettings } from '@/lib/validations/schemas/siteSettings'
import requests from '@/services/network/http'
import { zodResolver } from '@hookform/resolvers/zod'
import { Clock, Mail, MapPin, Phone, Send } from 'lucide-react'
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

  const contactInfo = [
    {
      icon: MapPin,
      title: 'Visit Us',
      content: siteConfig?.address,
      details: 'Visit us at our office'
    },
    {
      icon: Phone,
      title: 'Call Us',
      content: siteConfig?.phone,
      details: siteConfig?.hotline ? `Hotline: ${siteConfig.hotline}` : 'Mon-Fri: 9AM - 6PM'
    },
    {
      icon: Mail,
      title: 'Email Us',
      content: siteConfig?.email,
      details: 'We reply within 24 hours'
    },
    {
      icon: Clock,
      title: 'Working Hours',
      content: siteConfig?.workingHours,
      details: '9:00 AM - 6:00 PM'
    }
  ]

  return (
    <>
      {/* Hero Section */}
      <Section className='bg-linear-to-r from-primary/10 via-primary/5 to-background'>
        <Container>
          <div className='py-16 text-center'>
            <Typography variant='h1' as='h1' weight='bold' className='mb-4'>
              Get In Touch
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl text-muted-foreground'>
              Have questions about our services? We&apos;d love to hear from you. Send us a message
              and we&apos;ll respond as soon as possible.
            </Typography>
          </div>
        </Container>
      </Section>

      {/* Contact Info Cards */}
      <Section variant='lg'>
        <Container>
          <div className='gap-4 md:gap-6 grid grid-cols-2 md:grid-cols-2 lg:grid-cols-4 -mt-8'>
            {contactInfo.map((info, index) => (
              <Card
                key={index}
                className='hover:shadow-lg border-border/50 transition-shadow duration-300'
              >
                <CardContent className='pt-6'>
                  <div className='flex flex-col items-center text-center'>
                    <div className='flex justify-center items-center bg-primary/10 mb-4 rounded-full w-16 h-16'>
                      <info.icon className='w-8 h-8 text-primary' />
                    </div>
                    <Typography variant='h6' weight='semibold' className='mb-2'>
                      {info.title}
                    </Typography>
                    <Typography variant='body2' weight='medium' className='mb-1'>
                      {info.content}
                    </Typography>
                    <Typography variant='caption' className='text-muted-foreground'>
                      {info.details}
                    </Typography>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </Container>
      </Section>

      {/* Contact Form & Map */}
      <Section variant='xl'>
        <Container>
          <div className='gap-12 grid grid-cols-1 lg:grid-cols-2'>
            {/* Contact Form */}
            <div>
              <div className='mb-8'>
                <Typography variant='h2' as='h2' weight='bold' className='mb-4'>
                  Send Us a Message
                </Typography>
                <Typography variant='body1' className='text-muted-foreground'>
                  Fill out the form below and our team will get back to you within 24 hours.
                </Typography>
              </div>

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
                    <div className='space-y-2'>
                      <label className='font-medium text-sm'>
                        Message <span className='text-destructive'>*</span>
                      </label>
                      <Textarea
                        placeholder='Tell us more about your inquiry...'
                        rows={6}
                        className={errors.message ? 'border-destructive' : ''}
                        {...field}
                      />
                      {errors.message && (
                        <p className='text-destructive text-sm'>{errors.message.message}</p>
                      )}
                    </div>
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
              <Card className='p-0! h-full overflow-hidden'>
                <iframe
                  src='https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3022.2412648718453!2d-73.98784492346618!3d40.74844097138558!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x89c259a9b3117469%3A0xd134e199a405a163!2sEmpire%20State%20Building!5e0!3m2!1sen!2sus!4v1701234567890!5m2!1sen!2sus'
                  width='100%'
                  height='100%'
                  style={{ border: 0 }}
                  allowFullScreen
                  loading='lazy'
                  referrerPolicy='no-referrer-when-downgrade'
                  title='Office Location'
                  className='inset-0 h-full min-h-100'
                />
              </Card>
            </div>
          </div>
        </Container>
      </Section>
    </>
  )
}

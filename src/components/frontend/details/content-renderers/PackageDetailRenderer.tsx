'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Calendar, Check, Clock, DollarSign, MapPin, Phone, Star, Users } from 'lucide-react'

type PackageDetailProps = {
  data: Package
}

export default function PackageDetailRenderer({ data }: PackageDetailProps) {
  return (
    <>
      {/* Hero Section */}
      <Section className="bg-[gradient(to_right,rgba(0,0,0,0.6),rgba(0,0,0,0.2)),url('/images/bg/breadcrumb.jpg')] bg-cover bg-center">
        <Container>
          <div className='space-y-4 py-12'>
            <div className='flex flex-wrap items-center gap-3'>
              {data.category && (
                <Badge variant='secondary' className='mb-2'>
                  {data.category.name}
                </Badge>
              )}
              {data.destination && (
                <div className='flex items-center gap-2 text-white/90'>
                  <MapPin className='w-4 h-4' />
                  <span className='text-sm'>{data.destination}</span>
                </div>
              )}
            </div>

            <Typography variant='h1' as='h1' weight='bold' className='text-white'>
              {data.title}
            </Typography>

            {data.excerpt && (
              <Typography variant='body1' className='max-w-3xl text-white/90'>
                {data.excerpt}
              </Typography>
            )}

            {/* Meta Info */}
            <div className='flex flex-wrap items-center gap-4 pt-4 text-white/80'>
              {data.rating && (
                <div className='flex items-center gap-2'>
                  <Star className='fill-yellow-400 w-4 h-4 text-yellow-400' />
                  <span className='text-sm'>{data.rating}</span>
                  {data.reviewCount && (
                    <span className='text-sm'>({data.reviewCount} reviews)</span>
                  )}
                </div>
              )}
              {data.duration && (
                <div className='flex items-center gap-2'>
                  <Clock className='w-4 h-4' />
                  <span className='text-sm'>
                    {data.duration.days}D / {data.duration.nights}N
                  </span>
                </div>
              )}
              {data.maxGroupSize && (
                <div className='flex items-center gap-2'>
                  <Users className='w-4 h-4' />
                  <span className='text-sm'>Max {data.maxGroupSize} people</span>
                </div>
              )}
            </div>
          </div>
        </Container>
      </Section>

      {/* Content Section */}
      <Section variant='xl'>
        <Container>
          <div className='gap-8 grid lg:grid-cols-12'>
            {/* Main Content */}
            <article className='lg:col-span-8'>
              {/* Featured Image */}
              {data.thumbnail && (
                <div className='relative mb-8 rounded-xl w-full h-[400px] overflow-hidden'>
                  <CustomImage
                    src={data.thumbnail}
                    alt={data.title}
                    fill
                    className='object-cover'
                  />
                </div>
              )}

              {/* Package Content */}
              <div className='space-y-6 prose-img:rounded-lg max-w-none prose-headings:font-bold prose-a:text-primary prose-p:text-gray-700 prose lg:prose-xl'>
                {data.content && <div dangerouslySetInnerHTML={{ __html: data.content }} />}
              </div>

              {/* Highlights */}
              {data.highlights && data.highlights.length > 0 && (
                <div className='mt-8'>
                  <Card>
                    <CardContent className='pt-6'>
                      <Typography variant='h5' weight='semibold' className='mb-4'>
                        Package Highlights
                      </Typography>
                      <ul className='space-y-2'>
                        {data.highlights.map((highlight, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <Check className='mt-1 w-5 h-5 text-green-600 shrink-0' />
                            <span className='text-gray-700'>{highlight}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </div>
              )}

              {/* Itinerary */}
              {data.itinerary && data.itinerary.length > 0 && (
                <div className='mt-8'>
                  <Typography variant='h4' weight='bold' className='mb-6'>
                    Itinerary
                  </Typography>
                  <div className='space-y-4'>
                    {data.itinerary.map((day) => (
                      <Card key={day.day}>
                        <CardContent className='pt-6'>
                          <div className='flex gap-4'>
                            <div className='flex justify-center items-center bg-primary rounded-lg w-12 h-12 text-white shrink-0'>
                              <span className='font-bold'>{day.day}</span>
                            </div>
                            <div className='flex-1'>
                              <Typography variant='h6' weight='semibold' className='mb-2'>
                                {day.title}
                              </Typography>
                              <Typography variant='body2' className='text-gray-600'>
                                {day.description}
                              </Typography>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    ))}
                  </div>
                </div>
              )}

              {/* Inclusions & Exclusions */}
              <div className='gap-6 grid md:grid-cols-2 mt-8'>
                {data.inclusions && data.inclusions.length > 0 && (
                  <Card className='bg-green-50/50 border-green-200'>
                    <CardContent className='pt-6'>
                      <Typography variant='h6' weight='semibold' className='mb-4 text-green-800'>
                        Included
                      </Typography>
                      <ul className='space-y-2'>
                        {data.inclusions.map((item, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <Check className='mt-1 w-4 h-4 text-green-600 shrink-0' />
                            <span className='text-gray-700 text-sm'>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}

                {data.exclusions && data.exclusions.length > 0 && (
                  <Card className='bg-red-50/50 border-red-200'>
                    <CardContent className='pt-6'>
                      <Typography variant='h6' weight='semibold' className='mb-4 text-red-800'>
                        Not Included
                      </Typography>
                      <ul className='space-y-2'>
                        {data.exclusions.map((item, index) => (
                          <li key={index} className='flex items-start gap-2'>
                            <span className='mt-1 w-4 h-4 text-red-600 shrink-0'>×</span>
                            <span className='text-gray-700 text-sm'>{item}</span>
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                )}
              </div>

              {/* Gallery */}
              {data.gallery && data.gallery.length > 0 && (
                <div className='mt-8'>
                  <Typography variant='h4' weight='bold' className='mb-6'>
                    Gallery
                  </Typography>
                  <div className='gap-4 grid grid-cols-2 md:grid-cols-3'>
                    {data.gallery.map((image, index) => (
                      <div key={index} className='relative rounded-lg w-full h-48 overflow-hidden'>
                        <CustomImage
                          src={image}
                          alt={`${data.title} - Image ${index + 1}`}
                          fill
                          className='object-cover hover:scale-110 transition-transform'
                        />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Tags */}
              {data.tags && data.tags.length > 0 && (
                <div className='flex flex-wrap gap-2 mt-8 pt-8 border-t'>
                  <Typography variant='body2' weight='medium' className='mr-2'>
                    Tags:
                  </Typography>
                  {data.tags.map((tag, index) => (
                    <Badge key={index} variant='outline'>
                      {tag}
                    </Badge>
                  ))}
                </div>
              )}
            </article>

            {/* Sidebar - Booking Card */}
            <aside className='lg:col-span-4'>
              <div className='top-24 sticky'>
                <Card className='border-2'>
                  <CardContent className='space-y-6 pt-6'>
                    {/* Price */}
                    {data.price && (
                      <div>
                        <Typography variant='body2' className='mb-1 text-gray-600'>
                          Starting from
                        </Typography>
                        <div className='flex items-baseline gap-2'>
                          {data.price.discountedPrice && (
                            <Typography variant='body1' className='text-gray-400 line-through'>
                              {data.price.currency || '$'}
                              {data.price.amount}
                            </Typography>
                          )}
                          <Typography variant='h2' weight='bold' className='text-primary'>
                            {data.price.currency || '$'}
                            {data.price.discountedPrice || data.price.amount}
                          </Typography>
                          <Typography variant='body2' className='text-gray-600'>
                            per person
                          </Typography>
                        </div>
                      </div>
                    )}

                    {/* Quick Info */}
                    <div className='space-y-3 pt-4 border-t'>
                      {data.duration && (
                        <div className='flex items-center gap-3'>
                          <Clock className='w-5 h-5 text-gray-400' />
                          <div>
                            <Typography variant='body2' weight='medium'>
                              Duration
                            </Typography>
                            <Typography variant='body2' className='text-gray-600'>
                              {data.duration.days}D / {data.duration.nights}N
                            </Typography>
                          </div>
                        </div>
                      )}
                      {data.maxGroupSize && (
                        <div className='flex items-center gap-3'>
                          <Users className='w-5 h-5 text-gray-400' />
                          <div>
                            <Typography variant='body2' weight='medium'>
                              Group Size
                            </Typography>
                            <Typography variant='body2' className='text-gray-600'>
                              Max {data.maxGroupSize} people
                            </Typography>
                          </div>
                        </div>
                      )}
                      {data.availability && (
                        <div className='flex items-center gap-3'>
                          <Calendar className='w-5 h-5 text-gray-400' />
                          <div>
                            <Typography variant='body2' weight='medium'>
                              Availability
                            </Typography>
                            <Typography variant='body2' className='text-gray-600'>
                              {data.availability}
                            </Typography>
                          </div>
                        </div>
                      )}
                    </div>

                    {/* CTA Buttons */}
                    <div className='space-y-3 pt-4 border-t'>
                      <Button className='w-full' size='lg'>
                        <DollarSign className='mr-2 w-5 h-5' />
                        Book Now
                      </Button>
                      <Button variant='outline' className='w-full' size='lg'>
                        <Phone className='mr-2 w-5 h-5' />
                        Contact Us
                      </Button>
                    </div>

                    {/* Additional Info */}
                    <div className='pt-4 border-t'>
                      <Typography variant='body2' className='text-gray-600 text-center'>
                        Need help? Call us or WhatsApp
                      </Typography>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </aside>
          </div>
        </Container>
      </Section>
    </>
  )
}

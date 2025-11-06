'use client'

import { Container } from '@/components/common/container'
import CustomImage from '@/components/common/CustomImage'
import CustomLink from '@/components/common/CustomLink'
import { sectionVariants } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import {
  Award,
  Calendar,
  CheckCircle,
  Clock,
  Eye,
  Globe,
  Heart,
  HeartHandshake,
  MapPin,
  Plane,
  Shield,
  Star,
  Target,
  Users,
  Zap
} from 'lucide-react'
import { motion } from 'motion/react'

// Simple Testimonial Card Component
const TestimonialCard = ({
  name,
  role,
  image,
  rating,
  comment
}: {
  name: string
  role: string
  image: string
  rating: number
  comment: string
}) => {
  return (
    <div className='bg-white shadow-lg hover:shadow-xl p-8 border border-gray-100 rounded-3xl transition-all duration-300'>
      <div className='flex items-center gap-4 mb-6'>
        <div className='relative rounded-full w-16 h-16 overflow-hidden'>
          <CustomImage
            src={image}
            alt={name}
            width={64}
            height={64}
            className='w-full h-full object-cover'
          />
        </div>
        <div>
          <Typography variant='h6' weight='bold' className='mb-1 text-gray-800'>
            {name}
          </Typography>
          <Typography variant='body2' className='font-medium text-primary'>
            {role}
          </Typography>
        </div>
      </div>

      <div className='flex gap-1 mb-4'>
        {Array.from({ length: 5 }).map((_, index) => (
          <Star
            key={index}
            className={cn(
              'w-5 h-5',
              index < rating ? 'text-yellow-400 fill-yellow-400' : 'text-gray-300'
            )}
          />
        ))}
      </div>

      <Typography variant='body1' className='text-gray-600 italic leading-relaxed'>
        &ldquo;{comment}&rdquo;
      </Typography>
    </div>
  )
}

// About page data
const aboutData = {
  hero: {
    title: 'About RBS Travels',
    subtitle: 'Your Trusted Travel Companion Since 2018',
    description:
      "We believe that travel is not just about reaching a destination—it's about creating memories that last a lifetime. At RBS Travels, we make every journey extraordinary.",
    image: '/images/about.jpg',
    stats: [
      { number: '25,000+', label: 'Happy Travelers' },
      { number: '150+', label: 'Tour Packages' },
      { number: '75+', label: 'Countries Covered' },
      { number: '7', label: 'Years of Excellence' }
    ]
  },
  story: {
    title: 'Our Journey',
    subtitle: 'From a Vision to Reality',
    content:
      'Founded in 2018 with a simple vision: to make extraordinary travel accessible to everyone. What started as a small team of passionate travel enthusiasts has grown into a trusted name in the travel industry, serving thousands of satisfied customers worldwide.',
    milestones: [
      {
        year: '2018',
        title: 'Company Founded',
        description: 'Started with a vision to revolutionize travel experiences'
      },
      {
        year: '2020',
        title: 'Digital Expansion',
        description: 'Launched our comprehensive online booking platform'
      },
      {
        year: '2022',
        title: 'Global Recognition',
        description: 'Awarded "Best Travel Agency" by Tourism Board'
      },
      {
        year: '2024',
        title: 'Milestone Achievement',
        description: 'Served over 25,000 happy travelers worldwide'
      }
    ]
  },
  mission: {
    mission: {
      title: 'Our Mission',
      description:
        'To inspire and enable people to explore the world through exceptional travel experiences, personalized service, and sustainable tourism practices.',
      icon: Target
    },
    vision: {
      title: 'Our Vision',
      description:
        "To be the world's most trusted travel partner, creating connections between cultures and fostering global understanding through travel.",
      icon: Eye
    },
    values: [
      {
        title: 'Customer First',
        description:
          "Every decision we make is centered around our customers' needs and satisfaction.",
        icon: Heart
      },
      {
        title: 'Integrity',
        description: 'We operate with complete transparency and honesty in all our dealings.',
        icon: Shield
      },
      {
        title: 'Excellence',
        description:
          'We strive for perfection in every service we provide and experience we create.',
        icon: Award
      },
      {
        title: 'Innovation',
        description:
          'We continuously evolve and adapt to bring you the latest in travel technology.',
        icon: Zap
      }
    ]
  },
  services: [
    {
      title: 'Tour Packages',
      description: "Curated travel experiences to the world's most beautiful destinations",
      icon: MapPin,
      features: [
        'Customized Itineraries',
        'Expert Local Guides',
        'Premium Accommodations',
        '24/7 Support'
      ]
    },
    {
      title: 'Flight Booking',
      description: 'Best deals on domestic and international flights worldwide',
      icon: Plane,
      features: ['Competitive Prices', 'Flexible Booking', 'Multiple Airlines', 'Easy Cancellation']
    },
    {
      title: 'Visa Assistance',
      description: 'Complete visa processing and documentation support',
      icon: Globe,
      features: [
        'Document Guidance',
        'Application Processing',
        'Status Tracking',
        'Expert Consultation'
      ]
    },
    {
      title: 'Travel Support',
      description: 'Round-the-clock assistance for all your travel needs',
      icon: HeartHandshake,
      features: ['24/7 Helpline', 'Emergency Support', 'Travel Insurance', 'Concierge Services']
    }
  ],
  team: [
    {
      name: 'Sarah Ahmed',
      role: 'Founder & CEO',
      image: '/images/team/sarah.jpg',
      description: 'Passionate traveler with 15+ years in tourism industry'
    },
    {
      name: 'Michael Chen',
      role: 'Head of Operations',
      image: '/images/team/michael.jpg',
      description: 'Operations expert ensuring seamless travel experiences'
    },
    {
      name: 'Priya Sharma',
      role: 'Customer Experience Manager',
      image: '/images/team/priya.jpg',
      description: 'Dedicated to creating unforgettable customer journeys'
    },
    {
      name: 'David Rodriguez',
      role: 'Travel Consultant',
      image: '/images/team/david.jpg',
      description: 'Expert in international destinations and custom itineraries'
    }
  ],
  testimonials: [
    {
      name: 'Emily Johnson',
      role: 'Travel Enthusiast',
      image: '/images/testimonials/emily.jpg',
      rating: 5,
      comment:
        'RBS Travels made our honeymoon in Bali absolutely perfect. Every detail was taken care of, and their customer service was exceptional!'
    },
    {
      name: 'Ahmed Hassan',
      role: 'Business Traveler',
      image: '/images/testimonials/ahmed.jpg',
      rating: 5,
      comment:
        "I've been using RBS Travels for all my business trips. Their efficiency and reliability are unmatched. Highly recommended!"
    },
    {
      name: 'Lisa Thompson',
      role: 'Family Vacation',
      image: '/images/testimonials/lisa.jpg',
      rating: 5,
      comment:
        'Our family trip to Europe was flawlessly organized. The kids loved every moment, and we created memories to last a lifetime.'
    }
  ]
}

export default function AboutPage() {
  return (
    <div className='min-h-screen'>
      {/* Hero Section */}
      <section
        className={cn(
          sectionVariants({ variant: 'xl' }),
          'relative overflow-hidden bg-linear-to-br from-blue-50 via-white to-purple-50/30'
        )}
      >
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-5'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23000000' fill-opacity='0.1'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
            }}
          />
        </div>

        <Container className='relative'>
          <div className='items-center gap-12 grid lg:grid-cols-2'>
            {/* Content */}
            <div className='slide-in-from-bottom-4 space-y-6 animate-in duration-700'>
              <div className='inline-flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-full text-primary'>
                <Globe className='w-4 h-4' />
                <Typography variant='body2' weight='medium' className='uppercase tracking-wider'>
                  {aboutData.hero.subtitle}
                </Typography>
              </div>

              <Typography variant='h1' weight='bold' className='max-w-2xl text-gray-800'>
                {aboutData.hero.title}
              </Typography>

              <Typography variant='body1' className='max-w-lg text-gray-600 leading-relaxed'>
                {aboutData.hero.description}
              </Typography>

              {/* Hero Stats */}
              <div className='gap-6 grid grid-cols-2 md:grid-cols-4 pt-8'>
                {aboutData.hero.stats.map((stat, index) => (
                  <div
                    key={index}
                    className='slide-in-from-bottom-4 text-center animate-in duration-700'
                    style={{ animationDelay: `${index * 100}ms` }}
                  >
                    <Typography variant='h3' weight='bold' className='mb-1 text-primary'>
                      {stat.number}
                    </Typography>
                    <Typography variant='body2' className='text-gray-600'>
                      {stat.label}
                    </Typography>
                  </div>
                ))}
              </div>
            </div>

            {/* Image */}
            <div className='relative animate-in duration-700 delay-200 zoom-in-50'>
              <div className='relative shadow-2xl rounded-3xl overflow-hidden'>
                <CustomImage
                  src={aboutData.hero.image}
                  alt='About RBS Travels'
                  width={600}
                  height={400}
                  className='w-full h-96 object-cover'
                />
                <div className='absolute inset-0 bg-linear-to-t from-black/20 via-transparent to-transparent' />
              </div>

              {/* Floating Badge */}
              <div className='-bottom-6 -left-6 absolute bg-white shadow-xl p-6 rounded-2xl'>
                <div className='flex items-center gap-3'>
                  <div className='flex justify-center items-center bg-primary/10 rounded-full w-12 h-12'>
                    <Award className='w-6 h-6 text-primary' />
                  </div>
                  <div>
                    <Typography variant='body2' weight='bold' className='text-gray-800'>
                      Award Winning
                    </Typography>
                    <Typography variant='body2' className='text-gray-600'>
                      Travel Agency 2024
                    </Typography>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </Container>
      </section>

      {/* Our Story Section */}
      <section className={cn(sectionVariants({ variant: 'xl' }), 'bg-white')}>
        <Container>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant='h2' weight='bold' className='mb-4 text-gray-800'>
              {aboutData.story.title}
            </Typography>
            <Typography variant='h5' className='mb-6 text-primary'>
              {aboutData.story.subtitle}
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-3xl text-gray-600 leading-relaxed'>
              {aboutData.story.content}
            </Typography>
          </motion.div>

          {/* Timeline */}
          <div className='relative'>
            <div className='left-1/2 absolute bg-linear-to-b from-primary via-primary/50 to-primary/20 rounded-full w-1 h-full -translate-x-1/2 transform' />

            <div className='space-y-12'>
              {aboutData.story.milestones.map((milestone, index) => (
                <motion.div
                  key={index}
                  className={cn(
                    'flex items-center gap-8',
                    index % 2 === 0 ? 'flex-row' : 'flex-row-reverse'
                  )}
                  initial={{ opacity: 0, x: index % 2 === 0 ? -50 : 50 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                  viewport={{ once: true }}
                >
                  <div className='flex-1'>
                    <div
                      className={cn(
                        'bg-white shadow-lg p-6 border border-gray-100 rounded-2xl',
                        index % 2 === 0 ? 'ml-8' : 'mr-8'
                      )}
                    >
                      <div className='flex items-center gap-3 mb-3'>
                        <div className='flex justify-center items-center bg-primary/10 rounded-full w-12 h-12'>
                          <Calendar className='w-6 h-6 text-primary' />
                        </div>
                        <Typography variant='h6' weight='bold' className='text-primary'>
                          {milestone.year}
                        </Typography>
                      </div>
                      <Typography variant='h6' weight='bold' className='mb-2 text-gray-800'>
                        {milestone.title}
                      </Typography>
                      <Typography variant='body2' className='text-gray-600'>
                        {milestone.description}
                      </Typography>
                    </div>
                  </div>

                  {/* Center dot */}
                  <div className='z-10 bg-primary shadow-lg border-4 border-white rounded-full w-4 h-4' />

                  <div className='flex-1' />
                </motion.div>
              ))}
            </div>
          </div>
        </Container>
      </section>

      {/* Mission, Vision & Values */}
      <section
        className={cn(
          sectionVariants({ variant: 'xl' }),
          'bg-linear-to-br from-gray-50 to-blue-50/30'
        )}
      >
        <Container>
          {/* Mission & Vision */}
          <div className='gap-12 grid md:grid-cols-2 mb-20'>
            {[aboutData.mission.mission, aboutData.mission.vision].map((item, index) => (
              <motion.div
                key={index}
                className='bg-white shadow-lg p-8 border border-gray-100 rounded-3xl'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className='flex justify-center items-center bg-primary/10 mb-6 rounded-2xl w-16 h-16'>
                  <item.icon className='w-8 h-8 text-primary' />
                </div>
                <Typography variant='h4' weight='bold' className='mb-4 text-gray-800'>
                  {item.title}
                </Typography>
                <Typography variant='body1' className='text-gray-600 leading-relaxed'>
                  {item.description}
                </Typography>
              </motion.div>
            ))}
          </div>

          {/* Values */}
          <motion.div
            className='mb-12 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant='h3' weight='bold' className='mb-4 text-gray-800'>
              Our Core Values
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl text-gray-600'>
              These principles guide everything we do and shape the experiences we create for our
              travelers.
            </Typography>
          </motion.div>

          <div className='gap-8 grid md:grid-cols-2 lg:grid-cols-4'>
            {aboutData.mission.values.map((value, index) => (
              <motion.div
                key={index}
                className='bg-white shadow-lg hover:shadow-xl p-6 border border-gray-100 rounded-2xl text-center transition-shadow duration-300'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className='flex justify-center items-center bg-primary/10 mx-auto mb-4 rounded-2xl w-14 h-14'>
                  <value.icon className='w-7 h-7 text-primary' />
                </div>
                <Typography variant='h6' weight='bold' className='mb-3 text-gray-800'>
                  {value.title}
                </Typography>
                <Typography variant='body2' className='text-gray-600 leading-relaxed'>
                  {value.description}
                </Typography>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Services Overview */}
      <section className={cn(sectionVariants({ variant: 'xl' }), 'bg-white')}>
        <Container>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant='h2' weight='bold' className='mb-4 text-gray-800'>
              Our Services
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl text-gray-600 leading-relaxed'>
              We offer comprehensive travel solutions to make your journey seamless from start to
              finish.
            </Typography>
          </motion.div>

          <div className='gap-8 grid md:grid-cols-2'>
            {aboutData.services.map((service, index) => (
              <motion.div
                key={index}
                className='bg-linear-to-br from-white to-gray-50/50 shadow-lg hover:shadow-xl p-8 border border-gray-100 rounded-3xl transition-all duration-300'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className='flex justify-center items-center bg-primary/10 mb-6 rounded-2xl w-16 h-16'>
                  <service.icon className='w-8 h-8 text-primary' />
                </div>

                <Typography variant='h5' weight='bold' className='mb-3 text-gray-800'>
                  {service.title}
                </Typography>

                <Typography variant='body1' className='mb-6 text-gray-600 leading-relaxed'>
                  {service.description}
                </Typography>

                <div className='space-y-3'>
                  {service.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className='flex items-center gap-3'>
                      <CheckCircle className='flex-shrink-0 w-5 h-5 text-green-500' />
                      <Typography variant='body2' className='text-gray-600'>
                        {feature}
                      </Typography>
                    </div>
                  ))}
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Team Section */}
      <section
        className={cn(
          sectionVariants({ variant: 'xl' }),
          'bg-linear-to-br from-blue-50/50 via-white to-purple-50/30'
        )}
      >
        <Container>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant='h2' weight='bold' className='mb-4 text-gray-800'>
              Meet Our Team
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl text-gray-600 leading-relaxed'>
              Our passionate team of travel experts is dedicated to creating extraordinary
              experiences for every traveler.
            </Typography>
          </motion.div>

          <div className='gap-8 grid md:grid-cols-2 lg:grid-cols-4'>
            {aboutData.team.map((member, index) => (
              <motion.div
                key={index}
                className='bg-white shadow-lg hover:shadow-xl border border-gray-100 rounded-3xl overflow-hidden transition-all duration-300'
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <div className='relative h-64 overflow-hidden'>
                  <CustomImage
                    src={member.image}
                    alt={member.name}
                    width={300}
                    height={250}
                    className='w-full h-full object-cover hover:scale-105 transition-transform duration-500'
                  />
                  <div className='absolute inset-0 bg-linear-to-t from-black/30 via-transparent to-transparent' />
                </div>

                <div className='p-6'>
                  <Typography variant='h6' weight='bold' className='mb-1 text-gray-800'>
                    {member.name}
                  </Typography>
                  <Typography variant='body2' className='mb-3 font-medium text-primary'>
                    {member.role}
                  </Typography>
                  <Typography variant='body2' className='text-gray-600 leading-relaxed'>
                    {member.description}
                  </Typography>
                </div>
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Testimonials Section */}
      <section className={cn(sectionVariants({ variant: 'xl' }), 'bg-white')}>
        <Container>
          <motion.div
            className='mb-16 text-center'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant='h2' weight='bold' className='mb-4 text-gray-800'>
              What Our Travelers Say
            </Typography>
            <Typography variant='body1' className='mx-auto max-w-2xl text-gray-600 leading-relaxed'>
              Don&apos;t just take our word for it. Here&apos;s what our satisfied customers have to
              say about their experiences.
            </Typography>
          </motion.div>

          <div className='gap-8 grid md:grid-cols-3'>
            {aboutData.testimonials.map((testimonial, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                viewport={{ once: true }}
              >
                <TestimonialCard {...testimonial} />
              </motion.div>
            ))}
          </div>
        </Container>
      </section>

      {/* Call to Action Section */}
      <section
        className={cn(
          sectionVariants({ variant: 'xl' }),
          'bg-linear-to-r from-primary via-primary/90 to-primary/80 text-white relative overflow-hidden'
        )}
      >
        {/* Background Pattern */}
        <div className='absolute inset-0 opacity-10'>
          <div
            className='absolute inset-0'
            style={{
              backgroundImage: `url("data:image/svg+xml,%3Csvg width='100' height='100' viewBox='0 0 100 100' xmlns='http://www.w3.org/2000/svg'%3E%3Cpath d='M11 18c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm48 25c3.866 0 7-3.134 7-7s-3.134-7-7-7-7 3.134-7 7 3.134 7 7 7zm-43-7c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3zm63 31c1.657 0 3-1.343 3-3s-1.343-3-3-3-3 1.343-3 3 1.343 3 3 3z' fill='%23ffffff' fill-opacity='0.1'/%3E%3C/svg%3E")`
            }}
          />
        </div>

        <Container className='relative text-center'>
          <motion.div
            className='mx-auto max-w-4xl'
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            <Typography variant='h2' weight='bold' className='mb-6'>
              Ready to Start Your Adventure?
            </Typography>
            <Typography
              variant='body1'
              className='opacity-90 mx-auto mb-8 max-w-2xl leading-relaxed'
            >
              Join thousands of satisfied travelers who have trusted RBS Travels to create their
              perfect journey. Let us help you explore the world and create memories that will last
              a lifetime.
            </Typography>

            <div className='flex sm:flex-row flex-col justify-center items-center gap-4'>
              <CustomLink href='/contact'>
                <Button
                  size='lg'
                  variant='secondary'
                  className='bg-white hover:bg-gray-50 shadow-lg hover:shadow-xl px-8 py-4 rounded-xl font-semibold text-primary transition-all duration-300'
                >
                  <Users className='mr-2 w-5 h-5' />
                  Contact Our Experts
                </Button>
              </CustomLink>

              <CustomLink href='/packages'>
                <Button
                  size='lg'
                  variant='outline'
                  className='hover:bg-white px-8 py-4 border-white rounded-xl font-semibold text-white hover:text-primary transition-all duration-300'
                >
                  <MapPin className='mr-2 w-5 h-5' />
                  Explore Packages
                </Button>
              </CustomLink>
            </div>

            {/* Additional CTA Stats */}
            <div className='gap-8 grid grid-cols-1 sm:grid-cols-3 mt-12 pt-8 border-white/20 border-t'>
              <div className='text-center'>
                <div className='flex justify-center items-center bg-white/20 mx-auto mb-3 rounded-full w-12 h-12'>
                  <Clock className='w-6 h-6 text-white' />
                </div>
                <Typography variant='body2' className='opacity-90'>
                  24/7 Customer Support
                </Typography>
              </div>

              <div className='text-center'>
                <div className='flex justify-center items-center bg-white/20 mx-auto mb-3 rounded-full w-12 h-12'>
                  <Shield className='w-6 h-6 text-white' />
                </div>
                <Typography variant='body2' className='opacity-90'>
                  Secure & Safe Travel
                </Typography>
              </div>

              <div className='text-center'>
                <div className='flex justify-center items-center bg-white/20 mx-auto mb-3 rounded-full w-12 h-12'>
                  <Star className='w-6 h-6 text-white' />
                </div>
                <Typography variant='body2' className='opacity-90'>
                  5-Star Customer Rating
                </Typography>
              </div>
            </div>
          </motion.div>
        </Container>
      </section>
    </div>
  )
}

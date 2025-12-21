'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Building, ChevronRight, ExternalLink } from 'lucide-react'
import { motion } from 'motion/react'
import Image from 'next/image'
import Link from 'next/link'
import { use, useState } from 'react'

interface SisterConcernProps {
  data?: any
  isLoading?: boolean
  className?: string
}

const SisterConcern = ({ data, isLoading = false, className }: SisterConcernProps) => {
  const res: any = use(data)
  const sectionData = res?.data?.value

  if (!sectionData?.companies?.length) {
    return null
  }

  // Filter only active companies
  const activeCompanies = sectionData?.companies.filter((company: any) => company.isActive)

  if (!activeCompanies.length) {
    return null
  }

  return (
    <Section variant='xl' className={cn('bg-background', className)}>
      <Container>
        <div className="flex items-center gap-12">
          <Header data={sectionData} />
          <PartnersGrid companies={activeCompanies} />
        </div>
      </Container>
    </Section>
  )
}

// Header
const Header = ({ data }: { data: any }) => {
  return (
    <div className='max-w-lg'>
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}
        className='space-y-6'
      >
        {data?.subtitle && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.1 }}
          >
            <Typography
              variant='subtitle1'
              className='font-semibold text-primary text-sm uppercase tracking-widest'
            >
              {data.subtitle}
            </Typography>
          </motion.div>
        )}

        {data?.title && (
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <Typography
              variant='h3'
              as='h2'
              weight='bold'
              className='text-foreground leading-tight tracking-tight'
            >
              {data.title}
            </Typography>
          </motion.div>
        )}

        {data?.description && (
          <motion.div
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            <Typography
              variant='body1'
              className='mx-auto max-w-2xl text-muted-foreground leading-relaxed'
            >
              {data.description}
            </Typography>
          </motion.div>
        )}
      </motion.div>
    </div>
  )
}

// Partners Grid Container
const PartnersGrid = ({ companies }: { companies: any[] }) => {
  const [showAll, setShowAll] = useState(false)
  const displayCompanies = showAll ? companies : companies.slice(0, 8)

  return (
    <div className='relative w-full'>
      <div className='gap-3 md:gap-5 grid grid-cols-2 lg:grid-cols-3'>
        {displayCompanies.map((company, index) => (
          <PartnerCard key={company.id || index} company={company} index={index} />
        ))}
      </div>

      {companies.length > 8 && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className='flex justify-center mt-12'
        >
          <Button
            variant='default'
            size='lg'
            onClick={() => setShowAll(!showAll)}
            className='group shadow-lg hover:shadow-xl font-medium transition-all'
          >
            {showAll ? 'Show Less Partners' : 'View All Partners'}
            <ChevronRight
              className={cn(
                'ml-2 w-4 h-4 transition-transform duration-300',
                showAll ? 'rotate-90' : 'group-hover:translate-x-1'
              )}
            />
          </Button>
        </motion.div>
      )}
    </div>
  )
}

// Partner Card
const PartnerCard = ({ company, index }: { company: any; index: number }) => {
  const cardClasses = cn(
    'group relative flex justify-center items-center',
    'bg-card hover:bg-accent/5',
    'border border-border/50 hover:border-primary/20',
    'rounded-2xl p-4 aspect-4/3',
    'transition-all duration-500 ease-out',
    'hover:shadow-lg hover:shadow-primary/5',
    'hover:-translate-y-1',
    company.url && 'cursor-pointer',
    'overflow-hidden'
  )

  const cardContent = (
    <>
      <LogoContent company={company} />

      {company.url && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          whileHover={{ opacity: 1, scale: 1 }}
          className='top-3 right-3 absolute opacity-0 group-hover:opacity-100 transition-opacity duration-300'
        >
          <div className='flex justify-center items-center bg-primary/10 backdrop-blur-sm rounded-full w-7 h-7'>
            <ExternalLink className='w-3.5 h-3.5 text-primary' />
          </div>
        </motion.div>
      )}
    </>
  )

  return (
    <motion.div
      initial={{ opacity: 0, y: 20, scale: 0.9 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true }}
      transition={{
        duration: 0.5,
        delay: index * 0.05,
        ease: [0.22, 1, 0.36, 1]
      }}
      className='h-full'
    >
      {company.url ? (
        <Link
          href={company.url}
          target='_blank'
          rel='noopener noreferrer'
          className={cardClasses}
        >
          {cardContent}
        </Link>
      ) : (
        <div className={cardClasses}>{cardContent}</div>
      )}
    </motion.div>
  )
}

// Logo Content Component
const LogoContent = ({ company }: { company: any }) => {
  return (
    <div className='relative flex justify-center items-center w-full h-full'>
      {company.logo ? (
        <div className='relative w-full h-full'>
          <Image
            src={company.logo}
            alt={company.name || 'Partner logo'}
            fill
            className='opacity-60 group-hover:opacity-100 grayscale group-hover:grayscale-0 object-contain group-hover:scale-105 transition-all duration-500 filter'
          />
        </div>
      ) : (
        <div className='flex justify-center items-center'>
          <Building className='w-12 h-12 text-muted-foreground/40 group-hover:text-primary/60 transition-colors duration-300' />
        </div>
      )}
    </div>
  )
}

export default SisterConcern

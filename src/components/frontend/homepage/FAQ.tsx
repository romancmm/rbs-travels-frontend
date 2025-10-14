'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { cn } from '@/lib/utils'
import { ChevronDown, ChevronUp } from 'lucide-react'
import { AnimatePresence, motion } from 'motion/react'
import { useState } from 'react'

interface FAQ {
  id: number
  question: string
  answer: string
}

interface FAQData {
  title: string
  subtitle: string
  faqs: FAQ[]
}

interface FAQProps {
  data?: FAQData
  className?: string
}

const FAQItem = ({
  faq,
  index,
  isOpen,
  onToggle
}: {
  faq: FAQ
  index: number
  isOpen: boolean
  onToggle: () => void
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ delay: index * 0.1, duration: 0.5 }}
      className={cn(
        'group border border-border/50 rounded-2xl overflow-hidden transition-all duration-300',
        'hover:border-primary/30 hover:shadow-lg hover:shadow-primary/10',
        isOpen ? 'bg-primary/5 border-primary/40' : 'bg-card hover:bg-accent/5'
      )}
    >
      <button
        onClick={onToggle}
        className='hover:bg-accent/5 p-6 w-full text-left transition-all duration-300'
        aria-expanded={isOpen}
        aria-controls={`faq-answer-${faq.id}`}
      >
        <div className='flex justify-between items-center gap-4'>
          <Typography
            variant='h6'
            weight='semibold'
            className={cn(
              'text-foreground transition-colors duration-300',
              isOpen ? 'text-primary' : 'group-hover:text-primary/80'
            )}
          >
            {faq.question}
          </Typography>

          <div
            className={cn(
              'flex justify-center items-center rounded-full w-8 h-8 transition-all duration-300',
              'bg-muted group-hover:bg-primary/10',
              isOpen ? 'bg-primary/20 rotate-180' : 'group-hover:scale-110'
            )}
          >
            {isOpen ? (
              <ChevronUp className='w-4 h-4 text-primary' />
            ) : (
              <ChevronDown className='w-4 h-4 group-hover:text-primary' />
            )}
          </div>
        </div>
      </button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            id={`faq-answer-${faq.id}`}
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3, ease: 'easeInOut' }}
            className='overflow-hidden'
          >
            <div className='px-6 pb-6'>
              <div className='bg-gradient-to-r from-transparent to-transparent mb-4 via-border h-px' />
              <Typography variant='body1' className='leading-relaxed'>
                {faq.answer}
              </Typography>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  )
}

const FAQ = ({ data, className }: FAQProps) => {
  const [openItems, setOpenItems] = useState<Set<number>>(new Set())

  const toggleItem = (id: number) => {
    setOpenItems((prev) => {
      const newSet = new Set(prev)
      if (newSet.has(id)) {
        newSet.delete(id)
      } else {
        newSet.add(id)
      }
      return newSet
    })
  }

  if (!data) return null

  return (
    <Section variant='xl' className={className}>
      <Container>
        {/* Header Section */}
        <div className='mb-12 text-center'>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Typography
              variant='subtitle1'
              className='mb-3 font-semibold text-primary uppercase tracking-wide'
            >
              {data.subtitle}
            </Typography>
            <Typography
              variant='h2'
              as='h2'
              weight='bold'
              className='text-foreground leading-tight'
            >
              {data.title}
            </Typography>
          </motion.div>
        </div>

        {/* FAQ Grid */}
        <div className='mx-auto max-w-4xl'>
          <div className='space-y-4'>
            {data.faqs?.map((faq, index) => (
              <FAQItem
                key={faq.id}
                faq={faq}
                index={index}
                isOpen={openItems.has(faq.id)}
                onToggle={() => toggleItem(faq.id)}
              />
            ))}
          </div>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className='mt-12 text-center'
          >
            <div className='bg-gradient-to-r from-primary/10 via-primary/5 to-primary/10 p-8 rounded-2xl'>
              <Typography variant='h5' weight='semibold' className='mb-4 text-foreground'>
                Still have questions?
              </Typography>
              <Typography variant='body1' className='mx-auto mb-6 max-w-2xl'>
                Can&apos;t find the answer you&apos;re looking for? Our friendly customer support
                team is here to help.
              </Typography>
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={cn(
                  'bg-primary hover:bg-primary/90 px-8 py-3 rounded-full text-white',
                  'font-semibold transition-all duration-300',
                  'shadow-lg hover:shadow-xl hover:shadow-primary/25'
                )}
              >
                Contact Support
              </motion.button>
            </div>
          </motion.div>
        </div>
      </Container>
    </Section>
  )
}

export default FAQ

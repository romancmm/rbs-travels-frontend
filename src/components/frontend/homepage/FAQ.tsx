'use client'

import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from '@/components/ui/accordion'
import { cn } from '@/lib/utils'
import { motion } from 'motion/react'
import { use } from 'react'

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
  data?: any // FAQData
  className?: string
}


const FAQ = ({ data, className }: FAQProps) => {
  const res: any = use(data)
  const faqData = res?.data?.value

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
              {faqData?.subtitle}
            </Typography>
            <Typography
              variant='h2'
              as='h2'
              weight='bold'
              className='text-foreground leading-tight'
            >
              {faqData?.title}
            </Typography>
          </motion.div>
        </div>

        {/* FAQ Grid */}
        <div className='mx-auto pb-10 max-w-4xl'>
          <Accordion type='single' collapsible>
            {faqData?.faqs?.map((faq: any, index: number) => (
              <AccordionItem
                key={index}
                value={`item-${index}`}
                className='mb-4 border border-border last:border-b rounded-xl w-full'
              >
                <AccordionTrigger className='flex justify-between items-center p-2 lg:p-4 rounded-none font-medium lg:text-xl text-left transition-colors cursor-pointer'>
                  {faq?.question}
                </AccordionTrigger>
                <AccordionContent className='p-4 lg:p-6 border-t border-t-border text-sm lg:text-lg'>
                  {faq?.answer}
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>

          {/* Call to Action */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.6 }}
            className='mt-12 text-center'
          >
            <div className='bg-linear-to-r from-primary/10 via-primary/5 to-primary/10 p-8 rounded-2xl'>
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

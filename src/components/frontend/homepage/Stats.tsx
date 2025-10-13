'use client'
import { Container } from '@/components/common/container'
import { Section } from '@/components/common/section'
import { Typography } from '@/components/common/typography'
import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

export default function Stats({ data }: { data?: any }) {
  return (
    <Section variant='none'>
      <Container>
        <div className='flex sm:flex-row flex-col justify-evenly items-center gap-6 lg:gap-10 py-4 border-y w-full'>
          {data?.map((item: any, index: number) => (
            <div key={index} className='flex items-center gap-4 p-3 w-full'>
              <div className="bg-gray-100 size-20"></div>
              <div className="">
                <Typography className='' variant='h4' weight={'bold'}>
                  <AnimatedCounter value={item.value} />
                </Typography>
                <Typography className='text-gray-500 dark:text-gray-400 text-sm'>{item.label}</Typography>
              </div>
            </div>
          ))}
        </div>
      </Container>
    </Section >
  )
}

// Animated Counter Component
const AnimatedCounter = ({ value }: { value: string }) => {
  const ref = useRef<HTMLSpanElement>(null)
  const isInView = useInView(ref, { once: true, margin: '-100px' })

  const motionValue = useMotionValue(0)
  const springValue = useSpring(motionValue, {
    damping: 60,
    stiffness: 100
  })

  // Extract number and suffix from value (e.g., "$23M+" -> 23 and "$", "M+")
  const match = value.match(/^([$]?)(\d+(?:\.\d+)?)(.*?)$/)

  useEffect(() => {
    if (isInView && match) {
      const targetNumber = parseFloat(match[2])
      motionValue.set(targetNumber)
    }
  }, [isInView, motionValue, match])

  useEffect(() => {
    if (!match) return

    const [, prefix, , suffix] = match
    const unsubscribe = springValue.on('change', (latest) => {
      if (ref.current) {
        const formatted = Math.floor(latest)
        ref.current.textContent = `${prefix}${formatted}${suffix}`
      }
    })

    return unsubscribe
  }, [springValue, match])

  if (!match) return <span>{value}</span>

  return <span ref={ref}>{value}</span>
}

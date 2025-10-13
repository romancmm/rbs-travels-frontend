'use client'

import { useInView, useMotionValue, useSpring } from 'motion/react'
import { useEffect, useRef } from 'react'

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

export default AnimatedCounter
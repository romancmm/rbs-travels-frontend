'use client'

import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'
import { Construction, Wrench } from 'lucide-react'
import Link from 'next/link'

export default function UnderConstruction() {
    return (
        <div className='flex flex-col justify-center items-center px-6 min-h-[80vh] text-center'>
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -180, opacity: 0 }}
                animate={{ scale: 1, rotate: 0, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 100, damping: 10 }}
                className='relative'
            >
                <div className='-top-4 -right-4 absolute'>
                    <motion.div
                        animate={{ rotate: [0, 20, -20, 0] }}
                        transition={{ repeat: Infinity, duration: 2 }}
                    >
                        <Wrench className='w-10 h-10 text-primary' />
                    </motion.div>
                </div>

                <motion.div
                    animate={{ y: [0, -10, 0] }}
                    transition={{ repeat: Infinity, duration: 2 }}
                >
                    <Construction className='w-24 h-24 text-primary' />
                </motion.div>
            </motion.div>

            {/* Heading */}
            <motion.h1
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className='mt-8 font-bold text-3xl sm:text-4xl'
            >
                Page Under Construction
            </motion.h1>

            {/* Subtitle */}
            <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className='mt-4 max-w-md'
            >
                We’re working hard to bring you something awesome. This page will be available soon!
            </motion.p>

            {/* Button */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7 }}
                className='mt-8'
            >
                <Link href='/'>
                    <Button variant='default' className='px-6 rounded-full'>
                        Back to Home
                    </Button>
                </Link>
            </motion.div>

            {/* Animated Construction Bar */}
            {/* <motion.div
                initial={{ width: 0 }}
                animate={{ width: ['0%', '80%', '0%'] }}
                transition={{ repeat: Infinity, duration: 3 }}
                className='bg-primary mt-10 rounded-full h-px'
            /> */}
        </div>
    )
}

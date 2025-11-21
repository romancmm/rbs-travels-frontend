'use client'

import { Card, CardContent } from '@/components/ui/card'
import { Sparkles } from 'lucide-react'
import { motion } from 'motion/react'

type WelcomeBannerProps = {
    userName?: string
}

export default function WelcomeBanner({ userName = 'Admin' }: WelcomeBannerProps) {
    const currentHour = new Date().getHours()
    const greeting =
        currentHour < 12 ? 'Good Morning' : currentHour < 18 ? 'Good Afternoon' : 'Good Evening'

    return (
        <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
        >
            <Card className='relative shadow-lg overflow-hidden'>
                <div className='absolute inset-0 bg-linear-to-r from-primary/10 via-accent/5 to-transparent' />
                <CardContent className='relative pt-8 pb-8'>
                    <div className='flex lg:flex-row flex-col justify-between items-start lg:items-center gap-6'>
                        <div className='space-y-3'>
                            <div className='flex items-center gap-2'>
                                <motion.div
                                    animate={{ rotate: [0, 10, -10, 0] }}
                                    transition={{ duration: 2, repeat: Infinity, repeatDelay: 3 }}
                                >
                                    <Sparkles className='w-6 h-6 text-primary' />
                                </motion.div>
                                <h1 className='font-bold text-3xl'>
                                    {greeting}, {userName}!
                                </h1>
                            </div>
                            <p className='text-muted-foreground text-lg'>
                                Welcome back to your CMS dashboard. Here&apos;s what&apos;s happening today.
                            </p>
                        </div>

                        {/* <div className='flex flex-wrap gap-4'>
                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className='flex items-center gap-2 bg-primary/10 px-4 py-2 rounded-lg'
                            >
                                <TrendingUp className='w-5 h-5 text-primary' />
                                <div>
                                    <p className='font-bold text-sm'>+12%</p>
                                    <p className='text-muted-foreground text-xs'>Growth</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className='flex items-center gap-2 bg-accent/10 px-4 py-2 rounded-lg'
                            >
                                <Users className='w-5 h-5 text-accent' />
                                <div>
                                    <p className='font-bold text-sm'>100</p>
                                    <p className='text-muted-foreground text-xs'>Users</p>
                                </div>
                            </motion.div>

                            <motion.div
                                whileHover={{ scale: 1.05 }}
                                className='flex items-center gap-2 bg-green-500/10 px-4 py-2 rounded-lg'
                            >
                                <FileText className='w-5 h-5 text-green-600' />
                                <div>
                                    <p className='font-bold text-sm'>08</p>
                                    <p className='text-muted-foreground text-xs'>Pages</p>
                                </div>
                            </motion.div>
                        </div> */}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

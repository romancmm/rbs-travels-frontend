'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowRight, LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

type QuickActionCardProps = {
    title: string
    description: string
    icon: LucideIcon
    href: string
    color: 'primary' | 'accent' | 'success' | 'warning'
    delay?: number
}

const colorClasses = {
    primary: {
        gradient: 'from-primary/20 to-primary/5',
        icon: 'bg-primary/10 text-primary',
        hover: 'group-hover:bg-primary/20'
    },
    accent: {
        gradient: 'from-accent/80 to-accent/40',
        icon: 'bg-accent/80 text-accent',
        hover: 'group-hover:bg-accent/20'
    },
    success: {
        gradient: 'from-green-500/20 to-green-500/5',
        icon: 'bg-green-500/10 text-green-600',
        hover: 'group-hover:bg-green-500/20'
    },
    warning: {
        gradient: 'from-yellow-500/20 to-yellow-500/5',
        icon: 'bg-yellow-500/10 text-yellow-600',
        hover: 'group-hover:bg-yellow-500/20'
    }
}

export default function QuickActionCard({
    title,
    description,
    icon: Icon,
    href,
    color,
    delay = 0
}: QuickActionCardProps) {
    const colors = colorClasses[color]

    return (
        <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
        >
            <Link href={href}>
                <Card className='group relative hover:shadow-xl border-2 hover:border-primary/50 h-full overflow-hidden transition-all duration-300 cursor-pointer'>
                    <div className={cn('absolute inset-0 bg-linear-to-br opacity-50', colors.gradient)} />
                    <CardContent className='relative'>
                        <ArrowRight className='top-6 right-4 absolute opacity-0 group-hover:opacity-100 w-4 h-4 transition-all -translate-x-2 group-hover:translate-x-0 duration-300' />
                        <div className='space-y-4'>
                            <div
                                className={cn(
                                    'inline-flex justify-center items-center rounded-xl w-14 h-14 transition-all duration-300',
                                    colors.icon,
                                    colors.hover
                                )}
                            >
                                <Icon className='w-7 h-7' />
                            </div>
                            <div className='space-y-2'>
                                <h3 className='flex items-center gap-2 font-semibold text-lg'>
                                    {title}
                                </h3>
                                <p className='text-muted-foreground text-sm leading-relaxed'>{description}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </Link>
        </motion.div>
    )
}

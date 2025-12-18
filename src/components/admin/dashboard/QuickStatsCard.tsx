'use client'

import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'

type QuickStatsCardProps = {
    title: string
    value: string | number
    icon: LucideIcon
    trend?: {
        value: number
        isPositive: boolean
    }
    color: 'primary' | 'accent' | 'success' | 'warning' | 'danger'
    delay?: number
}

const colorClasses = {
    primary: {
        bg: 'bg-primary/10',
        text: 'text-primary',
        border: 'border-primary/20'
    },
    accent: {
        bg: 'bg-accent/10',
        text: 'text-accent',
        border: 'border-accent/20'
    },
    success: {
        bg: 'bg-green-500/10',
        text: 'text-green-600',
        border: 'border-green-500/20'
    },
    warning: {
        bg: 'bg-yellow-500/10',
        text: 'text-yellow-600',
        border: 'border-yellow-500/20'
    },
    danger: {
        bg: 'bg-red-500/10',
        text: 'text-red-600',
        border: 'border-red-500/20'
    }
}

export default function QuickStatsCard({
    title,
    value,
    icon: Icon,
    trend,
    color,
    delay = 0
}: QuickStatsCardProps) {
    const colors = colorClasses[color]

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay }}
            whileHover={{ y: -4, transition: { duration: 0.2 } }}
        >
            <Card className='group relative hover:shadow-lg border-2 overflow-hidden transition-all duration-300'>
                <div className={cn('top-0 absolute inset-x-0 h-1 transition-all', colors.bg)} />
                <CardContent className=''>
                    <div className="flex flex-col gap-2">
                        <div className='flex justify-between items-start'>
                            <div className='space-y-1'>
                                <p className='font-medium text-muted-foreground text-sm'>{title}</p>
                                <p className='font-bold text-3xl tracking-tight'>{value}</p>
                            </div>
                            <div
                                className={cn(
                                    'flex justify-center items-center rounded-lg w-12 h-12 group-hover:scale-110 transition-all duration-300',
                                    colors.bg
                                )}
                            >
                                <Icon className={cn('w-6 h-6', colors.text)} />
                            </div>
                        </div>
                        {trend && (
                            <div className='flex items-center gap-1'>
                                <span
                                    className={cn(
                                        'font-medium text-xs',
                                        trend.isPositive ? 'text-green-600' : 'text-red-600'
                                    )}
                                >
                                    {trend.isPositive ? '↑' : '↓'} {Math.abs(trend.value)}%
                                </span>
                                <span className='text-muted-foreground text-xs'>vs last month</span>
                            </div>
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

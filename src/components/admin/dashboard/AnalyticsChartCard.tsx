'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { BarChart3, TrendingDown, TrendingUp } from 'lucide-react'
import { motion } from 'motion/react'

type ChartDataPoint = {
    label: string
    value: number
}

type AnalyticsChartCardProps = {
    title: string
    description?: string
    data: ChartDataPoint[]
    trend?: {
        value: number
        isPositive: boolean
    }
    totalValue?: string
}

export default function AnalyticsChartCard({
    title,
    description,
    data,
    trend,
    totalValue
}: AnalyticsChartCardProps) {
    const maxValue = Math.max(...data.map((d) => d.value))

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
        >
            <Card className='shadow-sm border-2 h-full'>
                <CardHeader className='bg-linear-to-r from-primary/5 to-transparent'>
                    <div className='flex justify-between items-start'>
                        <div className='space-y-1'>
                            <CardTitle className='flex items-center gap-2'>
                                <BarChart3 className='w-5 h-5 text-primary' />
                                {title}
                            </CardTitle>
                            {description && <CardDescription>{description}</CardDescription>}
                        </div>
                        <div className='flex items-center gap-2'>
                            {totalValue && (
                                <div className='text-right'>
                                    <p className='font-bold text-2xl'>{totalValue}</p>
                                    <p className='text-muted-foreground text-xs'>Total</p>
                                </div>
                            )}
                            {trend && (
                                <Badge
                                    variant='outline'
                                    className={cn(
                                        'gap-1',
                                        trend.isPositive
                                            ? 'bg-green-500/10 text-green-700 border-green-500/20'
                                            : 'bg-red-500/10 text-red-700 border-red-500/20'
                                    )}
                                >
                                    {trend.isPositive ? (
                                        <TrendingUp className='w-3 h-3' />
                                    ) : (
                                        <TrendingDown className='w-3 h-3' />
                                    )}
                                    {Math.abs(trend.value)}%
                                </Badge>
                            )}
                        </div>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className='pt-6'>
                    <div className='space-y-4'>
                        {data.map((item, index) => {
                            const percentage = (item.value / maxValue) * 100

                            return (
                                <motion.div
                                    key={item.label}
                                    initial={{ opacity: 0, x: -20 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className='space-y-2'
                                >
                                    <div className='flex justify-between items-center'>
                                        <span className='font-medium text-sm'>{item.label}</span>
                                        <span className='font-semibold text-sm'>{item.value.toLocaleString()}</span>
                                    </div>
                                    <div className='relative bg-muted rounded-full w-full h-3 overflow-hidden'>
                                        <motion.div
                                            initial={{ width: 0 }}
                                            animate={{ width: `${percentage}%` }}
                                            transition={{ duration: 1, delay: index * 0.1, ease: 'easeOut' }}
                                            className='top-0 left-0 absolute bg-linear-to-r from-primary to-accent rounded-full h-full'
                                        />
                                    </div>
                                </motion.div>
                            )
                        })}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

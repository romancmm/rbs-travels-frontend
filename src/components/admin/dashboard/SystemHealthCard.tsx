'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Activity, AlertTriangle, CheckCircle2 } from 'lucide-react'
import { motion } from 'motion/react'

type SystemMetric = {
    label: string
    value: number
    status: 'healthy' | 'warning' | 'critical'
    unit?: string
}

type SystemHealthCardProps = {
    metrics: SystemMetric[]
}

const statusConfig = {
    healthy: {
        icon: CheckCircle2,
        color: 'text-green-600',
        bg: 'bg-green-500/10',
        badge: 'bg-green-500/10 text-green-700 border-green-500/20'
    },
    warning: {
        icon: AlertTriangle,
        color: 'text-yellow-600',
        bg: 'bg-yellow-500/10',
        badge: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
    },
    critical: {
        icon: AlertTriangle,
        color: 'text-red-600',
        bg: 'bg-red-500/10',
        badge: 'bg-red-500/10 text-red-700 border-red-500/20'
    }
}

export default function SystemHealthCard({ metrics }: SystemHealthCardProps) {
    const overallStatus =
        metrics.some((m) => m.status === 'critical')
            ? 'critical'
            : metrics.some((m) => m.status === 'warning')
                ? 'warning'
                : 'healthy'

    const StatusIcon = statusConfig[overallStatus].icon

    return (
        <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className='shadow-sm border-2 h-full'>
                <CardHeader className='bg-linear-to-r from-accent/5 to-transparent'>
                    <div className='flex justify-between items-start'>
                        <div className='space-y-1'>
                            <CardTitle className='flex items-center gap-2'>
                                <Activity className='w-5 h-5 text-accent' />
                                System Health
                            </CardTitle>
                            <CardDescription>Real-time system metrics and status</CardDescription>
                        </div>
                        <Badge variant='outline' className={cn('gap-1', statusConfig[overallStatus].badge)}>
                            <StatusIcon className='w-3 h-3' />
                            {overallStatus}
                        </Badge>
                    </div>
                </CardHeader>
                <Separator />
                <CardContent className='pt-6'>
                    <div className='space-y-5'>
                        {metrics.map((metric, index) => {
                            const config = statusConfig[metric.status]
                            const Icon = config.icon

                            return (
                                <motion.div
                                    key={metric.label}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className='space-y-2'
                                >
                                    <div className='flex justify-between items-center'>
                                        <div className='flex items-center gap-2'>
                                            <div className={cn('p-1 rounded', config.bg)}>
                                                <Icon className={cn('w-3 h-3', config.color)} />
                                            </div>
                                            <span className='font-medium text-sm'>{metric.label}</span>
                                        </div>
                                        <span className='font-semibold text-sm'>
                                            {metric.value}
                                            {metric.unit}
                                        </span>
                                    </div>
                                    <div className='relative bg-muted rounded-full w-full h-2 overflow-hidden'>
                                        <div
                                            className={cn(
                                                'h-full transition-all duration-500',
                                                metric.status === 'healthy' && 'bg-green-500',
                                                metric.status === 'warning' && 'bg-yellow-500',
                                                metric.status === 'critical' && 'bg-red-500'
                                            )}
                                            style={{ width: `${metric.value}%` }}
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

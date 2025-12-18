'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { cn } from '@/lib/utils'
import { Clock, User } from 'lucide-react'
import { motion } from 'motion/react'

type Activity = {
    id: string
    user: string
    action: string
    target: string
    timestamp: string
    type: 'create' | 'update' | 'delete'
}

type RecentActivityCardProps = {
    activities: Activity[]
}

const activityColors = {
    create: 'bg-green-500/10 text-green-700 border-green-500/20',
    update: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    delete: 'bg-red-500/10 text-red-700 border-red-500/20'
}

export default function RecentActivityCard({ activities }: RecentActivityCardProps) {
    return (
        <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5 }}
        >
            <Card className='shadow-sm border-2 h-full'>
                <CardHeader className='bg-linear-to-r from-primary/5 to-transparent'>
                    <CardTitle className='flex items-center gap-2'>
                        <Clock className='w-5 h-5 text-primary' />
                        Recent Activity
                    </CardTitle>
                    <CardDescription>Latest actions performed in the system</CardDescription>
                </CardHeader>
                <Separator />
                <CardContent className='pt-6'>
                    <div className='space-y-4'>
                        {activities.length === 0 ? (
                            <div className='flex flex-col justify-center items-center gap-2 bg-muted/30 p-8 border-2 border-dashed rounded-lg text-center'>
                                <Clock className='w-8 h-8 text-muted-foreground/50' />
                                <p className='text-muted-foreground text-sm'>No recent activity</p>
                            </div>
                        ) : (
                            activities.map((activity, index) => (
                                <motion.div
                                    key={activity.id}
                                    initial={{ opacity: 0, x: -10 }}
                                    animate={{ opacity: 1, x: 0 }}
                                    transition={{ duration: 0.3, delay: index * 0.1 }}
                                    className='group hover:bg-muted/50 p-3 rounded-lg transition-colors'
                                >
                                    <div className='flex justify-between items-start gap-3'>
                                        <div className='flex-1 space-y-1'>
                                            <div className='flex items-center gap-2'>
                                                <Badge
                                                    variant='outline'
                                                    className={cn('text-xs', activityColors[activity.type])}
                                                >
                                                    {activity.type}
                                                </Badge>
                                                <p className='font-medium text-sm'>{activity.action}</p>
                                            </div>
                                            <p className='text-muted-foreground text-xs'>
                                                Target: <span className='font-medium'>{activity.target}</span>
                                            </p>
                                            <div className='flex items-center gap-1 text-muted-foreground text-xs'>
                                                <User className='w-3 h-3' />
                                                <span>{activity.user}</span>
                                            </div>
                                        </div>
                                        <span className='text-muted-foreground text-xs whitespace-nowrap'>
                                            {activity.timestamp}
                                        </span>
                                    </div>
                                </motion.div>
                            ))
                        )}
                    </div>
                </CardContent>
            </Card>
        </motion.div>
    )
}

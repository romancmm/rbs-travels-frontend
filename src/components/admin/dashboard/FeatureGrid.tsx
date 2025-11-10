'use client'

import { Badge } from '@/components/ui/badge'
import { Card, CardContent } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { ArrowUpRight, LucideIcon } from 'lucide-react'
import { motion } from 'motion/react'
import Link from 'next/link'

export type Feature = {
    id: string
    title: string
    description: string
    icon: LucideIcon
    href: string
    badge?: string
    color: 'primary' | 'accent' | 'success' | 'warning' | 'purple' | 'pink'
}

type FeatureGridProps = {
    features: Feature[]
    columns?: 2 | 3 | 4
}

const colorClasses = {
    primary: {
        gradient: 'from-primary/20 via-primary/10 to-transparent',
        icon: 'bg-primary/10 text-primary group-hover:bg-primary/20',
        border: 'hover:border-primary/50'
    },
    accent: {
        gradient: 'from-accent/20 via-accent/10 to-transparent',
        icon: 'bg-accent/10 text-accent group-hover:bg-accent/20',
        border: 'hover:border-accent/50'
    },
    success: {
        gradient: 'from-green-500/20 via-green-500/10 to-transparent',
        icon: 'bg-green-500/10 text-green-600 group-hover:bg-green-500/20',
        border: 'hover:border-green-500/50'
    },
    warning: {
        gradient: 'from-yellow-500/20 via-yellow-500/10 to-transparent',
        icon: 'bg-yellow-500/10 text-yellow-600 group-hover:bg-yellow-500/20',
        border: 'hover:border-yellow-500/50'
    },
    purple: {
        gradient: 'from-purple-500/20 via-purple-500/10 to-transparent',
        icon: 'bg-purple-500/10 text-purple-600 group-hover:bg-purple-500/20',
        border: 'hover:border-purple-500/50'
    },
    pink: {
        gradient: 'from-pink-500/20 via-pink-500/10 to-transparent',
        icon: 'bg-pink-500/10 text-pink-600 group-hover:bg-pink-500/20',
        border: 'hover:border-pink-500/50'
    }
}

const gridColumns = {
    2: 'grid-cols-1 md:grid-cols-2',
    3: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-3',
    4: 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4'
}

export default function FeatureGrid({ features, columns = 3 }: FeatureGridProps) {
    return (
        <div className={cn('gap-4 grid', gridColumns[columns])}>
            {features.map((feature, index) => {
                const colors = colorClasses[feature.color]
                const Icon = feature.icon

                return (
                    <motion.div
                        key={feature.id}
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.4, delay: index * 0.05 }}
                        whileHover={{ y: -4 }}
                    >
                        <Link href={feature.href}>
                            <Card
                                className={cn(
                                    'group relative hover:shadow-xl border-2 h-full overflow-hidden transition-all duration-300 cursor-pointer',
                                    colors.border
                                )}
                            >
                                <div className={cn('absolute inset-0 bg-linear-to-br opacity-40', colors.gradient)} />
                                <CardContent className='relative'>
                                    <div className='space-y-4'>
                                        <div className='flex justify-between items-start'>
                                            <div
                                                className={cn(
                                                    'inline-flex justify-center items-center rounded-xl w-12 h-12 transition-all duration-300',
                                                    colors.icon
                                                )}
                                            >
                                                <Icon className='w-6 h-6' />
                                            </div>
                                            {feature.badge && (
                                                <Badge variant='secondary' className='text-xs'>
                                                    {feature.badge}
                                                </Badge>
                                            )}
                                            {!feature.badge && (
                                                <ArrowUpRight className='opacity-0 group-hover:opacity-100 w-5 h-5 text-muted-foreground transition-opacity' />
                                            )}
                                        </div>
                                        <div className='space-y-2'>
                                            <h3 className='font-semibold text-lg leading-tight'>{feature.title}</h3>
                                            <p className='text-muted-foreground text-sm line-clamp-2 leading-relaxed'>
                                                {feature.description}
                                            </p>
                                        </div>
                                    </div>
                                </CardContent>
                            </Card>
                        </Link>
                    </motion.div>
                )
            })}
        </div>
    )
}

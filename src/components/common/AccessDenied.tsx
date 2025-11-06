'use client'

import { Button } from '@/components/ui/button'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { cn } from '@/lib/utils'
import { AlertTriangle, ArrowLeft, Clock, Home, Lock, Shield } from 'lucide-react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'

interface AccessDeniedProps {
  title?: string
  message?: string
  showBackButton?: boolean
  showHomeButton?: boolean
  redirectPath?: string
}

export default function AccessDenied({
  title = 'Access Denied',
  message = `You don&apos;t have permission to access this resource.`,
  showBackButton = true,
  showHomeButton = true,
  redirectPath = '/admin/dashboard'
}: AccessDeniedProps) {
  const router = useRouter()
  const [countdown, setCountdown] = useState(10)
  const [isVisible, setIsVisible] = useState(false)

  // Fade in animation
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Auto-redirect countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          router.push(redirectPath)
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [router, redirectPath])

  const handleGoBack = () => {
    if (window.history.length > 1) {
      router.back()
    } else {
      router.push(redirectPath)
    }
  }

  return (
    <div className='flex justify-center items-center px-4 py-12 min-h-screen'>
      <div
        className={cn(
          'mx-auto w-full max-w-md transition-all duration-700 ease-out',
          isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
        )}
      >
        <Card className='relative bg-white/80 shadow-2xl backdrop-blur-sm border-0 overflow-hidden'>
          {/* Decorative gradient background */}
          <div className='absolute inset-0 bg-linear-to-br from-red-50/50 via-orange-50/30 to-yellow-50/50' />

          <CardHeader className='relative pb-6 text-center'>
            {/* Icon with animated background */}
            <div className='relative mx-auto mb-6'>
              <div className='absolute inset-0 bg-red-100 rounded-full animate-pulse' />
              <div className='relative flex justify-center items-center bg-linear-to-br from-red-100 to-red-200 shadow-lg rounded-full w-20 h-20'>
                <Lock className='w-10 h-10 text-red-600' />
              </div>
            </div>

            <CardTitle className='flex justify-center items-center gap-3 mb-3 font-bold text-gray-900 text-3xl'>
              <AlertTriangle className='w-7 h-7 text-red-500' />
              {title}
            </CardTitle>

            <CardDescription className='text-gray-600 text-lg leading-relaxed'>
              {message}
            </CardDescription>
          </CardHeader>

          <CardContent className='relative space-y-6'>
            {/* Permission notice with improved styling */}
            <div className='bg-linear-to-r from-amber-50 to-orange-50 shadow-sm p-5 border border-amber-200 rounded-xl'>
              <div className='flex items-start gap-4'>
                <div className='flex-shrink-0 bg-amber-100 p-2 rounded-full'>
                  <Shield className='w-5 h-5 text-amber-700' />
                </div>
                <div className='text-amber-900'>
                  <p className='mb-2 font-semibold text-base'>Permission Required</p>
                  <p className='text-sm leading-relaxed'>
                    This action requires specific permissions that haven&apos;t been granted to your
                    account. Please contact your administrator if you believe this is an error.
                  </p>
                </div>
              </div>
            </div>

            {/* Countdown with improved design */}
            <div className='bg-linear-to-r from-blue-50 to-indigo-50 p-4 border border-blue-200 rounded-lg text-center'>
              <div className='flex justify-center items-center gap-2 text-blue-800'>
                <Clock className='w-5 h-5' />
                <span className='font-medium text-sm'>
                  Redirecting to dashboard in{' '}
                  <span className='inline-flex justify-center items-center bg-blue-600 ml-1 rounded-full w-8 h-8 font-mono font-bold text-white text-lg'>
                    {countdown}
                  </span>{' '}
                  seconds
                </span>
              </div>
            </div>

            {/* Action buttons with improved spacing and design */}
            <div className='flex sm:flex-row flex-col gap-3 pt-2'>
              {showBackButton && (
                <Button
                  variant='outline'
                  onClick={handleGoBack}
                  className='group flex-1 hover:bg-gray-50 border-2 h-12 hover:scale-105 transition-all duration-200'
                >
                  <ArrowLeft className='mr-2 w-5 h-5 transition-transform group-hover:-translate-x-1' />
                  Go Back
                </Button>
              )}

              {showHomeButton && (
                <Link href={redirectPath} className='flex-1'>
                  <Button className='group bg-linear-to-r from-blue-600 hover:from-blue-700 to-indigo-600 hover:to-indigo-700 shadow-lg hover:shadow-xl w-full h-12 hover:scale-105 transition-all duration-200'>
                    <Home className='mr-2 w-5 h-5 group-hover:scale-110 transition-transform' />
                    Dashboard
                  </Button>
                </Link>
              )}
            </div>

            {/* Support link with improved styling */}
            <div className='pt-4 border-gray-100 border-t text-center'>
              <Link
                href='/contact'
                className='inline-flex items-center gap-2 font-medium text-blue-600 hover:text-blue-800 text-sm hover:underline transition-colors duration-200'
              >
                Need help? Contact support
              </Link>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  )
}

'use client'

import { authenticate } from '@/action/auth'
import CustomInput from '@/components/common/CustomInput'
import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Checkbox } from '@/components/ui/checkbox'
import { Separator } from '@/components/ui/separator'
import { showError } from '@/lib/errMsg'
import { LoginSchema, loginSchema } from '@/lib/validations/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface LoginCardProps {
  className?: string
  onSuccess?: () => void
  compact?: boolean
}

export default function LoginCard({ className = '', onSuccess, compact = false }: LoginCardProps) {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [showPassword, setShowPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [rememberMe, setRememberMe] = useState(false)

  // Get callback URL from search params (set by middleware)
  const callbackUrl = searchParams.get('callbackUrl')

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<LoginSchema>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: ''
    }
  })

  const onSubmit: SubmitHandler<LoginSchema> = async (data) => {
    setIsLoading(true)

    try {
      const res = await authenticate(data)

      if (res?.data?.token) {
        toast.success('User logged in successfully!')
        // Call onSuccess to close modal if in modal mode
        onSuccess?.()
        router.refresh()
        router.push('/user/profile')
      } else {
        showError(res?.errors)
      }
    } catch (error: unknown) {
      showError(error)
    } finally {
      setIsLoading(false)
    }
  }

  const handleSocialLogin = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    try {
      // Handle social login logic here
      console.log(`${provider} login clicked`)
      onSuccess?.()
    } catch (error) {
      console.error(`${provider} login error:`, error)
    }
    setIsLoading(false)
  }

  const content = (
    <div className={`space-y-${compact ? '4' : '6'}`}>
      {/* Logo and Header */}
      <div className='text-center'>
        <Typography variant='h2' weight='semibold' className={compact ? 'text-xl' : 'text-2xl'}>
          Welcome Back
        </Typography>
        <Typography variant='body2'>Sign in to your account to continue</Typography>
      </div>

      {/* Login Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Email Field */}
        <Controller
          name='email'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Email Address'
              name='email'
              type='email'
              placeholder='Enter your email'
              value={field.value}
              onChange={(e) => {
                field.onChange(e)
              }}
              error={errors.email?.message}
              required
              size={compact ? 'middle' : 'large'}
              disabled={isLoading}
            />
          )}
        />

        {/* Password Field */}
        <div className='relative'>
          <Controller
            name='password'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Password'
                name='password'
                type={showPassword ? 'text' : 'password'}
                placeholder='Enter your password'
                value={field.value}
                onChange={(e) => {
                  field.onChange(e)
                }}
                error={errors.password?.message}
                required
                size={compact ? 'middle' : 'large'}
                disabled={isLoading}
              />
            )}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 ${compact ? 'top-1/2' : 'top-1/2'}   transition-colors`}
            disabled={isLoading}
          >
            {showPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
          </button>
        </div>

        {/* Remember Me & Forgot Password */}
        <div className='flex justify-between items-center'>
          <div className='flex items-center space-x-2'>
            <Checkbox
              id='rememberMe'
              checked={rememberMe}
              onCheckedChange={(checked: boolean) => setRememberMe(checked as boolean)}
              disabled={isLoading}
            />
            <label htmlFor='rememberMe' className='font-medium text-sm cursor-pointer'>
              Remember me
            </label>
          </div>
          <CustomLink
            href='/forgot-password'
            className='font-medium text-primary text-sm hover:underline'
          >
            Forgot password?
          </CustomLink>
        </div>

        {/* Login Button */}
        <Button
          type='submit'
          className={`w-full text-background  ${compact ? 'h-10' : 'h-12'} font-semibold ${
            compact ? 'text-sm' : 'text-base'
          }`}
          size={compact ? 'default' : 'lg'}
          disabled={isLoading}
        >
          {isLoading ? 'Signing In...' : 'Sign In'}
        </Button>
      </form>

      {/* Divider */}
      <div className='relative'>
        <Separator className='bg-muted-foreground/20' />
        <div className='absolute inset-0 flex justify-center'>
          <span className='bg-foreground -mt-2 px-4 text-sm'>or continue with</span>
        </div>
      </div>

      {/* Social Login Options */}
      <div className='space-y-3'>
        <Button
          type='button'
          variant='outline'
          onClick={() => handleSocialLogin('google')}
          className={`hover:bg-muted/10 border-muted-foreground w-full ${
            compact ? 'h-10' : 'h-12'
          }`}
          disabled={isLoading}
        >
          <svg className='mr-3 w-5 h-5' viewBox='0 0 24 24'>
            <path
              fill='currentColor'
              d='M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z'
            />
            <path
              fill='currentColor'
              d='M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z'
            />
            <path
              fill='currentColor'
              d='M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z'
            />
            <path
              fill='currentColor'
              d='M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z'
            />
          </svg>
          Continue with Google
        </Button>

        <Button
          type='button'
          variant='outline'
          onClick={() => handleSocialLogin('facebook')}
          className={`hover:bg-muted/10 border-muted-foreground w-full ${
            compact ? 'h-10' : 'h-12'
          }`}
          disabled={isLoading}
        >
          <svg className='mr-3 w-5 h-5' fill='currentColor' viewBox='0 0 24 24'>
            <path d='M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z' />
          </svg>
          Continue with Facebook
        </Button>
      </div>

      {/* Sign Up Link */}
      <div className='text-center'>
        <Typography variant='body2' className=' '>
          Don&apos;t have an account?{' '}
          <CustomLink
            href='/sign-up?direct=true'
            className='font-semibold text-primary hover:underline'
          >
            Sign up
          </CustomLink>
        </Typography>
      </div>
    </div>
  )

  if (compact) {
    return <div className={`p-6 w-full ${className}`}>{content}</div>
  }

  return (
    <Card className={`bg-foreground p-8 border-muted-foreground w-full max-w-md ${className}`}>
      {content}
    </Card>
  )
}

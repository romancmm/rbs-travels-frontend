'use client'

import { registerUser } from '@/action/auth'
import CustomInput from '@/components/common/CustomInput'
import CustomLink from '@/components/common/CustomLink'
import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card } from '@/components/ui/card'
import { Separator } from '@/components/ui/separator'
import { showError } from '@/lib/errMsg'
import { RegisterSchema, registerSchema } from '@/lib/validations/schemas'
import { zodResolver } from '@hookform/resolvers/zod'
import { EyeIcon, EyeOffIcon } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { useState } from 'react'
import { Controller, SubmitHandler, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface SignUpCardProps {
  className?: string
  onSuccess?: () => void
  compact?: boolean
}

export default function RegisterCard({
  className = '',
  onSuccess,
  compact = false
}: SignUpCardProps) {
  const router = useRouter()
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [isLoading, setIsLoading] = useState(false)

  const {
    control,
    handleSubmit,
    formState: { errors }
  } = useForm<RegisterSchema>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      telegramUsername: '',
      password: '',
      confirm: ''
    }
  })

  const onSubmit: SubmitHandler<RegisterSchema> = async (data) => {
    setIsLoading(true)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { confirm, ...rest } = data

    try {
      const res = await registerUser(rest)

      if (res?.data?.token) {
        toast.success('User registered successfully!')
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

  const handleSocialSignUp = async (provider: 'google' | 'facebook') => {
    setIsLoading(true)
    try {
      // Handle social sign up logic here
      console.log(`${provider} sign up clicked`)
      onSuccess?.()
    } catch (error) {
      console.error(`${provider} sign up error:`, error)
    }
    setIsLoading(false)
  }

  const content = (
    <div className={`space-y-${compact ? '4' : '6'}`}>
      {/* Header */}
      <div className='text-center'>
        <Typography variant='h2' weight='semibold' className={compact ? 'text-xl' : 'text-2xl'}>
          Create Account
        </Typography>
        <Typography variant='body2'>Join us and start your journey today</Typography>
      </div>

      {/* Sign Up Form */}
      <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
        {/* Name Fields */}
        <div className='gap-3 grid grid-cols-2'>
          <Controller
            name='firstName'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='First Name'
                name='firstName'
                type='text'
                placeholder='Enter first name'
                value={field.value}
                onChange={field.onChange}
                error={errors.firstName?.message}
                disabled={isLoading}
                required
              />
            )}
          />
          <Controller
            name='lastName'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Last Name'
                name='lastName'
                type='text'
                placeholder='Enter last name'
                value={field.value}
                onChange={field.onChange}
                error={errors.lastName?.message}
                disabled={isLoading}
                required
              />
            )}
          />
        </div>

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
              onChange={field.onChange}
              error={errors.email?.message}
              disabled={isLoading}
              required
            />
          )}
        />

        {/* Phone Field */}
        <Controller
          name='phone'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Phone/WhatsApp Number'
              name='phone'
              type='text'
              placeholder='Enter your phone number'
              value={field.value}
              onChange={field.onChange}
              error={errors.phone?.message}
              disabled={isLoading}
            />
          )}
        />

        {/* Telegram Field */}
        <Controller
          name='telegramUsername'
          control={control}
          render={({ field }) => (
            <CustomInput
              label='Telegram Username'
              name='telegramUsername'
              type='text'
              placeholder='Enter your Telegram username'
              value={field.value || ''}
              onChange={field.onChange}
              error={errors.telegramUsername?.message}
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
                placeholder='Create a password'
                value={field.value}
                onChange={field.onChange}
                error={errors.password?.message}
                disabled={isLoading}
                required
              />
            )}
          />
          <button
            type='button'
            onClick={() => setShowPassword(!showPassword)}
            className={`absolute right-3 ${
              compact ? 'top-1/2' : 'top-1/2'
            } text-muted-foreground transition-colors`}
            disabled={isLoading}
          >
            {showPassword ? <EyeOffIcon className='w-5 h-5' /> : <EyeIcon className='w-5 h-5' />}
          </button>
        </div>

        {/* Confirm Password Field */}
        <div className='relative'>
          <Controller
            name='confirm'
            control={control}
            render={({ field }) => (
              <CustomInput
                label='Confirm Password'
                name='confirm'
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder='Confirm your password'
                value={field.value}
                onChange={field.onChange}
                error={errors.confirm?.message}
                disabled={isLoading}
                required
              />
            )}
          />
          <button
            type='button'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}
            className={`absolute right-3 ${
              compact ? 'top-1/2' : 'top-1/2'
            } text-muted-foreground transition-colors`}
            disabled={isLoading}
          >
            {showConfirmPassword ? (
              <EyeOffIcon className='w-5 h-5' />
            ) : (
              <EyeIcon className='w-5 h-5' />
            )}
          </button>
        </div>

        {/* Submit Button */}
        <Button
          type='submit'
          className={`w-full text-background ${compact ? 'h-10' : 'h-12'} font-semibold ${
            compact ? 'text-sm' : 'text-base'
          }`}
          size={compact ? 'default' : 'lg'}
          disabled={isLoading}
        >
          {isLoading ? 'Creating Account...' : 'Create Account'}
        </Button>
      </form>

      {/* Divider */}
      <div className='relative'>
        <Separator className='bg-muted-foreground/20' />
        <div className='absolute inset-0 flex justify-center'>
          <span className='bg-foreground -mt-2 px-4 text-muted-foreground text-sm'>
            or sign up with
          </span>
        </div>
      </div>

      {/* Social Sign Up Buttons */}
      <div className='space-y-3'>
        <Button
          type='button'
          variant='outline'
          onClick={() => handleSocialSignUp('google')}
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
          onClick={() => handleSocialSignUp('facebook')}
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

      {/* Sign In Link */}
      <div className='text-center'>
        <Typography variant='body2' className='text-muted-foreground'>
          Already have an account?{' '}
          <CustomLink
            href='/login?direct=true'
            className='font-semibold text-primary hover:underline'
          >
            Sign in
          </CustomLink>
        </Typography>
      </div>
    </div>
  )

  if (compact) {
    return <div className={`p-6 w-full ${className}`}>{content}</div>
  }

  return (
    <Card className={`bg-foreground p-8 border-muted-foreground w-full max-w-lg ${className}`}>
      {content}
    </Card>
  )
}

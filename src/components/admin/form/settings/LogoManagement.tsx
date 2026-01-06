'use client'

import { revalidateTags } from '@/action/data'
import FilePicker from '@/components/common/FilePicker'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { showError } from '@/lib/errMsg'
import { cn } from '@/lib/utils'
import { SiteSettings, siteSettingsSchema } from '@/lib/validations/schemas/siteSettings'
import requests from '@/services/network/http'
import { SITE_CONFIG } from '@/types/cache-keys'
import { zodResolver } from '@hookform/resolvers/zod'
import { Image as ImageIcon, Moon, Sparkles, Sun } from 'lucide-react'
import { Controller, useForm } from 'react-hook-form'
import { toast } from 'sonner'

type TProps = {
  settingsKey: string
  initialValues?: SiteSettings | undefined
  refetch?: () => void
}

const LogoManagement = ({ settingsKey, initialValues, refetch }: TProps) => {
  const {
    handleSubmit,
    control,
    formState: { errors, isSubmitting }
  } = useForm<SiteSettings>({
    resolver: zodResolver(siteSettingsSchema),
    defaultValues: {
      ...initialValues,
      logo: {
        default: initialValues?.logo?.default || '',
        dark: initialValues?.logo?.dark || ''
      }
    }
  })

  const onSubmit = handleSubmit(async (data) => {
    try {
      const res = await requests[initialValues ? 'put' : 'post'](
        `/admin/setting/settings/${initialValues ? `key/${settingsKey}` : ''}`,
        {
          key: settingsKey,
          value: data
        }
      )
      if (res?.success) {
        await revalidateTags(SITE_CONFIG)
        toast.success('Settings updated successfully!')
        refetch?.()
      }
    } catch (error) {
      showError(error)
    }
  })

  return (
    <form onSubmit={onSubmit} className='space-y-8'>
      <div className='gap-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
        {/* Default Logo Card */}
        <Card className='group relative hover:shadow-2xl border-2 hover:border-blue-500/30 overflow-hidden transition-all duration-500'>
          {/* Decorative gradient background */}
          <div className='absolute inset-0 bg-linear-to-br from-blue-500/5 via-transparent to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          {/* Decorative corner accent */}
          <div className='top-0 right-0 absolute bg-linear-to-br from-blue-500/20 to-transparent opacity-50 rounded-bl-full w-20 h-20' />

          <CardHeader className='relative pb-3'>
            <CardTitle className='flex justify-between items-center gap-2 font-semibold text-base'>
              <span className='flex items-center gap-2'>
                <Sun className='w-4 h-4 text-blue-600' />
                Logo
              </span>
              <span className='bg-blue-100 px-2 py-0.5 rounded-full font-medium text-blue-700 text-xs'>
                Light
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className='relative'>
            <div className='space-y-3'>
              <div
                className={cn(
                  'relative flex justify-center items-center p-2 rounded-xl transition-all duration-500',
                  'bg-linear-to-br from-muted/50 via-muted/30 to-background',
                  'border-2 border-dashed border-muted-foreground/20',
                  'group-hover:border-blue-500/40'
                )}
              >
                <Controller
                  control={control}
                  name='logo.default'
                  render={({ field }) => (
                    <FilePicker
                      value={field.value || ''}
                      onChangeAction={field.onChange}
                      multiple={false}
                      maxAllow={1}
                      size='large'
                    />
                  )}
                />
              </div>
              <p className='flex items-center gap-1 text-muted-foreground text-xs'>
                <ImageIcon className='w-3 h-3' />
                Max height 120px
              </p>
              {errors.logo?.default && (
                <span className='text-red-500 text-xs'>{errors.logo.default.message}</span>
              )}
            </div>
          </CardContent>

          {/* Hover effect bar */}
          <div className='right-0 bottom-0 left-0 absolute bg-linear-to-r from-blue-500/0 via-blue-500 to-blue-500/0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
        </Card>

        {/* Dark Logo Card */}
        <Card className='group relative hover:shadow-2xl border-2 hover:border-gray-700/30 overflow-hidden transition-all duration-500'>
          {/* Decorative gradient background */}
          <div className='absolute inset-0 bg-linear-to-br from-gray-700/5 via-transparent to-gray-700/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          {/* Decorative corner accent */}
          <div className='top-0 right-0 absolute bg-linear-to-br from-gray-700/20 to-transparent opacity-50 rounded-bl-full w-20 h-20' />

          <CardHeader className='relative pb-3'>
            <CardTitle className='flex justify-between items-center gap-2 font-semibold text-base'>
              <span className='flex items-center gap-2'>
                <Moon className='w-4 h-4 text-gray-700' />
                Logo
              </span>
              <span className='bg-gray-800 px-2 py-0.5 rounded-full font-medium text-white text-xs'>
                Dark
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className='relative'>
            <div className='space-y-3'>
              <div
                className={cn(
                  'relative flex justify-center items-center p-2 rounded-xl transition-all duration-500',
                  'bg-linear-to-br from-muted/50 via-muted/30 to-background',
                  'border-2 border-dashed border-muted-foreground/20',
                  'group-hover:border-gray-700/40'
                )}
              >
                <Controller
                  control={control}
                  name='logo.dark'
                  render={({ field }) => (
                    <FilePicker
                      value={field.value || ''}
                      onChangeAction={field.onChange}
                      multiple={false}
                      maxAllow={1}
                      size='large'
                    />
                  )}
                />
              </div>
              <p className='flex items-center gap-1 text-muted-foreground text-xs'>
                <ImageIcon className='w-3 h-3' />
                Max height 120px
              </p>
              {errors.logo?.dark && (
                <span className='text-red-500 text-xs'>{errors.logo.dark.message}</span>
              )}
            </div>
          </CardContent>
          {/* Hover effect bar */}
          <div className='right-0 bottom-0 left-0 absolute bg-linear-to-r from-gray-700/0 via-gray-700 to-gray-700/0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
        </Card>

        {/* Favicon Card */}
        <Card className='group relative hover:shadow-2xl border-2 hover:border-amber-500/30 overflow-hidden transition-all duration-500'>
          {/* Decorative gradient background */}
          <div className='absolute inset-0 bg-linear-to-br from-amber-500/5 via-transparent to-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500' />

          {/* Decorative corner accent */}
          <div className='top-0 right-0 absolute bg-linear-to-br from-amber-500/20 to-transparent opacity-50 rounded-bl-full w-20 h-20' />

          <CardHeader className='relative pb-3'>
            <CardTitle className='flex justify-between items-center gap-2 font-semibold text-base'>
              <span className='flex items-center gap-2'>
                <Sparkles className='w-4 h-4 text-amber-600' />
                Favicon
              </span>
              <span className='bg-amber-100 px-2 py-0.5 rounded-full font-medium text-amber-700 text-xs'>
                Icon
              </span>
            </CardTitle>
          </CardHeader>

          <CardContent className='relative'>
            <div className='space-y-3'>
              <div
                className={cn(
                  'relative flex justify-center items-center p-2 rounded-xl transition-all duration-500',
                  'bg-linear-to-br from-muted/50 via-muted/30 to-background',
                  'border-2 border-dashed border-muted-foreground/20',
                  'group-hover:border-amber-500/40'
                )}
              >
                <Controller
                  control={control}
                  name='favicon'
                  render={({ field }) => (
                    <FilePicker
                      value={field.value || ''}
                      onChangeAction={field.onChange}
                      multiple={false}
                      maxAllow={1}
                      size='large'
                    />
                  )}
                />
              </div>
              <p className='flex items-center gap-1 text-muted-foreground text-xs'>
                <ImageIcon className='w-3 h-3' />
                48x48 px
              </p>
              {errors.favicon && (
                <span className='text-red-500 text-xs'>{errors.favicon.message}</span>
              )}
            </div>
          </CardContent>
          {/* Hover effect bar */}
          <div className='right-0 bottom-0 left-0 absolute bg-linear-to-r from-amber-500/0 via-amber-500 to-amber-500/0 h-1 scale-x-0 group-hover:scale-x-100 transition-transform duration-500' />
        </Card>
      </div>

      <Button
        type='submit'
        size='lg'
        className='shadow-lg hover:shadow-xl w-full sm:w-auto min-w-48 transition-all duration-300'
        disabled={isSubmitting}
      >
        {isSubmitting ? (
          <>
            <span className='mr-2 animate-spin'>⏳</span>
            Uploading...
          </>
        ) : initialValues ? (
          'Update Settings'
        ) : (
          'Save Settings'
        )}
      </Button>
    </form>
  )
}

export default LogoManagement

'use client'

import { useLanguage } from '@/components/providers/language-provider'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger
} from '@/components/ui/dropdown-menu'
import { SUPPORTED_LANGUAGES, getLanguage } from '@/config/languages'
import { cn } from '@/lib/utils'
import { Check, Globe } from 'lucide-react'

export default function LanguageSwitcher({ compact = false }: { compact?: boolean }) {
  const { language, setLanguage } = useLanguage()
  const current = getLanguage(language)

  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <button
          type='button'
          aria-label='Change language'
          className={cn(
            'flex items-center gap-1.5 rounded-lg text-header-color/90 hover:text-header-color transition-colors cursor-pointer',
            compact
              ? 'justify-center bg-white/10 hover:bg-white/20 w-10 h-10'
              : 'hover:bg-white/10 px-3 py-2 text-sm'
          )}
        >
          <Globe className='w-4 h-4' />
          {!compact && <span className='font-medium uppercase'>{current.code}</span>}
        </button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align='end' className='w-48'>
        {SUPPORTED_LANGUAGES.map((lang) => (
          <DropdownMenuItem
            key={lang.code}
            onClick={() => setLanguage(lang.code)}
            className='flex items-center justify-between gap-2'
          >
            <span className='flex flex-col'>
              <span className='text-sm'>{lang.nativeName}</span>
              {lang.nativeName !== lang.name && (
                <span className='text-muted-foreground text-xs'>{lang.name}</span>
              )}
            </span>
            {lang.code === current.code && <Check className='w-4 h-4 text-primary' />}
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  )
}

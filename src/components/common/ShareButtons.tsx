'use client'

import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Link as LinkIcon } from 'lucide-react'
import { useState } from 'react'

type ShareButtonsProps = {
  url: string
  title: string
  variant?: 'card' | 'inline'
  showTitle?: boolean
}

// lucide-react dropped brand/logo icons; these small local outline icons
// (in lucide's own stroke style) fill in for the removed Facebook/Twitter/Linkedin.
function FacebookIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z' />
    </svg>
  )
}

function TwitterIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M23 3a10.9 10.9 0 0 1-3.14 1.53 4.48 4.48 0 0 0-7.86 3v1A10.66 10.66 0 0 1 3 4s-4 9 5 13a11.64 11.64 0 0 1-7 2c9 5 20 0 20-11.5a4.5 4.5 0 0 0-.08-.83A7.72 7.72 0 0 0 23 3z' />
    </svg>
  )
}

function LinkedinIcon(props: React.SVGProps<SVGSVGElement>) {
  return (
    <svg
      viewBox='0 0 24 24'
      fill='none'
      stroke='currentColor'
      strokeWidth={2}
      strokeLinecap='round'
      strokeLinejoin='round'
      {...props}
    >
      <path d='M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z' />
      <rect x='2' y='9' width='4' height='12' />
      <circle cx='4' cy='4' r='2' />
    </svg>
  )
}

export default function ShareButtons({
  url,
  title,
  variant = 'card',
  showTitle = true
}: ShareButtonsProps) {
  const [copySuccess, setCopySuccess] = useState(false)

  const shareTitle = encodeURIComponent(title)
  const shareUrl = encodeURIComponent(url)

  const handleCopyLink = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopySuccess(true)
      setTimeout(() => setCopySuccess(false), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  const shareLinks = {
    facebook: `https://www.facebook.com/sharer/sharer.php?u=${shareUrl}`,
    twitter: `https://twitter.com/intent/tweet?url=${shareUrl}&text=${shareTitle}`,
    linkedin: `https://www.linkedin.com/sharing/share-offsite/?url=${shareUrl}`
  }

  const buttons = (
    <div className={variant === 'inline' ? 'flex gap-2' : 'flex flex-col gap-3'}>
      <Button
        variant='outline'
        className={variant === 'inline' ? '' : 'justify-start w-full'}
        size={variant === 'inline' ? 'icon' : 'default'}
        onClick={() => window.open(shareLinks.facebook, '_blank')}
        title='Share on Facebook'
      >
        <FacebookIcon className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
        {variant === 'card' && 'Share on Facebook'}
      </Button>
      <Button
        variant='outline'
        className={variant === 'inline' ? '' : 'justify-start w-full'}
        size={variant === 'inline' ? 'icon' : 'default'}
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        title='Share on Twitter'
      >
        <TwitterIcon className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
        {variant === 'card' && 'Share on Twitter'}
      </Button>
      <Button
        variant='outline'
        className={variant === 'inline' ? '' : 'justify-start w-full'}
        size={variant === 'inline' ? 'icon' : 'default'}
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
        title='Share on LinkedIn'
      >
        <LinkedinIcon className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
        {variant === 'card' && 'Share on LinkedIn'}
      </Button>
      <Button
        variant='outline'
        className={variant === 'inline' ? '' : 'justify-start w-full'}
        size={variant === 'inline' ? 'icon' : 'default'}
        onClick={handleCopyLink}
        title={copySuccess ? 'Link Copied!' : 'Copy Link'}
      >
        <LinkIcon className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
        {variant === 'card' && (copySuccess ? 'Link Copied!' : 'Copy Link')}
      </Button>
    </div>
  )

  if (variant === 'inline') {
    return (
      <div className='space-y-3'>
        {showTitle && (
          <Typography variant='body2' weight='semibold'>
            Share this article
          </Typography>
        )}
        {buttons}
      </div>
    )
  }

  return (
    <Card>
      <CardContent className='pt-6'>
        {showTitle && (
          <Typography variant='h6' weight='semibold' className='mb-4'>
            Share this article
          </Typography>
        )}
        {buttons}
      </CardContent>
    </Card>
  )
}

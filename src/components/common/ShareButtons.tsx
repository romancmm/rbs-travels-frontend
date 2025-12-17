'use client'

import { Typography } from '@/components/common/typography'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Facebook, Link as LinkIcon, Linkedin, Twitter } from 'lucide-react'
import { useState } from 'react'

type ShareButtonsProps = {
  url: string
  title: string
  variant?: 'card' | 'inline'
  showTitle?: boolean
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
        <Facebook className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
        {variant === 'card' && 'Share on Facebook'}
      </Button>
      <Button
        variant='outline'
        className={variant === 'inline' ? '' : 'justify-start w-full'}
        size={variant === 'inline' ? 'icon' : 'default'}
        onClick={() => window.open(shareLinks.twitter, '_blank')}
        title='Share on Twitter'
      >
        <Twitter className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
        {variant === 'card' && 'Share on Twitter'}
      </Button>
      <Button
        variant='outline'
        className={variant === 'inline' ? '' : 'justify-start w-full'}
        size={variant === 'inline' ? 'icon' : 'default'}
        onClick={() => window.open(shareLinks.linkedin, '_blank')}
        title='Share on LinkedIn'
      >
        <Linkedin className={variant === 'inline' ? 'w-4 h-4' : 'mr-2 w-4 h-4'} />
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

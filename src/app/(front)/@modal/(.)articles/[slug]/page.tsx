'use client'

import ArticleDetails from '@/components/frontend/details/ArticleDetails'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface ModalArticlePageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ModalArticlePage({ params }: ModalArticlePageProps) {
  const router = useRouter()
  const { slug } = use(params)

  return (
    <Dialog
      open
      onOpenChange={(open) => {
        if (!open) {
          router.back()
        }
      }}
    >
      <DialogContent className='min-w-[80vw] max-h-[90vh] overflow-y-auto'>
        <ArticleDetails slug={slug} />
      </DialogContent>
    </Dialog>
  )
}

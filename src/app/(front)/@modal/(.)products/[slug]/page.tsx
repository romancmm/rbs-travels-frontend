'use client'

import ProductDetails from '@/components/frontend/details/ProductDetails'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface ModalProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ModalProductPage({ params }: ModalProductPageProps) {
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
      <DialogContent className='p-0 max-w-5xl max-h-[90vh] overflow-y-auto'>
        <ProductDetails slug={slug} />
      </DialogContent>
    </Dialog>
  )
}

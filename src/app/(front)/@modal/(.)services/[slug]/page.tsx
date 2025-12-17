'use client'

import ServiceDetails from '@/components/frontend/details/ServiceDetails'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface ModalServicePageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ModalServicePage({ params }: ModalServicePageProps) {
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
        <ServiceDetails slug={slug} />
      </DialogContent>
    </Dialog>
  )
}

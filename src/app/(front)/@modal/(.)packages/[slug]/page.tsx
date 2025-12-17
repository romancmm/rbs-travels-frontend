'use client'

import PackageDetails from '@/components/frontend/details/PackageDetails'
import { Dialog, DialogContent } from '@/components/ui/dialog'
import { useRouter } from 'next/navigation'
import { use } from 'react'

interface ModalPackagePageProps {
  params: Promise<{
    slug: string
  }>
}

export default function ModalPackagePage({ params }: ModalPackagePageProps) {
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
        <PackageDetails slug={slug} />
      </DialogContent>
    </Dialog>
  )
}

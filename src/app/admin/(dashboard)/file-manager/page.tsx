'use client'

import { FileManagerComponent } from '@/components/admin/file-manager'
import { Suspense } from 'react'

function FileManager() {
  return (
    <div className='flex flex-col w-full h-full overflow-hidden'>
      {/* Header */}
      {/* <PageHeader
        title='File Manager'
        subTitle='Manage your uploaded files and folders'
        className='shrink-0'
      /> */}

      {/* File Manager Content */}
      <div className='flex-1 min-h-0'>
        <FileManagerComponent />
      </div>
    </div>
  )
}

export default function FileManagerPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FileManager />
    </Suspense>
  )
}

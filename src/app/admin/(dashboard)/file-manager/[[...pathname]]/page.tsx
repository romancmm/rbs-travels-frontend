'use client'

import { FileManagerComponent } from '@/components/admin/file-manager'
import { Suspense } from 'react'

interface FileManagerPageProps {
  params: {
    pathname?: string[]
  }
}

function FileManager({ params }: FileManagerPageProps) {
  // Convert pathname array to path string
  // e.g., ['folder1', 'folder2'] -> '/folder1/folder2'
  const currentPath = params.pathname ? `/${params.pathname.join('/')}` : '/'

  return (
    <div className='flex flex-col w-full h-full overflow-hidden'>
      {/* File Manager Content */}
      <div className='flex-1 min-h-0'>
        <FileManagerComponent initialPath={currentPath} />
      </div>
    </div>
  )
}

export default function FileManagerPage({ params }: FileManagerPageProps) {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <FileManager params={params} />
    </Suspense>
  )
}

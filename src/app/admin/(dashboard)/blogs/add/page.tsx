'use client'

import BlogForm from '@/components/admin/form/Blog'
import PageHeader from '@/components/common/PageHeader'

function BlogCreateContent() {
  return (
    <div className='w-full max-w-full'>
      {/* Header */}
      <PageHeader title='Create New Blog Post' subTitle='Write and publish a new blog post' />

      {/* Form */}
      <BlogForm />
    </div>
  )
}

export default function BlogCreatePage() {
  return <BlogCreateContent />
}

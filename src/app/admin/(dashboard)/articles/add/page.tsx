'use client'

import ArticleForm from '@/components/admin/form/Article'
import PageHeader from '@/components/common/PageHeader'

function ArticleCreateContent() {
  return (
    <div className='w-full max-w-full'>
      {/* Header */}
      <PageHeader title='Create New Article Post' subTitle='Write and publish a new blog post' />

      {/* Form */}
      <ArticleForm />
    </div>
  )
}

export default function ArticleCreatePage() {
  return <ArticleCreateContent />
}

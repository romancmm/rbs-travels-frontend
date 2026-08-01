'use client'

import ArticleForm from '@/components/admin/form/Article'
import PageHeader from '@/components/common/PageHeader'
import useAsync from '@/hooks/useAsync'
import { useParams } from 'next/navigation'

export default function ArticleEditPage() {
  const params = useParams()
  const { data } = useAsync<{ data: Article }>(`/admin/articles/posts/${params.id}`)

  if (!data?.data) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Edit Post' subTitle='Update blog post information' />

      <ArticleForm initialData={data.data} />
    </div>
  )
}

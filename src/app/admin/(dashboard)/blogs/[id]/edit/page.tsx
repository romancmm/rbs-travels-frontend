'use client'

import BlogForm from '@/components/admin/form/Blog'
import PageHeader from '@/components/common/PageHeader'
import useAsync from '@/hooks/useAsync'
import { useParams } from 'next/navigation'

export default function BlogEditPage() {
  const params = useParams()
  const { data } = useAsync<{ data: Blog }>(`/admin/blogs/${params.id}`)

  if (!data?.data) {
    return <div>Loading...</div>
  }

  return (
    <div className='space-y-6'>
      <PageHeader title='Edit Post' subTitle='Update blog post information' />

      <BlogForm initialData={data.data} />
    </div>
  )
}

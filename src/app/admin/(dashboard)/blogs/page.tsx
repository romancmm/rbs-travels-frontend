'use client'

import { Suspense } from 'react'

import { CustomTable } from '@/components/admin/common/data-table'
import { blogColumns } from '@/components/admin/table/articles/article-columns'
import PageHeader from '@/components/common/PageHeader'
import Pagination from '@/components/common/Pagination'
import useAsync from '@/hooks/useAsync'
import type { PaginatedResponse } from '@/hooks/useFilter'
import { filterConfigs } from '@/plugins/filters/filterConfig'
import { FilterForm } from '@/plugins/filters/FilterForm'
import { useSearchFilters } from '@/plugins/filters/useSearchFilters'
import { blogsFilterSchema } from '@/validations/filter-schemas'

function ArticleList() {
  const { filters, setFilters, resetFilters, queryString } = useSearchFilters(blogsFilterSchema)

  const { data, loading, mutate } = useAsync<PaginatedResponse<Article>>(
    () => '/admin/articles/posts' + (queryString ? `?${queryString}` : '')
  )

  return (
    <div className='w-full max-w-full overflow-x-hidden'>
      {/* Header */}
      <PageHeader
        title='Article Posts'
        subTitle='Manage blog posts and articles'
        extra={
          <FilterForm
            fields={filterConfigs.blogs as FilterField[]}
            values={filters}
            onChange={setFilters}
            onReset={queryString ? resetFilters : undefined}
            addButton={{ href: '/admin/blogs/add' }}
          />
        }
      />

      {/* Table */}
      <CustomTable
        columns={blogColumns(mutate)}
        data={data?.data?.items ?? []}
        getRowId={(row: any) => row.id}
        emptyMessage={loading ? 'Loading blog posts...' : 'No blog posts found.'}
        className={loading ? 'opacity-50 pointer-events-none' : ''}
      />

      {/* Pagination */}
      <Pagination data={data?.pagination} limitOptions={[5, 10, 20, 50]} />
    </div>
  )
}

export default function ArticleListPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <ArticleList />
    </Suspense>
  )
}

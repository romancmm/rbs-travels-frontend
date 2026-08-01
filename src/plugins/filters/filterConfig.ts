const defaultFilter: FilterField[] = [
  { type: 'input', name: 'q', label: 'Search', placeholder: 'Filter by Name' }
]

// TODO: handle dynamic placeholder
const customerFilter = [
  { type: 'input', name: 'search', label: 'Search', placeholder: 'Filter by Name, Email or Phone' },
  {
    type: 'select-api',
    name: 'status',
    label: 'Active Status',
    placeholder: 'Filter by Active Status'
  }
]

export const filterConfigs = {
  default: [...defaultFilter],
  customer: customerFilter,
  articles: [
    ...defaultFilter,
    {
      type: 'select-api',
      name: 'categorySlugs',
      label: 'Category',
      placeholder: 'Filter by Category',
      url: '/admin/articles/categories?page=0&limit=50',
      options: (data: { data: { items: any[] } }) =>
        data?.data?.items?.map((item: any) => ({ label: item?.name, value: item?.slug })),
      multiple: true
    },
    {
      type: 'select',
      name: 'isPublished',
      label: 'Status',
      placeholder: 'Filter by Status',
      options: [
        { label: 'Published', value: 'true' },
        { label: 'Draft', value: 'false' }
      ]
    }
  ] satisfies FilterField[],
  articleCategories: [...defaultFilter]
}

const defaultFilter = [{ type: 'input', name: 'q', label: 'Search', placeholder: 'Filter by Name' }]

// TODO: handle dynamic placeholder
const customerFilter = [
  { type: 'input', name: 'q', label: 'Search', placeholder: 'Filter by Name, Email or Phone' },
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
  orders: [
    {
      type: 'select-api',
      name: 'status',
      label: 'Order Status',
      placeholder: 'Filter by Order Status'
    },
    {
      type: 'input',
      name: 'orderNumber',
      label: 'Order Number',
      placeholder: 'Filter by Order Number'
    },
    { type: 'input', name: 'phone', label: 'Phone Number', placeholder: 'Filter by Phone Number' }
  ],
  products: [
    ...defaultFilter,
    { type: 'input', name: 'barcode', label: 'Barcode', placeholder: 'Filter by Barcode' }
    // {
    //   type: 'select-api',
    //   name: 'brand',
    //   label: 'Brand',
    //   placeholder: 'Filter by Brand',
    //   url: '/admin/ecommerce/brands'
    // },
    // {
    //   type: 'select-api',
    //   name: 'category',
    //   label: 'Category',
    //   placeholder: 'Filter by Category',
    //   url: '/admin/ecommerce/categories?page=1&limit=12'
    //   // multiple: true
    // }
  ],
  categories: [
    ...defaultFilter,
    {
      type: 'select-api',
      name: 'parentSlug',
      label: 'Category',
      placeholder: 'Filter by Parent',
      url: '/admin/categories?page=1&limit=12',
      options: (data: { data: { items: Category[] } }) =>
        data?.data?.items?.map((item: Category) => ({ label: item?.name, value: item?.slug }))
    }
  ],
  blogs: [
    ...defaultFilter,
    {
      type: 'select-api',
      name: 'categorySlugs',
      label: 'Category',
      placeholder: 'Filter by category',
      url: '/admin/articles/categories?page=1&limit=12',
      options: (data: { data: { items: Category[] } }) =>
        data?.data?.items?.map((item: Category) => ({ label: item?.name, value: item?.slug }))
    }
  ],
  stocks: [
    // { type: 'input', name: 'sku', label: 'SKU', placeholder: 'Search by SKU' },
    {
      type: 'select-api',
      name: 'productId',
      label: 'Product',
      placeholder: 'Filter by Product',
      url: '/admin/ecommerce/products?page=1&limit=12'
    },
    {
      type: 'select-api',
      name: 'storeId',
      label: 'Store',
      placeholder: 'Filter by Store',
      url: '/admin/inventory/stores?page=1&limit=12',
      isMultiStore: false
    }
  ],
  reviews: [
    { type: 'input', name: 'rating', label: 'Rating', placeholder: 'Filter by Rating' },
    {
      type: 'select-api',
      name: 'productId',
      label: 'Store',
      placeholder: 'Filter by Product',
      url: '/admin/ecommerce/products?page=1&limit=12'
    },
    {
      type: 'select-api',
      name: 'userId',
      label: 'Variant',
      placeholder: 'Filter by User',
      url: '/admin/users?page=1&limit=12',
      options: (data: { data: User[] }) =>
        data?.data?.map((item: User) => ({
          label: item?.firstName,
          value: item?.id
        }))
    }
  ]
}

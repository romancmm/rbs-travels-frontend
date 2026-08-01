import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { HomepageFaqType } from '@/lib/validations/schemas/faqSettings'

export const homeFaqFields: FieldConfig<HomepageFaqType>[] = [
  { type: 'text', name: 'title', label: 'Title', placeholder: 'e.g., Frequently Asked Questions' },
  {
    type: 'text',
    name: 'subTitle',
    label: 'Subtitle',
    placeholder: 'e.g., Got Questions? We Have Answers'
  },
  {
    type: 'textarea',
    name: 'desc',
    label: 'Description',
    rows: 3,
    placeholder: 'Brief description about the FAQ section...',
    colSpan: 'full'
  },
  {
    type: 'array',
    name: 'faqs',
    emptyLabel: 'No FAQs yet. Get started by adding your first frequently asked question.',
    addLabel: 'Add FAQ',
    maxItems: 20,
    defaultItem: { question: '', answer: '' },
    itemLabel: (index) => `FAQ Item ${index + 1}`,
    itemFields: [
      {
        type: 'text',
        name: 'question',
        label: 'Question',
        placeholder: 'e.g., What services do you offer?',
        colSpan: 'full'
      },
      {
        type: 'textarea',
        name: 'answer',
        label: 'Answer',
        rows: 4,
        placeholder: 'Provide a detailed answer to the question...',
        colSpan: 'full'
      }
    ]
  }
]

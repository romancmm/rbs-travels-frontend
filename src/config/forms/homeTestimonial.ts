import type { FieldConfig } from '@/components/admin/common/dynamic-form'
import type { TestimonialSettings } from '@/lib/validations/schemas/testimonialSettings'

export const homeTestimonialFields: FieldConfig<TestimonialSettings>[] = [
  { type: 'text', name: 'title', label: 'Title', placeholder: 'e.g., What Our Clients Say' },
  { type: 'text', name: 'subtitle', label: 'Subtitle', placeholder: 'e.g., Client Testimonials' },
  {
    type: 'textarea',
    name: 'desc',
    label: 'Description',
    rows: 3,
    placeholder: 'e.g., Hear from our satisfied customers about their experiences.',
    colSpan: 'full'
  },
  {
    type: 'array',
    name: 'testimonials',
    emptyLabel: 'No testimonials yet. Get started by adding your first customer testimonial.',
    addLabel: 'Add Testimonial',
    maxItems: 10,
    defaultItem: { name: '', avatar: '', rating: 5, review: '', designation: '' },
    itemLabel: (index) => `Testimonial ${index + 1}`,
    itemFields: [
      { type: 'text', name: 'name', label: 'Customer Name', placeholder: 'e.g., John Doe' },
      {
        type: 'text',
        name: 'designation',
        label: 'Designation / Role',
        placeholder: 'e.g., Marketing Manager'
      },
      {
        type: 'textarea',
        name: 'review',
        label: 'Review / Testimonial',
        rows: 4,
        placeholder: 'Share what the customer said about your service...',
        colSpan: 'full'
      },
      { type: 'number', name: 'rating', label: 'Rating (1-5)' },
      { type: 'image', name: 'avatar', label: 'Customer Avatar' }
    ]
  }
]

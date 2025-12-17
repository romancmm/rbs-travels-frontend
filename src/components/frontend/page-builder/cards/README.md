# Grid Card Components

This directory contains reusable card components that can be used in the grid layout component.

## Available Card Types

- **BlogCard** - Blog post/article card
- **ProductCard** - E-commerce product card
- **ServiceCard** - Service offering card
- **TourPackageCard** - Travel package card
- **TestimonialCard** - Customer testimonial card
- **TeamMemberCard** - Team member profile card
- **PricingCard** - Pricing tier card
- **IconBox** - Icon with text box
- **FeatureCard** - Feature highlight card
- **PortfolioCard** - Portfolio/project card

## Usage

### In API Mode

The grid component will fetch data from API and render cards automatically:

```tsx
{
  type: 'grid',
  props: {
    dataSource: 'api',
    apiEndpoint: '/api/blog',
    cardType: 'BlogCard',
    columns: 3
  }
}
```

### In Manual Mode

Define individual grid items with specific card types and props:

```tsx
{
  type: 'grid',
  props: {
    dataSource: 'manual',
    gridItems: [
      {
        id: '1',
        order: 0,
        cardType: 'BlogCard',
        props: {
          title: 'My Blog Post',
          excerpt: 'Post description...',
          image: '/images/blog1.jpg',
          author: 'John Doe',
          date: '2024-01-01'
        }
      },
      {
        id: '2',
        order: 1,
        cardType: 'ProductCard',
        props: {
          title: 'Product Name',
          price: 99.99,
          image: '/images/product.jpg'
        }
      }
    ]
  }
}
```

## Creating New Card Components

1. Create a new file in this directory (e.g., `BlogCard.tsx`)
2. Export the component with proper typing
3. Register it in `index.ts`
4. Add the type to `GridCardType` in `/types/page-builder.ts`

Example:

```tsx
// BlogCard.tsx
export interface BlogCardProps {
  title: string
  excerpt?: string
  image?: string
  author?: string
  date?: string
  category?: string
}

export function BlogCard({ title, excerpt, image, author, date }: BlogCardProps) {
  return <div className='card'>{/* Card content */}</div>
}
```

Then register in `index.ts`:

```tsx
import { BlogCard } from './BlogCard'

export const cardComponents = {
  BlogCard: BlogCard
  // ... other cards
}
```

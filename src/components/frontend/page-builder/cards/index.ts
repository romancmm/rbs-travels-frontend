/**
 * Grid Card Components
 * Reusable card components that can be used in grid layouts
 */

import { GridCardType } from '@/types/page-builder'

// Card component imports
// import { BlogCard } from './BlogCard'
// import { ProductCard } from './ProductCard'
// import { ServiceCard } from './ServiceCard'
// ... etc

/**
 * Card component registry
 * Maps card type to actual component
 */
export const cardComponents: Record<GridCardType, any> = {
  BlogCard: null, // () => import('./BlogCard').then(m => m.BlogCard)
  ProductCard: null,
  ServiceCard: null,
  TourPackageCard: null,
  TestimonialCard: null,
  TeamMemberCard: null,
  PricingCard: null,
  IconBox: null,
  FeatureCard: null,
  PortfolioCard: null,
  custom: null
}

/**
 * Get card component by type
 */
export function getCardComponent(cardType: GridCardType) {
  return cardComponents[cardType] || cardComponents.custom
}

/**
 * Render a card component with props
 */
export function renderCard(cardType: GridCardType, props: Record<string, any>) {
  const CardComponent = getCardComponent(cardType)

  if (!CardComponent) {
    // Return placeholder if card component not implemented
    return {
      type: 'div',
      props: {
        className: 'p-4 border rounded bg-gray-50',
        children: `${cardType} (Not implemented)`
      }
    }
  }

  return CardComponent(props)
}

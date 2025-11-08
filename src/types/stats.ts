/**
 * Represents a single statistic item
 */
export interface StatItem {
  /** The value to display (e.g. "1.6k+", "98%") */
  value: string
  /** The label describing the statistic (e.g. "Happy Travelers") */
  label?: string
  /** The icon (can be a Lucide icon name or image URL) */
  icon?: string
}

/**
 * Props for the Stats component
 */
export interface StatsProps {
  /** Array of statistics to display */
  data?: StatItem[]
  /** Optional loading state */
  isLoading?: boolean
  /** Optional className for styling */
  className?: string
}

/**
 * Props for individual StatItem component
 */
export interface StatItemProps extends StatItem {
  /** Optional className for styling */
  className?: string
  /** Optional index for animation delay */
  index?: number
}

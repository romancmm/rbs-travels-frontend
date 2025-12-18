# CMS Dashboard Components

Interactive and animated dashboard components for the NODE CMS admin panel.

## Components Overview

### 1. WelcomeBanner

Dynamic greeting banner with real-time statistics.

**Features:**

- Time-based greeting (Good Morning/Afternoon/Evening)
- Animated sparkle icon
- Quick stats display (Growth, Users, Pages)
- Gradient background with hover effects

**Usage:**

```tsx
<WelcomeBanner userName='Admin' />
```

### 2. QuickStatsCard

Displays key metrics with trend indicators.

**Props:**

- `title`: Stat label
- `value`: Stat value (string | number)
- `icon`: Lucide icon component
- `trend`: Optional trend data (value, isPositive)
- `color`: Card accent color (primary | accent | success | warning | danger)
- `delay`: Animation delay

**Features:**

- Hover lift animation
- Color-coded icons
- Trend indicators with percentages
- Smooth entrance animations

### 3. QuickActionCard

Call-to-action cards for common tasks.

**Features:**

- Gradient backgrounds
- Hover scale effects
- Arrow indicator on hover
- Links to admin pages

### 4. FeatureGrid

Grid layout for CMS features with customizable columns.

**Props:**

- `features`: Array of feature objects
- `columns`: Grid columns (2 | 3 | 4)

**Feature Object:**

- `id`: Unique identifier
- `title`: Feature name
- `description`: Feature description
- `icon`: Lucide icon
- `href`: Link URL
- `badge`: Optional badge text
- `color`: Color theme

### 5. RecentActivityCard

Display recent system activities with type indicators.

**Features:**

- Activity timeline
- Type-based badges (create, update, delete)
- User attribution
- Timestamp display
- Empty state handling

### 6. SystemHealthCard

Real-time system metrics with status indicators.

**Features:**

- Health status badges
- Progress bars with color coding
- Warning/Critical alerts
- Animated metric updates

### 7. AnalyticsChartCard

Animated bar chart for data visualization.

**Features:**

- Horizontal bar charts
- Trend indicators
- Total value display
- Smooth bar animations
- Responsive design

## Animations

All components use Framer Motion (`motion/react`) for:

- Entrance animations (fade, slide, scale)
- Hover effects (lift, scale)
- Staggered list animations
- Progress bar animations

## Color System

Components support multiple color themes:

- `primary`: Blue theme
- `accent`: Purple/Pink theme
- `success`: Green theme
- `warning`: Yellow theme
- `danger`: Red theme
- `purple`: Purple theme
- `pink`: Pink theme

## Responsive Design

All components are fully responsive with:

- Mobile-first approach
- Tailwind breakpoints (sm, md, lg, xl)
- Flexible grid layouts
- Adaptive spacing

## Example Dashboard Layout

```tsx
<div className='space-y-6'>
  <WelcomeBanner userName='Admin' />

  {/* Stats Grid */}
  <div className='grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4'>
    {stats.map((stat, i) => (
      <QuickStatsCard key={i} {...stat} delay={i * 0.1} />
    ))}
  </div>

  {/* Quick Actions */}
  <div className='grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4'>
    {actions.map((action, i) => (
      <QuickActionCard key={i} {...action} />
    ))}
  </div>

  {/* Feature Grid */}
  <FeatureGrid features={features} columns={4} />

  {/* Activity & Health */}
  <div className='grid grid-cols-1 lg:grid-cols-2 gap-4'>
    <RecentActivityCard activities={activities} />
    <SystemHealthCard metrics={metrics} />
  </div>

  {/* Analytics */}
  <AnalyticsChartCard
    title='Page Views'
    data={analyticsData}
    trend={{ value: 12.5, isPositive: true }}
  />
</div>
```

## Performance

- Optimized animations with GPU acceleration
- Lazy loading support
- Memoized components where applicable
- Efficient re-renders

## Customization

All components accept standard className props and can be styled with Tailwind CSS utilities.

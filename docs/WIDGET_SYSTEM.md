# Page Builder Widget System

Complete widget library similar to Joomla modules and Elementor elements.

## Widget Categories

### 1. Basic Widgets

Essential building blocks for any page.

#### Heading (`heading`)

- H1-H6 headings with customizable styling
- Text alignment, color, font size, weight
- Line height control

#### Text (`text`)

- Paragraph text with rich formatting options
- Alignment, color, size controls
- Line height adjustments

#### Button (`button`)

- Call-to-action buttons
- Multiple variants: primary, secondary, outline, ghost, link
- Size options: small, medium, large
- Full width option
- Link configuration with new tab support

#### Image (`image`)

- Single image with responsive options
- Alt text for accessibility
- Object fit controls (cover, contain, fill)
- Optional linking
- Lazy loading support

#### Spacer (`spacer`)

- Vertical spacing control
- Configurable height

#### Divider (`divider`)

- Horizontal line separator
- Customizable width, thickness, color
- Line styles: solid, dashed, dotted
- Alignment options

#### Icon Box (`icon-box`)

- Icon with title and description
- Multiple icon sources (Lucide, custom, emoji)
- Vertical/horizontal layouts
- Hover effects

---

### 2. Form Widgets

Interactive forms for user engagement.

#### Contact Form (`contact-form`)

- **Fields:** Name, Email, Phone, Subject, Message
- Configurable field visibility
- Two layout modes: stacked, two-column
- Label positions: top, left, floating
- Custom success/error messages
- API endpoint configuration

**Use Cases:**

- Contact pages
- Support requests
- General inquiries

#### Newsletter Subscribe (`newsletter`)

- Email subscription form
- Inline or stacked layout
- Optional name field
- GDPR compliance checkbox
- Success message customization

**Use Cases:**

- Newsletter signups
- Marketing campaigns
- Email list building

#### Search (`search`)

- Search input with autocomplete
- Configurable button visibility
- Multiple sizes and variants
- Minimum character triggers
- Max suggestions limit

**Use Cases:**

- Site-wide search
- Product search
- Content filtering

---

### 3. Media Widgets

Rich media content display.

#### Video (`video`)

- YouTube, Vimeo, or uploaded videos
- Autoplay, controls, loop options
- Mute capability
- Aspect ratio control

**Use Cases:**

- Video tutorials
- Promotional videos
- Embedded content

#### Photo Gallery (`gallery`)

- Multiple layouts: grid, masonry, justified
- Configurable columns (1-6)
- Lightbox functionality
- Image captions
- Category filtering
- Load more pagination

**Use Cases:**

- Portfolio showcase
- Product galleries
- Photo albums
- Event galleries

#### Google Map (`map`)

- Interactive Google Maps embed
- Custom markers with descriptions
- Multiple map types (roadmap, satellite, hybrid, terrain)
- Zoom controls
- Street view and fullscreen options
- Custom styling themes

**Use Cases:**

- Contact pages
- Store locations
- Event venues
- Service areas

---

### 4. Dynamic Content Widgets

Data-driven content displays.

#### Blog Grid (`blog-grid`)

- Display blog posts in grid/list/masonry layouts
- 2-4 column configurations
- Show/hide: featured image, excerpt, author, date, category
- Pagination or load more
- Category filtering
- Sorting options
- Card styles: default, minimal, bordered, elevated
- Hover effects

**Use Cases:**

- Blog listing pages
- News sections
- Article archives

#### Blog Carousel (`blog-carousel`)

- Blog posts in slider/carousel
- 1-4 slides per view
- Autoplay with configurable delay
- Navigation arrows and pagination dots
- Space between slides

**Use Cases:**

- Featured articles
- Latest posts slider
- Related posts

#### Product Grid (`product-grid`)

- Products/Services/Packages display
- Grid or list layouts
- 2-4 columns
- Show/hide: image, title, price, description, rating
- Add to cart buttons
- Category and price filtering
- Multiple sort options

**Use Cases:**

- E-commerce product listings
- Service catalogs
- Package offerings

#### Tour Packages (`tour-packages`)

- Travel-specific package display
- Duration and destination info
- Rating display
- Booking CTA buttons
- Filter by destination, duration, price

**Use Cases:**

- Travel agency websites
- Tour operator platforms
- Destination guides

#### Testimonials (`testimonials`)

- Customer reviews and feedback
- Grid, carousel, list, or masonry layouts
- Avatar display (circle, square, rounded)
- Show/hide: name, role, rating, date
- Quote icon option
- Multiple card styles

**Use Cases:**

- Social proof sections
- Customer reviews
- Case studies

#### FAQ (`faq`)

- Frequently asked questions
- Accordion, grid, or list layouts
- Multiple open support
- Search functionality
- Category filtering

**Use Cases:**

- Help centers
- Support pages
- Knowledge bases

#### Stats Counter (`stats`)

- Animated number counters
- Multiple layouts: grid, row, vertical
- 2-6 columns
- Icon support
- Prefix/suffix for numbers (e.g., +, %, $)
- Animate on scroll

**Use Cases:**

- Achievement displays
- Company milestones
- Data highlights

---

### 5. Layout Widgets

Content organization tools.

#### Tabs (`tabs`)

- Tabbed content sections
- Multiple styles: default, pills, underline
- Icon support
- Alignment options
- Default tab selection

**Use Cases:**

- Product specifications
- Multi-section content
- Feature comparisons

#### Accordion (`accordion`)

- Collapsible content panels
- Multiple open support
- Default open item
- Styles: default, bordered, minimal
- Icon positioning

**Use Cases:**

- FAQs
- Content organization
- Mobile-friendly sections

---

### 6. Advanced Widgets

Enhanced functionality and integrations.

#### Social Share (`social-share`)

- Share buttons for social platforms
- Platforms: Facebook, Twitter, LinkedIn, WhatsApp, Email, Pinterest
- Layouts: horizontal, vertical, floating
- Styles: icons, buttons, labels
- Share count display

**Use Cases:**

- Blog posts
- Product pages
- Content sharing

#### Social Feed (`social-feed`)

- Display social media posts
- Platforms: Instagram, Twitter, Facebook
- Grid, carousel, or list layouts
- Show engagement metrics
- API caching

**Use Cases:**

- Social proof
- Instagram feeds
- Twitter timelines

#### Pricing Table (`pricing`)

- Pricing plans comparison
- Cards or table layout
- Highlight popular plans
- Feature lists
- CTA buttons per plan
- Monthly/yearly toggle option

**Use Cases:**

- SaaS pricing
- Membership plans
- Package comparisons

#### Countdown Timer (`countdown`)

- Event/offer countdown
- Show days, hours, minutes, seconds
- Multiple layouts and sizes
- Expired message
- Optional redirect on expiry

**Use Cases:**

- Limited time offers
- Event countdowns
- Sale timers
- Launch dates

---

## Technical Implementation

### Widget Registration

All widgets are registered in the component registry with:

- Type and metadata
- Default props
- Zod schema validation
- Property panel definitions

### Widget File Structure

```
src/lib/page-builder/widgets/
├── index.ts                  # Main export
├── form-widgets.ts          # Form components
├── content-widgets.ts       # Dynamic content
├── interactive-widgets.ts   # Interactive elements
└── social-widgets.ts        # Social & advanced
```

### Adding New Widgets

1. Create widget definition with `componentRegistry.register()`
2. Define props schema with Zod
3. Create property panels configuration
4. Import in `widgets/index.ts`
5. Implement renderer component

### Widget Categories

- `basic` - Basic building blocks
- `form` - Form elements
- `media` - Media content
- `dynamic` - Data-driven content
- `layout` - Layout tools
- `advanced` - Advanced features

## Usage in Page Builder

All widgets are available in the ComponentsSidebar and can be:

- Dragged into columns
- Configured via PropertiesPanel
- Styled with visual controls
- Saved with className-based styling

## API Integration

Widgets with dynamic content require API endpoints:

- Blog/Articles: `/api/blog`
- Products: `/api/products`
- Packages: `/api/packages`
- Testimonials: `/api/testimonials`
- FAQ: `/api/faq`
- Gallery: `/api/gallery`
- Social Feed: `/api/social-feed`
- Newsletter: `/api/newsletter`
- Contact: `/api/contact`

## Best Practices

1. **Performance**: Use pagination and lazy loading for dynamic widgets
2. **Accessibility**: Always provide alt text, ARIA labels
3. **Responsive**: Test widgets on mobile, tablet, desktop
4. **SEO**: Use semantic HTML and proper heading hierarchy
5. **Caching**: Implement caching for API-driven widgets
6. **Error Handling**: Show fallback UI for failed API calls

## Future Enhancements

- [ ] Custom widget builder
- [ ] Widget templates
- [ ] A/B testing support
- [ ] Analytics integration
- [ ] Animation controls
- [ ] Conditional display rules
- [ ] User role permissions
- [ ] Multi-language support

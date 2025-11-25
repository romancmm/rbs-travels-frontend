# Professional Page Builder Architecture

## 🎯 Vision

Build a production-grade, scalable drag-and-drop page builder comparable to Builder.io and Elementor, serving as the core CMS feature for Next.js applications.

## 🏗️ Architecture Overview

### Core Principles

1. **Performance First**: SSR-friendly, optimized rendering, lazy loading
2. **Scalability**: Extensible component system, plugin architecture
3. **Type Safety**: Strict TypeScript, Zod validation
4. **Developer Experience**: Clean API, comprehensive docs
5. **User Experience**: Intuitive UI, real-time preview, keyboard shortcuts

## 📐 Data Structure

### Hierarchical Content Model

```
Page
 └─ Sections (Containers)
     └─ Rows (Layout containers)
         └─ Columns (Grid system)
             └─ Components (Renderable elements)
```

### JSON Schema

```typescript
{
  sections: Section[]
}

Section {
  id: string (UUID)
  name: string
  order: number
  settings: SectionSettings
  rows: Row[]
}

Row {
  id: string (UUID)
  order: number
  settings: RowSettings
  columns: Column[]
}

Column {
  id: string (UUID)
  width: number (1-12, Bootstrap grid)
  order: number
  settings: ColumnSettings
  components: Component[]
}

Component {
  id: string (UUID)
  type: ComponentType
  order: number
  props: Record<string, any>
  settings: ComponentSettings
}
```

## 🎨 Component System

### Component Categories

1. **Basic Components**

   - Text (rich text editor)
   - Heading (H1-H6)
   - Button (with variants)
   - Image (with lazy loading)
   - Spacer
   - Divider

2. **Media Components**

   - Video (YouTube, Vimeo, upload)
   - Gallery (grid, carousel)
   - Icon
   - Background Image

3. **Layout Components**

   - Container
   - Grid
   - Tabs
   - Accordion
   - Card

4. **Dynamic Components**
   - Article Posts List
   - Categories
   - Contact Form
   - Newsletter
   - Testimonials

### Component Definition Schema

```typescript
interface ComponentDefinition {
  type: string
  label: string
  icon: React.ComponentType
  category: ComponentCategory
  description: string
  defaultProps: Record<string, any>
  propSchema: ZodSchema
  previewImage?: string

  // Render function
  render: (props: any) => React.ReactNode

  // Property panel configuration
  propertyPanels: PropertyPanel[]

  // Constraints
  allowedParents?: string[]
  allowedChildren?: string[]
  maxInstances?: number
}
```

## 🚀 Technology Stack

### Core Libraries

- **@dnd-kit**: Modern drag-and-drop (accessibility, touch support)
- **Zustand**: Lightweight state management
- **react-hook-form + Zod**: Form handling with validation
- **TipTap**: Rich text editor (extensible, performant)
- **Radix UI**: Accessible component primitives
- **Framer Motion**: Smooth animations

### Architecture Patterns

- **Command Pattern**: For undo/redo system
- **Factory Pattern**: Component creation
- **Observer Pattern**: State subscriptions
- **Strategy Pattern**: Different rendering strategies

## 🎛️ Builder Interface

### Layout Structure

```
┌─────────────────────────────────────────────────────┐
│  Header (Save, Publish, Preview, Settings)          │
├──────┬──────────────────────────────────┬───────────┤
│      │                                  │           │
│ Com- │         Canvas Area              │ Property  │
│ pon- │      (Visual Editor)             │ Panel     │
│ ents │                                  │ (Inspector│
│      │                                  │           │
│ Side-│  - Sections                      │ - Styling │
│ bar  │  - Rows                          │ - Content │
│      │  - Columns                       │ - Settings│
│      │  - Components                    │           │
│      │                                  │           │
├──────┴──────────────────────────────────┴───────────┤
│  Footer (Layers, History, Device Modes)             │
└─────────────────────────────────────────────────────┘
```

### Key Features

#### 1. Components Sidebar

- Searchable component library
- Category filters
- Drag components to canvas
- Recently used components
- Custom component templates

#### 2. Canvas Editor

- Live WYSIWYG preview
- Click to select elements
- Hover effects with element info
- Inline editing for text
- Visual indicators (margins, padding)
- Responsive breakpoint simulator
- Zoom controls (50%-200%)

#### 3. Properties Panel

Context-aware panels based on selected element:

- **Content Tab**: Edit text, images, links
- **Style Tab**: Colors, typography, spacing
- **Advanced Tab**: Custom CSS, animations, conditions

#### 4. Toolbar Actions

- Undo/Redo (Ctrl+Z, Ctrl+Y)
- Copy/Paste (Ctrl+C, Ctrl+V)
- Duplicate (Ctrl+D)
- Delete (Delete/Backspace)
- Save Draft (Ctrl+S)
- Publish
- Preview (opens in new tab)

#### 5. Layers Panel (Bottom)

- Tree view of page structure
- Show/hide sections
- Lock/unlock editing
- Quick navigation
- Drag to reorder

## 🔄 State Management

### Zustand Store Structure

```typescript
interface BuilderStore {
  // Content
  page: PageLayout | null
  content: PageContent

  // Selection
  selectedElementId: string | null
  hoveredElementId: string | null

  // History
  history: {
    past: PageContent[]
    future: PageContent[]
    canUndo: boolean
    canRedo: boolean
  }

  // UI State
  previewMode: 'desktop' | 'tablet' | 'mobile'
  zoom: number
  showGrid: boolean
  showOutlines: boolean

  // Operations
  isDirty: boolean
  isSaving: boolean
  lastSaved: Date | null

  // Actions
  updateContent: (content: PageContent) => void
  selectElement: (id: string | null) => void
  addComponent: (parentId: string, component: Component) => void
  deleteElement: (id: string) => void
  moveElement: (id: string, newParentId: string, newIndex: number) => void
  updateProps: (id: string, props: Record<string, any>) => void
  undo: () => void
  redo: () => void
  save: () => Promise<void>
  publish: () => Promise<void>
}
```

## 🎯 Drag & Drop System

### @dnd-kit Configuration

#### Sensors

- Mouse sensor (desktop)
- Touch sensor (mobile/tablet)
- Keyboard sensor (accessibility)

#### Drop Zones

1. **Section Drop Zone**: Add new sections
2. **Row Drop Zone**: Add rows within sections
3. **Column Drop Zone**: Add columns within rows
4. **Component Drop Zone**: Add components to columns

#### Drag States

- `dragging`: Element being dragged
- `over`: Drop zone being hovered
- `active`: Currently active drag operation

#### Visual Feedback

- Drag preview (ghost image)
- Drop indicators (blue line)
- Valid/invalid drop zones (green/red)
- Scroll on edge (auto-scroll)

## 📝 Property Panels

### Panel Types

1. **Text Editor Panel**

   - Rich text editor (TipTap)
   - Font family, size, weight
   - Color picker
   - Alignment
   - Line height, letter spacing

2. **Image Panel**

   - Upload/URL
   - Alt text
   - Dimensions
   - Object fit
   - Lazy loading
   - Filters

3. **Spacing Panel**

   - Margin (T, R, B, L)
   - Padding (T, R, B, L)
   - Visual box model

4. **Background Panel**

   - Color/Gradient
   - Image
   - Video
   - Patterns

5. **Border Panel**

   - Width, style, color
   - Radius (all/individual corners)

6. **Animation Panel**
   - Entrance animations
   - Scroll animations
   - Hover effects

## 🔧 Implementation Plan

### Phase 1: Foundation (Week 1-2)

- [x] Design type system and interfaces
- [ ] Set up Zustand store structure
- [ ] Implement basic JSON operations (add/delete/move)
- [ ] Create basic UI layout

### Phase 2: Drag & Drop (Week 3-4)

- [ ] Integrate @dnd-kit
- [ ] Implement drop zones for all levels
- [ ] Add drag previews and indicators
- [ ] Test with keyboard and touch

### Phase 3: Component System (Week 5-6)

- [ ] Create component registry
- [ ] Implement basic components (Text, Image, Button, etc.)
- [ ] Build component renderer for canvas
- [ ] Add component property panels

### Phase 4: Advanced Features (Week 7-8)

- [ ] Undo/redo system
- [ ] Copy/paste functionality
- [ ] Layers panel
- [ ] Responsive editing

### Phase 5: Polish & Optimization (Week 9-10)

- [ ] Performance optimization
- [ ] Accessibility improvements
- [ ] Documentation
- [ ] User testing and feedback

## 📊 Performance Optimizations

### Rendering

- Use `React.memo` for canvas elements
- Virtual scrolling for long pages
- Lazy load images and media
- Debounce property updates

### State Updates

- Immer for immutable updates
- Batch updates where possible
- Only re-render affected components

### Data Management

- Auto-save with debounce (3 seconds)
- Compress history snapshots
- Limit history size (50 steps)

## 🔒 Data Validation

### Zod Schemas

```typescript
const ComponentSchema = z.object({
  id: z.string().uuid(),
  type: z.enum([...componentTypes]),
  order: z.number().min(0),
  props: z.record(z.any()),
  settings: z.object({...})
})

const ColumnSchema = z.object({
  id: z.string().uuid(),
  width: z.number().min(1).max(12),
  order: z.number().min(0),
  settings: z.object({...}),
  components: z.array(ComponentSchema)
})

// ... and so on
```

## 🎓 Best Practices

1. **Always validate JSON content before rendering**
2. **Use TypeScript strict mode**
3. **Keep component logic separate from builder logic**
4. **Test with large pages (50+ components)**
5. **Support keyboard navigation throughout**
6. **Provide clear error messages**
7. **Auto-save frequently**
8. **Allow easy rollback/recovery**

## 🚢 Deployment Considerations

### Frontend Renderer

- Server-side render JSON to HTML
- Cache rendered pages (Redis)
- CDN distribution
- Lazy load below-fold content

### Builder Editor

- Code splitting for builder UI
- Only load editor dependencies when needed
- Separate bundle from public site

### API Endpoints

```
POST   /admin/pages              # Create page
GET    /admin/pages/:id          # Get page (with draftContent)
PUT    /admin/pages/:id          # Update draft
POST   /admin/pages/:id/publish  # Publish page
POST   /admin/pages/:id/saveDraft # Save draft
GET    /pages/:slug              # Public page (uses publishedContent)
```

## 📚 Further Reading

- [@dnd-kit Documentation](https://docs.dndkit.com)
- [TipTap Editor](https://tiptap.dev)
- [Builder.io Architecture](https://www.builder.io/c/docs)
- [Contentful Page Modelling](https://www.contentful.com/developers/docs/concepts/data-model/)

---

**This is a living document. Update as architecture evolves.**

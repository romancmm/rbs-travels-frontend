# 🧩 CMS Backend Specification — Menu & Page Builder System

**Tech Stack:** Node.js + Express.js + postgresql

---

## 1. Overview

This document defines the backend requirements for a **modular CMS system** inspired by **Joomla** and **Elementor/Helix Page Builder**.  
It supports:

- Multiple **menus** (header, footer, sidebar, etc.)
- **Nested/multi-level menu items**
- **Page builder** for custom sections, rows, columns, and prebuilt widgets.

---

## 2. Menu Management

### 2.1 Menu Types

Each menu represents a group of navigational links.  
Examples:

- `Main Menu`
- `Footer Menu`
- `Sidebar Menu`

### 2.2 Menu Item Types

Each menu item will have a `type` field specifying its behavior.

| Type             | Description                           | Example Target                    |
| ---------------- | ------------------------------------- | --------------------------------- |
| `custom-link`    | Manual external/internal URL          | `/about` or `https://example.com` |
| `category-blogs` | Auto-link to a category blog list     | `/articles/category/:slug`        |
| `custom-page`    | Link to a page built via page builder | `/page/:slug`                     |
| `article`        | Link to a single article              | `/article/:slug`                  |

### 2.3 Menu Schema (Example)

```ts
{
  _id: ObjectId,
  name: string,                 // e.g. "Header Menu"
  slug: string,                 // e.g. "main-menu"
  items: [
    {
      _id: ObjectId,
      title: string,
      type: 'custom-link' | 'category-blogs' | 'custom-page' | 'article',
      link: string,             // target URL or slug
      parentId: ObjectId | null, // null for root
      order: number,
      children: [MenuItem],     // recursive
      status: 'published' | 'draft',
      icon?: string,
      target?: '_blank' | '_self',
      meta?: object
    }
  ],
  createdAt: Date,
  updatedAt: Date
}
```

2.4 Features

Add/update/delete menus.

Nesting support (multi-level submenus).

Assign menus to positions: header, footer, sidebar, etc.

Order management for menu items.

3. Page Builder System
   3.1 Concept

A drag & drop visual builder like Elementor or Joomla Helix.

Each page consists of Sections → Rows → Columns → Components.

3.2 Page Schema
{
\_id: ObjectId,
title: string,
slug: string,
layout: [Section],
createdAt: Date,
updatedAt: Date,
status: 'draft' | 'published'
}

3.3 Section Schema
{
id: string,
name: string, // e.g. "Product Section"
settings: {
backgroundColor?: string,
backgroundImage?: string,
padding?: string,
margin?: string,
},
rows: [Row]
}

3.4 Row Schema
{
id: string,
columns: [Column],
settings?: {
columnsGap?: string,
background?: string
}
}

3.5 Column Schema
{
id: string,
width: number, // e.g. 12, 6, 4 (bootstrap style grid)
content: [Component]
}

3.6 Component Schema
{
id: string,
type: string, // e.g. "text", "image", "rich-text", "product-card", etc.
props: object, // component-specific data
}

4. Supported Components (Initial Phase)
   Component Description Configurable Props
   text Plain text text, style
   rich-text HTML content content, style
   image Image block src, alt, style
   gallery Image grid images[], columns
   banner Hero/banner section title, subtitle, image, cta
   carousel Image/Content carousel slides[], interval
   product-card Dynamic API-driven cards apiEndpoint, dataMap, variant, size
   service-list List of services apiEndpoint, dataMap
   testimonial Testimonial slider apiEndpoint, dataMap
5. Dynamic API Integration

For API-driven components (like product-card, service-list):
Each component can define:

{
apiEndpoint: '/products?featured=true',
dataMap: 'data.data.products', // how to access array from response
}

The backend returns structured component config to the frontend for rendering.

6. Admin Dashboard Features

✅ Manage multiple menus (header, footer, sidebar)
✅ Manage nested menu items
✅ Create & edit custom pages via drag-and-drop builder
✅ Add prebuilt sections (gallery, banners, products, etc.)
✅ Define API endpoints for dynamic widgets
✅ Preview before publishing

7. Frontend Rendering Logic

Fetch page data (via /pages/:slug)

Parse layout JSON recursively:

Section → Row → Column → Component

Render React components dynamically using mapping (e.g., type: 'product-card' → <ProductCard {...props} />)

8. Integration References

Page builder engine inspiration:

Craft.js

Builder.io

Menu structure reference: Joomla-style hierarchical menus.

9. API Endpoints (Examples)
   Method Endpoint Description
   GET /menus Fetch all menus
   POST /menus Create new menu
   PUT /menus/:id Update menu
   DELETE /menus/:id Delete menu
   GET /pages/:slug Fetch page layout by slug
   POST /pages Create new page
   PUT /pages/:id Update page layout
   DELETE /pages/:id Delete page
10. Scalability Notes

Store layout JSON in postgresql as flexible schema.

Support versioning (draft/published).

Support multi-language via locale field.

Allow custom plugins/components registration in future.

✅ Goal:
A scalable, Joomla-like CMS for Next.js frontend — powered by Node.js backend — enabling fully dynamic menu & page structures with customizable layouts and reusable API-driven components.

# CMS Structure Instructions (Frontend - React/Next.js)

## Overview

This document defines the frontend architecture and behavior for a **modular CMS-driven website** built using **React.js/Next.js**.  
The system will handle **multi-level menus**, **multiple menu types**, and a **visual page builder** similar to **Joomla Shaper Helix** or **Elementor**.  
The architecture must be flexible, scalable, and fully dynamic (driven by API configuration or JSON schema).

---

## 🧭 MENU SYSTEM (Joomla-like)

### Menu Groups / Locations

There can be multiple independent menus:

- **Header/Main Menu**
- **Footer Menu**
- **Sidebar Menu**
- **Other custom menus**

Each menu will have its own **unique key/identifier** (e.g., `"main_menu"`, `"footer_menu"`, `"sidebar_menu"`).

### Menu Structure

Each menu supports **multi-level (nested) items**.

**Example Structure:**

```json
[
  {
    "id": 1,
    "title": "Home",
    "type": "custom_link",
    "link": "/",
    "children": []
  },
  {
    "id": 2,
    "title": "Article",
    "type": "category_blogs",
    "categoryId": "news",
    "children": [
      {
        "id": 3,
        "title": "Tech",
        "type": "category_blogs",
        "categoryId": "tech",
        "children": []
      }
    ]
  },
  {
    "id": 4,
    "title": "About Us",
    "type": "custom_page",
    "pageId": "about-us",
    "children": []
  }
]
```

### Supported Menu Types

- Custom Link → Direct external or internal URL.
- Category Articles → Dynamically fetch blog posts by category.
- Custom Page → Render a page built using the page builder (dynamic layout).
- Article → Render a single article/post by slug or ID.

### 🧩 PAGE BUILDER SYSTEM (Elementor/Helix-like)

#### Core Concept

Pages are composed of Sections → Rows → Columns → Elements.
Each node has configurable attributes, styling, and child relationships.

##### Hierarchy Example:

```
Page
 └── Section (About Section)
      ├── Row (1)
      │    └── Column (12)
      │         ├── Text (Section Heading)
      │         └── Text (Section Description)
      └── Row (2)
           ├── Column (6)
           │    ├── RichText (About Title)
           │    └── Text (About Text)
           └── Column (6)
                └── Image (About Image)

```

## 🧠 BUILDER FUNCTIONALITY

Admin Features

- ##### Add Section

  Each section can have background, padding, margin, custom class, and ID.

- ##### Add Row

  Can define column layout (e.g., 12, 6-6, 4-4-4, etc.).

- ##### Add Column

  Columns hold content blocks (elements/components).

- ##### Add Element

  Choose from predefined components such as:

- Text / Heading
- Rich Text / HTML Block
- Image / Video
- Button / Link
- Spacer / Divider
- Icon Box / Counter
- Gallery
- Carousel / Banner Slider
- Product List / Product Card
- Service List
- Testimonial List
- Article List / Featured Posts

### Component Configuration

Each element will have:

- Data source (static or dynamic via API)
- Field mapping (e.g., data.data.products or data.data.items)
- Styling options (className, Tailwind config, alignment, padding, etc.)
- Conditional rendering (show/hide by role or device)
- Predefined schema (for validation and rendering)

## 🧰 EXAMPLE: Dynamic Product Section

```
{
  "section": "Product Section",
  "rows": [
    {
      "columns": [
        {
          "col": 12,
          "elements": [
            { "type": "text", "content": "Featured Products" },
            { "type": "text", "content": "Our handpicked collection" }
          ]
        }
      ]
    },
    {
      "columns": [
        {
          "col": 12,
          "elements": [
            {
              "type": "product_list",
              "api": "/products?featured=true",
              "dataMap": "data.data.products",
              "config": {
                "variant": "grid",
                "columns": 4,
                "showPrice": true,
                "showButton": true
              }
            }
          ]
        }
      ]
    }
  ]
}
```

# ⚙️ FRONTEND RENDER LOGIC

#### Step 1: Fetch Page Schema

Each page will have a JSON schema from the backend describing the structure (sections, rows, columns, elements).

#### Step 2: Recursive Renderer

Render components dynamically based on the JSON schema hierarchy.

Pseudocode:

```

function RenderNode({ node }) {
  switch (node.type) {
    case 'section': return <Section {...node.props}>{node.children.map(RenderNode)}</Section>;
    case 'row': return <Row {...node.props}>{node.children.map(RenderNode)}</Row>;
    case 'col': return <Column {...node.props}>{node.children.map(RenderNode)}</Column>;
    case 'text': return <TextBlock {...node.props} />;
    case 'image': return <ImageBlock {...node.props} />;
    case 'product_list': return <ProductList {...node.props} />;
    // ...other components
  }
}
```

# 🧩 BUILDER FRAMEWORK REFERENCES

- Craft.js
  – React-based page builder framework.
- Builder.io
  – API-driven visual builder and headless CMS concept.
- We will take architectural inspiration from both for:
- Drag-and-drop builder (future phase)
- Component registration system
- Schema-based rendering

# ✅ Summary

- Multi-menu system like Joomla (header/footer/sidebar/custom)

- Multi-level menu structure (nested menus)
- Dynamic menu types (custom, page, article, category)
- Schema-driven page builder (section → row → column → element)
- Configurable, reusable React components for each element
- Data-driven elements (API + field mapping)
- Integration inspiration: Craft.js + Builder.io
- Goal: Scalable, component-based frontend CMS builder

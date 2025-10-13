
---

### ⚙️ Core Features

1. **Headless CMS System**
   - Full drag & drop page builder (Elementor-style)
   - Reusable dynamic blocks (Hero, Gallery, Text, BlogList, etc.)
   - Page data stored as JSON in MongoDB  

2. **Multi-language**
   - Supported: English, Bangla, Arabic, Russian, Hindi  
   <!-- - Use `next-intl` for static translations   -->
   - Use Google Translate API for dynamic content fallback  

3. **Media & Gallery Manager**
   - Multi-folder structure  
   - Upload, rename, delete, move files (Multer backend)  
   - API endpoints for media operations  

4. **Content Management**
   - Services CRUD  
   - Blogs CRUD with WYSIWYG editor  
   - Dynamic Pages with builder  
   - Contact form (NodeMailer)  
   - Site settings (logo, contact info, meta data, etc.)

5. **Authentication**
   - JWT-based auth (Admin/User roles)  
   - Role-based route protection  

6. **Admin Dashboard**
   - Built with shadcn/ui + Tailwind + motion/react  
   - Manage all content dynamically from backend  

---

### 💾 MongoDB Collections

**Collections:**
- `users`
- `pages`
- `services`
- `blogs`
- `media`
- `settings`
- `translations`

**Example `pages` schema:**
```js
{
  title: String,
  slug: String,
  sections: [
    {
      type: String,  // e.g., 'hero', 'gallery', 'textBlock'
      data: Object,  // content for each section
      order: Number
    }
  ],
  language: String, // 'en', 'bn', etc.
  createdBy: ObjectId,
}

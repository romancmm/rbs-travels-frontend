# Gallery Feature Documentation

## Overview

The gallery feature allows you to create image galleries by organizing images in folders and then creating menu items that link to these galleries. The gallery pages display images in a beautiful grid layout with an animated lightbox for viewing.

## Features

✅ **Dynamic Gallery Pages** - Automatically generated from folder structure  
✅ **Animated Image Lightbox** - Full-screen image viewer with zoom, navigation, and animations  
✅ **Keyboard Navigation** - Use arrow keys, +/-, and Escape for easy control  
✅ **Responsive Grid Layout** - Adapts to all screen sizes  
✅ **Touch Gestures** - Swipe to navigate between images on touch devices  
✅ **Image Download** - Download images directly from the lightbox  
✅ **Thumbnail Preview** - Quick navigation with thumbnail strip

## How to Use

### 1. Upload Images to a Gallery Folder

1. Go to **Admin Panel → File Manager**
2. Create a new folder under `/gallery/` (e.g., `/gallery/vacation-2024`)
3. Upload images to this folder

### 2. Create a Menu Item

1. Go to **Admin Panel → Menu Manager**
2. Select the menu you want to edit (e.g., "Main Menu")
3. Click "Manage Items"
4. Add a new menu item:
   - **Title**: "Vacation Photos" (or your preferred title)
   - **Type**: Select "Gallery"
   - **Gallery Folder Name**: Enter the folder name without `/gallery/` prefix (e.g., "vacation-2024")
   - **Target**: Choose "\_self" or "\_blank"
   - **Status**: Published

### 3. Access the Gallery

The gallery will be available at:

```
/gallery/{folder-name}
```

For example: `/gallery/vacation-2024`

## File Structure

```
src/
├── app/
│   └── (front)/
│       └── gallery/
│           └── [folder]/
│               └── page.tsx              # Gallery page component
├── components/
│   └── frontend/
│       └── ImageLightbox.tsx             # Animated lightbox component
└── public/
    └── gallery/                          # Gallery images location
        ├── vacation-2024/
        ├── company-events/
        └── product-showcase/
```

## Gallery Page Features

### Grid Layout

- Responsive grid that adapts to screen size
- Hover effects with image information overlay
- Smooth animations on load

### Image Lightbox

- **Navigation**: Left/Right arrow buttons or keyboard arrows
- **Zoom**: +/- buttons or keyboard +/- keys
- **Download**: Download button to save images
- **Thumbnails**: Bottom strip for quick navigation
- **Close**: X button or Escape key
- **Drag**: Swipe gesture on touch devices

## API Integration

The gallery feature integrates with the File Manager API:

```typescript
// API Endpoint
GET /admin/media?fileType=image&path=/gallery/{folder-name}

// Response
{
  items: [
    {
      type: 'file',
      name: 'image1.jpg',
      url: '/files/gallery/folder-name/image1.jpg',
      thumbnail: '/files/gallery/folder-name/image1.jpg',
      fileType: 'image',
      width: 1920,
      height: 1080,
      size: 245678,
      mime: 'image/jpeg',
      // ... other fields
    },
    // ... more images
  ]
}
```

## Menu Configuration

When creating a gallery menu item, the system:

1. Stores the folder name in the `link` field
2. Sets the `type` to `'gallery'`
3. Generates the URL as `/gallery/{folder-name}`

### Example Menu Item JSON:

```json
{
  "id": "uuid-here",
  "title": "Our Gallery",
  "type": "gallery",
  "link": "vacation-2024",
  "target": "_self",
  "order": 3,
  "isPublished": true,
  "children": []
}
```

## Lightbox Keyboard Shortcuts

| Key        | Action         |
| ---------- | -------------- |
| `←`        | Previous image |
| `→`        | Next image     |
| `+` or `=` | Zoom in        |
| `-`        | Zoom out       |
| `Esc`      | Close lightbox |

## Styling & Animations

### Hover Effects

- Image scales up on hover
- Overlay appears with image info
- Shimmer effect on hover

### Lightbox Animations

- Smooth slide transitions between images
- Fade and scale effects
- Spring animation for smooth feel

### Mobile Responsive

- Grid adjusts from 1 column (mobile) to 5 columns (desktop)
- Touch-friendly controls
- Swipe gestures for navigation

## Customization

### Change Grid Layout

Edit `/src/app/(front)/gallery/[folder]/page.tsx`:

```tsx
// Current: 1-5 columns responsive
<div className='gap-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5'>

// Example: 1-3 columns
<div className='gap-4 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3'>
```

### Change Animation Speed

Edit `/src/components/frontend/ImageLightbox.tsx`:

```tsx
// Current transition
transition={{
  x: { type: 'spring', stiffness: 300, damping: 30 },
  opacity: { duration: 0.2 },
  scale: { duration: 0.2 }
}}

// Faster transition
transition={{
  x: { type: 'spring', stiffness: 500, damping: 40 },
  opacity: { duration: 0.1 },
  scale: { duration: 0.1 }
}}
```

## Troubleshooting

### Gallery shows "No Images Found"

- Check if images are uploaded to the correct folder
- Verify folder name matches the menu item `link` field
- Ensure images have correct file extensions (.jpg, .jpeg, .png, .gif, .webp, .svg)

### Images not loading

- Verify API endpoint returns correct image URLs
- Check if images are accessible via direct URL
- Ensure `NEXT_PUBLIC_BASE_API` is configured correctly

### Lightbox not working

- Check browser console for JavaScript errors
- Verify `motion/react` (Framer Motion) is installed
- Ensure dialog component is properly imported

## Performance Tips

1. **Optimize Images**: Compress images before uploading
2. **Use Thumbnails**: Generate thumbnails for faster grid loading
3. **Lazy Loading**: Images are lazy-loaded automatically with Next.js Image
4. **Limit Grid Size**: Consider pagination for galleries with 50+ images

## Future Enhancements

- [ ] Gallery categories/albums
- [ ] Image captions and metadata
- [ ] Slideshow mode with auto-play
- [ ] Share functionality
- [ ] Image filtering and sorting
- [ ] Bulk image upload
- [ ] Image editing capabilities

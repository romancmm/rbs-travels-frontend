# File Manager System

A comprehensive Joomla-like file manager system built with React, TypeScript, and shadcn/ui components.

## Features

- **Grid and List Views**: Switch between grid and list view modes
- **Folder Navigation**: Create folders and navigate through directory structure
- **File Upload**: Drag & drop or click to upload multiple files
- **File Preview**: Image thumbnails and file details
- **Search**: Search files and folders
- **Selection**: Single or multi-file selection
- **Breadcrumb Navigation**: Easy navigation with breadcrumbs
- **File Details Panel**: View file information, copy URLs, download, delete
- **Modal Integration**: Use in forms with FileManagerModal
- **Permission-aware**: Integrates with existing permission system

## Components

### FileManagerComponent

Main file manager interface for standalone use.

```tsx
import { FileManagerComponent } from '@/components/admin/file-manager'

;<FileManagerComponent
  mode='standalone' // or "modal"
  onFileSelect={(file) => console.log(file)}
  allowedTypes={['image', 'video', 'document']}
  maxFiles={5}
/>
```

### FileManagerModal

Modal wrapper for use in forms and other components.

```tsx
import { FileManagerModal } from '@/components/admin/file-manager'

const [showModal, setShowModal] = useState(false)
const [selectedFiles, setSelectedFiles] = useState([])

<FileManagerModal
  open={showModal}
  onClose={() => setShowModal(false)}
  onFileSelect={(files) => setSelectedFiles(files)}
  allowedTypes={['image']}
  maxFiles={3}
  title="Select Images"
  description="Choose up to 3 images"
/>
```

## Props

### FileManagerComponent Props

| Prop           | Type                       | Default        | Description                                                       |
| -------------- | -------------------------- | -------------- | ----------------------------------------------------------------- |
| `mode`         | `'standalone' \| 'modal'`  | `'standalone'` | Display mode                                                      |
| `onFileSelect` | `(file: FileItem) => void` | -              | Callback when file is selected                                    |
| `allowedTypes` | `string[]`                 | `[]`           | Allowed file types: `'image'`, `'video'`, `'audio'`, `'document'` |
| `maxFiles`     | `number`                   | `1`            | Maximum files to select (modal mode)                              |
| `className`    | `string`                   | -              | Additional CSS classes                                            |

### FileManagerModal Props

| Prop           | Type                                     | Default                                  | Description             |
| -------------- | ---------------------------------------- | ---------------------------------------- | ----------------------- |
| `open`         | `boolean`                                | -                                        | Modal open state        |
| `onClose`      | `() => void`                             | -                                        | Close modal callback    |
| `onFileSelect` | `(file: FileItem \| FileItem[]) => void` | -                                        | File selection callback |
| `allowedTypes` | `string[]`                               | `[]`                                     | Allowed file types      |
| `maxFiles`     | `number`                                 | `1`                                      | Maximum files to select |
| `title`        | `string`                                 | `'Select Files'`                         | Modal title             |
| `description`  | `string`                                 | `'Choose files from your media library'` | Modal description       |

## File Types

The file manager supports filtering by these types:

- **image**: Image files (jpg, png, gif, etc.)
- **video**: Video files (mp4, avi, mov, etc.)
- **audio**: Audio files (mp3, wav, etc.)
- **document**: Document files (pdf, doc, txt, etc.)

## API Integration

The file manager expects these API endpoints:

### GET `/admin/media`

Get files and folders

```
Query params:
- fileType: 'all' | 'image' | 'video' | etc.
- path: folder path
- search: search query

Response:
{
  items: FileItem[],
  page: number,
  perPage: number,
  hasMore: boolean
}
```

### POST `/api/admin/media/upload`

Upload files

```
FormData:
- files[]: File[]
- path: string

Response: Upload result
```

### POST `/api/admin/media/folder`

Create folder

```
Body:
{
  name: string,
  path: string
}

Response: Folder creation result
```

### DELETE `/api/admin/media/delete`

Delete file/folder

```
Body:
{
  fileId: string,
  path: string
}

Response: Deletion result
```

## File Structure

```
src/components/admin/file-manager/
├── index.ts                     # Exports
├── FileManagerComponent.tsx     # Main component
├── FileManagerModal.tsx         # Modal wrapper
├── FileGrid.tsx                 # Grid view
├── FileList.tsx                 # List view
├── FileUploadModal.tsx          # Upload dialog
├── CreateFolderModal.tsx        # Create folder dialog
├── FileDetailsPanel.tsx         # File details sidebar
└── FileManagerFormExample.tsx   # Usage example
```

## Usage Examples

### In a Form

```tsx
const [selectedImages, setSelectedImages] = useState([])
const [showFileManager, setShowFileManager] = useState(false)

// In your form
<Button onClick={() => setShowFileManager(true)}>
  Select Images
</Button>

<FileManagerModal
  open={showFileManager}
  onClose={() => setShowFileManager(false)}
  onFileSelect={setSelectedImages}
  allowedTypes={['image']}
  maxFiles={5}
/>
```

### Standalone Page

```tsx
export default function MediaPage() {
  return (
    <div className='h-screen'>
      <FileManagerComponent />
    </div>
  )
}
```

### Blog Post Creation

```tsx
const [featuredImage, setFeaturedImage] = useState(null)

<FileManagerModal
  open={showImageSelector}
  onClose={() => setShowImageSelector(false)}
  onFileSelect={(file) => setFeaturedImage(file)}
  allowedTypes={['image']}
  maxFiles={1}
  title="Select Featured Image"
/>
```

## Styling

The file manager uses Tailwind CSS classes and follows the shadcn/ui design system. All components are fully responsive and support dark mode.

## Dependencies

- React 19+
- Next.js 15+
- shadcn/ui components
- Tailwind CSS
- Lucide React icons
- date-fns for date formatting

## Notes

- The file manager maintains folder state across navigation
- File selections are preserved during folder navigation in modal mode
- Thumbnails are automatically generated for images
- File sizes are automatically formatted
- The system supports both single and multi-file selection
- All API calls include proper error handling
- The interface is fully keyboard accessible

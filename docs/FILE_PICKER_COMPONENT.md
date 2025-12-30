# FilePicker Component - Joomla-style File Management

## Overview

The `FilePicker` component provides a Joomla-like file selection experience by integrating with the File Manager. Users can:

1. Click to open the File Manager modal
2. Browse and select from previously uploaded files
3. Upload new files directly within the modal
4. Select files which automatically populate the field

## Usage

### Basic Single File Selection (Image)

```tsx
import FilePicker from '@/components/common/FilePicker'

;<FilePicker
  value={imageUrl}
  onChangeAction={setImageUrl}
  multiple={false}
  maxAllow={1}
  size='large'
  allowedTypes={['image']}
/>
```

### Multiple File Selection

```tsx
<FilePicker
  value={fileUrls} // string[]
  onChangeAction={setFileUrls}
  multiple={true}
  maxAllow={5}
  size='medium'
  allowedTypes={['image', 'document']}
/>
```

### With React Hook Form

```tsx
<Controller
  control={control}
  name='bannerImage'
  render={({ field }) => (
    <FilePicker
      value={field.value || ''}
      onChangeAction={field.onChange}
      multiple={false}
      maxAllow={1}
      size='large'
      allowedTypes={['image']}
    />
  )}
/>
```

## Props

| Prop             | Type                                              | Default    | Description                                                   |
| ---------------- | ------------------------------------------------- | ---------- | ------------------------------------------------------------- |
| `value`          | `string \| string[]`                              | -          | Current file URL(s)                                           |
| `onChangeAction` | `(url: string \| string[]) => void`               | -          | Callback when files change                                    |
| `multiple`       | `boolean`                                         | `false`    | Allow multiple file selection                                 |
| `maxAllow`       | `number`                                          | `5`        | Maximum number of files (when multiple=true)                  |
| `size`           | `'small' \| 'medium' \| 'large' \| 'extra-large'` | `'medium'` | Display size                                                  |
| `allowedTypes`   | `string[]`                                        | `[]`       | File types to filter (e.g., `['image', 'video', 'document']`) |

## Allowed Types

- `'image'` - JPEG, PNG, GIF, SVG, WebP
- `'video'` - MP4, AVI, MOV, WMV, WebM
- `'audio'` - MP3, WAV, OGG
- `'document'` - PDF, DOC, DOCX, XLS, XLSX, TXT

## Features

### 1. File Manager Integration

- Opens full File Manager in modal
- Browse folders and navigate directory structure
- Search functionality
- Grid/List view toggle
- Upload new files directly within the modal

### 2. File Preview

- Image thumbnails for image files
- File type icons for documents
- File name display

### 3. File Management

- Remove selected files
- Multiple file selection with limit
- Drag and drop support (via File Manager)

### 4. Responsive Design

- 4 size variants
- Mobile-friendly interface
- Smooth animations

## Migration from FileUploader

### Before (FileUploader)

```tsx
<FileUploader
  value={field.value || ''}
  onChangeAction={field.onChange}
  multiple={false}
  maxAllow={1}
  size='large'
  uploadPath='banners'
/>
```

### After (FilePicker)

```tsx
<FilePicker
  value={field.value || ''}
  onChangeAction={field.onChange}
  multiple={false}
  maxAllow={1}
  size='large'
  allowedTypes={['image']}
/>
```

## Key Differences from FileUploader

| Feature           | FileUploader       | FilePicker               |
| ----------------- | ------------------ | ------------------------ |
| Upload Method     | Direct file input  | File Manager modal       |
| Browse Files      | No                 | Yes - full media library |
| Folder Navigation | No                 | Yes                      |
| Search Files      | No                 | Yes                      |
| Upload Location   | Fixed `uploadPath` | Choose in File Manager   |
| File Organization | Limited            | Full folder structure    |
| Reuse Files       | No                 | Yes - browse existing    |

## Architecture

```
FilePicker
  └─ FileManagerModal
      └─ FileManagerComponent (mode='modal')
          ├─ FileGrid / FileList
          ├─ FileUploadModal (for new uploads)
          ├─ CreateFolderModal
          └─ FileDetailsPanel
```

## Examples in Codebase

1. **Banner Images** - `/src/components/admin/form/settings/home/HomeBanner.tsx`
   - Single image selection
   - Image type filter
   - Large size display

## Best Practices

1. **Always specify allowedTypes** for better UX filtering
2. **Use appropriate size** based on context
3. **Set reasonable maxAllow** for multiple selections
4. **Handle empty values** gracefully with `|| ''`
5. **Show validation errors** below the component

## Future Enhancements

- Direct drag-and-drop to FilePicker
- Inline cropping/editing
- Cloud storage integration
- Advanced search filters

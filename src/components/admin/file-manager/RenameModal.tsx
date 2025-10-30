'use client'

import { Button } from '@/components/ui/button'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle
} from '@/components/ui/dialog'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Edit3 } from 'lucide-react'
import { useEffect, useState } from 'react'
import { FileItem } from './FileManagerComponent'

interface RenameModalProps {
  open: boolean
  onClose: () => void
  file: FileItem | null
  existingNames?: string[]
  onRename: (file: FileItem, newName: string) => void
}

export function RenameModal({
  open,
  onClose,
  file,
  existingNames = [],
  onRename
}: RenameModalProps) {
  const [newName, setNewName] = useState('')
  const [isRenaming, setIsRenaming] = useState(false)
  const [error, setError] = useState('')

  useEffect(() => {
    if (file && open) {
      // For files, remove the extension to edit just the name
      if (file.type === 'file') {
        const lastDotIndex = file.name.lastIndexOf('.')
        const nameWithoutExtension =
          lastDotIndex > 0 ? file.name.substring(0, lastDotIndex) : file.name
        setNewName(nameWithoutExtension)
      } else {
        setNewName(file.name)
      }
    }
  }, [file, open])

  const getFullFileName = () => {
    if (!file) return ''

    if (file.type === 'folder') {
      return newName.trim()
    }

    // For files, add back the extension
    const lastDotIndex = file.name.lastIndexOf('.')
    const extension = lastDotIndex > 0 ? file.name.substring(lastDotIndex) : ''
    return newName.trim() + extension
  }

  const handleRename = async () => {
    if (!file || !newName.trim()) {
      setError('Name is required')
      return
    }

    const fullFileName = getFullFileName()

    // Check for duplicate names
    if (existingNames.includes(fullFileName) && fullFileName !== file.name) {
      setError(`A ${file.type} with this name already exists`)
      return
    }

    // Validate name
    if (!/^[a-zA-Z0-9_-\s.]+$/.test(fullFileName)) {
      setError('Name can only contain letters, numbers, spaces, hyphens, underscores, and dots')
      return
    }

    setIsRenaming(true)
    setError('')

    try {
      await onRename(file, fullFileName)
      handleClose()
    } catch {
      setError('Failed to rename')
    } finally {
      setIsRenaming(false)
    }
  }

  const handleClose = () => {
    if (!isRenaming) {
      setNewName('')
      setError('')
      onClose()
    }
  }

  if (!file) return null

  const extension =
    file.type === 'file' && file.name.includes('.')
      ? file.name.substring(file.name.lastIndexOf('.'))
      : ''

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <Edit3 className='w-5 h-5' />
            Rename {file.type === 'folder' ? 'Folder' : 'File'}
          </DialogTitle>
          <DialogDescription>Enter a new name for &ldquo;{file.name}&rdquo;</DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='new-name'>{file.type === 'folder' ? 'Folder Name' : 'File Name'}</Label>
            <div className='flex items-center gap-2'>
              <Input
                id='new-name'
                value={newName}
                onChange={(e) => {
                  setNewName(e.target.value)
                  setError('')
                }}
                placeholder={`Enter ${file.type} name`}
                disabled={isRenaming}
                onKeyDown={(e) => {
                  if (e.key === 'Enter') {
                    handleRename()
                  }
                }}
              />
              {extension && (
                <span className='font-mono text-muted-foreground text-sm'>{extension}</span>
              )}
            </div>
            {error && <p className='text-red-500 text-sm'>{error}</p>}
            {file.type === 'file' && extension && (
              <p className='text-muted-foreground text-xs'>
                The file extension {extension} will be preserved
              </p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isRenaming}>
            Cancel
          </Button>
          <Button onClick={handleRename} disabled={!newName.trim() || isRenaming}>
            {isRenaming ? 'Renaming...' : 'Rename'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

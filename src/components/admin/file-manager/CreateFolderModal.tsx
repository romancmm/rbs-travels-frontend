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
import requests from '@/services/network/http'
import { FolderPlus } from 'lucide-react'
import { useState } from 'react'

interface CreateFolderModalProps {
  open: boolean
  onClose: () => void
  currentPath: string
  onFolderCreated: () => void
  existingFolders?: string[] // List of existing folder names in current path
}

export function CreateFolderModal({
  open,
  onClose,
  currentPath,
  onFolderCreated,
  existingFolders = []
}: CreateFolderModalProps) {
  const [folderName, setFolderName] = useState('')
  const [isCreating, setIsCreating] = useState(false)
  const [error, setError] = useState('')

  const handleCreate = async () => {
    if (!folderName.trim()) {
      setError('Folder name is required')
      return
    }

    // Check for duplicate folder names
    if (existingFolders.includes(folderName.trim())) {
      setError('A folder with this name already exists')
      return
    }

    // Validate folder name
    if (!/^[a-zA-Z0-9_-\s]+$/.test(folderName)) {
      setError('Folder name can only contain letters, numbers, spaces, hyphens, and underscores')
      return
    }

    setIsCreating(true)
    setError('')

    try {
      await requests.post('/admin/media/folder', {
        folderName: folderName.trim(),
        path: currentPath
      })

      onFolderCreated()
      setFolderName('')
      onClose()
    } catch (error: any) {
      setError(error?.response?.data?.message || 'Failed to create folder')
    } finally {
      setIsCreating(false)
    }
  }

  const handleClose = () => {
    if (!isCreating) {
      setFolderName('')
      setError('')
      onClose()
    }
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className='max-w-md'>
        <DialogHeader>
          <DialogTitle className='flex items-center gap-2'>
            <FolderPlus className='w-5 h-5' />
            Create New Folder
          </DialogTitle>
          <DialogDescription>
            Create a new folder in {currentPath === '/' ? 'root directory' : currentPath}
          </DialogDescription>
        </DialogHeader>

        <div className='space-y-4 py-4'>
          <div className='space-y-2'>
            <Label htmlFor='folder-name'>Folder Name</Label>
            <Input
              id='folder-name'
              value={folderName}
              onChange={(e) => {
                setFolderName(e.target.value)
                setError('')
              }}
              placeholder='Enter folder name'
              disabled={isCreating}
              onKeyDown={(e) => {
                if (e.key === 'Enter') {
                  handleCreate()
                }
              }}
            />
            {error && <p className='text-red-500 text-sm'>{error}</p>}
          </div>
        </div>

        <DialogFooter>
          <Button variant='outline' onClick={handleClose} disabled={isCreating}>
            Cancel
          </Button>
          <Button onClick={handleCreate} disabled={!folderName.trim() || isCreating}>
            {isCreating ? 'Creating...' : 'Create Folder'}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

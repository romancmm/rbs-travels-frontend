'use client'

/**
 * Menu Items Builder
 * Drag-and-drop interface for managing nested menu items
 */

import {
    ChevronDown,
    ChevronRight,
    ExternalLink,
    FileText,
    FolderOpen,
    GripVertical,
    Link as LinkIcon,
    Plus,
    Trash2,
} from 'lucide-react'
import { useState } from 'react'

import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select'
import { cn } from '@/lib/utils'
import { generateId } from '@/services/api/cms.service'
import type { MenuItem, MenuItemType } from '@/types/cms'

interface MenuItemsBuilderProps {
    items: MenuItem[]
    onChange: (items: MenuItem[]) => void
}

export function MenuItemsBuilder({ items, onChange }: MenuItemsBuilderProps) {
    const [expandedItems, setExpandedItems] = useState<Set<string>>(new Set())
    const [editingItem, setEditingItem] = useState<string | null>(null)

    const toggleExpand = (id: string) => {
        setExpandedItems((prev) => {
            const next = new Set(prev)
            if (next.has(id)) {
                next.delete(id)
            } else {
                next.add(id)
            }
            return next
        })
    }

    const addItem = (parentId: string | null = null) => {
        const newItem: MenuItem = {
            id: generateId(),
            title: 'New Menu Item',
            type: 'custom-link',
            link: '/',
            parentId,
            order: 0,
            children: [],
            status: 'published',
        }

        if (parentId === null) {
            onChange([...items, newItem])
        } else {
            onChange(addChildToParent(items, parentId, newItem))
        }

        setEditingItem(newItem.id)
    }

    const addChildToParent = (
        items: MenuItem[],
        parentId: string,
        newItem: MenuItem
    ): MenuItem[] => {
        return items.map((item) => {
            if (item.id === parentId) {
                return {
                    ...item,
                    children: [...item.children, newItem],
                }
            }
            if (item.children.length > 0) {
                return {
                    ...item,
                    children: addChildToParent(item.children, parentId, newItem),
                }
            }
            return item
        })
    }

    const updateItem = (id: string, updates: Partial<MenuItem>) => {
        onChange(updateItemRecursive(items, id, updates))
    }

    const updateItemRecursive = (
        items: MenuItem[],
        id: string,
        updates: Partial<MenuItem>
    ): MenuItem[] => {
        return items.map((item) => {
            if (item.id === id) {
                return { ...item, ...updates }
            }
            if (item.children.length > 0) {
                return {
                    ...item,
                    children: updateItemRecursive(item.children, id, updates),
                }
            }
            return item
        })
    }

    const deleteItem = (id: string) => {
        if (!confirm('Are you sure you want to delete this menu item?')) return
        onChange(deleteItemRecursive(items, id))
    }

    const deleteItemRecursive = (items: MenuItem[], id: string): MenuItem[] => {
        return items
            .filter((item) => item.id !== id)
            .map((item) => ({
                ...item,
                children: deleteItemRecursive(item.children, id),
            }))
    }

    const getMenuItemIcon = (type: MenuItemType) => {
        switch (type) {
            case 'custom-link':
                return <LinkIcon className='w-4 h-4' />
            case 'custom-page':
                return <FileText className='w-4 h-4' />
            case 'category-blogs':
                return <FolderOpen className='w-4 h-4' />
            case 'article':
                return <FileText className='w-4 h-4' />
            default:
                return <LinkIcon className='w-4 h-4' />
        }
    }

    const renderMenuItem = (item: MenuItem, level: number = 0) => {
        const isExpanded = expandedItems.has(item.id)
        const isEditing = editingItem === item.id
        const hasChildren = item.children.length > 0

        return (
            <div key={item.id} className='space-y-1'>
                {/* Menu Item Row */}
                <div
                    className={cn(
                        'group flex items-center gap-2 bg-background p-3 border rounded-lg transition-colors',
                        level > 0 && 'ml-8'
                    )}
                >
                    {/* Drag Handle */}
                    <div className='text-muted-foreground hover:text-foreground cursor-grab'>
                        <GripVertical className='w-4 h-4' />
                    </div>

                    {/* Expand/Collapse */}
                    {hasChildren && (
                        <button
                            type='button'
                            onClick={() => toggleExpand(item.id)}
                            className='text-muted-foreground hover:text-foreground'
                        >
                            {isExpanded ? (
                                <ChevronDown className='w-4 h-4' />
                            ) : (
                                <ChevronRight className='w-4 h-4' />
                            )}
                        </button>
                    )}

                    {/* Icon */}
                    <div className='text-muted-foreground'>{getMenuItemIcon(item.type)}</div>

                    {/* Content */}
                    <div className='flex-1'>
                        {isEditing ? (
                            <MenuItemEditor
                                item={item}
                                onSave={(updates) => {
                                    updateItem(item.id, updates)
                                    setEditingItem(null)
                                }}
                                onCancel={() => setEditingItem(null)}
                            />
                        ) : (
                            <div className='space-y-1'>
                                <div className='flex items-center gap-2'>
                                    <span className='font-medium'>{item.title}</span>
                                    <Badge variant='secondary' className='text-xs'>
                                        {item.type.replace('-', ' ')}
                                    </Badge>
                                    {item.target === '_blank' && <ExternalLink className='w-3 h-3' />}
                                </div>
                                <p className='text-muted-foreground text-xs'>
                                    {item.link || item.pageId || item.categoryId || item.articleId}
                                </p>
                            </div>
                        )}
                    </div>

                    {/* Actions */}
                    <div className='flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity'>
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => addItem(item.id)}
                            title='Add child item'
                        >
                            <Plus className='w-4 h-4' />
                        </Button>
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => setEditingItem(item.id)}
                            title='Edit'
                        >
                            <FileText className='w-4 h-4' />
                        </Button>
                        <Button
                            type='button'
                            variant='ghost'
                            size='icon'
                            onClick={() => deleteItem(item.id)}
                            title='Delete'
                            className='text-destructive hover:text-destructive'
                        >
                            <Trash2 className='w-4 h-4' />
                        </Button>
                    </div>
                </div>

                {/* Children */}
                {hasChildren && isExpanded && (
                    <div className='space-y-1'>
                        {item.children.map((child) => renderMenuItem(child, level + 1))}
                    </div>
                )}
            </div>
        )
    }

    return (
        <div className='space-y-4'>
            <div className='flex justify-between items-center'>
                <div>
                    <h3 className='font-semibold text-lg'>Menu Items</h3>
                    <p className='text-muted-foreground text-sm'>
                        Add and organize menu items. You can nest items by adding child items.
                    </p>
                </div>
                <Button type='button' onClick={() => addItem()}>
                    <Plus className='mr-2 w-4 h-4' />
                    Add Item
                </Button>
            </div>

            {items.length === 0 ? (
                <div className='flex flex-col justify-center items-center p-12 border border-dashed rounded-lg text-center'>
                    <LinkIcon className='mb-4 w-12 h-12 text-muted-foreground' />
                    <h3 className='mb-2 font-semibold text-lg'>No menu items yet</h3>
                    <p className='mb-4 text-muted-foreground text-sm'>
                        Start building your menu by adding your first item.
                    </p>
                    <Button type='button' onClick={() => addItem()}>
                        <Plus className='mr-2 w-4 h-4' />
                        Add First Item
                    </Button>
                </div>
            ) : (
                <div className='space-y-2'>{items.map((item) => renderMenuItem(item))}</div>
            )}
        </div>
    )
}

// Menu Item Editor Component
interface MenuItemEditorProps {
    item: MenuItem
    onSave: (updates: Partial<MenuItem>) => void
    onCancel: () => void
}

function MenuItemEditor({ item, onSave, onCancel }: MenuItemEditorProps) {
    const [formData, setFormData] = useState({
        title: item.title,
        type: item.type,
        link: item.link || '',
        pageId: item.pageId || '',
        categoryId: item.categoryId || '',
        articleId: item.articleId || '',
        target: item.target || '_self',
        icon: item.icon || '',
    })

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()
        onSave(formData)
    }

    return (
        <form onSubmit={handleSubmit} className='space-y-3 bg-muted/50 p-4 border rounded-lg'>
            <div className='gap-3 grid sm:grid-cols-2'>
                {/* Title */}
                <div className='space-y-1'>
                    <Label htmlFor='title' className='text-xs'>
                        Title
                    </Label>
                    <Input
                        id='title'
                        value={formData.title}
                        onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                        placeholder='Menu title'
                        required
                    />
                </div>

                {/* Type */}
                <div className='space-y-1'>
                    <Label htmlFor='type' className='text-xs'>
                        Type
                    </Label>
                    <Select
                        value={formData.type}
                        onValueChange={(value: MenuItemType) => setFormData({ ...formData, type: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='custom-link'>Custom Link</SelectItem>
                            <SelectItem value='custom-page'>Custom Page</SelectItem>
                            <SelectItem value='category-blogs'>Category Blogs</SelectItem>
                            <SelectItem value='article'>Article</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Dynamic field based on type */}
                {formData.type === 'custom-link' && (
                    <div className='space-y-1'>
                        <Label htmlFor='link' className='text-xs'>
                            URL
                        </Label>
                        <Input
                            id='link'
                            value={formData.link}
                            onChange={(e) => setFormData({ ...formData, link: e.target.value })}
                            placeholder='/about or https://...'
                            required
                        />
                    </div>
                )}

                {formData.type === 'custom-page' && (
                    <div className='space-y-1'>
                        <Label htmlFor='pageId' className='text-xs'>
                            Page Slug
                        </Label>
                        <Input
                            id='pageId'
                            value={formData.pageId}
                            onChange={(e) => setFormData({ ...formData, pageId: e.target.value })}
                            placeholder='about-us'
                            required
                        />
                    </div>
                )}

                {formData.type === 'category-blogs' && (
                    <div className='space-y-1'>
                        <Label htmlFor='categoryId' className='text-xs'>
                            Category Slug
                        </Label>
                        <Input
                            id='categoryId'
                            value={formData.categoryId}
                            onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                            placeholder='news'
                            required
                        />
                    </div>
                )}

                {formData.type === 'article' && (
                    <div className='space-y-1'>
                        <Label htmlFor='articleId' className='text-xs'>
                            Article Slug
                        </Label>
                        <Input
                            id='articleId'
                            value={formData.articleId}
                            onChange={(e) => setFormData({ ...formData, articleId: e.target.value })}
                            placeholder='my-article'
                            required
                        />
                    </div>
                )}

                {/* Target */}
                <div className='space-y-1'>
                    <Label htmlFor='target' className='text-xs'>
                        Open In
                    </Label>
                    <Select
                        value={formData.target}
                        onValueChange={(value: '_blank' | '_self') => setFormData({ ...formData, target: value })}
                    >
                        <SelectTrigger>
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value='_self'>Same Window</SelectItem>
                            <SelectItem value='_blank'>New Tab</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Icon (optional) */}
                <div className='space-y-1'>
                    <Label htmlFor='icon' className='text-xs'>
                        Icon (optional)
                    </Label>
                    <Input
                        id='icon'
                        value={formData.icon}
                        onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                        placeholder='icon-name'
                    />
                </div>
            </div>

            {/* Actions */}
            <div className='flex justify-end gap-2'>
                <Button type='button' variant='outline' size='sm' onClick={onCancel}>
                    Cancel
                </Button>
                <Button type='submit' size='sm'>
                    Save
                </Button>
            </div>
        </form>
    )
}

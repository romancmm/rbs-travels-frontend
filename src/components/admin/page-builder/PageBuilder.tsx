'use client'

import { Eye, Monitor, Redo2, Save, Smartphone, Tablet, Undo2 } from 'lucide-react'
import { useEffect } from 'react'

import { Button } from '@/components/ui/button'
import { useBuilderStore } from '@/lib/page-builder/builder-store'
import { BuilderDndProvider } from '@/lib/page-builder/dnd-context'
import { cn } from '@/lib/utils'
import type { PageContent } from '@/types/page-builder'
import { Canvas } from './Canvas'
import { ComponentsSidebar } from './ComponentsSidebar'
import { PropertiesPanel } from './PropertiesPanel'

type PreviewMode = 'desktop' | 'tablet' | 'mobile'

interface PageBuilderProps {
    pageId: string
    initialContent?: PageContent
}

export function PageBuilder({ pageId, initialContent }: PageBuilderProps) {
    // Store hooks
    const loadPage = useBuilderStore((state) => state.loadPage)
    const savePage = useBuilderStore((state) => state.savePage)
    const publishPage = useBuilderStore((state) => state.publishPage)
    const undo = useBuilderStore((state) => state.undo)
    const redo = useBuilderStore((state) => state.redo)
    const canUndo = useBuilderStore((state) => state.canUndo)
    const canRedo = useBuilderStore((state) => state.canRedo)
    const previewMode = useBuilderStore((state) => state.ui.previewMode)
    const setPreviewMode = useBuilderStore((state) => state.setPreviewMode)
    const isDirty = useBuilderStore((state) => state.isDirty)
    const isSaving = useBuilderStore((state) => state.isSaving)
    const isPublishing = useBuilderStore((state) => state.isPublishing)

    // Load page on mount
    useEffect(() => {
        if (initialContent) {
            loadPage(pageId, initialContent)
        }
    }, [pageId, initialContent, loadPage])

    // Handle keyboard shortcuts
    useEffect(() => {
        const handleKeyDown = (e: KeyboardEvent) => {
            // Undo: Ctrl+Z / Cmd+Z
            if ((e.ctrlKey || e.metaKey) && e.key === 'z' && !e.shiftKey) {
                e.preventDefault()
                if (canUndo()) undo()
            }
            // Redo: Ctrl+Shift+Z / Cmd+Shift+Z or Ctrl+Y / Cmd+Y
            if (
                ((e.ctrlKey || e.metaKey) && e.key === 'z' && e.shiftKey) ||
                ((e.ctrlKey || e.metaKey) && e.key === 'y')
            ) {
                e.preventDefault()
                if (canRedo()) redo()
            }
            // Save: Ctrl+S / Cmd+S
            if ((e.ctrlKey || e.metaKey) && e.key === 's') {
                e.preventDefault()
                savePage()
            }
        }

        window.addEventListener('keydown', handleKeyDown)
        return () => window.removeEventListener('keydown', handleKeyDown)
    }, [undo, redo, canUndo, canRedo, savePage])

    // Handle unsaved changes warning
    useEffect(() => {
        const handleBeforeUnload = (e: BeforeUnloadEvent) => {
            if (isDirty) {
                e.preventDefault()
                e.returnValue = ''
            }
        }

        window.addEventListener('beforeunload', handleBeforeUnload)
        return () => window.removeEventListener('beforeunload', handleBeforeUnload)
    }, [isDirty])

    const previewModes: { mode: PreviewMode; icon: typeof Monitor; label: string }[] = [
        { mode: 'desktop', icon: Monitor, label: 'Desktop' },
        { mode: 'tablet', icon: Tablet, label: 'Tablet' },
        { mode: 'mobile', icon: Smartphone, label: 'Mobile' },
    ]

    return (
        <BuilderDndProvider>
            <div className="flex flex-col bg-gray-50 h-screen">
                {/* Top Toolbar */}
                <div className="flex justify-between items-center bg-white shadow-sm px-4 border-b h-14">
                    {/* Left: Title and status */}
                    <div className="flex items-center gap-4">
                        <h1 className="font-semibold text-gray-900 text-lg">Page Builder</h1>
                        {isDirty && (
                            <span className="text-amber-600 text-xs">Unsaved changes</span>
                        )}
                    </div>

                    {/* Center: Preview mode switcher */}
                    <div className="flex items-center gap-1 bg-gray-50 p-1 border rounded-lg">
                        {previewModes.map(({ mode, icon: Icon, label }) => (
                            <Button
                                key={mode}
                                variant="ghost"
                                size="sm"
                                onClick={() => setPreviewMode(mode)}
                                className={cn(
                                    'gap-2 h-8',
                                    previewMode === mode && 'bg-white shadow-sm'
                                )}
                            >
                                <Icon className="w-4 h-4" />
                                <span className="hidden sm:inline">{label}</span>
                            </Button>
                        ))}
                    </div>

                    {/* Right: Actions */}
                    <div className="flex items-center gap-2">
                        {/* Undo/Redo */}
                        <div className="flex items-center gap-1 bg-gray-50 p-1 border rounded-lg">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={undo}
                                disabled={!canUndo()}
                                className="p-0 w-8 h-8"
                                title="Undo (Ctrl+Z)"
                            >
                                <Undo2 className="w-4 h-4" />
                            </Button>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={redo}
                                disabled={!canRedo()}
                                className="p-0 w-8 h-8"
                                title="Redo (Ctrl+Y)"
                            >
                                <Redo2 className="w-4 h-4" />
                            </Button>
                        </div>

                        {/* Preview */}
                        <Button variant="outline" size="sm" className="gap-2">
                            <Eye className="w-4 h-4" />
                            Preview
                        </Button>

                        {/* Save */}
                        <Button
                            variant="outline"
                            size="sm"
                            onClick={() => savePage()}
                            disabled={isSaving || !isDirty}
                            className="gap-2"
                        >
                            <Save className="w-4 h-4" />
                            {isSaving ? 'Saving...' : 'Save Draft'}
                        </Button>

                        {/* Publish */}
                        <Button
                            size="sm"
                            onClick={() => publishPage()}
                            disabled={isPublishing}
                            className="gap-2"
                        >
                            {isPublishing ? 'Publishing...' : 'Publish'}
                        </Button>
                    </div>
                </div>

                {/* Main Content Area */}
                <div className="flex flex-1 overflow-hidden">
                    {/* Left Sidebar - Components */}
                    <ComponentsSidebar />

                    {/* Center - Canvas */}
                    <div className="flex-1 bg-gray-100 overflow-auto">
                        <Canvas />
                    </div>

                    {/* Right Sidebar - Properties Panel */}
                    <PropertiesPanel />
                </div>
            </div>
        </BuilderDndProvider>
    )
}

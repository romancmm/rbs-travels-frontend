/**
 * Page Builder Store
 * Zustand store with Immer for immutable state updates
 * Central state management for the entire page builder
 */

import requests from '@/services/network/http'
import type {
  BuilderError,
  Column,
  BaseComponent as Component,
  DraggableType,
  PageContent,
  Row,
  Section
} from '@/types/page-builder'
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { immer } from 'zustand/middleware/immer'
import {
  addColumn,
  addComponent,
  addRow,
  addSection,
  createEmptyContent,
  deepCloneWithNewIds,
  deleteColumn,
  deleteComponent,
  deleteRow,
  deleteSection,
  duplicateComponent,
  duplicateSection,
  findElementById,
  getElementType,
  moveColumn,
  moveComponent,
  moveRow,
  moveSection,
  updateColumn,
  updateComponent,
  updateRow,
  updateSection,
  validateContent
} from './builder-utils'

// ==================== TYPES ====================

interface SelectionState {
  selectedId: string | null
  selectedType: DraggableType | null
  hoveredId: string | null
  hoveredType: DraggableType | null
}

interface UIState {
  previewMode: 'desktop' | 'tablet' | 'mobile'
  deviceWidth: number
  zoom: number
  showGrid: boolean
  showOutlines: boolean
  showSpacing: boolean
  leftPanelOpen: boolean
  rightPanelOpen: boolean
  bottomPanelOpen: boolean
  activePropertyTab: 'content' | 'style' | 'advanced'
  activeLeftTab: 'components' | 'layers' | 'templates'
}

interface ClipboardState {
  copiedItem: any | null
  copiedType: DraggableType | null
}

interface HistoryState {
  past: PageContent[]
  future: PageContent[]
}

interface BuilderStore {
  // Core data
  pageId: string | null
  pageSlug: string | null
  pageTitle: string | null
  pageDescription: string | null
  pageSEO: any | null
  content: PageContent
  originalContent: PageContent | null

  // State
  selection: SelectionState
  ui: UIState
  clipboard: ClipboardState
  history: HistoryState

  // Status
  isDirty: boolean
  isSaving: boolean
  isPublishing: boolean
  lastSaved: Date | null
  errors: BuilderError[]

  // Actions - Selection
  selectElement: (id: string | null, type?: DraggableType | null) => void
  hoverElement: (id: string | null, type?: DraggableType | null) => void
  clearSelection: () => void

  // Actions - UI
  setPreviewMode: (mode: 'desktop' | 'tablet' | 'mobile') => void
  setZoom: (zoom: number) => void
  toggleGrid: () => void
  toggleOutlines: () => void
  toggleSpacing: () => void
  toggleLeftPanel: () => void
  toggleRightPanel: () => void
  toggleBottomPanel: () => void
  setActivePropertyTab: (tab: 'content' | 'style' | 'advanced') => void
  setActiveLeftTab: (tab: 'components' | 'layers' | 'templates') => void

  // Actions - Content (Sections)
  addSection: (section: Section, index?: number) => void
  deleteSection: (sectionId: string) => void
  updateSection: (sectionId: string, updates: Partial<Section>) => void
  moveSection: (sectionId: string, newIndex: number) => void
  duplicateSection: (sectionId: string) => void

  // Actions - Content (Rows)
  addRow: (sectionId: string, row: Row, index?: number) => void
  deleteRow: (rowId: string) => void
  updateRow: (rowId: string, updates: Partial<Row>) => void
  moveRow: (rowId: string, targetSectionId: string, newIndex: number) => void

  // Actions - Content (Columns)
  addColumn: (rowId: string, column: Column, index?: number) => void
  deleteColumn: (columnId: string) => void
  updateColumn: (columnId: string, updates: Partial<Column>) => void
  moveColumn: (columnId: string, targetRowId: string, newIndex: number) => void

  // Actions - Content (Components)
  addComponent: (columnId: string, component: Component, index?: number) => void
  deleteComponent: (componentId: string) => void
  updateComponent: (componentId: string, updates: Partial<Component>) => void
  moveComponent: (componentId: string, targetColumnId: string, newIndex: number) => void
  duplicateComponent: (componentId: string) => void

  // Actions - History
  undo: () => void
  redo: () => void
  canUndo: () => boolean
  canRedo: () => boolean
  pushToHistory: () => void

  // Actions - Clipboard
  copyElement: (id: string) => void
  cutElement: (id: string) => void
  pasteElement: (targetId: string) => void
  canPaste: () => boolean

  // Actions - Page
  loadPage: (
    pageId: string,
    content: PageContent,
    metadata?: {
      slug?: string
      title?: string
      description?: string
      seo?: any
    }
  ) => void
  savePage: () => Promise<void>
  publishPage: () => Promise<void>
  resetPage: () => void
  setContent: (content: PageContent) => void

  // Actions - Errors
  addError: (error: BuilderError) => void
  clearErrors: () => void
}

// ==================== INITIAL STATE ====================

const initialUIState: UIState = {
  previewMode: 'desktop',
  deviceWidth: 1440,
  zoom: 100,
  showGrid: false,
  showOutlines: true,
  showSpacing: false,
  leftPanelOpen: true,
  rightPanelOpen: true,
  bottomPanelOpen: false,
  activePropertyTab: 'content',
  activeLeftTab: 'components'
}

const initialSelectionState: SelectionState = {
  selectedId: null,
  selectedType: null,
  hoveredId: null,
  hoveredType: null
}

const initialClipboardState: ClipboardState = {
  copiedItem: null,
  copiedType: null
}

const initialHistoryState: HistoryState = {
  past: [],
  future: []
}

// ==================== STORE ====================

export const useBuilderStore = create<BuilderStore>()(
  devtools(
    immer((set, get) => ({
      // Initial state
      pageId: null,
      pageSlug: null,
      pageTitle: null,
      pageDescription: null,
      pageSEO: null,
      content: createEmptyContent(),
      originalContent: null,
      selection: initialSelectionState,
      ui: initialUIState,
      clipboard: initialClipboardState,
      history: initialHistoryState,
      isDirty: false,
      isSaving: false,
      isPublishing: false,
      lastSaved: null,
      errors: [],

      // ==================== SELECTION ACTIONS ====================

      selectElement: (id, type) => {
        set((state) => {
          if (id === null) {
            state.selection.selectedId = null
            state.selection.selectedType = null
          } else {
            state.selection.selectedId = id
            state.selection.selectedType = type || getElementType(state.content, id)
          }
        })
      },

      hoverElement: (id, type) => {
        set((state) => {
          if (id === null) {
            state.selection.hoveredId = null
            state.selection.hoveredType = null
          } else {
            state.selection.hoveredId = id
            state.selection.hoveredType = type || getElementType(state.content, id)
          }
        })
      },

      clearSelection: () => {
        set((state) => {
          state.selection = initialSelectionState
        })
      },

      // ==================== UI ACTIONS ====================

      setPreviewMode: (mode) => {
        set((state) => {
          state.ui.previewMode = mode
          state.ui.deviceWidth = mode === 'desktop' ? 1440 : mode === 'tablet' ? 768 : 375
        })
      },

      setZoom: (zoom) => {
        set((state) => {
          state.ui.zoom = Math.max(50, Math.min(200, zoom))
        })
      },

      toggleGrid: () => {
        set((state) => {
          state.ui.showGrid = !state.ui.showGrid
        })
      },

      toggleOutlines: () => {
        set((state) => {
          state.ui.showOutlines = !state.ui.showOutlines
        })
      },

      toggleSpacing: () => {
        set((state) => {
          state.ui.showSpacing = !state.ui.showSpacing
        })
      },

      toggleLeftPanel: () => {
        set((state) => {
          state.ui.leftPanelOpen = !state.ui.leftPanelOpen
        })
      },

      toggleRightPanel: () => {
        set((state) => {
          state.ui.rightPanelOpen = !state.ui.rightPanelOpen
        })
      },

      toggleBottomPanel: () => {
        set((state) => {
          state.ui.bottomPanelOpen = !state.ui.bottomPanelOpen
        })
      },

      setActivePropertyTab: (tab) => {
        set((state) => {
          state.ui.activePropertyTab = tab
        })
      },

      setActiveLeftTab: (tab) => {
        set((state) => {
          state.ui.activeLeftTab = tab
        })
      },

      // ==================== SECTION ACTIONS ====================

      addSection: (section, index) => {
        const { content } = get()
        set((state) => {
          state.content = addSection(content, section, index)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      deleteSection: (sectionId) => {
        const { content } = get()
        set((state) => {
          state.content = deleteSection(content, sectionId)
          state.isDirty = true
          // Clear selection if deleted element was selected
          if (state.selection.selectedId === sectionId) {
            state.selection = initialSelectionState
          }
        })
        get().pushToHistory()
      },

      updateSection: (sectionId, updates) => {
        const { content } = get()
        set((state) => {
          state.content = updateSection(content, sectionId, updates)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      moveSection: (sectionId, newIndex) => {
        const { content } = get()
        set((state) => {
          state.content = moveSection(content, sectionId, newIndex)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      duplicateSection: (sectionId) => {
        const { content } = get()
        set((state) => {
          state.content = duplicateSection(content, sectionId)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      // ==================== ROW ACTIONS ====================

      addRow: (sectionId, row, index) => {
        console.log('[Store] Adding row:', { sectionId, row, index })
        const { content } = get()
        set((state) => {
          state.content = addRow(content, sectionId, row, index)
          state.isDirty = true
        })
        console.log('[Store] Row added, new content:', get().content)
        get().pushToHistory()
      },

      deleteRow: (rowId) => {
        const { content } = get()
        set((state) => {
          state.content = deleteRow(content, rowId)
          state.isDirty = true
          if (state.selection.selectedId === rowId) {
            state.selection = initialSelectionState
          }
        })
        get().pushToHistory()
      },

      updateRow: (rowId, updates) => {
        const { content } = get()
        set((state) => {
          state.content = updateRow(content, rowId, updates)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      moveRow: (rowId, targetSectionId, newIndex) => {
        const { content } = get()
        set((state) => {
          state.content = moveRow(content, rowId, targetSectionId, newIndex)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      // ==================== COLUMN ACTIONS ====================

      addColumn: (rowId, column, index) => {
        console.log('[Store] 🟢 addColumn called with:', { rowId, column, index })
        const { content } = get()
        console.log('[Store] Current content before add:', JSON.parse(JSON.stringify(content)))

        const newContent = addColumn(content, rowId, column, index)
        console.log(
          '[Store] New content after addColumn utility:',
          JSON.parse(JSON.stringify(newContent))
        )

        set((state) => {
          state.content = newContent
          state.isDirty = true
        })

        console.log('[Store] ✅ State updated, final content:', get().content)
        console.log('[Store] Sections count:', get().content.sections.length)
        get().content.sections.forEach((section, idx) => {
          console.log(`[Store] Section ${idx} has ${section.rows.length} rows`)
          section.rows.forEach((row, ridx) => {
            console.log(`[Store]   Row ${ridx} (id: ${row.id}) has ${row.columns.length} columns`)
          })
        })

        get().pushToHistory()
      },

      deleteColumn: (columnId) => {
        const { content } = get()
        set((state) => {
          state.content = deleteColumn(content, columnId)
          state.isDirty = true
          if (state.selection.selectedId === columnId) {
            state.selection = initialSelectionState
          }
        })
        get().pushToHistory()
      },

      updateColumn: (columnId, updates) => {
        const { content } = get()
        set((state) => {
          state.content = updateColumn(content, columnId, updates)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      moveColumn: (columnId, targetRowId, newIndex) => {
        const { content } = get()
        set((state) => {
          state.content = moveColumn(content, columnId, targetRowId, newIndex)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      // ==================== COMPONENT ACTIONS ====================

      addComponent: (columnId, component, index) => {
        const { content } = get()
        set((state) => {
          state.content = addComponent(content, columnId, component, index)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      deleteComponent: (componentId) => {
        const { content } = get()
        set((state) => {
          state.content = deleteComponent(content, componentId)
          state.isDirty = true
          if (state.selection.selectedId === componentId) {
            state.selection = initialSelectionState
          }
        })
        get().pushToHistory()
      },

      updateComponent: (componentId, updates) => {
        const { content } = get()
        set((state) => {
          state.content = updateComponent(content, componentId, updates)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      moveComponent: (componentId, targetColumnId, newIndex) => {
        const { content } = get()
        set((state) => {
          state.content = moveComponent(content, componentId, targetColumnId, newIndex)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      duplicateComponent: (componentId) => {
        const { content } = get()
        set((state) => {
          state.content = duplicateComponent(content, componentId)
          state.isDirty = true
        })
        get().pushToHistory()
      },

      // ==================== HISTORY ACTIONS ====================

      pushToHistory: () => {
        const { content } = get()
        set((state) => {
          // Add current content to past
          state.history.past.push(JSON.parse(JSON.stringify(content)))
          // Clear future (can't redo after new change)
          state.history.future = []
          // Limit history size to 50 states
          if (state.history.past.length > 50) {
            state.history.past.shift()
          }
        })
      },

      undo: () => {
        const { history, content } = get()
        if (history.past.length === 0) return

        set((state) => {
          // Move current content to future
          state.history.future.unshift(JSON.parse(JSON.stringify(content)))
          // Restore previous content from past
          const previousContent = state.history.past.pop()
          if (previousContent) {
            state.content = previousContent
            state.isDirty = true
          }
        })
      },

      redo: () => {
        const { history, content } = get()
        if (history.future.length === 0) return

        set((state) => {
          // Move current content to past
          state.history.past.push(JSON.parse(JSON.stringify(content)))
          // Restore next content from future
          const nextContent = state.history.future.shift()
          if (nextContent) {
            state.content = nextContent
            state.isDirty = true
          }
        })
      },

      canUndo: () => get().history.past.length > 0,
      canRedo: () => get().history.future.length > 0,

      // ==================== CLIPBOARD ACTIONS ====================

      copyElement: (id) => {
        const { content } = get()
        const result = findElementById(content, id)
        if (!result) return

        set((state) => {
          state.clipboard.copiedItem = JSON.parse(JSON.stringify(result.element))
          state.clipboard.copiedType = result.type
        })
      },

      cutElement: (id) => {
        get().copyElement(id)
        const type = getElementType(get().content, id)

        // Delete based on type
        if (type === 'section') get().deleteSection(id)
        else if (type === 'row') get().deleteRow(id)
        else if (type === 'column') get().deleteColumn(id)
        else if (type === 'component') get().deleteComponent(id)
      },

      pasteElement: (targetId) => {
        const { clipboard, content } = get()
        if (!clipboard.copiedItem || !clipboard.copiedType) return

        const targetResult = findElementById(content, targetId)
        if (!targetResult) return

        // Clone item with new IDs
        const clonedItem = deepCloneWithNewIds(clipboard.copiedItem)

        // Paste based on types
        if (clipboard.copiedType === 'section') {
          get().addSection(clonedItem)
        } else if (clipboard.copiedType === 'row' && targetResult.type === 'section') {
          get().addRow(targetId, clonedItem)
        } else if (clipboard.copiedType === 'column' && targetResult.type === 'row') {
          get().addColumn(targetId, clonedItem)
        } else if (clipboard.copiedType === 'component' && targetResult.type === 'column') {
          get().addComponent(targetId, clonedItem)
        }
      },

      canPaste: () => {
        const { clipboard } = get()
        return clipboard.copiedItem !== null && clipboard.copiedType !== null
      },

      // ==================== PAGE ACTIONS ====================

      loadPage: (pageId, content, metadata) => {
        set((state) => {
          state.pageId = pageId
          state.pageSlug = metadata?.slug || null
          state.pageTitle = metadata?.title || null
          state.pageDescription = metadata?.description || null
          state.pageSEO = metadata?.seo || null
          state.content = content
          state.originalContent = JSON.parse(JSON.stringify(content))
          state.isDirty = false
          state.selection = initialSelectionState
          state.history = initialHistoryState
          state.errors = []
        })
      },

      savePage: async () => {
        const { pageId, pageSlug, pageTitle, pageDescription, pageSEO, content } = get()
        if (!pageId) {
          console.error('[Store] Cannot save: pageId is null')
          return
        }

        set((state) => {
          state.isSaving = true
        })

        try {
          // Validate content before saving
          const validation = validateContent(content)
          if (!validation.valid) {
            throw new Error(`Invalid content: ${validation.errors.join(', ')}`)
          }

          // Prepare payload with all page data
          const payload: any = {
            content: content
          }

          // Include additional metadata if available
          if (pageSlug) payload.slug = pageSlug
          if (pageTitle) payload.title = pageTitle
          if (pageDescription) payload.description = pageDescription
          if (pageSEO) payload.seo = pageSEO

          console.log('[Store] Saving page:', { pageId, payload })

          // Call API to save page content
          // Using PUT to update the page with new content
          const response = await requests.put(`/admin/pages/${pageId}`, payload)

          console.log('[Store] Page saved successfully:', response)

          set((state) => {
            state.isDirty = false
            state.lastSaved = new Date()
            state.originalContent = JSON.parse(JSON.stringify(content))
          })

          // Success notification (you might want to use a toast notification system)
          console.log('[Store] ✅ Page saved successfully!')
        } catch (error: any) {
          console.error('[Store] Failed to save page:', error)

          get().addError({
            id: Date.now().toString(),
            type: 'save',
            message: error.message || 'Failed to save page',
            timestamp: new Date()
          })

          // Re-throw to allow caller to handle the error
          throw error
        } finally {
          set((state) => {
            state.isSaving = false
          })
        }
      },

      publishPage: async () => {
        const { pageId } = get()
        if (!pageId) {
          console.error('[Store] Cannot publish: pageId is null')
          return
        }

        set((state) => {
          state.isPublishing = true
        })

        try {
          // Save first, then publish
          await get().savePage()

          console.log('[Store] Publishing page:', pageId)

          // Call API to publish the page
          const response = await requests.post(`/admin/pages/${pageId}/publish`)

          console.log('[Store] ✅ Page published successfully:', response)
        } catch (error: any) {
          console.error('[Store] Failed to publish page:', error)

          get().addError({
            id: Date.now().toString(),
            type: 'save',
            message: error.message || 'Failed to publish page',
            timestamp: new Date()
          })

          // Re-throw to allow caller to handle the error
          throw error
        } finally {
          set((state) => {
            state.isPublishing = false
          })
        }
      },

      resetPage: () => {
        const { originalContent } = get()
        if (originalContent) {
          set((state) => {
            state.content = JSON.parse(JSON.stringify(originalContent))
            state.isDirty = false
            state.selection = initialSelectionState
            state.history = initialHistoryState
          })
        }
      },

      setContent: (content) => {
        set((state) => {
          state.content = content
          state.isDirty = true
        })
        get().pushToHistory()
      },

      // ==================== ERROR ACTIONS ====================

      addError: (error) => {
        set((state) => {
          state.errors.push(error)
        })
      },

      clearErrors: () => {
        set((state) => {
          state.errors = []
        })
      }
    })),
    { name: 'PageBuilder' }
  )
)

// Export hooks for specific state slices (performance optimization)
export const useBuilderContent = () => useBuilderStore((state) => state.content)
export const useBuilderSelection = () => useBuilderStore((state) => state.selection)
export const useBuilderUI = () => useBuilderStore((state) => state.ui)
export const useBuilderHistory = () => useBuilderStore((state) => state.history)
export const useBuilderStatus = () =>
  useBuilderStore((state) => ({
    isDirty: state.isDirty,
    isSaving: state.isSaving,
    isPublishing: state.isPublishing,
    lastSaved: state.lastSaved
  }))

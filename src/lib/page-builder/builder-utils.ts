/**
 * Page Builder Utility Functions
 * Tree operations, element manipulation, and helper functions
 */

import type {
  Column,
  BaseComponent as Component,
  DraggableType,
  PageContent,
  Row,
  Section
} from '@/types/page-builder'

// ==================== ID GENERATION ====================

/**
 * Generate UUID v4
 */
export const generateId = (): string => {
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
    const r = (Math.random() * 16) | 0
    const v = c === 'x' ? r : (r & 0x3) | 0x8
    return v.toString(16)
  })
}

// ==================== TREE TRAVERSAL ====================

/**
 * Find element by ID in page content
 */
export const findElementById = (
  content: PageContent,
  id: string
): { type: DraggableType; element: any; parent?: any } | null => {
  // Search sections
  for (const section of content.sections) {
    if (section.id === id) {
      return { type: 'section', element: section }
    }

    // Search rows
    for (const row of section.rows) {
      if (row.id === id) {
        return { type: 'row', element: row, parent: section }
      }

      // Search columns
      for (const column of row.columns) {
        if (column.id === id) {
          return { type: 'column', element: column, parent: row }
        }

        // Search components
        for (const component of column.components) {
          if (component.id === id) {
            return { type: 'component', element: component, parent: column }
          }
        }
      }
    }
  }

  return null
}

/**
 * Get parent element by child ID
 */
export const findParentById = (content: PageContent, childId: string): any | null => {
  const result = findElementById(content, childId)
  return result?.parent || null
}

/**
 * Get element type by ID
 */
export const getElementType = (content: PageContent, id: string): DraggableType | null => {
  const result = findElementById(content, id)
  return result?.type || null
}

// ==================== SECTION OPERATIONS ====================

/**
 * Add section to page
 */
export const addSection = (content: PageContent, section: Section, index?: number): PageContent => {
  const newSections = [...content.sections]

  if (index !== undefined && index >= 0 && index <= newSections.length) {
    newSections.splice(index, 0, section)
  } else {
    newSections.push(section)
  }

  // Reorder all sections - create new objects with updated order
  const reorderedSections = newSections.map((s, i) => ({
    ...s,
    order: i
  }))

  return {
    ...content,
    sections: reorderedSections
  }
}

/**
 * Delete section by ID
 */
export const deleteSection = (content: PageContent, sectionId: string): PageContent => {
  const newSections = content.sections.filter((s) => s.id !== sectionId)

  // Reorder remaining sections - create new objects with updated order
  const reorderedSections = newSections.map((s, i) => ({
    ...s,
    order: i
  }))

  return {
    ...content,
    sections: reorderedSections
  }
}

/**
 * Update section by ID
 */
export const updateSection = (
  content: PageContent,
  sectionId: string,
  updates: Partial<Section>
): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) =>
      section.id === sectionId ? { ...section, ...updates } : section
    )
  }
}

/**
 * Move section to new index
 */
export const moveSection = (
  content: PageContent,
  sectionId: string,
  newIndex: number
): PageContent => {
  const newSections = [...content.sections]
  const oldIndex = newSections.findIndex((s) => s.id === sectionId)

  if (oldIndex === -1) return content

  const [section] = newSections.splice(oldIndex, 1)
  newSections.splice(newIndex, 0, section)

  // Reorder all sections - create new objects with updated order
  const reorderedSections = newSections.map((s, i) => ({
    ...s,
    order: i
  }))

  return {
    ...content,
    sections: reorderedSections
  }
}

/**
 * Duplicate section
 */
export const duplicateSection = (content: PageContent, sectionId: string): PageContent => {
  const sectionIndex = content.sections.findIndex((s) => s.id === sectionId)
  if (sectionIndex === -1) return content

  const originalSection = content.sections[sectionIndex]
  const duplicatedSection = deepCloneWithNewIds(originalSection) as Section

  return addSection(content, duplicatedSection, sectionIndex + 1)
}

// ==================== ROW OPERATIONS ====================

/**
 * Add row to section
 */
export const addRow = (
  content: PageContent,
  sectionId: string,
  row: Row,
  index?: number
): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => {
      if (section.id !== sectionId) return section

      const newRows = [...section.rows]

      if (index !== undefined && index >= 0 && index <= newRows.length) {
        newRows.splice(index, 0, row)
      } else {
        newRows.push(row)
      }

      // Reorder all rows - create new objects with updated order
      const reorderedRows = newRows.map((r, i) => ({
        ...r,
        order: i
      }))

      return { ...section, rows: reorderedRows }
    })
  }
}

/**
 * Delete row by ID
 */
export const deleteRow = (content: PageContent, rowId: string): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.filter((r) => r.id !== rowId).map((r, i) => ({ ...r, order: i }))
    }))
  }
}

/**
 * Update row by ID
 */
export const updateRow = (
  content: PageContent,
  rowId: string,
  updates: Partial<Row>
): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => (row.id === rowId ? { ...row, ...updates } : row))
    }))
  }
}

/**
 * Move row to new section/index
 */
export const moveRow = (
  content: PageContent,
  rowId: string,
  targetSectionId: string,
  newIndex: number
): PageContent => {
  let rowToMove: Row | null = null
  let sourceSectionId: string | null = null

  // Find and remove row from source
  const contentWithoutRow: PageContent = {
    ...content,
    sections: content.sections.map((section) => {
      const rowIndex = section.rows.findIndex((r) => r.id === rowId)
      if (rowIndex !== -1) {
        rowToMove = section.rows[rowIndex]
        sourceSectionId = section.id
        return {
          ...section,
          rows: section.rows.filter((r) => r.id !== rowId).map((r, i) => ({ ...r, order: i }))
        }
      }
      return section
    })
  }

  if (!rowToMove) return content

  // Add row to target section
  return addRow(contentWithoutRow, targetSectionId, rowToMove, newIndex)
}

// ==================== COLUMN OPERATIONS ====================

/**
 * Add column to row
 */
export const addColumn = (
  content: PageContent,
  rowId: string,
  column: Column,
  index?: number
): PageContent => {
  console.log('[builder-utils] 🔧 addColumn utility called:', { rowId, column, index })
  console.log('[builder-utils] Looking for row with id:', rowId)

  let rowFound = false

  const result = {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => {
        if (row.id !== rowId) {
          console.log('[builder-utils] Skipping row:', row.id)
          return row
        }

        rowFound = true
        console.log('[builder-utils] ✅ Found matching row:', row.id)
        console.log('[builder-utils] Current columns in row:', row.columns.length)

        const newColumns = [...row.columns]

        if (index !== undefined && index >= 0 && index <= newColumns.length) {
          newColumns.splice(index, 0, column)
          console.log('[builder-utils] Inserted column at index:', index)
        } else {
          newColumns.push(column)
          console.log('[builder-utils] Pushed column to end')
        }

        console.log('[builder-utils] New columns count:', newColumns.length)

        // Reorder all columns - create new objects with updated order
        const reorderedColumns = newColumns.map((c, i) => ({
          ...c,
          order: i
        }))

        console.log('[builder-utils] Reordered columns:', reorderedColumns.length)

        return { ...row, columns: reorderedColumns }
      })
    }))
  }

  if (!rowFound) {
    console.error('[builder-utils] ❌ ERROR: Row not found with id:', rowId)
  } else {
    console.log('[builder-utils] ✅ Column added successfully')
  }

  return result
}

/**
 * Delete column by ID
 */
export const deleteColumn = (content: PageContent, columnId: string): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.filter((c) => c.id !== columnId).map((c, i) => ({ ...c, order: i }))
      }))
    }))
  }
}

/**
 * Update column by ID
 */
export const updateColumn = (
  content: PageContent,
  columnId: string,
  updates: Partial<Column>
): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) =>
          column.id === columnId ? { ...column, ...updates } : column
        )
      }))
    }))
  }
}

/**
 * Move column to new row/index
 */
export const moveColumn = (
  content: PageContent,
  columnId: string,
  targetRowId: string,
  newIndex: number
): PageContent => {
  let columnToMove: Column | null = null

  // Find and remove column from source
  const contentWithoutColumn: PageContent = {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => {
        const columnIndex = row.columns.findIndex((c) => c.id === columnId)
        if (columnIndex !== -1) {
          columnToMove = row.columns[columnIndex]
          return {
            ...row,
            columns: row.columns
              .filter((c) => c.id !== columnId)
              .map((c, i) => ({ ...c, order: i }))
          }
        }
        return row
      })
    }))
  }

  if (!columnToMove) return content

  // Add column to target row
  return addColumn(contentWithoutColumn, targetRowId, columnToMove, newIndex)
}

// ==================== COMPONENT OPERATIONS ====================

/**
 * Add component to column
 */
export const addComponent = (
  content: PageContent,
  columnId: string,
  component: Component,
  index?: number
): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => {
          if (column.id !== columnId) return column

          const newComponents = [...column.components]

          if (index !== undefined && index >= 0 && index <= newComponents.length) {
            newComponents.splice(index, 0, component)
          } else {
            newComponents.push(component)
          }

          // Reorder all components - create new objects with updated order
          const reorderedComponents = newComponents.map((c, i) => ({
            ...c,
            order: i
          }))

          return { ...column, components: reorderedComponents }
        })
      }))
    }))
  }
}

/**
 * Delete component by ID
 */
export const deleteComponent = (content: PageContent, componentId: string): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          components: column.components
            .filter((c) => c.id !== componentId)
            .map((c, i) => ({ ...c, order: i }))
        }))
      }))
    }))
  }
}

/**
 * Update component by ID
 */
export const updateComponent = (
  content: PageContent,
  componentId: string,
  updates: Partial<Component>
): PageContent => {
  return {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => ({
          ...column,
          components: column.components.map((component) =>
            component.id === componentId ? { ...component, ...updates } : component
          )
        }))
      }))
    }))
  }
}

/**
 * Move component to new column/index
 */
export const moveComponent = (
  content: PageContent,
  componentId: string,
  targetColumnId: string,
  newIndex: number
): PageContent => {
  console.log('[builder-utils] 🔧 moveComponent called:', {
    componentId,
    targetColumnId,
    newIndex
  })

  let componentToMove: Component | null = null
  let sourceColumnId: string | null = null

  // Find and remove component from source
  const contentWithoutComponent: PageContent = {
    ...content,
    sections: content.sections.map((section) => ({
      ...section,
      rows: section.rows.map((row) => ({
        ...row,
        columns: row.columns.map((column) => {
          const componentIndex = column.components.findIndex((c) => c.id === componentId)
          if (componentIndex !== -1) {
            componentToMove = column.components[componentIndex]
            sourceColumnId = column.id
            console.log('[builder-utils] Found component in column:', column.id)
            console.log('[builder-utils] Component was at index:', componentIndex)
            console.log('[builder-utils] Components before removal:', column.components.length)
            const filtered = column.components
              .filter((c) => c.id !== componentId)
              .map((c, i) => ({ ...c, order: i }))
            console.log('[builder-utils] Components after removal:', filtered.length)
            return {
              ...column,
              components: filtered
            }
          }
          return column
        })
      }))
    }))
  }

  if (!componentToMove) {
    console.log('[builder-utils] ❌ Component not found:', componentId)
    return content
  }

  console.log(
    '[builder-utils] Moving component from column:',
    sourceColumnId,
    'to column:',
    targetColumnId
  )
  console.log('[builder-utils] Target index:', newIndex)

  // Add component to target column
  const result = addComponent(contentWithoutComponent, targetColumnId, componentToMove, newIndex)

  // Log result
  const targetColumn = result.sections
    .flatMap((s) => s.rows)
    .flatMap((r) => r.columns)
    .find((c) => c.id === targetColumnId)

  console.log(
    '[builder-utils] ✅ Component moved. Target column now has',
    targetColumn?.components.length,
    'components'
  )
  console.log(
    '[builder-utils] Component order in target:',
    targetColumn?.components.map((c, i) => `${i}: ${c.type}(${c.id.substring(0, 8)})`)
  )

  return result
}

/**
 * Duplicate component
 */
export const duplicateComponent = (content: PageContent, componentId: string): PageContent => {
  let columnId: string | null = null
  let componentIndex: number = -1

  // Find the component and its parent column
  for (const section of content.sections) {
    for (const row of section.rows) {
      for (const column of row.columns) {
        const index = column.components.findIndex((c) => c.id === componentId)
        if (index !== -1) {
          columnId = column.id
          componentIndex = index
          break
        }
      }
      if (columnId) break
    }
    if (columnId) break
  }

  if (!columnId || componentIndex === -1) return content

  const result = findElementById(content, componentId)
  if (!result) return content

  const duplicatedComponent = deepCloneWithNewIds(result.element) as Component

  return addComponent(content, columnId, duplicatedComponent, componentIndex + 1)
}

// ==================== UTILITY FUNCTIONS ====================

/**
 * Deep clone object with new IDs for all elements
 */
export const deepCloneWithNewIds = (obj: any): any => {
  if (obj === null || typeof obj !== 'object') {
    return obj
  }

  if (Array.isArray(obj)) {
    return obj.map((item) => deepCloneWithNewIds(item))
  }

  const cloned: any = {}

  for (const key in obj) {
    if (key === 'id') {
      cloned[key] = generateId()
    } else if (key === 'rows' || key === 'columns' || key === 'components') {
      cloned[key] = obj[key].map((item: any) => deepCloneWithNewIds(item))
    } else if (typeof obj[key] === 'object' && obj[key] !== null) {
      cloned[key] = deepCloneWithNewIds(obj[key])
    } else {
      cloned[key] = obj[key]
    }
  }

  return cloned
}

/**
 * Get total count of each element type in content
 */
export const getContentStats = (
  content: PageContent
): {
  sections: number
  rows: number
  columns: number
  components: number
} => {
  let rows = 0
  let columns = 0
  let components = 0

  for (const section of content.sections) {
    rows += section.rows.length

    for (const row of section.rows) {
      columns += row.columns.length

      for (const column of row.columns) {
        components += column.components.length
      }
    }
  }

  return {
    sections: content.sections.length,
    rows,
    columns,
    components
  }
}

/**
 * Validate page content structure
 */
export const validateContent = (content: PageContent): { valid: boolean; errors: string[] } => {
  const errors: string[] = []

  if (!content.sections || !Array.isArray(content.sections)) {
    errors.push('Content must have sections array')
    return { valid: false, errors }
  }

  // Validate each section
  content.sections.forEach((section, sIndex) => {
    if (!section.id) errors.push(`Section ${sIndex}: Missing ID`)
    if (!section.name) errors.push(`Section ${sIndex}: Missing name`)
    if (!Array.isArray(section.rows)) errors.push(`Section ${sIndex}: Missing rows array`)

    // Validate each row
    section.rows.forEach((row, rIndex) => {
      if (!row.id) errors.push(`Section ${sIndex}, Row ${rIndex}: Missing ID`)
      if (!Array.isArray(row.columns)) {
        errors.push(`Section ${sIndex}, Row ${rIndex}: Missing columns array`)
      }

      // Validate each column
      row.columns.forEach((column, cIndex) => {
        if (!column.id) {
          errors.push(`Section ${sIndex}, Row ${rIndex}, Column ${cIndex}: Missing ID`)
        }
        if (typeof column.width !== 'number' || column.width < 1 || column.width > 12) {
          errors.push(
            `Section ${sIndex}, Row ${rIndex}, Column ${cIndex}: Invalid width (must be 1-12)`
          )
        }
        if (!Array.isArray(column.components)) {
          errors.push(
            `Section ${sIndex}, Row ${rIndex}, Column ${cIndex}: Missing components array`
          )
        }

        // Validate each component
        column.components.forEach((component, compIndex) => {
          if (!component.id) {
            errors.push(
              `Section ${sIndex}, Row ${rIndex}, Column ${cIndex}, Component ${compIndex}: Missing ID`
            )
          }
          if (!component.type) {
            errors.push(
              `Section ${sIndex}, Row ${rIndex}, Column ${cIndex}, Component ${compIndex}: Missing type`
            )
          }
        })
      })
    })
  })

  return {
    valid: errors.length === 0,
    errors
  }
}

/**
 * Create empty page content
 */
export const createEmptyContent = (): PageContent => {
  return {
    sections: []
  }
}

/**
 * Create default section with one row and one column
 */
export const createDefaultSection = (name: string = 'New Section'): Section => {
  const sectionId = generateId()
  const rowId = generateId()
  const columnId = generateId()

  return {
    id: sectionId,
    name,
    order: 0,
    settings: {
      className: 'py-16'
    },
    rows: [
      {
        id: rowId,
        order: 0,
        settings: {
          className: 'gap-8'
        },
        columns: [
          {
            id: columnId,
            width: 12,
            order: 0,
            components: []
          }
        ]
      }
    ]
  }
}

/**
 * Create row with specified column layout
 */
export const createRow = (columnWidths: number[] = [12]): Row => {
  const rowId = generateId()

  return {
    id: rowId,
    order: 0,
    settings: {
      columnsGap: '30px'
    },
    columns: columnWidths.map((width, index) => ({
      id: generateId(),
      width,
      order: index,
      components: []
    }))
  }
}

/**
 * Export all utilities
 */
export default {
  generateId,
  findElementById,
  findParentById,
  getElementType,
  addSection,
  deleteSection,
  updateSection,
  moveSection,
  duplicateSection,
  addRow,
  deleteRow,
  updateRow,
  moveRow,
  addColumn,
  deleteColumn,
  updateColumn,
  moveColumn,
  addComponent,
  deleteComponent,
  updateComponent,
  moveComponent,
  duplicateComponent,
  deepCloneWithNewIds,
  getContentStats,
  validateContent,
  createEmptyContent,
  createDefaultSection,
  createRow
}

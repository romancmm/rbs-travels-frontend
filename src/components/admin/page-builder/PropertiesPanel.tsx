'use client'

import { Settings } from 'lucide-react'

import { useBuilderStore } from '@/lib/page-builder/builder-store'

export function PropertiesPanel() {
    const selectedId = useBuilderStore((state) => state.selection.selectedId)
    const selectedType = useBuilderStore((state) => state.selection.selectedType)
    const rightPanelOpen = useBuilderStore((state) => state.ui.rightPanelOpen)

    if (!rightPanelOpen) return null

    return (
        <div className="bg-white border-l w-80 shrink-0">
            <div className="flex flex-col h-full">
                {/* Header */}
                <div className="flex justify-between items-center px-4 border-b h-14">
                    <div className="flex items-center gap-2">
                        <Settings className="w-4 h-4 text-gray-500" />
                        <h2 className="font-semibold text-gray-900">Properties</h2>
                    </div>
                </div>

                {/* Content */}
                <div className="flex-1 p-4 overflow-auto">
                    {selectedId ? (
                        <div className="space-y-4">
                            <div className="bg-gray-50 p-4 border rounded-lg">
                                <p className="text-gray-600 text-sm">
                                    Selected: <strong>{selectedType}</strong>
                                </p>
                                <p className="mt-1 text-gray-500 text-xs">ID: {selectedId}</p>
                            </div>
                            <p className="text-gray-500 text-sm">
                                Properties panel coming soon...
                            </p>
                        </div>
                    ) : (
                        <div className="flex flex-col justify-center items-center py-12 text-center">
                            <Settings className="w-8 h-8 text-gray-300" />
                            <p className="mt-4 font-medium text-gray-900 text-sm">
                                No element selected
                            </p>
                            <p className="mt-1 text-gray-500 text-xs">
                                Select an element to edit its properties
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </div>
    )
}

'use client'

import { clearSession } from '@/services/api/authUtils'
import { toast } from 'sonner'

type ErrorPayload = string | string[] | Record<string, unknown> | null | undefined

export const showErrorToast = (errors: ErrorPayload) => {
    const list = normalizeErrorPayload(errors)

    if (list.length === 0) return

    if (hasAuthTokenFailure(list)) {
        clearSession()
        return
    }

    list.forEach((entry) => {
        if (!entry) return

        const [title, ...rest] = entry.split(':')
        const description = rest.join(':').trim()

        if (description) {
            toast.error(title.trim() || 'Error', {
                description
            })
            return
        }

        toast.error(entry)
    })
}

const hasAuthTokenFailure = (messages: string[]): boolean => {
    const joined = messages.join(' ').toLowerCase()

    return (
        joined.includes('invalid authentication token') ||
        joined.includes('token expired') ||
        joined.includes('expired token') ||
        joined.includes('jwt expired') ||
        joined.includes('session has expired') ||
        joined.includes('unauthorized')
    )
}

const normalizeErrorPayload = (value: ErrorPayload, keyPath?: string): string[] => {
    if (!value) return []

    if (Array.isArray(value)) {
        return value.flatMap((entry) => normalizeErrorPayload(entry, keyPath))
    }

    if (typeof value === 'object') {
        return Object.entries(value).flatMap(([key, entry]) => {
            const nextKey = keyPath ? `${keyPath}.${key}` : key
            return normalizeErrorPayload(entry as ErrorPayload, nextKey)
        })
    }

    const message = String(value).trim()
    if (!message) return []

    return keyPath ? [`${keyPath}: ${message}`] : [message]
}

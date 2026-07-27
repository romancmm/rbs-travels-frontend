const DEFAULT_ERROR_MESSAGE = 'Something went wrong. Please try again.'

const STATUS_MESSAGES: Record<number, string> = {
    400: 'We could not process your request. Please review the details and try again.',
    401: 'Your session has expired. Please sign in again.',
    403: 'You are not allowed to perform this action.',
    404: 'The requested resource was not found.',
    409: 'This action conflicts with the current state of the resource.',
    422: 'Some fields need attention before we can continue.',
    429: 'You are sending too many requests. Please slow down.',
    500: 'Our servers hit a snag. Please retry in a moment.'
}

const isRecord = (value: unknown): value is Record<string, unknown> =>
    typeof value === 'object' && value !== null

const flattenMessages = (value: unknown, keyPath?: string): string[] => {
    if (!value) return []

    if (Array.isArray(value)) {
        return value.flatMap((entry) => flattenMessages(entry, keyPath))
    }

    if (isRecord(value)) {
        return Object.entries(value).flatMap(([key, entry]) => {
            const nextKey = keyPath ? `${keyPath}.${key}` : key
            return flattenMessages(entry, nextKey)
        })
    }

    if (value instanceof Error) {
        const message = value.message || ''
        return message ? (keyPath ? [`${keyPath}: ${message}`] : [message]) : []
    }

    const message = String(value)
    return keyPath ? [`${keyPath}: ${message}`] : [message]
}

const getFirstNonEmptyMessages = (values: unknown[]): string[] => {
    for (const value of values) {
        const messages = flattenMessages(value).filter((message) => message.trim().length > 0)

        if (messages.length > 0) {
            return messages
        }
    }

    return []
}

export const deserializeServerResponse = async (response: Response): Promise<unknown> => {
    const contentType = response.headers.get('content-type') ?? ''

    try {
        if (contentType.includes('application/json')) {
            return await response.json()
        }

        const text = await response.text()
        return text ? { message: text } : null
    } catch {
        return null
    }
}

export const extractServerActionErrors = (
    payload: unknown,
    status?: number
): string[] => {
    let messages: string[] = []

    if (isRecord(payload)) {
        const responsePayload = isRecord(payload.response) ? payload.response : null
        const flattened = getFirstNonEmptyMessages([
            responsePayload?.errors,
            payload.errors,
            payload.error,
            payload.message,
            payload.detail,
            payload.data,
            payload
        ])

        if (flattened.length > 0) {
            messages = flattened
        }
    }

    if (messages.length === 0) {
        if (typeof payload === 'string' && payload.trim().length > 0) {
            messages = [payload]
        } else if (status && STATUS_MESSAGES[status]) {
            messages = [STATUS_MESSAGES[status]]
        } else {
            messages = [DEFAULT_ERROR_MESSAGE]
        }
    }

    return messages
}

export const normalizeServerActionException = (error: unknown): string[] => {
    if (error instanceof DOMException && error.name === 'AbortError') {
        return ['The request was cancelled. Please try again.']
    }

    if (error instanceof Error) {
        return error.message ? [error.message] : [DEFAULT_ERROR_MESSAGE]
    }

    return [DEFAULT_ERROR_MESSAGE]
}

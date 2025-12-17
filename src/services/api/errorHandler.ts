import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { clearSession } from './authUtils'

export const handleApiError = (error: AxiosError) => {
  const status = error.response?.status
  const responseData = error.response?.data as { message?: string } | undefined

  // Check for invalid token errors
  const isInvalidToken =
    status === 401 ||
    responseData?.message?.toLowerCase().includes('invalid token') ||
    responseData?.message?.toLowerCase().includes('token expired') ||
    responseData?.message?.toLowerCase().includes('unauthorized')

  // Define the error messages based on status codes
  const errorMessages: Record<number | 'default', string> = {
    401: 'Session expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    500: 'Server error. Please try again later.',
    default: responseData?.message || 'An unexpected error occurred.'
  }

  // Get the appropriate error message
  const message = errorMessages[status || 'default'] || errorMessages.default

  // Handle different error status codes with appropriate error messages
  switch (status) {
    case 401:
      console.error(message)
      toast.error(message)
      clearSession()
      break
    case 403:
      // console.error(message)
      toast.error(message)
      if (isInvalidToken) {
        clearSession()
      }
      break
    case 500:
      console.error(message)
      toast.error(message)
      break
    default:
      console.error(message)
      // Clear session if invalid token detected in any response
      if (isInvalidToken) {
        clearSession()
      }
  }
}

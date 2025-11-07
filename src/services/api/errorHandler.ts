import { AxiosError } from 'axios'
import { toast } from 'sonner'
import { clearSession } from './authUtils'

export const handleApiError = (error: AxiosError) => {
  console.log('error :>> ', error)
  const status = error.response?.status

  // Define the error messages based on status codes
  const errorMessages: Record<number | 'default', string> = {
    401: 'Session expired. Please log in again.',
    403: 'You do not have permission to perform this action.',
    500: 'Server error. Please try again later.',
    default:
      (error.response?.data as { message?: string })?.message || 'An unexpected error occurred.'
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
      console.error(message)
      break
    case 500:
      console.error(message)
      break
    default:
      console.error(message)
  }
}

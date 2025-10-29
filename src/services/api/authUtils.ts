import Cookies from 'js-cookie'

// Check if the cookie exists and log its value
export const getToken = (): string | null => {
  const token = Cookies.get('adminToken')
  return token || null
}

export const clearSession = () => {
  console.log('object :>> ', 'Clearing admin session')
  Cookies.remove('adminToken')
  Cookies.remove('permissions')
  Cookies.remove('userRole')
  window.location.href = '/admin/login' // Redirect to login
}

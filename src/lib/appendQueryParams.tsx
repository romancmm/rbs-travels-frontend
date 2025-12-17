export const appendQueryParams = (url: string, params?: Record<string, any>) => {
  if (!params) return url

  const query = new URLSearchParams(
    Object.entries(params).filter(([, v]) => v !== undefined) as [string, string][]
  ).toString()

  if (!query) return url

  return url + (url.includes('?') ? '&' : '?') + query
}

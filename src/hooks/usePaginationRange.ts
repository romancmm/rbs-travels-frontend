export function usePaginationRange({
  currentPage,
  totalPages,
  rangeSize = 6
}: {
  currentPage: number
  totalPages: number
  rangeSize?: number
}) {
  const totalVisible = rangeSize
  const half = Math.floor(totalVisible / 2)

  const range: (number | string)[] = []

  let start = Math.max(1, currentPage + 2 - half)
  let end = start + totalVisible - 1

  if (end > totalPages) {
    end = totalPages
    start = Math.max(1, end - totalVisible + 1)
  }

  if (start > 1) {
    range.push(1)
    if (start > 2) range.push('...')
  }

  for (let i = start; i <= end; i++) {
    range.push(i)
  }

  if (end < totalPages) {
    if (end < totalPages - 1) range.push('...')
    range.push(totalPages)
  }

  return range
}

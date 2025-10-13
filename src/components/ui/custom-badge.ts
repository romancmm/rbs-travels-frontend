export const getStatusColor = (status: string) => {
  const colors = {
    PENDING: 'bg-yellow-500/10 text-yellow-500 border-yellow-500/20',
    CONFIRMED: 'bg-blue-500/10 text-blue-500 border-blue-500/20',
    PARTIAL: 'bg-orange-500/10 text-orange-500 border-orange-500/20',
    COMPLETED: 'bg-green-500/10 text-green-500 border-green-500/20',
    CANCELLED: 'bg-red-500/10 text-red-500 border-red-500/20',
    REFUNDED: 'bg-gray-500/10 text-gray-500 border-gray-500/20'
  }
  return colors[status as keyof typeof colors] || colors.PENDING
}

export const getDeliveryStatusColor = (status: string) => {
  const colors = {
    PENDING: 'bg-yellow-500/10 text-yellow-500',
    PROCESSING: 'bg-blue-500/10 text-blue-500',
    PARTIAL: 'bg-orange-500/10 text-orange-500',
    DELIVERED: 'bg-green-500/10 text-green-500',
    FAILED: 'bg-red-500/10 text-red-500'
  }
  return colors[status as keyof typeof colors] || colors.PENDING
}

import { NotFoundMessage } from '@/components/common/NotFoundMessage'

export default function DetailNotFound() {
  return (
    <NotFoundMessage
      title='Content Not Found'
      description='The content you are looking for does not exist or has been removed.'
    />
  )
}

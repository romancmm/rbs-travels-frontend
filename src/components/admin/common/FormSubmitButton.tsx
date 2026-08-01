import { Button } from '@/components/ui/button'
import { Loader2 } from 'lucide-react'

type FormSubmitButtonProps = Omit<React.ComponentProps<typeof Button>, 'type'> & {
  isSubmitting: boolean
  isEditing: boolean
  createLabel?: string
  updateLabel?: string
  savingLabel?: string
}

export function FormSubmitButton({
  isSubmitting,
  isEditing,
  createLabel = 'Save Settings',
  updateLabel = 'Update Settings',
  savingLabel = 'Saving...',
  children,
  disabled,
  ...props
}: FormSubmitButtonProps) {
  return (
    <Button type='submit' disabled={disabled || isSubmitting} {...props}>
      {isSubmitting ? (
        <>
          <Loader2 className='size-4 animate-spin' />
          {savingLabel}
        </>
      ) : (
        (children ?? (isEditing ? updateLabel : createLabel))
      )}
    </Button>
  )
}

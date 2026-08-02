import { Toaster } from 'sonner'
import { NuqsProvider } from './nuqs-provider'

interface RootProvidersProps {
  children: React.ReactNode
}

const RootProviders: React.FC<RootProvidersProps> = ({ children }) => (
  <>
    <NuqsProvider>{children}</NuqsProvider>
    <Toaster richColors closeButton theme='light' position='bottom-right' />
  </>
)

export default RootProviders

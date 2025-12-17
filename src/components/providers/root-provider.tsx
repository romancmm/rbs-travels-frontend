import { Toaster } from 'sonner'
import { NuqsProvider } from './nuqs-provider'
import { ThemeProvider } from './theme-provider'

interface RootProvidersProps {
  children: React.ReactNode
}

const RootProviders: React.FC<RootProvidersProps> = ({ children }) => (
  <ThemeProvider defaultTheme='light' enableSystem disableTransitionOnChange>
    <NuqsProvider>{children}</NuqsProvider>
    <Toaster richColors closeButton theme='light' position='bottom-right' />
  </ThemeProvider>
)

export default RootProviders

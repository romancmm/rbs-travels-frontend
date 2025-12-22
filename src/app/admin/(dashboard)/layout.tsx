import BreadCrumbs from '@/components/admin/layout/BreadCrumbs'
import { AppSidebar } from '@/components/admin/layout/app-sidebar'
import { PermissionProvider } from '@/components/providers/PermissionProvider'
import { Separator } from '@/components/ui/separator'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@/components/ui/sidebar'
import { cookies } from 'next/headers'

type TProps = {
  children: React.ReactNode
}

export default async function DashboardLayout({ children }: TProps) {
  const cookieStore = await cookies()
  const defaultOpen = cookieStore.get('sidebar_state')?.value === 'true'

  return (
    <PermissionProvider>
      <SidebarProvider defaultOpen={defaultOpen}>
        <AppSidebar />
        <SidebarInset>
          <header className='flex items-center gap-2 h-16 group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 transition-[width,height] ease-linear shrink-0'>
            <div className='flex items-center gap-2 px-4'>
              <SidebarTrigger className='-ml-1' />
              <Separator orientation='vertical' className='mr-2 data-[orientation=vertical]:h-4' />
              <BreadCrumbs />
            </div>
          </header>
          <main className='bg-gray-100 p-3 lg:p-4 h-full'>{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </PermissionProvider>
  )
}

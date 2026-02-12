import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  SidebarInset,
} from '@/components/ui/sidebar';
import { Logo } from '@/components/Logo';
import { SyncStatusBadge } from '@/components/SyncStatusBadge';
import { AuthProvider } from '@/context/AuthContext';
import AdminSidebar from './_components/AdminSidebar';
import AdminHeader from './_components/AdminHeader';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <AuthProvider>
      <SidebarProvider>
        <Sidebar>
          <SidebarHeader>
            <Logo />
          </SidebarHeader>
          <SidebarContent>
            <AdminSidebar />
          </SidebarContent>
          <SidebarFooter>
            <SyncStatusBadge />
          </SidebarFooter>
        </Sidebar>
        <SidebarInset>
          <AdminHeader />
          <main className="p-4 sm:p-6 lg:p-8">{children}</main>
        </SidebarInset>
      </SidebarProvider>
    </AuthProvider>
  );
}

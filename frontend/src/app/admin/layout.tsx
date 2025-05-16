import { AdminLayout as AdminLayoutComponent } from "@/components/admin-layout"
import AdminRouteGuard from "./route-guard"

export { metadata } from "./metadata"

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AdminRouteGuard>
      <AdminLayoutComponent>
        {children}
      </AdminLayoutComponent>
    </AdminRouteGuard>
  )
}
import { AdminLayout } from "@/components/admin-layout"
import AccountRouteGuard from "./route-guard"

export { metadata } from "./metadata"

export default function AccountLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <AccountRouteGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </AccountRouteGuard>
  )
}

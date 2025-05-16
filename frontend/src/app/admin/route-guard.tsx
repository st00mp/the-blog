import { RouteGuard } from "@/components/route-guard"

export default function AdminRouteGuard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard requireAuth requireRole="admin">
      {children}
    </RouteGuard>
  )
}

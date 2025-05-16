import { RouteGuard } from "@/components/route-guard"

export default function AccountRouteGuard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard requireAuth requireRole="user">
      {children}
    </RouteGuard>
  )
}

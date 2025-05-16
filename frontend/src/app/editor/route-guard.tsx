import { RouteGuard } from "@/components/route-guard"

export default function EditorRouteGuard({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <RouteGuard requireAuth requireRole="editor">
      {children}
    </RouteGuard>
  )
}

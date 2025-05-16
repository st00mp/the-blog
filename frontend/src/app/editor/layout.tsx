import { AdminLayout } from "@/components/admin-layout"
import EditorRouteGuard from "./route-guard"

export { metadata } from "./metadata"

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EditorRouteGuard>
      <AdminLayout>
        {children}
      </AdminLayout>
    </EditorRouteGuard>
  )
}

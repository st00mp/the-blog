import { AdminLayout } from "@/components/admin-layout"
import EditorRouteGuard from "./route-guard"
import { ArticleActionsProvider } from "@/contexts/ArticleActionsContext"

export { metadata } from "./metadata"

export default function EditorLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <EditorRouteGuard>
      <ArticleActionsProvider>
        <AdminLayout>
          {children}
        </AdminLayout>
      </ArticleActionsProvider>
    </EditorRouteGuard>
  )
}

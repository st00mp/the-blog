"use client"

import { ReactNode } from "react"
import dynamic from "next/dynamic"
import { SidebarProvider } from "@/components/ui/sidebar"

// Chargement dynamique pour éviter les problèmes de SSR avec le contexte de la sidebar
const AdminSidebar = dynamic(
  () => import("@/components/admin-sidebar").then((mod) => mod.AdminSidebar),
  { ssr: false }
)

type AdminLayoutProps = {
  children: ReactNode
}

export function AdminLayout({ children }: AdminLayoutProps) {
  return (
    <SidebarProvider>
      <div className="flex min-h-screen w-full bg-zinc-900 text-zinc-100">
        {/* Sidebar fixe à gauche */}
        <div className="hidden md:block w-64 bg-[#0a0a0a] border-r border-zinc-800">
          <AdminSidebar className="h-screen sticky top-0 overflow-y-auto" />
        </div>

        {/* Contenu principal */}
        <div className="flex-1 w-full">
          <div className="h-full w-full p-6">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

"use client"

import { ReactNode } from "react"
import dynamic from "next/dynamic"
import Link from "next/link"
import { LogOut } from "lucide-react"
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
      <div className="flex min-h-screen w-full bg-black">
        {/* Sidebar fixe à gauche */}
        <div className="hidden md:flex flex-col w-64 bg-[#0a0a0a] border-r border-zinc-800">
          <div className="flex-1 overflow-y-auto">
            <AdminSidebar />
          </div>
          <div className="p-4 border-t border-zinc-800">
            <Link href="/" className="flex items-center px-3 py-2 text-zinc-400 hover:text-zinc-200 rounded-md hover:bg-zinc-800 transition-colors">
              <LogOut className="mr-3" size={18} />
              <span className="text-sm">Retour au site</span>
            </Link>
          </div>
        </div>

        {/* Contenu principal */}
        <div className="flex-1 w-full bg-black">
          <div className="h-full w-full p-12">
            {children}
          </div>
        </div>
      </div>
    </SidebarProvider>
  )
}

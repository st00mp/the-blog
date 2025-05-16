"use client"

import { usePathname } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Menu, User } from "lucide-react"
import { UserNav } from "@/components/user-nav"

export function AdminHeader() {
  const pathname = usePathname()
  
  // Fonction pour obtenir le titre de la page actuelle
  const getPageTitle = () => {
    if (pathname === '/admin') return 'Tableau de bord'
    if (pathname.startsWith('/editor/dashboard')) return 'Tableau de bord éditeur'
    if (pathname.startsWith('/editor/articles')) return 'Gestion des articles'
    if (pathname.startsWith('/account/settings')) return 'Paramètres du compte'
    return 'Tableau de bord'
  }

  return (
    <header className="sticky top-0 z-10 border-b border-zinc-800 bg-black/80 backdrop-blur-sm">
      <div className="flex h-14 items-center px-4 sm:px-6 lg:px-8">
        <div className="flex items-center space-x-4">
          <Button variant="ghost" size="icon" className="md:hidden">
            <Menu className="h-5 w-5" />
            <span className="sr-only">Ouvrir le menu</span>
          </Button>
          <h1 className="text-lg font-medium text-white">{getPageTitle()}</h1>
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <UserNav />
        </div>
      </div>
    </header>
  )
}

"use client"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { User, LayoutDashboard, LogOut, Edit } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter, usePathname } from "next/navigation"
import Link from "next/link"

const navItems = [
    { name: "Accueil", href: "/" },
    { name: "Articles", href: "/articles" },
    { name: "À propos", href: "/about" },
    { name: "Contact", href: "/contact" },
]

// Composant UserMenu avec avatar et dropdown
function UserMenu() {
    const { user, logout } = useAuth()
    const router = useRouter()

    const handleLogout = async (e: React.MouseEvent) => {
        // Empêcher la propagation de l'événement pour éviter les clics multiples
        e.preventDefault()
        e.stopPropagation()
        
        try {
            // Utiliser la fonction logout du contexte d'authentification
            // Elle s'occupera déjà de la redirection appropriée
            await logout()
            
            // La fonction logout du contexte gère déjà la redirection,
            // donc nous n'avons pas besoin de le faire ici
        } catch (error) {
            console.error('Erreur lors de la déconnexion:', error)
        }
    }

    // Fonction getInitials supprimée car plus nécessaire avec un admin unique

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded-full" aria-label="Menu utilisateur">
                    <div className="h-9 w-9 flex items-center justify-center rounded-full border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors bg-zinc-800">
                        <User className="h-5 w-5 text-zinc-300" />
                    </div>
                </button>
            </DropdownMenuTrigger>
            <AnimatePresence>
                <DropdownMenuContent
                    align="end"
                    className="w-56 bg-zinc-900 border border-zinc-800 text-zinc-100 rounded-md shadow-md p-1"
                    sideOffset={8}
                    aria-label="Menu utilisateur"
                    asChild
                    forceMount
                >
                    <motion.div
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2, ease: "easeOut" }}
                    >
                        <DropdownMenuLabel className="px-3 py-2 text-sm text-zinc-400 font-normal">
                            Administrateur
                            <div className="text-xs text-zinc-500">{user?.email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                        {/* Option Administration - toujours visible car utilisateur unique */}
                        <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                router.push('/admin')
                            }}
                        >
                            <LayoutDashboard className="h-4 w-4" />
                            <span>Administration</span>
                            <span className="sr-only">Accéder au panneau d'administration</span>
                        </DropdownMenuItem>

                        {/* Option Édition pour l'admin */}
                        <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                router.push('/editor/dashboard')
                            }}
                        >
                            <Edit className="h-4 w-4" />
                            <span>Édition</span>
                            <span className="sr-only">Accéder à l'interface d'édition</span>
                        </DropdownMenuItem>
                        
                        {/* Option Paramètres */}
                        <DropdownMenuItem 
                            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors"
                            onClick={(e) => {
                                e.preventDefault()
                                e.stopPropagation()
                                router.push('/account/settings')
                            }}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="h-4 w-4">
                                <path d="M12.22 2h-.44a2 2 0 0 0-2 2v.18a2 2 0 0 1-1 1.73l-.43.25a2 2 0 0 1-2 0l-.15-.08a2 2 0 0 0-2.73.73l-.22.38a2 2 0 0 0 .73 2.73l.15.1a2 2 0 0 1 1 1.72v.51a2 2 0 0 1-1 1.74l-.15.09a2 2 0 0 0-.73 2.73l.22.38a2 2 0 0 0 2.73.73l.15-.08a2 2 0 0 1 2 0l.43.25a2 2 0 0 1 1 1.73V20a2 2 0 0 0 2 2h.44a2 2 0 0 0 2-2v-.18a2 2 0 0 1 1-1.73l.43-.25a2 2 0 0 1 2 0l.15.08a2 2 0 0 0 2.73-.73l.22-.39a2 2 0 0 0-.73-2.73l-.15-.08a2 2 0 0 1-1-1.74v-.5a2 2 0 0 1 1-1.74l.15-.09a2 2 0 0 0 .73-2.73l-.22-.38a2 2 0 0 0-2.73-.73l-.15.08a2 2 0 0 1-2 0l-.43-.25a2 2 0 0 1-1-1.73V4a2 2 0 0 0-2-2z"></path>
                                <circle cx="12" cy="12" r="3"></circle>
                            </svg>
                            <span>Paramètres</span>
                            <span className="sr-only">Accéder aux paramètres du compte</span>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                        <DropdownMenuItem
                            onClick={(e) => handleLogout(e)}
                            className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 focus:bg-zinc-800 transition-colors"
                        >
                            <LogOut className="h-4 w-4" />
                            <span>Déconnexion</span>
                            <span className="sr-only">Se déconnecter de votre compte</span>
                        </DropdownMenuItem>
                    </motion.div>
                </DropdownMenuContent>
            </AnimatePresence>
        </DropdownMenu>
    )
}

export function NavBar() {
    const { isAuthenticated, isLoading } = useAuth()
    const router = useRouter()
    // Plus besoin de vérifier le chemin, nous affichons la NavBar partout
    
    return (
        <header className="w-full border-b border-zinc-800">
            <div className="w-full px-6 sm:px-12 py-3 flex items-center justify-between">
                <Link
                    href="/blog"
                    className="text-white text-xl font-bold hover:underline"
                >
                    TechBlog
                </Link>
                <div className="flex items-center space-x-3">
                    {isLoading ? (
                        <div className="w-24 h-9 bg-zinc-800 animate-pulse rounded-md"></div>
                    ) : isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <>
                            {/* Aucun bouton de connexion - accès discret via /login */}
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

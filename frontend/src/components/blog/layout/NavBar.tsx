"use client"

import { useState } from "react"
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
import { Dialog, DialogContent } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"
import { RegisterForm } from "@/components/register-form"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

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

    const handleLogout = async () => {
        await logout()
        router.push("/")
        router.refresh()
    }

    // Obtenir les initiales de l'utilisateur pour l'avatar
    const getInitials = (name: string) => {
        if (!name) return "UN"
        const nameParts = name.split(" ")
        if (nameParts.length === 1) return nameParts[0].charAt(0).toUpperCase()
        return (nameParts[0].charAt(0) + nameParts[nameParts.length - 1].charAt(0)).toUpperCase()
    }

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
                            {user?.name}
                            <div className="text-xs text-zinc-500">{user?.email}</div>
                        </DropdownMenuLabel>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1" />

                        {/* Option Administration pour les admins */}
                        {user?.role === "admin" && (
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors" asChild>
                                <a href="/admin">
                                    <LayoutDashboard className="h-4 w-4" />
                                    <span>Administration</span>
                                    <span className="sr-only">Accéder au panneau d'administration</span>
                                </a>
                            </DropdownMenuItem>
                        )}

                        {/* Option Édition pour les éditeurs et admins */}
                        {(user?.role === "editor" || user?.role === "admin") && (
                            <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors" asChild>
                                <a href="/editor/dashboard">
                                    <Edit className="h-4 w-4" />
                                    <span>Édition</span>
                                    <span className="sr-only">Accéder à l'interface d'édition</span>
                                </a>
                            </DropdownMenuItem>
                        )}

                        {/* Option Compte pour tous les utilisateurs connectés */}
                        <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors" asChild>
                            <a href="/account/settings">
                                <User className="h-4 w-4" />
                                <span>Compte</span>
                                <span className="sr-only">Accéder à votre compte</span>
                            </a>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                        <DropdownMenuItem
                            onClick={handleLogout}
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
    const [isLoginOpen, setIsLoginOpen] = useState(false)
    const [isRegisterOpen, setIsRegisterOpen] = useState(false)
    const { isAuthenticated, isLoading } = useAuth()

    // Fonction pour basculer entre les modales
    const switchToRegister = () => {
        setIsLoginOpen(false)
        setIsRegisterOpen(true)
    }

    const switchToLogin = () => {
        setIsRegisterOpen(false)
        setIsLoginOpen(true)
    }

    // Fermer les modales après une connexion/inscription réussie
    const handleAuthSuccess = () => {
        setIsLoginOpen(false)
        setIsRegisterOpen(false)
    }

    return (
        <header className="w-full border-b border-zinc-800">
            <div className="w-full px-6 sm:px-12 py-3 flex items-center justify-between">
                <h1 className="text-white text-xl font-bold">TechBlog</h1>

                <div className="flex items-center space-x-3">
                    {isLoading ? (
                        <div className="w-24 h-9 bg-zinc-800 animate-pulse rounded-md"></div>
                    ) : isAuthenticated ? (
                        <UserMenu />
                    ) : (
                        <>
                            {/* Log In = fond noir, texte blanc, hover légèrement plus clair */}
                            <Button
                                variant="ghost"
                                className="bg-black text-white text-sm px-4 py-1 rounded-md border border-white/60 hover:bg-zinc-700 hover:text-white"
                                onClick={() => setIsLoginOpen(true)}
                            >
                                Log In
                            </Button>

                            {/* Boîte de dialogue de connexion */}
                            <Dialog open={isLoginOpen} onOpenChange={setIsLoginOpen}>
                                <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
                                    <div className="p-6">
                                        <LoginForm onSuccess={handleAuthSuccess} switchToRegister={switchToRegister} />
                                    </div>
                                </DialogContent>
                            </Dialog>

                            {/* Sign Up = fond blanc, texte noir, hover fond gris clair */}
                            <Button
                                variant="ghost"
                                className="bg-white text-black text-sm px-4 py-1 rounded-md hover:bg-zinc-300"
                                onClick={() => setIsRegisterOpen(true)}
                            >
                                Sign Up
                            </Button>

                            {/* Boîte de dialogue d'inscription */}
                            <Dialog open={isRegisterOpen} onOpenChange={setIsRegisterOpen}>
                                <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800 p-0 overflow-hidden">
                                    <div className="p-6">
                                        <RegisterForm onSuccess={handleAuthSuccess} switchToLogin={switchToLogin} />
                                    </div>
                                </DialogContent>
                            </Dialog>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

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
import { User, LayoutDashboard, LogOut } from "lucide-react"
import { motion, AnimatePresence } from "framer-motion"

// Composant UserMenu avec avatar et dropdown
function UserMenu() {
    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <button className="focus:outline-none focus-visible:ring-2 focus-visible:ring-zinc-500 rounded-full" aria-label="Menu utilisateur">
                    <Avatar className="h-9 w-9 border border-zinc-700 cursor-pointer hover:border-zinc-500 transition-colors">
                        <AvatarImage src="/avatars/user-avatar.png" alt="Avatar utilisateur" />
                        <AvatarFallback className="bg-zinc-800 text-zinc-300">UN</AvatarFallback>
                    </Avatar>
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
                <DropdownMenuLabel className="px-3 py-2 text-sm text-zinc-400 font-normal">Mon compte</DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors">
                    <User className="h-4 w-4" />
                    <span>Profil</span>
                    <span className="sr-only">Accéder à votre profil</span>
                </DropdownMenuItem>
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-zinc-200 hover:text-white hover:bg-zinc-800 focus:bg-zinc-800 focus:text-white transition-colors" asChild>
                    <a href="/admin/dashboard">
                        <LayoutDashboard className="h-4 w-4" />
                        <span>Tableau de bord</span>
                        <span className="sr-only">Accéder à votre tableau de bord</span>
                    </a>
                </DropdownMenuItem>
                <DropdownMenuSeparator className="bg-zinc-800 my-1" />
                <DropdownMenuItem className="cursor-pointer flex items-center gap-2 px-3 py-2 text-sm rounded-sm text-red-400 hover:text-red-300 hover:bg-zinc-800 focus:bg-zinc-800 transition-colors">
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
    // État fictif pour simuler si l'utilisateur est connecté ou non
    const isLoggedIn = true;

    return (
        <header className="w-full border-b border-zinc-800">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-12 py-4 flex items-center justify-between">
                <h1 className="text-white text-xl font-bold">TechBlog</h1>

                <div className="flex items-center space-x-3">
                    {isLoggedIn ? (
                        <UserMenu />
                    ) : (
                        <>
                            {/* Log In = fond noir, texte blanc, hover légèrement plus clair */}
                            <Button
                                variant="ghost"
                                className="bg-black text-white text-sm px-4 py-1 rounded-md border border-white/60 hover:bg-zinc-700 hover:text-white"
                            >
                                Log In
                            </Button>

                            {/* Sign Up = fond blanc, texte noir, hover fond gris clair */}
                            <Button
                                variant="ghost"
                                className="bg-white text-black text-sm px-4 py-1 rounded-md hover:bg-zinc-300"
                            >
                                Sign Up
                            </Button>
                        </>
                    )}
                </div>
            </div>
        </header>
    )
}

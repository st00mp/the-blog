"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, FilePen, Settings, LogOut, LayoutDashboard, Edit } from "lucide-react"

import { useAuth } from "@/contexts/AuthContext"
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarGroup,
    SidebarGroupContent,
    SidebarGroupLabel,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from "@/components/ui/sidebar"

// Types pour les rôles - simplifié pour l'administrateur unique
type Role = 'ROLE_ADMIN' | 'ROLE_EDITOR' | 'ROLE_USER'

// Vérifie si l'utilisateur a le rôle admin - version simplifiée pour format singulier
const hasAdminRole = (userRole?: string): boolean => {
    if (!userRole) return false
    return userRole === 'ROLE_ADMIN'
}

// Structure de navigation simplifiée pour admin mono-utilisateur
const adminNavigation = [
    {
        title: "EDITION",
        items: [
            {
                title: "Tableau de bord",
                url: "/editor/dashboard",
                icon: LayoutDashboard
            },
            {
                title: "Articles",
                url: "/editor/articles",
                icon: FilePen
            },
        ],
    },
    {
        title: "COMPTE",
        items: [
            {
                title: "Paramètres",
                url: "/account/settings",
                icon: Settings
            },
        ],
    },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()
    const { user } = useAuth()

    const isActive = (path: string) => {
        return pathname.startsWith(path)
    }

    return (
        <Sidebar {...props}>
            <div className="px-4 py-6">
                <SidebarContent className="space-y-6">
                    {/* Afficher tous les groupes de navigation si l'utilisateur est admin */}
                    {hasAdminRole(user?.role) && adminNavigation.map((group) => (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupLabel className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                {group.title}
                            </SidebarGroupLabel>
                            <SidebarGroupContent className="mt-2">
                                <SidebarMenu className="space-y-1">
                                    {group.items.map((item) => (
                                        <SidebarMenuItem key={item.url}>
                                            <SidebarMenuButton
                                                asChild
                                                isActive={isActive(item.url)}
                                                className="group flex items-center w-full px-3 py-2 text-sm font-medium rounded-md transition-colors hover:bg-zinc-800"
                                            >
                                                <Link href={item.url} className="flex items-center space-x-3">
                                                    <item.icon
                                                        className="h-5 w-5 text-zinc-400 group-hover:text-white group-data-[active=true]:text-white transition-colors"
                                                        aria-hidden="true"
                                                    />
                                                    <span>{item.title}</span>
                                                </Link>
                                            </SidebarMenuButton>
                                        </SidebarMenuItem>
                                    ))}
                                </SidebarMenu>
                            </SidebarGroupContent>
                        </SidebarGroup>
                    ))}
                </SidebarContent>
            </div>
        </Sidebar>
    )
}

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

// Types pour les rôles
type Role = 'admin' | 'editor' | 'user'

// Hiérarchie des rôles
const ROLE_HIERARCHY: Record<Role, number> = {
    'admin': 3,
    'editor': 2,
    'user': 1
}

// Vérifie si l'utilisateur a le rôle requis
const hasRequiredRole = (userRole: Role | undefined, requiredRole: Role): boolean => {
    if (!userRole) return false
    return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

// Structure de navigation
const adminNavigation = [
    {
        title: "Administration",
        items: [
            {
                title: "Tableau de bord",
                url: "/admin",
                icon: LayoutDashboard,
                requiredRole: 'admin' as Role
            },
        ],
    },
    {
        title: "Édition",
        items: [
            {
                title: "Vue d’ensemble",
                url: "/editor/dashboard",
                icon: LayoutDashboard,
                requiredRole: 'editor' as Role
            },
            {
                title: "Articles",
                url: "/editor/articles",
                icon: FilePen,
                requiredRole: 'editor' as Role
            },
        ],
    },
    {
        title: "Compte",
        items: [
            {
                title: "Paramètres",
                url: "/account/settings",
                icon: Settings,
                requiredRole: 'user' as Role
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
                    {/* Groupes de navigation */}
                    {adminNavigation
                        // Filtrer les groupes qui n'ont aucun élément visible pour le rôle de l'utilisateur
                        .filter(group =>
                            group.items.some(item => hasRequiredRole(user?.role as Role, item.requiredRole))
                        )
                        // Rendre uniquement les groupes qui ont au moins un élément visible
                        .map((group) => (
                            <SidebarGroup key={group.title}>
                                <SidebarGroupLabel className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                    {group.title}
                                </SidebarGroupLabel>
                                <SidebarGroupContent className="mt-2">
                                    <SidebarMenu className="space-y-1">
                                        {group.items.map((item) => {
                                            // Vérifier si l'utilisateur a le rôle requis pour voir cet élément
                                            if (!hasRequiredRole(user?.role as Role, item.requiredRole)) {
                                                return null;
                                            }

                                            return (
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
                                            );
                                        })}
                                    </SidebarMenu>
                                </SidebarGroupContent>
                            </SidebarGroup>
                        ))}
                </SidebarContent>
            </div>
        </Sidebar>
    )
}

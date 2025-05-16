"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, FilePen, Settings, LogOut, LayoutDashboard } from "lucide-react"

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
                    {adminNavigation.map((group) => (
                        <SidebarGroup key={group.title}>
                            <SidebarGroupLabel className="text-zinc-400 text-xs font-medium uppercase tracking-wider">
                                {group.title}
                            </SidebarGroupLabel>
                            <SidebarGroupContent className="mt-2">
                                <SidebarMenu className="space-y-1">
                                    {group.items.map((item) => {
                                        // Vérifier si l'utilisateur a le rôle requis pour voir cet élément
                                        if (!hasRequiredRole(user?.role as Role | undefined, item.requiredRole)) {
                                            return null;
                                        }

                                        return (
                                            <SidebarMenuItem key={item.title}>
                                                <SidebarMenuButton
                                                    asChild
                                                    isActive={isActive(item.url)}
                                                    className="px-3 py-2 rounded-md hover:bg-zinc-800 transition-colors"
                                                >
                                                    <Link href={item.url} className="flex items-center">
                                                        <item.icon className="mr-3" size={18} />
                                                        <span className="text-sm">{item.title}</span>
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

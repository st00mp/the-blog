"use client"

import * as React from "react"
import { usePathname } from "next/navigation"
import Link from "next/link"
import { Home, FilePen, Settings, LogOut } from "lucide-react"

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

// Structure de navigation pour l'admin
const adminNavigation = [
    {
        title: "Navigation",
        items: [
            {
                title: "Tableau de bord",
                url: "/admin/dashboard",
                icon: Home,
            },
            {
                title: "Articles",
                url: "/admin/articles",
                icon: FilePen,
            },
            {
                title: "Paramètres",
                url: "/admin/settings",
                icon: Settings,
            },
        ],
    },
]

export function AdminSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
    const pathname = usePathname()

    const isActive = (path: string) => {
        return pathname.startsWith(path)
    }

    return (
        <Sidebar {...props}>
            <SidebarContent>
                {/* Groupes de navigation */}
                {adminNavigation.map((group) => (
                    <SidebarGroup key={group.title}>
                        <SidebarGroupLabel>{group.title}</SidebarGroupLabel>
                        <SidebarGroupContent>
                            <SidebarMenu>
                                {group.items.map((item) => (
                                    <SidebarMenuItem key={item.title}>
                                        <SidebarMenuButton asChild isActive={isActive(item.url)}>
                                            <Link href={item.url} className="flex items-center">
                                                <item.icon className="mr-2" size={18} />
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
            <SidebarFooter className="p-4 border-t border-zinc-800">
                <SidebarMenuButton asChild>
                    <Link href="/" className="flex items-center text-zinc-400 hover:text-zinc-200">
                        <LogOut className="mr-2" size={18} />
                        <span>Retour au site</span>
                    </Link>
                </SidebarMenuButton>
            </SidebarFooter>
        </Sidebar>
    )
}

"use client"

import { usePathname } from "next/navigation"
import React from "react"

import { AdminSidebar } from "@/components/admin-sidebar"
import { SearchForm } from "@/components/search-form"
import {
    Breadcrumb,
    BreadcrumbItem,
    BreadcrumbLink,
    BreadcrumbList,
    BreadcrumbPage,
    BreadcrumbSeparator
} from "@/components/ui/breadcrumb"
import {
    SidebarProvider,
    SidebarTrigger
} from "@/components/ui/sidebar"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    const pathname = usePathname()

    // Fonction pour générer les breadcrumbs basés sur le pathname
    const getBreadcrumbs = () => {
        const paths = pathname.split('/').filter(Boolean)
        const breadcrumbs = []

        // Ajout de l'accueil
        breadcrumbs.push({
            label: 'Admin',
            path: '/admin',
            isCurrent: paths.length === 1 && paths[0] === 'admin'
        })

        // Ajout des chemins intermédiaires
        let currentPath = ''
        for (let i = 1; i < paths.length; i++) {
            currentPath += `/${paths[i]}`
            const isCurrent = i === paths.length - 1

            breadcrumbs.push({
                label: paths[i].charAt(0).toUpperCase() + paths[i].slice(1),
                path: `/admin${currentPath}`,
                isCurrent
            })
        }

        return breadcrumbs
    }

    const breadcrumbs = getBreadcrumbs()

    return (
        <SidebarProvider>
            <div className="flex min-h-screen bg-zinc-950">
                {/* Sidebar personnalisée avec le style sombre */}
                <AdminSidebar
                    className="bg-[#0a0a0a] border-r border-zinc-800"
                    collapsible="icon"
                />

                <div className="flex-1 flex flex-col">
                    {/* Header noir (#000000) comme demandé */}
                    <header className="h-14 border-b border-zinc-800 bg-black flex items-center px-6">
                        <SidebarTrigger className="mr-2 text-zinc-400 hover:text-zinc-200" />
                        <div className="flex-1 flex items-center justify-between">
                            <h1 className="text-lg font-medium text-zinc-100">Admin</h1>
                            <div className="w-64">
                                <SearchForm className="w-full" />
                            </div>
                        </div>
                    </header>

                    <div className="flex-1 flex flex-col">
                        {/* Fil d'Ariane */}
                        <div className="px-6 py-3 border-b border-zinc-800">
                            <Breadcrumb>
                                <BreadcrumbList>
                                    {breadcrumbs.map((item, index) => (
                                        <React.Fragment key={item.path}>
                                            <BreadcrumbItem>
                                                {item.isCurrent ? (
                                                    <BreadcrumbPage>{item.label}</BreadcrumbPage>
                                                ) : (
                                                    <BreadcrumbLink href={item.path}>
                                                        {item.label}
                                                    </BreadcrumbLink>
                                                )}
                                            </BreadcrumbItem>
                                            {index < breadcrumbs.length - 1 && (
                                                <BreadcrumbSeparator />
                                            )}
                                        </React.Fragment>
                                    ))}
                                </BreadcrumbList>
                            </Breadcrumb>
                        </div>

                        {/* Contenu principal */}
                        <main className="flex-1 p-6">
                            {children}
                        </main>
                    </div>
                </div>
            </div>
        </SidebarProvider>
    )
}
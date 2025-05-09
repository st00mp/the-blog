

import { Sidebar, SidebarContent, SidebarFooter, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from "@/components/ui/sidebar"
import { SidebarProvider } from "@/components/ui/sidebar"
import { Home, FilePen, Settings, LogOut } from "lucide-react"
import Link from "next/link"

export default function AdminLayout({
    children,
}: {
    children: React.ReactNode
}) {
    return (
        <SidebarProvider>
            <div className="flex min-h-screen">
                <div className="w-64 flex flex-col h-screen bg-[#0a0a0a] border-r border-zinc-800 z-10">
                    <Sidebar className="flex flex-col h-full">
                        <SidebarHeader className="p-4 flex-shrink-0">
                            <h2 className="text-xl font-bold"> Admin</h2>
                        </SidebarHeader>
                        <SidebarContent className="px-2 flex-grow overflow-y-auto">
                            <SidebarMenu>
                                <SidebarMenuItem>
                                    <SidebarMenuButton isActive asChild>
                                        <Link href="/admin/dashboard">
                                            <Home className="mr-2" size={18} />
                                            <span>Tableau de bord</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/admin/articles">
                                            <FilePen className="mr-2" size={18} />
                                            <span>Articles</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                                <SidebarMenuItem>
                                    <SidebarMenuButton asChild>
                                        <Link href="/admin/settings">
                                            <Settings className="mr-2" size={18} />
                                            <span>Paramètres</span>
                                        </Link>
                                    </SidebarMenuButton>
                                </SidebarMenuItem>
                            </SidebarMenu>
                        </SidebarContent>
                        <div className="flex-shrink-0 p-4 border-t border-zinc-800">
                            <SidebarFooter className="p-0">
                        <SidebarMenuButton asChild>
                            <Link href="/" className="flex items-center text-zinc-400 hover:text-zinc-200">
                                <LogOut className="mr-2" size={18} />
                                <span>Retour au site</span>
                            </Link>
                        </SidebarMenuButton>
                        </SidebarFooter>
                    </div>
                </Sidebar>
                </div>
                <main className="flex-1 min-h-screen p-6">
                    {children}
                </main>
            </div>
        </SidebarProvider>
    )
}
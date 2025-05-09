

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
        <SidebarProvider className="bg-black">
            <Sidebar className="flex flex-col h-full">
                <SidebarHeader className="p-5 flex-shrink-0">
                    <h2 className="text-xl font-bold">Admin</h2>
                </SidebarHeader>
                <SidebarContent className="px-3 py-2 flex-grow overflow-y-auto">
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
                <div className="flex-shrink-0 p-5 border-t border-zinc-800">
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
            <main className="flex-1 min-h-screen flex justify-center">
                <div className="w-full max-w-[calc(100%-18rem-4rem)] px-8 py-6">
                    {children}
                </div>
            </main>
        </SidebarProvider>
    )
}
"use client"

import { useState } from "react"
import Link from "next/link"
import { FileEdit, Trash2, Plus, Home, FilePen, Settings, LogOut } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminArticlesTable } from "@/components/admin/article/ArticlesTable"

// Import the Article type from ArticlesTable or create a shared type
type Article = {
  id: string
  title: string
  createdAt: string
  status: "published" | "draft"
  excerpt: string
}

// Données fictives pour simuler des articles
const MOCK_ARTICLES: Article[] = [
  {
    id: "1",
    title: "Introduction à Next.js 13",
    createdAt: "2025-04-20T10:00:00Z",
    status: "published",
    excerpt: "Découvrez les nouvelles fonctionnalités de Next.js 13...",
  },
  {
    id: "2",
    title: "Utiliser Tailwind CSS avec React",
    createdAt: "2025-04-18T14:30:00Z",
    status: "published",
    excerpt: "Comment intégrer efficacement Tailwind CSS...",
  },
  {
    id: "3",
    title: "Les avantages de TypeScript",
    createdAt: "2025-04-15T09:15:00Z",
    status: "draft",
    excerpt: "Pourquoi TypeScript devrait être votre langage de choix...",
  },
  {
    id: "4",
    title: "Les bases de l'API REST",
    createdAt: "2025-04-10T16:45:00Z",
    status: "draft",
    excerpt: "Comprendre les principes fondamentaux des API REST...",
  },
  {
    id: "5",
    title: "Déployer votre application sur Vercel",
    createdAt: "2025-04-05T11:20:00Z",
    status: "published",
    excerpt: "Un guide étape par étape pour déployer votre application Next.js...",
  },
];

export default function AdminDashboardPage() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);

  // Fonction pour supprimer un article
  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  return (
    <SidebarProvider>
      <div className="flex min-h-screen bg-black text-zinc-200">

        {/* Contenu principal */}
        <div className="flex-1 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-3xl font-bold">Tableau de bord</h1>
            <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
              <Link href="/admin/articles/new">
                <Plus size={16} className="mr-2" />
                Nouvel article
              </Link>
            </Button>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Articles publiés</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{articles.filter(a => a.status === 'published').length}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Brouillons</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{articles.filter(a => a.status === 'draft').length}</p>
              </CardContent>
            </Card>
            <Card className="bg-zinc-900 border border-zinc-800">
              <CardHeader className="pb-2">
                <CardTitle className="text-lg">Total</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-3xl font-bold">{articles.length}</p>
              </CardContent>
            </Card>
          </div>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle>Vos articles</CardTitle>
            </CardHeader>
            <CardContent>
              <AdminArticlesTable articles={articles} onDelete={handleDeleteArticle} />
            </CardContent>
          </Card>
        </div>

        {/* Trigger for mobile sidebar */}
        <SidebarTrigger className="fixed bottom-4 right-4 lg:hidden bg-zinc-800 text-zinc-200" />
      </div>
    </SidebarProvider>
  );
}

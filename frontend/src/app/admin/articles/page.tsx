"use client"

import { useState } from "react"
import Link from "next/link"
import { Plus, Filter, Search } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { AdminArticlesTable } from "@/components/admin/article/ArticlesTable"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

// Type pour les articles
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
  {
    id: "6",
    title: "Optimisation des performances React",
    createdAt: "2025-03-28T13:40:00Z",
    status: "published",
    excerpt: "Techniques avancées pour améliorer les performances de vos applications React...",
  },
  {
    id: "7",
    title: "Introduction à GraphQL",
    createdAt: "2025-03-22T09:30:00Z",
    status: "draft",
    excerpt: "Pourquoi GraphQL est une alternative intéressante aux API REST traditionnelles...",
  },
  {
    id: "8",
    title: "Gestion d'état avec Redux",
    createdAt: "2025-03-15T16:20:00Z",
    status: "published",
    excerpt: "Comment implémenter Redux dans vos applications React pour une gestion d'état efficace...",
  },
];

export default function ArticlesPage() {
  const [articles, setArticles] = useState<Article[]>(MOCK_ARTICLES);
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");

  // Fonction pour supprimer un article
  const handleDeleteArticle = (id: string) => {
    setArticles(articles.filter(article => article.id !== id));
  };

  // Fonction pour filtrer les articles
  const filteredArticles = articles.filter(article => {
    // Filtre par terme de recherche
    const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
    
    // Filtre par statut
    const matchesStatus = statusFilter === "all" || article.status === statusFilter;
    
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-8">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Articles</h1>
        <Button asChild className="bg-zinc-100 text-zinc-900 hover:bg-zinc-200">
          <Link href="/admin/articles/new">
            <Plus size={16} className="mr-2" />
            Nouvel article
          </Link>
        </Button>
      </div>

      <Card className="bg-zinc-900 border border-zinc-800">
        <CardHeader>
          <CardTitle>Filtres</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-zinc-400" size={18} />
              <Input
                placeholder="Rechercher un article..."
                className="pl-10 bg-zinc-800 border-zinc-700 text-zinc-200"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>
            <div className="w-full md:w-64">
              <Select
                value={statusFilter}
                onValueChange={setStatusFilter}
              >
                <SelectTrigger className="bg-zinc-800 border-zinc-700 text-zinc-200">
                  <SelectValue placeholder="Filtrer par statut" />
                </SelectTrigger>
                <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                  <SelectItem value="all">Tous les statuts</SelectItem>
                  <SelectItem value="published">Publiés</SelectItem>
                  <SelectItem value="draft">Brouillons</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
        </CardContent>
      </Card>

      <Card className="bg-zinc-900 border border-zinc-800">
        <CardHeader className="flex flex-row items-center justify-between">
          <CardTitle>Liste des articles</CardTitle>
          <div className="text-sm text-zinc-400">
            {filteredArticles.length} article{filteredArticles.length !== 1 ? 's' : ''}
          </div>
        </CardHeader>
        <CardContent>
          <AdminArticlesTable 
            articles={filteredArticles} 
            onDelete={handleDeleteArticle} 
          />
        </CardContent>
      </Card>
    </div>
  );
}

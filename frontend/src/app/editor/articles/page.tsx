"use client"

import { useState, useEffect, useMemo } from "react"
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
  const [isLoading, setIsLoading] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  // Simuler un chargement
  useEffect(() => {
    setIsLoading(true);
    const timer = setTimeout(() => setIsLoading(false), 800);
    return () => clearTimeout(timer);
  }, []);

  // Fonction pour supprimer un article avec feedback visuel
  const handleDeleteArticle = async (id: string) => {
    setDeletingId(id);
    // Simuler une requête API
    await new Promise(resolve => setTimeout(resolve, 800));
    setArticles(articles.filter(article => article.id !== id));
    setDeletingId(null);
  };

  // Fonction pour filtrer les articles
  const filteredArticles = useMemo(() => {
    return articles.filter(article => {
      const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        article.excerpt.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesStatus = statusFilter === "all" || article.status === statusFilter;
      return matchesSearch && matchesStatus;
    });
  }, [articles, searchTerm, statusFilter]);

  // Fonction pour réinitialiser les filtres
  const resetFilters = () => {
    setSearchTerm("");
    setStatusFilter("all");
  };

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Articles</h1>
          <p className="text-zinc-400 mt-1">Gérez et suivez vos publications</p>
        </div>
        <Button asChild className="bg-blue-600 hover:bg-blue-700 text-white transition-colors">
          <Link href="/editor/articles/new" className="flex items-center">
            <Plus size={16} className="mr-2" />
            Nouvel article
          </Link>
        </Button>
      </div>

      {/* Carte principale */}
      <Card className="bg-zinc-900 border border-zinc-800 overflow-hidden p-6">
        {/* En-tête avec filtres */}
        <CardHeader className="pb-4 px-6 pt-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="flex items-center space-x-2">
              <h2 className="text-lg font-semibold text-white">Liste des articles</h2>
              <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-300 border border-zinc-700">
                {filteredArticles.length} {filteredArticles.length <= 1 ? 'article' : 'articles'}
              </span>
            </div>

            <div className="flex items-center gap-3 flex-1 justify-end">
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={resetFilters}
                  className="text-xs text-blue-400 hover:text-blue-300 hover:bg-transparent whitespace-nowrap"
                >
                  Réinitialiser les filtres
                </Button>
              )}

              <div className="relative w-full max-w-xs">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Search className="h-4 w-4 text-zinc-400" />
                </div>
                <Input
                  placeholder="Rechercher..."
                  className="pl-10 bg-zinc-800/50 border-zinc-700 text-zinc-200 placeholder-zinc-500 focus-visible:ring-1 focus-visible:ring-blue-500/50 h-9"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                />
              </div>

              <div className="w-40">
                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="bg-zinc-800/50 border-zinc-700 text-zinc-200 h-9">
                    <div className="flex items-center">
                      <Filter className="h-4 w-4 mr-2 text-zinc-400" />
                      <SelectValue placeholder="Statut" />
                    </div>
                  </SelectTrigger>
                  <SelectContent className="bg-zinc-800 border-zinc-700 text-zinc-200">
                    <SelectItem value="all">Tous les statuts</SelectItem>
                    <SelectItem value="published" className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-green-500 mr-2"></span>
                      Publiés
                    </SelectItem>
                    <SelectItem value="draft" className="flex items-center">
                      <span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>
                      Brouillons
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </div>
        </CardHeader>

        {/* Contenu */}
        <CardContent className="p-0">
          {isLoading ? (
            <div className="flex items-center justify-center p-12">
              <div className="animate-pulse flex flex-col items-center space-y-2">
                <div className="h-8 w-8 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                <p className="text-sm text-zinc-400">Chargement des articles...</p>
              </div>
            </div>
          ) : filteredArticles.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-center">
              <div className="p-4 bg-zinc-800/50 rounded-full mb-4">
                <Search className="h-8 w-8 text-zinc-400" />
              </div>
              <h3 className="text-lg font-medium text-white mb-1">Aucun article trouvé</h3>
              <p className="text-sm text-zinc-400 max-w-md">
                {searchTerm || statusFilter !== 'all'
                  ? 'Essayez de modifier vos critères de recherche ou réinitialisez les filtres.'
                  : 'Commencez par créer votre premier article.'}
              </p>
              {(searchTerm || statusFilter !== 'all') && (
                <Button
                  variant="outline"
                  className="mt-4 border-zinc-700 text-zinc-300 hover:bg-zinc-800/50"
                  onClick={resetFilters}
                >
                  Réinitialiser les filtres
                </Button>
              )}
            </div>
          ) : (
            <div className="overflow-hidden">
              <AdminArticlesTable
                articles={filteredArticles}
                onDelete={handleDeleteArticle}
                isDeleting={deletingId !== null}
              />
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

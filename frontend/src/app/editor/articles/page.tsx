"use client"

import { useState, useEffect, useMemo } from "react"
import Link from "next/link"
import { Plus, Filter, Search, RefreshCw } from "lucide-react"
import { useArticleActions } from "@/contexts/ArticleActionsContext"

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
import { useToast } from "@/components/ui/use-toast"
import { useAuth } from "@/contexts/AuthContext"
import { Article, getMyArticles, deleteArticle } from "@/services/articleService"

// Type Article est maintenant importé depuis articleService.ts

export default function ArticlesPage() {
    const { toast } = useToast();
    const { user } = useAuth(); // Récupérer l'utilisateur connecté
    const { shouldRefresh, registerAction } = useArticleActions(); // Utiliser le contexte d'actions
    
    const [articles, setArticles] = useState<Article[]>([]);
    const [searchTerm, setSearchTerm] = useState("");
    const [statusFilter, setStatusFilter] = useState<string>("all");
    const [isLoading, setIsLoading] = useState(true);
    const [deletingId, setDeletingId] = useState<string | null>(null);
    const [currentPage, setCurrentPage] = useState(1);
    const [meta, setMeta] = useState({ total: 0, page: 1, totalPages: 1, limit: 12 });
    const [isRefreshing, setIsRefreshing] = useState(false); // État pour le rafraîchissement manuel

    // Fonction pour charger les articles
    const loadArticles = async () => {
        try {
            setIsLoading(true);
            // Récupérer l'ID de l'utilisateur connecté et le passer au service
            const currentUserId = user?.id || null;
            const response = await getMyArticles(searchTerm, statusFilter, currentUserId, currentPage, meta.limit);
            setArticles(response.data);
            setMeta(response.meta);
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de charger vos articles."
            });
            console.error(error);
        } finally {
            setIsLoading(false);
        }
    };

    // Charger les articles au montage et quand les filtres changent
    useEffect(() => {
        loadArticles();
        // Pas de rafraîchissement automatique par minuteur
        // Le chargement se fait uniquement lors des changements de filtres ou de page
    }, [searchTerm, statusFilter, currentPage, meta.limit, user]);
    
    // Vérifier si une action a été effectuée et rafraîchir les données si nécessaire
    useEffect(() => {
        if (shouldRefresh()) {
            console.log('Rafraîchissement des articles après une action');
            loadArticles();
        }
    }, [shouldRefresh]);
    
    // Fonction pour le rafraîchissement manuel
    const handleManualRefresh = () => {
        setIsRefreshing(true);
        loadArticles().finally(() => {
            setIsRefreshing(false);
        });
    };
    
    // Suppression du rafraîchissement automatique lors des changements de visibilité
    // pour éviter les re-rendus excessifs - utiliser le bouton de rafraîchissement manuel à la place

    // Fonction pour supprimer un article
    const handleDeleteArticle = async (id: string, slug?: string) => {
        try {
            setDeletingId(id);
            // Passer le slug à la fonction deleteArticle, car le backend utilise le slug pour identifier l'article
            await deleteArticle(id, slug);
            setArticles(articles.filter(article => article.id !== id));

            // Enregistrer l'action de suppression pour déclencher un rafraîchissement ailleurs
            registerAction("delete");
            
            toast({
                title: "Succès",
                description: "L'article a été supprimé",
                variant: "default"
            });
        } catch (error) {
            toast({
                variant: "destructive",
                title: "Erreur",
                description: "Impossible de supprimer l'article."
            });
            console.error(error);
        } finally {
            setDeletingId(null);
        }
    };

    // Fonction pour mettre à jour un article après changement de statut (sans notification)
    const handleStatusChange = (updatedArticle: Article) => {
        // Mettre à jour la liste des articles avec le nouvel article mis à jour
        setArticles(articles.map(article =>
            article.id === updatedArticle.id ? updatedArticle : article
        ));
        
        // Enregistrer l'action de changement de statut (publication ou brouillon)
        registerAction(updatedArticle.status === 'published' ? "publish" : "draft");
        
        // Pas de notification toast - à la demande de l'utilisateur
    };

    // Fonction pour filtrer les articles
    const filteredArticles = useMemo(() => {
        return articles.filter(article => {
            // Recherche dans le titre et l'intro
            const matchesSearch = article.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                (article.intro ? article.intro.toLowerCase().includes(searchTerm.toLowerCase()) : false);

            // Comparaison de statut ("all", "published", ou "draft")
            const matchesStatus = statusFilter === "all" || article.status === statusFilter;

            return matchesSearch && matchesStatus;
        });
    }, [articles, searchTerm, statusFilter]);

    // Console log pour déboguer les données reçues par le frontend
    useEffect(() => {
        if (!isLoading && articles.length > 0) {
            console.log('Articles chargés avec statuts:',
                articles.map(a => ({
                    id: a.id,
                    title: a.title,
                    status: a.status,
                    createdAt: a.createdAt
                })));
        }
    }, [articles, isLoading]);

    // Fonction pour réinitialiser les filtres
    const resetFilters = () => {
        setSearchTerm("");
        setStatusFilter("all");
        setCurrentPage(1);
    };

    // Fonction pour changer de page
    const handlePageChange = (page: number) => {
        setCurrentPage(page);
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
            <Card className="bg-zinc-900 border border-zinc-800 overflow-hidden">
                {/* En-tête avec filtres */}
                <CardHeader className="pb-4 px-6 pt-6">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                        <div className="flex items-center space-x-3">
                            <h2 className="text-lg font-semibold text-white">Liste des articles</h2>
                            <span className="inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium bg-zinc-800/50 text-zinc-300 border border-zinc-700">
                                {meta.total} {meta.total <= 1 ? 'article' : 'articles'}
                            </span>
                            <Button 
                                variant="ghost" 
                                size="sm" 
                                onClick={handleManualRefresh}
                                disabled={isRefreshing}
                                className="flex items-center text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800 h-8 px-2"
                                title="Rafraîchir la liste"
                            >
                                <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                            </Button>
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
                <CardContent className="pt-3 px-0 pb-0">
                    {isLoading ? (
                        <div className="flex items-center justify-center h-40">
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
                        <div className="overflow-x-auto">
                            <AdminArticlesTable
                                articles={filteredArticles}
                                onDelete={handleDeleteArticle}
                                isDeleting={deletingId !== null}
                                onStatusChange={handleStatusChange}
                            />

                            {/* Pagination */}
                            {meta.totalPages > 1 && (
                                <div className="mt-4 py-4 flex justify-center bg-zinc-900 border-t border-zinc-800">
                                    <div className="flex items-center gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 w-8 p-0"
                                            onClick={() => handlePageChange(Math.max(1, currentPage - 1))}
                                            disabled={currentPage === 1}
                                        >
                                            &lsaquo;
                                        </Button>

                                        {Array.from({ length: meta.totalPages }, (_, i) => i + 1).map((page) => (
                                            <Button
                                                key={page}
                                                size="sm"
                                                variant={page === currentPage ? "default" : "outline"}
                                                className={page === currentPage
                                                    ? "bg-blue-600 text-white border-blue-600 hover:bg-blue-700 hover:border-blue-700 h-8 w-8 p-0"
                                                    : "border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 w-8 p-0"}
                                                onClick={() => handlePageChange(page)}
                                            >
                                                {page}
                                            </Button>
                                        ))}

                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800 h-8 w-8 p-0"
                                            onClick={() => handlePageChange(Math.min(meta.totalPages, currentPage + 1))}
                                            disabled={currentPage === meta.totalPages}
                                        >
                                            &rsaquo;
                                        </Button>
                                    </div>
                                </div>
                            )}
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}
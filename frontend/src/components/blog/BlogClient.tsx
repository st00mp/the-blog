"use client"

// Import des hooks React pour gérer l'état et les effets
import { useState, useEffect } from "react"
// Composant pour afficher chaque carte d'article
import { ArticleCard } from "@/components/blog/ArticleCard"
// Composant pour filtrer par catégories
import { CategoryFilter } from "@/components/blog/layout/CategoryFilter"
// Icones de recherche et de suppression (X)
import { Search, X } from "lucide-react"

// Définition des types pour simplifier la lecture et garantir la validité des données
// Une catégorie a un identifiant et un nom
// Un article possède plusieurs champs, dont sa catégorie et son auteur

type Category = { id: number; name: string }
type Article = {
    id: number
    title: string
    intro: string
    slug: string
    category: Category
    updated_at: string
    created_at: string
    author: { id: number, name: string }
}

// Composant principal en rendu côté client
export default function BlogClient({
    initialArticles,
    initialCategories,
    initialSearch = "",
    initialCategory = null,
}: {
    initialArticles: Article[]
    initialCategories: Category[]
    initialSearch?: string
    initialCategory?: Category | null
}) {
    // États locaux :
    // - search : la chaîne de recherche
    // - articles : la liste courante d'articles affichés
    // - selectedCategory : catégorie filtrée
    // - page : page actuelle pour la pagination
    // - totalPages : nombre total de pages dispo
    const [search, setSearch] = useState(initialSearch)
    const [articles, setArticles] = useState(initialArticles)
    const [selectedCategory, setCat] = useState<Category | null>(initialCategory)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    // Réinitialise la page à chaque changement de recherche ou de catégorie
    useEffect(() => {
        setPage(1)
    }, [search, selectedCategory])

    // Fonction asynchrone pour interroger l'API avec les filtres et la pagination
    const handleSearch = async (term: string) => {
        // Utiliser l'API proxy Next.js locale au lieu d'appeler directement le backend
        const url = new URL('/api/articles', window.location.origin)
        // Ajouter le statut=1 pour ne récupérer que les articles publiés
        url.searchParams.set("status", "1")
        // Si un terme de recherche est présent, on l'ajoute en paramètre
        if (term) url.searchParams.set("search", term)
        // Idem pour la catégorie sélectionnée
        if (selectedCategory) {
            url.searchParams.set("category", selectedCategory.id.toString())
        }
        // Paramètre de page pour la pagination
        url.searchParams.set("page", page.toString())
        
        console.log('Recherche d\'articles via:', url.toString())

        // Appel réseau
        const res = await fetch(url.toString())
        if (res.ok) {
            const body = await res.json()
            // Récupère la liste d'articles (différent selon le format de l'API)
            const newArticles = body.data ?? body;
            // Si on est sur la première page, on remplace, sinon on concatène
            if (page === 1) {
                setArticles(newArticles);
            } else {
                setArticles(prev => [...prev, ...newArticles]);
            }
            // Met à jour le nombre total de pages dispo si fourni par l'API
            setTotalPages(body.meta?.totalPages ?? 1)
        }
    }

    // Effet pour appeler handleSearch avec un debounce de 300ms
    // Se déclenche à chaque modification de search, selectedCategory ou page
    useEffect(() => {
        const tid = setTimeout(() => {
            handleSearch(search)
        }, 300)
        // Nettoyage du timeout précédent pour éviter les appels inutiles
        return () => clearTimeout(tid)
    }, [search, selectedCategory, page])

    return (
        <>
            {/* Section de filtrage et de recherche */}
            <div className="flex items-center justify-between mb-8 space-x-4">
                {/* Filtre par catégories (scroll horizontal si besoin) */}
                <div className="overflow-x-auto">
                    <CategoryFilter
                        categories={initialCategories}
                        selected={selectedCategory}
                        onSelect={setCat}
                    />
                </div>

                {/* Barre de recherche */}
                <div className="relative w-auto">
                    <input
                        type="text"
                        placeholder="Search posts"
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        onKeyDown={e => {
                            // Appel manuel si on appuie sur Entrée
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleSearch(search)
                            }
                        }}
                        className="w-56 bg-transparent border border-white/20 placeholder-white/50 text-white text-sm rounded-full pl-10 pr-10 py-1.5 focus:outline-none focus:ring-0"
                    />
                    {/* Icône loupe en début d'input */}
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
                    {/* Bouton pour effacer la recherche si un terme est présent */}
                    {search && (
                        <button
                            onClick={() => setSearch("")}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-white/50 hover:text-white"
                            aria-label="Clear search"
                        >
                            <X size={18} />
                        </button>
                    )}
                </div>
            </div>

            {/* Grille d'articles responsive */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {articles.map(article => (
                    <div key={article.id} className="border border-white/10 m-0">
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>

            {/* Bouton « Voir plus d'articles » si d'autres pages existent */}
            {page < totalPages && (
                <div className="flex justify-center mt-10">
                    <button
                        onClick={() => setPage(prev => prev + 1)}
                        className="w-full max-w-xl border border-white/20 bg-white/5 hover:bg-white/20 hover:border-transparent focus:outline-none focus:ring-0 text-white text-sm font-normal px-8 py-3 rounded-full transition"
                    >
                        Show more posts
                    </button>
                </div>
            )}
        </>
    )
}

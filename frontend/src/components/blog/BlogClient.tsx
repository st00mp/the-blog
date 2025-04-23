"use client"

import { useState, useEffect } from "react"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { CategoryFilter } from "@/components/blog/layout/CategoryFilter"
import { Search, X } from "lucide-react"

type Category = { id: number; name: string }
type Article = {
    id: number
    title: string
    intro: string
    slug: string
    category: Category
    updated_at: string
    created_at: string
    author: { name: string }
}

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
    const [search, setSearch] = useState(initialSearch)
    const [articles, setArticles] = useState(initialArticles)
    const [selectedCategory, setCat] = useState<Category | null>(initialCategory)
    const [page, setPage] = useState<number>(1)
    const [totalPages, setTotalPages] = useState<number>(1)

    useEffect(() => {
        setPage(1)
    }, [search, selectedCategory])

    const handleSearch = async (term: string) => {
        const API = process.env.NEXT_PUBLIC_BACKEND_API_URL!
        const url = new URL(`${API}/api/articles`)
        if (term) url.searchParams.set("search", term)
        if (selectedCategory) {
            url.searchParams.set("category", selectedCategory.id.toString())
        }
        url.searchParams.set("page", page.toString())
        const res = await fetch(url.toString())
        if (res.ok) {
            const body = await res.json()
            const newArticles = body.data ?? body;
            if (page === 1) {
                setArticles(newArticles);
            } else {
                setArticles(prev => [...prev, ...newArticles]);
            }
            setTotalPages(body.meta?.totalPages ?? 1)
        }
    }

    // fetch + debounce
    useEffect(() => {
        const tid = setTimeout(() => {
            handleSearch(search)
        }, 300)
        return () => clearTimeout(tid)
    }, [search, selectedCategory, page])

    return (
        <>
            {/* Container search + filter */}
            <div className="flex items-center justify-between mb-8 space-x-4">
                {/* Filtre catégories */}
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
                            if (e.key === "Enter") {
                                e.preventDefault()
                                handleSearch(search)
                            }
                        }}
                        className="w-56 bg-transparent border border-white/20 placeholder-white/50 text-white text-sm rounded-full pl-10 pr-10 py-1.5 focus:outline-none focus:ring-0"
                    />
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-white/50" size={18} />
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

            {/* Grille d’articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 divide-x divide-y divide-white/10 border border-white/10">
                {articles.map(article => (
                    <div key={article.id}>
                        <ArticleCard article={article} />
                    </div>
                ))}
            </div>
            {/* Voir plus d'articles */}
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
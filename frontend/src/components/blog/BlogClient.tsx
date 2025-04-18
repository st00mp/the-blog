"use client"

import { useState, useEffect } from "react"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { CategoryFilter } from "@/components/blog/layout/CategoryFilter"

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
}: {
    initialArticles: Article[]
    initialCategories: Category[]
    initialSearch?: string
}) {
    const [search, setSearch] = useState(initialSearch)
    const [articles, setArticles] = useState(initialArticles)
    const [selectedCategory, setCat] = useState<Category | null>(null)

    const handleSearch = async (term: string) => {
        const API = process.env.NEXT_PUBLIC_BACKEND_API_URL!
        const url = new URL(`${API}/api/articles`)
        if (term) url.searchParams.set("search", term)
        const res = await fetch(url.toString())
        if (res.ok) {
            const body = await res.json()
            setArticles(body.data ?? body)
        }
    }

    // fetch + debounce
    useEffect(() => {
        const tid = setTimeout(() => {
            handleSearch(search)
        }, 300)
        return () => clearTimeout(tid)
    }, [search])

    // tri + filtre catégorie
    const sorted = [...articles].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    const filtered = selectedCategory
        ? sorted.filter(a => a.category.id === selectedCategory.id)
        : sorted

    return (
        <>
            {/* Container search + filter */}
            <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4 mb-8">
                {/* Filtre catégories */}
                <div className="overflow-x-auto">
                    <CategoryFilter
                        categories={initialCategories}
                        selected={selectedCategory}
                        onSelect={setCat}
                    />
                </div>

                {/* Barre de recherche */}
                <div className="relative w-full lg:w-1/3">
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
                        className="w-full bg-transparent border border-white/20 placeholder-white/50 text-white rounded-full pl-10 pr-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
                    />
                    {/* Icône loupe */}
                    <svg
                        className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-white/50"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                    >
                        <path
                            strokeWidth="2"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            d="M21 21l-4.35-4.35m0 0A7.5 7.5 0 1111.25 3a7.5 7.5 0 015.4 12.65z"
                        />
                    </svg>
                </div>
            </div>

            {/* Grille d’articles */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {filtered.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </>
    )
}
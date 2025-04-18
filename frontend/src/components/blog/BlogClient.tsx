"use client"

import { useState } from "react"
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
}: {
    initialArticles: Article[]
    initialCategories: Category[]
}) {
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    // Tri et filtre côté client
    const sorted = [...initialArticles].sort(
        (a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
    )
    const filtered = selectedCategory
        ? sorted.filter(a => a.category.id === selectedCategory.id)
        : sorted

    return (
        <>
            <CategoryFilter
                categories={initialCategories}
                selected={selectedCategory}
                onSelect={setSelectedCategory}
            />
            <br />
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                {filtered.map(article => (
                    <ArticleCard key={article.id} article={article} />
                ))}
            </div>
        </>
    )
}
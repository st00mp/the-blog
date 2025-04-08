"use client"

import { useEffect, useState } from "react"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { CategoryFilter } from "@/components/blog/layout/CategoryFilter"

type Category = {
    id: number
    name: string
}

type Article = {
    id: number
    title: string
    intro: string
    slug: string
    category: Category
    updated_at: string
    created_at: string
    author: {
        name: string
    }
}

export default function BlogPage() {
    const API_URL = process.env.NEXT_PUBLIC_BACKEND_API_URL;

    const [articles, setArticles] = useState<Article[]>([])
    const [categories, setCategories] = useState<Category[]>([])
    const [selectedCategory, setSelectedCategory] = useState<Category | null>(null)

    useEffect(() => {
        const fetchData = async () => {
            try {
                const articleRes = await fetch(`/api/articles`)
                const categoryRes = await fetch(`/api/categories`)
                if (!articleRes.ok || !categoryRes.ok) throw new Error("Erreur HTTP")
                const fetchedArticles = await articleRes.json()
                const fetchedCategories = await categoryRes.json()

                setArticles(
                    fetchedArticles.sort(
                        (a: Article, b: Article) =>
                            new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime()
                    )
                )
                setCategories(fetchedCategories)
            } catch (error) {
                console.error("❌ Erreur lors du chargement des données :", error)
            }
        }

        fetchData()
    }, [API_URL])

    const filteredArticles = selectedCategory
        ? articles.filter((a) => a.category.id === selectedCategory.id)
        : articles

    return (
        <main className="min-h-screen bg-black text-white py-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
                <CategoryFilter
                    categories={categories}
                    selected={selectedCategory}
                    onSelect={setSelectedCategory}
                />
                <br />
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                    {filteredArticles.map((article) => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </main>
    )
}

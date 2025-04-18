// File: frontend/src/app/blog/page.tsx
import { ArticleCard } from "@/components/blog/ArticleCard"
import BlogClient from "@/components/blog/BlogClient"

// ISR toutes les 60s pour régénération automatique
export const revalidate = 60

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
    author: { name: string }
}

export default async function BlogPage() {
    const API_URL = process.env.BACKEND_API_URL

    // Fetch côté serveur au build (SSG) ou ISR
    const [articles, categories] = await Promise.all([
        fetch(`${API_URL}/api/articles`).then(res => {
            if (!res.ok) throw new Error("Erreur HTTP articles")
            return res.json() as Promise<Article[]>
        }),
        fetch(`${API_URL}/api/categories`).then(res => {
            if (!res.ok) throw new Error("Erreur HTTP categories")
            return res.json() as Promise<Category[]>
        }),
    ])

    return (
        <main className="min-h-screen bg-black text-white py-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
                {/* Composant client pour le filtre */}
                <BlogClient
                    initialArticles={articles}
                    initialCategories={categories}
                />
            </div>
        </main>
    )
}
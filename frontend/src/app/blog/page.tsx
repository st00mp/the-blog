// File: frontend/src/app/blog/page.tsx
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

export default async function BlogPage({
    searchParams,
}: {
    searchParams: { search?: string }
}) {
    const API_URL = process.env.BACKEND_API_URL!
    if (!API_URL) {
        throw new Error("BACKEND_API_URL must be defined in .env.local")
    }

    // Construction de l'URL avec paramètre de recherche
    const url = new URL(`${API_URL}/api/articles`)
    if (searchParams.search) url.searchParams.set('search', searchParams.search)

    // Fetch côté serveur au build (SSG) ou ISR
    const [rawArticles, categories] = await Promise.all([
        fetch(url.toString(), { next: { revalidate: 60 } }).then(async res => {
            if (!res.ok) throw new Error(`Erreur HTTP articles: ${res.status}`)
            const json = await res.json() as { data: Article[] }
            return json.data
        }),
        fetch(`${API_URL}/api/categories`, { next: { revalidate: 60 } }).then(res => {
            if (!res.ok) throw new Error(`Erreur HTTP categories: ${res.status}`)
            return res.json() as Promise<Category[]>
        }),
    ])

    return (
        <main className="min-h-screen bg-black text-white py-10">
            <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
                <BlogClient
                    initialArticles={rawArticles}
                    initialCategories={categories}
                    initialSearch={searchParams.search ?? ''}
                />
            </div>
        </main>
    )
}
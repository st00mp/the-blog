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
    searchParams: { search?: string, category?: string, page?: string }
}) {
    // Récupération de l'URL de l'API backend depuis les variables d'environnement
    const API_URL = process.env.BACKEND_API_URL!
    // Vérifie que la variable BACKEND_API_URL est bien définie
    if (!API_URL) {
        throw new Error("BACKEND_API_URL must be defined in .env.local")
    }

    // Construction dynamique de l'URL avec les paramètres de recherche, catégorie et pagination
    const url = new URL(`${API_URL}/api/articles`)
    if (searchParams.search) url.searchParams.set('search', searchParams.search)
    if (searchParams.category) url.searchParams.set('category', searchParams.category)
    if (searchParams.page) url.searchParams.set('page', searchParams.page)

    // Requêtes serveur : articles et catégories, avec stratégie de revalidation ISR toutes les 60s
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

    // Rendu du composant BlogClient avec les données récupérées (articles, catégories, etc.)
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
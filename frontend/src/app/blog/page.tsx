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
    author: { id: number, name: string }
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

    // Deux requêtes sont faites en parallèle pour optimiser le temps de chargement :
    const [rawArticles, categories] = await Promise.all([
        // 1. Récupère les articles avec les éventuels filtres (search, category, page)
        fetch(url.toString(), { next: { revalidate: 60 } })
            // Vérifie la validité de la réponse et extrait les articles depuis le JSON
            .then(async res => {
                if (!res.ok) throw new Error(`Erreur HTTP articles: ${res.status}`)
                const json = await res.json() as { data: Article[] }
                return json.data
            }),
        // 2. Récupère toutes les catégories disponibles pour le filtre frontend
        fetch(`${API_URL}/api/categories`, { next: { revalidate: 60 } })
            // Vérifie la validité de la réponse et extrait la liste des catégories
            .then(res => {
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
                    initialCategories={Array.isArray(categories) ? categories : []}
                    initialSearch={searchParams.search ?? ''}
                />
            </div>
        </main>
    )
}
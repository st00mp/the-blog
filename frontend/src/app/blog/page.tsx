import { ArticleCard } from "@/components/blog/ArticleCard"
import { CategoryFilter } from "@/components/blog/layout/CategoryFilter"

type Article = {
    id: number
    title: string
    intro: string
    slug: string
    category: string
    updated_at: string
    created_at: string
    author: {
        name: string
    }
}

type ArticleCardProps = {
    article: Article
}

export default async function BlogPage() {
    const API_URL = process.env.BACKEND_API_URL;

    try {
        const res = await fetch(`${API_URL}/api/articles`);
        if (!res.ok) throw new Error("Erreur HTTP");

        const articles = (await res.json()) as Article[];

        return (
            <main className="min-h-screen bg-black text-white py-10">
                <div className="max-w-7xl mx-auto px-6 sm:px-10 md:px-16 lg:px-20">
                    <CategoryFilter />
                    <br />
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3">
                        {articles.map((article) => (
                            <ArticleCard
                                key={article.id}
                                article={article}
                            />
                        ))}
                    </div>
                </div>
            </main>
        );
    } catch (error) {
        console.error("❌ Erreur fetch articles list:", error);

        return (
            <main className="min-h-screen bg-black text-white py-10">
                <div className="text-center text-red-500">
                    Impossible to load the articles. Please try again later.
                </div>
            </main>
        );
    }
}

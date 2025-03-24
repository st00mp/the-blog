import { articles } from "@/lib/articles-mock"
import { ArticleCard } from "@/components/blog/ArticleCard"
import { CategoryFilter } from "@/components/blog/layout/CategoryFilter"

export default function BlogPage() {
    return (
        // Fond noir, texte blanc
        <main className="min-h-screen bg-black text-white py-10">
            <div className="max-w-7xl mx-auto px-6 md:px-8">
                {/* <h1 className="text-4xl font-bold mb-10">Blog</h1> */}
                <CategoryFilter />
                <br />
                <div className="grid grid-cols-1 md:grid-cols-3 gap-[1px]">
                    {articles.map(article => (
                        <ArticleCard key={article.id} article={article} />
                    ))}
                </div>
            </div>
        </main>
    )
}

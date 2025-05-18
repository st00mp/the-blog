import Link from "next/link"

function truncate(text: string, max: number) {
    return text.length > max ? text.slice(0, max).trim() + "…" : text
}

// Tableau fixe d'abréviations de mois
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Formatte la date en UTC pour éviter le mismatch
function formatDate(dateString: string) {
    const d = new Date(dateString)
    const month = MONTHS[d.getUTCMonth()]
    const day = d.getUTCDate()
    return `${month} ${day}`
}

type Article = {
    id: number
    title: string
    intro: string
    slug: string
    category: {
        id: number
        name: string
    }
    author: {
        id: number
        name: string
    }
    created_at: string
    updated_at: string
}

type ArticleCardProps = {
    article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/blog/${article.slug}`}>
            <div className="hover:bg-white/5 transition-colors flex flex-col p-10 gap-4 h-80">
                {/* Catégorie + Date */}
                <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>{article.category?.name ?? "Uncategorized"}</span>
                    <span>{formatDate(article.updated_at)}</span>
                </div>

                {/* Titre */}
                <h2 className="text-lg font-semibold leading-tight mb-2 line-clamp-2">
                    {article.title}
                </h2>

                {/* Extrait */}
                <p className="text-sm text-white/70 leading-relaxed mb-4 line-clamp-3">
                    {article.intro || "Aucun extrait disponible"}
                </p>

                {/* Auteur */}
                <div className="text-xs text-white/50 mt-auto">
                    {article.author.name}
                </div>
            </div>
        </Link>
    )
}

import Link from "next/link"
import { ArrowRightIcon } from "lucide-react"

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
    // author supprimé - application mono-utilisateur
    created_at: string
    updated_at: string
}

type ArticleCardProps = {
    article: Article
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/blog/${article.slug}`}>
            <div className="hover:bg-white/5 transition-colors flex flex-col p-6 pt-5 h-80 group">
                {/* En-tête: Catégorie + Date */}
                <div className="flex justify-between items-center text-xs text-white/50 mb-8">
                    <span className="bg-white/5 px-2 py-1 rounded-sm">{article.category?.name ?? "Uncategorized"}</span>
                    <span>{formatDate(article.updated_at)}</span>
                </div>

                {/* Titre avec taille améliorée et padding horizontal */}
                <h2 className="text-xl font-semibold leading-tight mb-4 line-clamp-2 group-hover:text-white transition-colors px-1 pt-1">
                    {article.title}
                </h2>

                {/* Extrait avec espace optimisé et padding horizontal */}
                <p className="text-sm text-white/60 leading-relaxed mb-7 line-clamp-4 px-1 pt-1">
                    {article.intro || "Aucun extrait disponible"}
                </p>

                {/* CTA "Read article" plus visible */}
                <div className="mt-auto">
                    <div className="flex items-center text-xs font-medium text-white/70 group-hover:text-white transition-colors">
                        <span className="mr-2">Read article</span>
                        <ArrowRightIcon className="w-4 h-4 transition-transform group-hover:translate-x-1" />
                    </div>
                </div>
            </div>
        </Link>
    )
}

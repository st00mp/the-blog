import Link from "next/link"
import { ArticleCardProps } from "@/types/article-card"

function truncate(text: string, max: number) {
    return text.length > max ? text.slice(0, max).trim() + "…" : text
}

export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/blog/${article.slug}`}>
            <div
                className="
                    border border-white/10
                    hover:bg-white/5
                    transition-colors
                    flex flex-col
                    p-4 sm:p-6 md:p-8
                    gap-3
                    h-full
                "
            >
                {/* Catégorie + Date */}
                <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span className="capitalize">{article.category ?? "Uncategorized"}</span>
                    <span>
                        {new Date(article.date).toLocaleDateString("en-US", {
                            month: "short",
                            day: "numeric",
                        })}
                    </span>
                </div>

                {/* Titre */}
                <h2 className="text-lg font-semibold leading-tight mb-2">
                    {truncate(article.title, 80)}
                </h2>

                {/* Extrait */}
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                    {truncate(article.excerpt, 130)}
                </p>

                {/* Auteur */}
                <div className="text-xs text-white/50 mt-auto">
                    {article.author}
                </div>
            </div>
        </Link>
    )
}

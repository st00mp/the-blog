import Link from "next/link"

// Fonction utilitaire pour tronquer un texte s'il dépasse une certaine longueur
function truncate(text: string, max: number) {
    return text.length > max ? text.slice(0, max).trim() + "…" : text
}

// Tableau fixe pour convertir un numéro de mois en abréviation anglaise
const MONTHS = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"]

// Formatte une date (string) en "Mois Jour" avec le mois en abréviation anglaise
function formatDate(dateString: string) {
    const d = new Date(dateString)
    const month = MONTHS[d.getUTCMonth()]
    const day = d.getUTCDate()
    return `${month} ${day}`
}

// Type TypeScript représentant la structure d’un article
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
        name: string
    }
    created_at: string
    updated_at: string
}

// Props attendues par le composant ArticleCard (un seul article)
type ArticleCardProps = {
    article: Article
}

// Composant qui affiche un aperçu cliquable d’un article sous forme de carte
export function ArticleCard({ article }: ArticleCardProps) {
    return (
        <Link href={`/blog/${article.slug}`}>
            <div className="hover:bg-white/5 transition-colors flex flex-col p-10 gap-4 h-full">
                {/* En-tête contenant la catégorie et la date de mise à jour */}
                <div className="flex justify-between text-xs text-white/60 mb-2">
                    <span>{article.category?.name ?? "Uncategorized"}</span>
                    <span>{formatDate(article.updated_at)}</span>
                </div>

                {/* Titre de l'article, tronqué s'il est trop long */}
                <h2 className="text-lg font-semibold leading-tight mb-2">
                    {truncate(article.title, 80)}
                </h2>

                {/* Extrait introductif de l'article, tronqué */}
                <p className="text-sm text-white/70 leading-relaxed mb-4">
                    {truncate(article.intro, 130)}
                </p>

                {/* Nom de l'auteur, affiché en bas de la carte */}
                <div className="text-xs text-white/50 mt-auto">
                    {article.author.name}
                </div>
            </div>
        </Link>
    )
}

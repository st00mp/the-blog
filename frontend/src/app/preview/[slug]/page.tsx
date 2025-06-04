"use client"

import { useEffect, useState } from "react"
import { useParams } from "next/navigation"
import TiptapRenderer from "@/components/blog/detail/TiptapRenderer"
import { Button } from "@/components/ui/button"
import { ClockIcon, ArrowLeft, Edit, Eye } from "lucide-react"
import Link from "next/link"
import { useAuth } from "@/contexts/AuthContext"
import { useRouter } from "next/navigation"

// Type pour représenter un article dans la prévisualisation
type Article = {
    id: string
    slug: string
    title: string
    intro: string
    category: { id: number; name: string }
    // author supprimé - application mono-utilisateur
    content: string
    steps: { title: string; content: any }[]
    quote?: string        // Citation optionnelle
    conclusionTitle: string
    conclusionDescription: any
    ctaDescription: string
    ctaButton: string
    updatedAt: string
    status: string
}

export default function PreviewArticlePage() {
    const params = useParams()
    const slug = typeof params?.slug === "string" ? params.slug : ""
    const router = useRouter()
    const { user, isLoading: authLoading } = useAuth()
    const [article, setArticle] = useState<Article | null>(null)
    const [isLoading, setIsLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)

    // Récupérer l'article en utilisant le slug
    useEffect(() => {
        const fetchArticle = async () => {
            if (!slug || authLoading) return

            try {
                setIsLoading(true)
                // Appel API via la route de prévisualisation spécifique avec le paramètre status=0 pour voir les brouillons
                const response = await fetch(`/api/articles/preview/${slug}?status=0`, {
                    credentials: "include",
                    cache: "no-store" // Éviter la mise en cache
                })

                if (!response.ok) {
                    if (response.status === 404) {
                        setError("Cet article n'existe pas.")
                    } else if (response.status === 403) {
                        setError("Vous n'êtes pas autorisé à accéder à cet article.")
                    } else {
                        setError("Une erreur est survenue lors du chargement de l'article.")
                    }
                    return
                }

                const articleData = await response.json()
                setArticle(articleData)
            } catch (err) {
                console.error("Erreur lors du chargement de l'article:", err)
                setError("Une erreur est survenue lors du chargement de l'article.")
            } finally {
                setIsLoading(false)
            }
        }

        fetchArticle()
    }, [slug, authLoading])

    // Rediriger les utilisateurs non authentifiés
    useEffect(() => {
        if (!authLoading && !user) {
            router.push("/login?redirect=/preview/" + slug)
        }
    }, [user, authLoading, router, slug])

    if (authLoading || (!user && typeof window !== "undefined")) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-400">Vérification de vos droits d'accès...</p>
                </div>
            </div>
        )
    }

    if (isLoading) {
        return (
            <div className="flex items-center justify-center min-h-screen">
                <div className="animate-pulse flex flex-col items-center">
                    <div className="h-12 w-12 border-4 border-t-blue-500 border-b-blue-500 rounded-full animate-spin mb-4"></div>
                    <p className="text-zinc-400">Chargement de la prévisualisation...</p>
                </div>
            </div>
        )
    }

    if (error || !article) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen p-4 text-center">
                <div className="bg-red-500/10 p-4 rounded-full mb-4">
                    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-red-500 h-10 w-10">
                        <circle cx="12" cy="12" r="10" />
                        <line x1="12" y1="8" x2="12" y2="12" />
                        <line x1="12" y1="16" x2="12" y2="16" />
                    </svg>
                </div>
                <h1 className="text-2xl font-bold text-white mb-2">Erreur</h1>
                <p className="text-zinc-400 max-w-md mb-6">{error || "Impossible de charger cet article."}</p>
                <Button asChild>
                    <Link href="/editor/articles" className="flex items-center">
                        <ArrowLeft size={16} className="mr-2" />
                        Retour aux articles
                    </Link>
                </Button>
            </div>
        )
    }

    // Formater la date de mise à jour
    const formatDate = (dateString: string | undefined): string => {
        // Si la date n'est pas définie ou invalide, retourner un placeholder
        if (!dateString) return "Brouillon - Non publié"
        
        try {
            const date = new Date(dateString)
            // Vérifier que la date est valide
            if (isNaN(date.getTime())) {
                return article.status === "published" ? "Date inconnue" : "Brouillon - Non publié"
            }
            
            return new Intl.DateTimeFormat('fr-FR', {
                day: 'numeric',
                month: 'long',
                year: 'numeric'
            }).format(date)
        } catch (e) {
            return article.status === "published" ? "Date inconnue" : "Brouillon - Non publié"
        }
    }

    return (
        <>
            {/* Bannière de prévisualisation - sticky au top */}
            <div className="sticky top-0 z-50 bg-amber-500 text-black py-2 px-4 flex items-center justify-between">
                <div className="flex items-center">
                    <Eye className="mr-2 h-5 w-5" />
                    <span className="font-medium">Mode prévisualisation</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-sm font-medium inline-flex items-center bg-amber-600/30 px-2 py-1 rounded">
                        {article.status === "published" ? "Article publié" : "Brouillon"}
                    </span>
                    <Button asChild size="sm" variant="secondary" className="bg-zinc-900 text-white hover:bg-zinc-800">
                        <Link href={`/editor/articles/edit/${article.id}`} className="flex items-center">
                            <Edit size={14} className="mr-1" />
                            Modifier
                        </Link>
                    </Button>
                    <Button asChild size="sm" variant="outline" className="bg-transparent border-black text-black hover:bg-amber-600/20">
                        <Link href="/editor/articles" className="flex items-center">
                            <ArrowLeft size={14} className="mr-1" />
                            Retour
                        </Link>
                    </Button>
                </div>
            </div>

            <main className="bg-black text-white min-h-screen pt-16 pb-16 px-4 sm:px-6">
                <div className="relative mx-auto max-w-6xl pt-5 pb-5 border border-white/10 bg-white/[0.02] shadow-sm px-4 sm:px-6">
                    <article>
                        <header className="mx-auto w-full max-w-3xl px-4 pt-12 pb-4">
                            <nav aria-label="Breadcrumb" className="mb-8 flex justify-center items-center space-x-2 text-sm">
                                <a href="/editor/articles" className="inline-flex items-center text-neutral-500 hover:text-neutral-300 transition-colors">
                                    <span className="mr-1 text-lg">←</span> Articles
                                </a>
                                <span className="text-neutral-500">/</span>
                                <span className="text-neutral-50 font-medium">{article.category?.name || "Non catégorisé"}</span>
                            </nav>
                            <div className="mx-auto max-w-5xl">
                                <h1 className="text-center text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-medium tracking-tight leading-[1.1] mb-6">
                                    {article.title}
                                </h1>
                            </div>
                            {/* Section auteur supprimée - inutile en mode mono-utilisateur */}
                            <div className="mt-16 flex justify-between items-center text-sm text-neutral-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>2 min read</span>
                                </div>
                                <span>{formatDate(article.updatedAt)}</span>
                            </div>
                            {(article.ctaDescription || article.ctaButton) && (
                                <div className="mt-6 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between rounded-md border border-white/10 bg-white/5 px-10 py-6 gap-6 shadow-sm">
                                    {article.ctaDescription && (
                                        <div className="space-y-1">
                                            <p className="text-base md:text-2xl font-semibold text-white">
                                                {article.ctaDescription}
                                            </p>
                                        </div>
                                    )}
                                    {article.ctaButton && (
                                        <Button className="whitespace-nowrap bg-blue-600 hover:bg-blue-700">{article.ctaButton}</Button>
                                    )}
                                </div>
                            )}
                        </header>

                        <section className="mx-auto w-full max-w-3xl px-4 pb-12">
                            {article.intro && (
                                <p className="text-xl text-white mb-8 leading-relaxed">
                                    {article.intro}
                                </p>
                            )}

                            {/* Corps de l'article */}
                            {article.steps && article.steps.map((step, index) => (
                                <section key={index} className="mb-10">
                                    <h2 className="text-2xl font-bold mb-6 text-white">{step.title}</h2>
                                    <TiptapRenderer content={step.content} />
                                </section>
                            ))}

                            {/* Citation si présente */}
                            {article.quote && (
                                <blockquote className="border-l-4 border-white-500 pl-6 italic text-white text-lg bg-white/[0.05] rounded-md p-6 shadow-sm my-10">
                                    {article.quote}
                                </blockquote>
                            )}

                            {/* Conclusion */}
                            {(article.conclusionTitle || article.conclusionDescription) && (
                                <footer className="mt-10 bg-white/5 p-6 rounded-md shadow-sm">
                                    {article.conclusionTitle && (
                                        <h3 className="text-xl font-semibold mb-2 text-white">{article.conclusionTitle}</h3>
                                    )}
                                    {article.conclusionDescription && (
                                        <TiptapRenderer content={article.conclusionDescription} />
                                    )}
                                </footer>
                            )}
                        </section>
                    </article>
                </div>
            </main>
        </>

    )
}
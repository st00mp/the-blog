import TiptapRenderer from "@/components/blog/detail/TiptapRenderer";

// Étape 1 : Générer les slugs dynamiques à build time
export async function generateStaticParams() {
    // console.log("BACKEND_API_URL =", process.env.BACKEND_API_URL); // ⬅️ debug important
    const API_URL = process.env.BACKEND_API_URL;

    const res = await fetch(`${API_URL}/api/articles`, {
        // Le nouvel article n’apparaîtra pas tout de suite, sauf si rebuild du site 
        next: { revalidate: 60 },
    });

    const articles = await res.json();

    // On retourne un tableau d'objets { slug }
    return articles.map((article: any) => ({
        slug: article.slug,
    }));
}
type Props = {
    params: { slug: string };
};

// Étape 2 : Composant de page dynamique
import { Button } from "@/components/ui/button";
import { ClockIcon } from "lucide-react";

type Article = {
    category: {
        id: number;
        name: string;
    };
    author: { name: string };
    title: string;
    intro: string;
    steps: { title: string; content: any }[];
    quote: string;
    conclusionTitle: string;
    conclusionDescription: any;
    ctaDescription: string;
    ctaButton: string;
    slug: string;
    updated_at: string;
};

export async function generateMetadata({ params }: Props) {
    const API_URL = process.env.BACKEND_API_URL;

    const res = await fetch(`${API_URL}/api/articles/${params.slug}`, {
        next: { revalidate: 60 },
    });

    const article = await res.json();

    return {
        title: article.metaTitle || article.title,
        description: article.metaDescription || article.intro,
    };
}

export default async function BlogPostPage({ params }: Props) {
    const API_URL = process.env.BACKEND_API_URL;

    try {
        // 1) On fetch l'article via son slug
        const res = await fetch(`${API_URL}/api/articles/${params.slug}`, {
            // Revalidation du contenu des articles (pour edit article, commentaires, ...)
            next: { revalidate: 60 },
        });

        if (!res.ok) {
            throw new Error(`Failed to fetch article: ${res.status}`);
        }

        // 2) On récupère l'article sous forme d'objet
        const article: Article = await res.json();

        // 3) On affiche la page
        return (
            <main className="bg-black text-white min-h-screen pt-16 pb-16 px-4 sm:px-6">
                <div className="relative mx-auto max-w-6xl pt-5 pb-5 border border-white/10 bg-white/[0.02] shadow-sm px-4 sm:px-6">
                    <article>

                        {/* Header complet de l’article */}
                        <header className="mx-auto w-full max-w-3xl px-4 pt-12 pb-4">

                            {/* Breadcrumb */}
                            <nav aria-label="Breadcrumb" className="mb-8 flex justify-center items-center space-x-2 text-sm">
                                <a href="/blog" className="inline-flex items-center text-neutral-500 hover:text-neutral-300 transition-colors">
                                    <span className="mr-1 text-lg">&larr;</span> Blog
                                </a>
                                <span className="text-neutral-500">/</span>
                                <span className="text-neutral-50 font-medium">{article.category?.name ?? "Unknown Category"}</span>                            </nav>

                            {/* Titre élargi uniquement */}
                            <div className="mx-auto max-w-5xl">
                                <h1 className="text-center text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-medium tracking-tight leading-[1.1] mb-6">
                                    {article.title}
                                </h1>
                            </div>

                            {/* Auteur */}
                            <div className="flex justify-center items-center gap-3 text-sm text-neutral-400 mb-2">
                                <img src="/blog/avatar.png" alt={article.author?.name || "Auteur"} className="w-7 h-7 rounded-full" />
                                <span className="text-white font-medium">{article.author?.name || "Auteur inconnu"}</span>
                            </div>

                            {/* Métadonnées */}
                            <div className="mt-16 flex justify-between items-center text-sm text-neutral-500 mb-6">
                                <div className="flex items-center gap-2">
                                    <ClockIcon className="w-4 h-4" />
                                    <span>2 min read</span>
                                </div>
                                <span>{new Date(article.updated_at).toLocaleDateString("en-US", {
                                    year: "numeric",
                                    month: "short",
                                    day: "numeric",
                                })}</span>
                            </div>

                            {/* CTA */}
                            <div className="mt-6 mb-10 flex flex-col md:flex-row items-start md:items-center justify-between rounded-md border border-white/10 bg-white/5 px-10 py-6 gap-6 shadow-sm">
                                <div className="space-y-1">
                                    <p className="text-base md:text-2xl font-semibold text-white">
                                        {article.ctaDescription}
                                    </p>
                                </div>
                                <Button
                                    variant="ghost"
                                    className="bg-white text-black text-sm px-6 py-3 rounded-full hover:bg-zinc-300"
                                >
                                    {article.ctaButton}
                                </Button>
                            </div>

                            {/* Intro */}
                            <p className="text-white/90 text-xl leading-relaxed mt-10 mb-6">{article.intro}</p>
                        </header>

                        {/* Corps de l’article */}
                        <section className="mx-auto w-full max-w-3xl px-4 pb-8">

                            {/* Étapes */}
                            <div className="space-y-12">
                                {article.steps?.map((step: any, index: number) => (
                                    <section key={index}>
                                        <h2 className="text-2xl font-semibold mb-2">{step.title}</h2>
                                        <div className="text-white/80 leading-relaxed">
                                            <TiptapRenderer content={step.content} />
                                        </div>
                                    </section>
                                ))}
                            </div>

                            {/* Citation */}
                            {article.quote && (
                                <blockquote className="border-l-4 border-white-500 pl-6 italic text-white text-lg bg-white/[0.05] rounded-md p-6 shadow-sm my-10">
                                    {article.quote}
                                </blockquote>)}

                            {/* Conclusion */}
                            {(article.conclusionTitle || article.conclusionDescription) && (
                                <footer className="mt-10 bg-white/5 p-6 rounded-md shadow-sm">
                                    <h3 className="text-xl font-semibold mb-2 text-white">{article.conclusionTitle}</h3>
                                    <TiptapRenderer content={article.conclusionDescription} />
                                </footer>
                            )}
                        </section>
                    </article>
                </div>
            </main>
        );
    } catch (error) {
        console.error("❌ Erreur fetch article:", error);

        return (
            <main className="min-h-screen bg-black text-white py-10">
                <div className="text-center text-red-500">
                    Impossible to load the article. Please try again later.
                </div>
            </main>
        );
    }
}

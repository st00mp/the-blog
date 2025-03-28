// Étape 1 : Générer les slugs dynamiques à build time
export async function generateStaticParams() {

    // console.log("BACKEND_API_URL =", process.env.BACKEND_API_URL); // ⬅️ debug important

    const API_URL = process.env.BACKEND_API_URL;
    const res = await fetch(`${API_URL}/api/articles`); const articles = await res.json();

    return articles.map((article: any) => ({
        slug: article.slug,
    }));
}

// Étape 2 : Composant de page dynamique
import { Button } from "@/components/ui/button"
import { ClockIcon } from "lucide-react"
import { Article } from "@/types/article"

type Props = {
    params: { slug: string }
}

export default async function BlogPostPage({ params }: Props) {
    const API_URL = process.env.BACKEND_API_URL;

    try {
        const res = await fetch(`${API_URL}/api/articles/${params.slug}`);

        if (!res.ok) {
            throw new Error(`Failed to fetch articles: ${res.status}`);
        }

        const article: Article = await res.json();

        return (
            <main className="bg-black text-white min-h-screen pt-16 pb-16 px-4 sm:px-6">

                {/* Wrapper */}
                <div className="relative mx-auto max-w-6xl pt-5 pb-5 border border-white/10 bg-white/[0.02] shadow-sm px-4 sm:px-6">

                    {/* Croix élégante en coin haut gauche */}
                    <div className="absolute -top-2 -left-2 w-4 h-4">
                        {/* Ligne verticale */}
                        <div className="absolute left-1/2 top-0 h-full w-px bg-white/60 transform -translate-x-1/2" />
                        {/* Ligne horizontale */}
                        <div className="absolute top-1/2 left-0 w-full h-px bg-white/60 transform -translate-y-1/2" />
                    </div>

                    {/* Titre plus large */}
                    <section className="mx-auto w-full max-w-5xl px-4 pt-12 pb-4">

                        {/* Breadcrumb centré */}
                        <div className="mb-8 w-full flex justify-center items-center space-x-2 text-sm">
                            <a
                                href="/blog"
                                className="inline-flex items-center text-neutral-500 hover:text-neutral-300 transition-colors"
                            >
                                <span className="mr-1 text-lg">&larr;</span> Blog
                            </a>
                            <span className="text-neutral-500">/</span>
                            <span className="text-neutral-50 font-medium">Customers</span>
                        </div>

                        {/* Titre centré dans conteneur large */}
                        <h1 className="text-center text-[32px] sm:text-[36px] md:text-[42px] lg:text-[48px] font-medium tracking-tight leading-[1.1] mb-2 max-w-5xl mx-auto">
                            {article.title}
                        </h1>
                    </section>

                    {/* Tout le reste dans conteneur plus étroit */}
                    <section className="mx-auto w-full max-w-3xl px-4 pb-8">

                        {/* Auteur centré sous le titre */}
                        <div className="flex justify-center items-center gap-3 text-sm text-neutral-400 mb-10 mt-2">
                            <img
                                src="/blog/avatar.png"
                                alt="Peri Langlois"
                                className="w-7 h-7 rounded-full"
                            />
                            <span className="text-white font-medium">{article.author.name}</span>
                            <span className="text-neutral-500">Senior Product Marketing Manager</span>
                        </div>

                        {/* Métadonnées */}
                        <div className="mt-20 flex justify-between items-center text-sm text-neutral-500 mb-10">
                            <div className="flex items-center gap-2">
                                <ClockIcon className="w-4 h-4" />
                                <span>2 min read</span>
                            </div>

                            {/* Date US format */}
                            <span>{new Date(article.updated_at).toLocaleDateString("en-US", {
                                year: "numeric",
                                month: "short",
                                day: "numeric",
                            })}</span>
                        </div>

                        {/* Résumé */}
                        <p className="text-neutral-300 text-xl md:text-2xl font-light leading-snug mb-14">
                            How Sitecore built a new brand assistant that empowers marketers
                            with real-time conversational creativity.
                        </p>

                        {/* CTA style Vercel */}
                        <div className="mb-3 flex flex-col md:flex-row items-start md:items-center justify-between rounded-md border border-white/10 bg-white/5 px-10 py-8 gap-6 shadow-sm">
                            <div className="space-y-1">
                                <p className="text-base md:text-2xl font-semibold text-white">
                                    Looking to use Next.js &amp; Vercel?
                                </p>
                            </div>
                            <Button
                                variant="secondary"
                                className="rounded-full px-4 py-3 text-sm font-medium transition hover:bg-white/10"
                            >
                                Talk to an Expert
                            </Button>
                        </div>
                    </section>

                    {/* Contenu principal */}
                    <article className="mx-auto w-full max-w-3xl px-4 py-10 space-y-6 leading-relaxed text-neutral-100">
                        <p>
                            <strong>Sitecore</strong> — a leading digital experience platform — wanted
                            to create a transformative AI tool that would help marketers connect more
                            deeply with their brand assets.
                        </p>

                        <p>
                            {article.content}
                        </p>


                        <h2 className="text-2xl font-semibold mt-6">Why it matters</h2>
                        <ul className="list-disc list-inside mt-3 space-y-1 text-neutral-200">
                            <li>Consistency and creativity in content</li>
                            <li>Real-time collaboration with AI</li>
                            <li>Easy integration with marketing workflows</li>
                        </ul>

                        <blockquote className="border-l-4 border-white/20 pl-4 italic text-neutral-400">
                            “Using the AI SDK, they launched Sitecore Stream — a dynamic, AI-powered brand assistant.”
                        </blockquote>

                        <p>
                            More paragraphs, code snippets, images, etc. <br />
                            This layout is just an example; adapt it to match your design system and brand.
                        </p>
                    </article>
                </div>
            </main >
        );
    } catch (error) {
        console.error("❌ Erreur fetch articles list:", error);

        return (
            <main className="min-h-screen bg-black text-white py-10">
                <div className="text-center text-red-500">
                    Impossible to load the article. Please try again later.
                </div>
            </main>
        );
    }
}

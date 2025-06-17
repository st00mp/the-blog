"use client";

import React, { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { useAuth } from "@/contexts/AuthContext";
import ArticleSection from "@/components/admin/article/new/ArticleSection";
import { StepBlock } from "@/components/admin/article/new/StepBlock";
import { RichTextEditor } from "@/components/admin/article/new/RichTextEditor";
import { FieldLabel } from "@/components/admin/article/new/FieldLabel";
import { ChevronDown, User } from "lucide-react";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Skeleton } from "@/components/ui/skeleton";

const defaultTiptapContent = {
    type: "doc",
    content: [],
};

// Composant client pour l'édition d'article
export default function EditArticlePage() {
    // Utiliser les params via un custom hook compatible avec Next.js
    const params = useParams();
    const articleId = params?.id as string; // 'id' est maintenant l'identifiant unique de l'article (et non plus le slug)
    const [articleSlug, setArticleSlug] = useState<string>(""); // Pour stocker le slug
    const [mediaMap, setMediaMap] = useState<Map<string, string>>(new Map()); // Pour suivre les URLs des médias et leurs IDs
    const router = useRouter();
    const { user, isLoading: isAuthLoading, isAuthenticated } = useAuth();

    // Rediriger vers la page de connexion si non authentifié
    useEffect(() => {
        if (!isAuthLoading && !isAuthenticated) {
            router.push('/login');
        }
    }, [isAuthLoading, isAuthenticated, router]);

    const [isLoading, setIsLoading] = useState(true);
    const [categories, setCategories] = useState<{ id: number; name: string }[]>([]);
    const [category, setCategory] = useState("");
    const [title, setTitle] = useState("");
    const [meta, setMeta] = useState({
        title: "",
        description: ""
    });
    const [intro, setIntro] = useState("");
    const [steps, setSteps] = useState([
        { title: "", content: defaultTiptapContent },
        { title: "", content: defaultTiptapContent },
        { title: "", content: defaultTiptapContent }
    ]);
    const [quote, setQuote] = useState("");
    const [conclusionTitle, setConclusionTitle] = useState("");
    const [conclusionDescription, setConclusionDescription] = useState(defaultTiptapContent);
    const [ctaDescription, setCtaDescription] = useState("");
    const [ctaButton, setCtaButton] = useState("");
    const [isSaving, setIsSaving] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);
    
    // Fonction pour mettre à jour la map des médias
    const handleMediaMapUpdate = (newMediaMap: Map<string, string>) => {
        console.log("Mise à jour de la mediaMap:", Object.fromEntries(newMediaMap));
        setMediaMap(newMediaMap);
    };

    // Récupérer les données de l'article existant
    useEffect(() => {
        const fetchArticleData = async () => {
            if (!articleId) return;

            try {
                setIsLoading(true);
                console.log(`Chargement de l'article avec ID: ${articleId}`);

                // ÉTAPE 1: Récupérer la liste des articles pour trouver le slug
                const listResponse = await fetch(`/api/articles?limit=200`, {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!listResponse.ok) {
                    console.error(`Erreur lors de la récupération de la liste d'articles: ${listResponse.status}`);
                    throw new Error(`Erreur ${listResponse.status}: Impossible de récupérer la liste d'articles`);
                }

                // ÉTAPE 2: Chercher l'article par ID dans la liste
                const articlesList = await listResponse.json();
                console.log(`Articles récupérés: ${articlesList.data?.length || 0}`);

                const targetArticle = articlesList.data?.find((a: any) =>
                    a.id === parseInt(articleId) || a.id === articleId);

                if (!targetArticle) {
                    console.error(`Article avec ID ${articleId} non trouvé dans la liste`);
                    throw new Error(`Article avec ID ${articleId} introuvable`);
                }

                console.log(`Article trouvé - ID: ${targetArticle.id}, Slug: ${targetArticle.slug}`);
                
                // Sauvegarder le slug pour l'utiliser lors de la sauvegarde
                setArticleSlug(targetArticle.slug);

                // ÉTAPE 3: Récupérer l'article complet par son slug
                const articleResponse = await fetch(`/api/articles/${targetArticle.slug}?status=-1`, {
                    method: 'GET',
                    credentials: 'include',
                    cache: 'no-store',
                    headers: {
                        'Content-Type': 'application/json',
                        'Accept': 'application/json'
                    }
                });

                if (!articleResponse.ok) {
                    console.error(`Erreur lors du chargement de l'article: ${articleResponse.status}`);
                    throw new Error(`Erreur ${articleResponse.status}: Impossible de charger l'article`);
                }

                const article = await articleResponse.json();
                console.log("Données d'article reçues:", article);

                // Remplir les champs avec les données existantes
                setTitle(article.title || "");
                setCategory(article.category?.id?.toString() || "");
                setMeta({
                    title: article.metaTitle || "",
                    description: article.metaDescription || ""
                });
                setIntro(article.intro || "");

                // Remplir les étapes avec celles de l'article existant
                if (article.steps && article.steps.length > 0) {
                    console.log("Format des étapes:", article.steps);
                    const formattedSteps = article.steps.map((step: any) => ({
                        title: step.title || "",
                        // Vérifier si le contenu est déjà un objet ou une chaîne JSON
                        content: typeof step.content === 'object' ? step.content :
                            (step.content ? JSON.parse(step.content) : defaultTiptapContent)
                    }));

                    // S'assurer qu'il y a au moins 3 étapes
                    while (formattedSteps.length < 3) {
                        formattedSteps.push({ title: "", content: defaultTiptapContent });
                    }

                    console.log("Étapes formatées:", formattedSteps);
                    setSteps(formattedSteps);
                }

                setQuote(article.quote || "");
                setConclusionTitle(article.conclusionTitle || "");
                // Vérifier si conclusionDescription est déjà un objet ou une chaîne JSON
                setConclusionDescription(
                    typeof article.conclusionDescription === 'object'
                        ? article.conclusionDescription
                        : (article.conclusionDescription
                            ? JSON.parse(article.conclusionDescription)
                            : defaultTiptapContent)
                );
                setCtaDescription(article.ctaDescription || "");
                setCtaButton(article.ctaButton || "");

                setIsLoading(false);
            } catch (error) {
                console.error('Erreur lors du chargement de l\'article:', error);
                setIsLoading(false);
            }
        };

        const fetchCategories = async () => {
            try {
                const response = await fetch('/api/categories');
                if (!response.ok) {
                    throw new Error('Erreur lors de la récupération des catégories');
                }
                const data = await response.json();
                setCategories(data);
            } catch (error) {
                console.error('Erreur lors du chargement des catégories:', error);
            }
        };

        fetchCategories();
        fetchArticleData();
    }, [articleId]);

    const stepTitlePlaceholders = [
        "Ex: Qu'est-ce que le machine learning ?",
        "Ex: Comment fonctionne le machine learning ?",
        "Ex: Pourquoi le machine learning est-il important ?"
    ];

    const stepPlaceholders = [
        "Dans cette partie, tu peux définir le concept et donner des exemples concrets.",
        "Ici tu peux expliquer le fonctionnement détaillé avec des schémas et exemples.",
        "Pour finir cette partie, explique les avantages et inconvénients."
    ];

    if (isAuthLoading || !isAuthenticated) {
        return (
            <div className="p-6">
                <Skeleton className="h-12 w-64 mb-4" />
                <Skeleton className="h-96 w-full" />
            </div>
        );
    }

    if (isLoading) {
        return (
            <div className="p-6">
                <h1 className="text-3xl font-bold mb-6">Modification de l'article</h1>
                <Card className="border-zinc-800 bg-zinc-900 text-white">
                    <CardContent className="pt-6">
                        <Skeleton className="h-10 w-full mb-4" />
                        <Skeleton className="h-20 w-full mb-4" />
                        <Skeleton className="h-40 w-full mb-4" />
                        <Skeleton className="h-60 w-full" />
                    </CardContent>
                </Card>
            </div>
        );
    }

    // Gérer le changement des étapes
    const handleStepChange = (index: number, field: string, value: any) => {
        const updatedSteps = [...steps];
        // @ts-ignore - Nous savons que les champs existent
        updatedSteps[index][field] = value;
        setSteps(updatedSteps);
    };

    // Gérer la soumission du formulaire
    const handleSubmit = async () => {
        if (!title) {
            alert("Le titre est requis");
            return;
        }
        setIsSaving(true);
        
        try {
            // Vérifier que nous avons bien le slug de l'article
            if (!articleSlug) {
                throw new Error('Slug de l\'article non disponible, veuillez rafraîchir la page');
            }
            
            console.log(`Utilisation du slug stocké: ${articleSlug} pour la sauvegarde`);
            const slug = articleSlug;

            // 2. Préparer les données pour l'envoi à l'API
            
            // Convertir la Map des médias en objet pour l'inclure dans la requête
            const mediaIds = Object.fromEntries(mediaMap);
            console.log('Médias détectés pour la sauvegarde:', mediaIds);
            
            const formData = {
                title,
                category: category ? parseInt(category) : null, // Backend attend 'category', pas 'categoryId'
                metaTitle: meta.title,
                metaDescription: meta.description,
                intro,
                steps: steps.filter(step => step.title || JSON.stringify(step.content) !== JSON.stringify(defaultTiptapContent)).map(step => ({
                    title: step.title,
                    content: JSON.stringify(step.content)
                })),
                quote,
                conclusionTitle,
                conclusionDescription: JSON.stringify(conclusionDescription),
                ctaDescription,
                ctaButton,
                mediaIds // Envoyer les IDs des médias au backend pour les associer à l'article
            };

            // 3. Envoyer la mise à jour en utilisant le SLUG
            const response = await fetch(`/api/articles/${slug}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                credentials: 'include',
                body: JSON.stringify(formData)
            });

            if (!response.ok) {
                throw new Error('Erreur lors de la mise à jour de l\'article');
            }

            const data = await response.json();

            // Vérifier si l'API a renvoyé une URL de redirection
            if (data.redirectUrl) {
                router.push(data.redirectUrl);
            } else {
                // Fallback au comportement précédent
                router.push('/editor/articles');
            }
        } catch (error) {
            console.error('Erreur lors de la mise à jour de l\'article:', error);
            alert("Une erreur est survenue lors de la mise à jour de l'article");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">Modifier l'article</h1>

            <Card className="border-zinc-800 bg-zinc-900 text-white">
                <CardContent className="pt-6">
                    {/* Section : Informations générales */}
                    <ArticleSection title="Informations générales" badge="info" tooltip="Titre et métadonnées">
                        <div className="space-y-5">
                            {/* Titre de l'article */}
                            <div>
                                <FieldLabel badge="h1">Titre de l'article</FieldLabel>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                    value={title}
                                    onChange={(e) => setTitle(e.target.value)}
                                    placeholder="Ex: Introduction au Machine Learning"
                                />
                            </div>

                            {/* Catégorie */}
                            <div>
                                <FieldLabel badge="#">Catégorie</FieldLabel>
                                <div className="relative">
                                    <select
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 pr-10 text-md appearance-none focus:outline-none focus:ring-0 focus:border-zinc-700"
                                        value={category}
                                        onChange={(e) => setCategory(e.target.value)}
                                    >
                                        <option value="">Sélectionner une catégorie</option>
                                        {categories.map((cat) => (
                                            <option key={cat.id} value={cat.id}>
                                                {cat.name}
                                            </option>
                                        ))}
                                    </select>
                                    <div className="absolute inset-y-0 right-0 flex items-center px-2 pointer-events-none">
                                        <ChevronDown className="h-5 w-5 text-zinc-400" />
                                    </div>
                                </div>
                            </div>

                            {/* Meta Title */}
                            <div>
                                <FieldLabel badge="meta">Meta Title (SEO)</FieldLabel>
                                <div className="mt-3">
                                    <input
                                        type="text"
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                        value={meta.title || ""}
                                        onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                                        placeholder="Titre pour les moteurs de recherche (50-60 caractères)"
                                        maxLength={60}
                                    />
                                </div>
                            </div>

                            {/* Meta Description */}
                            <div>
                                <FieldLabel badge="meta">Meta Description (SEO)</FieldLabel>
                                <div className="mt-3">
                                    <textarea
                                        className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                        value={meta.description || ""}
                                        onChange={(e) => setMeta({ ...meta, description: e.target.value })}
                                        rows={3}
                                        placeholder="Résumé concis et engageant de l'article pour les résultats de recherche (~150 caractères)"
                                    />
                                </div>
                            </div>
                        </div>
                    </ArticleSection>

                    {/* Section : Introduction de l'article */}
                    <ArticleSection title="Introduction" badge="<p>" tooltip="Contexte, promesse, plan">
                        <textarea
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                            value={intro}
                            onChange={(e) => setIntro(e.target.value)}
                            placeholder={`- Quel est le problème de ton lecteur ?\n- Quelle promesse lui fais-tu ?\n- À quoi doit-il s'attendre en lisant ?`}
                            rows={4}
                        />
                    </ArticleSection>

                    {/* Section : Étapes principales de l'article */}
                    <div className="space-y-13 border-l-[2px] border-zinc-800 pl-8 mt-13">
                        {steps.map((step, i) => (
                            <StepBlock
                                key={i}
                                stepNumber={i + 1}
                                title={step.title}
                                onChangeTitle={(val) => handleStepChange(i, "title", val)}
                                content={step.content}
                                onChangeContent={(val) => handleStepChange(i, "content", val)}
                                titlePlaceholder={stepTitlePlaceholders[i] || `Titre de l'étape ${i + 1}`}
                                tooltip="Contenu d'étape"
                            >
                                <RichTextEditor
                                    value={step.content}
                                    onChange={(val) => handleStepChange(i, "content", val)}
                                    placeholder={stepPlaceholders[i] || "Commence à écrire ici..."}
                                    onMediaMapUpdate={handleMediaMapUpdate}
                                />
                            </StepBlock>
                        ))}
                    </div>

                    {/* Section : Citation */}
                    <ArticleSection title="Citation" badge="quote" tooltip="Phrase à retenir">
                        <textarea
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                            value={quote}
                            onChange={(e) => setQuote(e.target.value)}
                            placeholder="Une phrase forte et mémorable qui résume le message principal"
                            rows={2}
                        />
                    </ArticleSection>

                    {/* Section : Conclusion */}
                    <ArticleSection title="Conclusion" badge="fin" tooltip="Résumé et prochaines étapes">
                        <div className="space-y-5">
                            <div>
                                <FieldLabel>Titre de la conclusion</FieldLabel>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                    value={conclusionTitle}
                                    onChange={(e) => setConclusionTitle(e.target.value)}
                                    placeholder="Ex: Conclusion et prochaines étapes"
                                />
                            </div>

                            <div>
                                <FieldLabel>Description</FieldLabel>
                                <RichTextEditor
                                    value={conclusionDescription}
                                    onChange={(val) => setConclusionDescription(val)}
                                    placeholder="Résume les points clés et propose les prochaines étapes..."
                                    onMediaMapUpdate={handleMediaMapUpdate}
                                />
                            </div>
                        </div>
                    </ArticleSection>

                    {/* Section : Call to Action */}
                    <ArticleSection title="Call to Action" badge="CTA" tooltip="Incitation à l'action">
                        <div className="space-y-5">
                            <div>
                                <FieldLabel badge="description">Description du CTA</FieldLabel>
                                <textarea
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                    value={ctaDescription}
                                    onChange={(e) => setCtaDescription(e.target.value)}
                                    placeholder="Ex: Prêt à commencer avec le Machine Learning ? Accédez à notre formation complète dès maintenant !"
                                    rows={3}
                                    maxLength={160}
                                />
                            </div>
                            <div>
                                <FieldLabel badge="bouton">Texte du bouton</FieldLabel>
                                <input
                                    type="text"
                                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                    value={ctaButton}
                                    onChange={(e) => setCtaButton(e.target.value)}
                                    placeholder="Ex: Démarrer maintenant"
                                    maxLength={30}
                                />
                            </div>
                        </div>
                    </ArticleSection>

                    {/* Boutons de validation */}
                    <div className="flex justify-end gap-3 mt-8 pt-6 border-t border-zinc-800">
                        <Button
                            variant="outline"
                            className="border-zinc-700 text-zinc-300 hover:bg-zinc-800/50 hover:text-white"
                            onClick={() => window.history.back()}
                        >
                            Annuler
                        </Button>
                        <Button
                            className="bg-blue-600 hover:bg-blue-700 text-white"
                            onClick={handleSubmit}
                            disabled={isSaving}
                        >
                            {isSaving ? "Enregistrement..." : "Mettre à jour l'article"}
                        </Button>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}
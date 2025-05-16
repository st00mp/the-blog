"use client";

import React, { useState, useEffect } from "react";
import ArticleSection from "@/components/admin/article/new/ArticleSection";
import { StepBlock } from "@/components/admin/article/new/StepBlock";
import { RichTextEditor } from "@/components/admin/article/new/RichTextEditor";
import { FieldLabel } from "@/components/admin/article/new/FieldLabel";
import { ChevronDown } from "lucide-react";

const defaultTiptapContent = {
    type: "doc",
    content: [],
};

// États pour gérer les champs du formulaire d'article
export default function NewArticlePage() {
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

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch("/api/categories");
                if (!res.ok) throw new Error("Erreur HTTP");
                const data = await res.json();
                setCategories(data);
            } catch (error) {
                console.error("Erreur lors du chargement des catégories", error);
            }
        };
        fetchCategories();
    }, []);

    // Fonction pour mettre à jour une étape du contenu (titre ou contenu riche)
    const handleStepChange = (index: number, field: "title" | "content", value: any) => {
        const updated = [...steps];
        updated[index][field] = value;
        setSteps(updated);
    };

    // Fonction déclenchée lors de la soumission du formulaire (POST vers l'API)
    const handleSubmit = async () => {
        if (!title.trim()) {
            alert("Le titre est obligatoire.");
            return;
        }

        setIsSaving(true);

        type NewArticlePayload = {
            category: string;
            title: string;
            metaTitle: string;
            metaDescription: string;
            intro: string;
            steps: { title: string; content: any }[];
            quote: string;
            conclusionTitle: string;
            conclusionDescription: any;
            ctaDescription: string;
            ctaButton: string;
        };

        const payload: NewArticlePayload = {
            category,
            title,
            metaTitle: meta.title,
            metaDescription: meta.description,
            intro,
            steps,
            quote,
            conclusionTitle,
            conclusionDescription,
            ctaDescription,
            ctaButton,
        };

        // 	Reset de tous les champs pour plus de clarté :
        const resetForm = () => {
            setTitle("");
            setMeta({ title: "", description: "" });
            setIntro("");
            setSteps([
                { title: "", content: defaultTiptapContent },
                { title: "", content: defaultTiptapContent },
                { title: "", content: defaultTiptapContent }
            ]);
            setQuote("");
            setConclusionTitle("");
            setConclusionDescription(defaultTiptapContent);
            setCtaDescription("");
            setCtaButton("");
        };
        console.log("[API POST /api/articles] payload:", payload);

        try {
            const res = await fetch(`/api/articles`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });

            if (!res.ok) throw new Error("Erreur lors de la création de l'article");

            alert("Article créé avec succès !");
            resetForm();
        } catch (err) {
            console.error(err);
            alert("Impossible de créer l’article");
        } finally {
            setIsSaving(false);
        }
    };

    // Valeurs par défaut pour aider à la rédaction guidée des étapes
    const stepTitlePlaceholders = [
        "Préparer votre environnement",
        "Appliquer la stratégie",
        "Évaluer les résultats",
    ];

    // Valeurs par défaut pour aider à la rédaction guidée des étapes
    const stepPlaceholders = [
        "- Qu’est-ce que [Mot-clé] ?\n- Pourquoi ce sujet est important ?\n- Chiffres-clés ou contexte actuel",
        "- Astuces concrètes\n- Étapes détaillées (avec H3 si besoin)\n- Comparaisons, tableaux, visuels",
        "- FAQ\n- “Est-ce que ça marche aussi pour… ?”\n- “Et si je n’ai pas de budget / d’expérience ?”",
    ];

    // Formulaire principal pour la création d'un nouvel article
    return (
        <div className="w-full text-zinc-100">
            <h1 className="text-3xl font-bold mb-10">Rédaction guidée d'un article de blog</h1>

            {/* Section : Choix de la catégorie */}
            <ArticleSection title="Catégorie de l'article" tooltip="Classer cet article dans une thématique">
                <div className="relative">
                    <select
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md text-white appearance-none pr-10 relative focus:outline-none focus:ring-0 focus:border-zinc-700"
                        value={category}
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Choisir une catégorie</option>
                        {categories.map((cat) => (
                            <option key={cat.id} value={cat.id}>
                                {cat.name}
                            </option>
                        ))}
                    </select>

                    {/* Icône flèche */}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <ChevronDown size={18} className="text-zinc-400" />
                    </div>
                </div>

            </ArticleSection >

            {/* Section : Titre de l’article et SEO */}
            <ArticleSection title="Titre de l’article" tooltip="Titre affiché en haut + SEO">
                <div className="space-y-6">

                    {/* Titre principal (H1) */}
                    <div>
                        <FieldLabel badge="H1">Titre principal</FieldLabel>
                        <div className="mt-3">
                            <input
                                type="text"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Titre accrocheur avec mot-clé principal"
                            />
                        </div>
                    </div>

                    {/* Meta Title */}
                    <div>
                        <FieldLabel badge="meta">Titre SEO (Meta Title)</FieldLabel>
                        <div className="mt-3">
                            <input
                                type="text"
                                className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                                value={meta.title}
                                onChange={(e) => setMeta({ ...meta, title: e.target.value })}
                                placeholder="Titre affiché sur Google (~60-70 caractères)"
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
                                placeholder="Résumé concis et engageant de l’article pour les résultats de recherche (~150 caractères)"
                            />
                        </div>
                    </div>
                </div>
            </ArticleSection>

            {/* Section : Introduction de l’article */}
            <ArticleSection title="Introduction" badge="<p>" tooltip="Contexte, promesse, plan">
                <textarea
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder={`- Quel est le problème de ton lecteur ?\n- Quelle promesse lui fais-tu ?\n- À quoi doit-il s’attendre en lisant ?`}
                    rows={4}
                />
            </ArticleSection>

            {/* Section : Étapes principales de l’article */}
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
                        />
                    </StepBlock>
                ))}
            </div>

            {/* Section : Citation ou punchline */}
            <ArticleSection title="Citation ou punchline" badge="<blockquote>" tooltip="Citation ou étude marquante">
                <textarea
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Ex: “80% des lecteurs...”"
                    rows={4}
                />
            </ArticleSection>

            {/* Section : Conclusion avec titre personnalisé */}
            <ArticleSection title="Conclusion" tooltip="Résumé final, ouverture">
                {/* Titre de la conclusion (H1) */}
                <div>
                    <FieldLabel badge="H3">Titre conclusion</FieldLabel>
                    <div className="mt-3">
                        <input
                            type="text"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                            value={conclusionTitle}
                            onChange={(e) => setConclusionTitle(e.target.value)}
                            placeholder="Titre de la conclusion"
                        />
                    </div>
                </div>

                <RichTextEditor
                    value={conclusionDescription}
                    onChange={(val) => setConclusionDescription(val)}
                    placeholder={`- Résumé des 2-3 grandes idées\n- Astuce ou mot de la fin\n- Question ouverte pour générer des commentaires`}
                />
            </ArticleSection>

            {/* Section : Call To Action (description + bouton) */}
            <ArticleSection title="Call to Action (optionnel)" badge="CTA" tooltip="Inviter à agir">
                <div className="space-y-4">
                    <div>
                        <FieldLabel badge="texte">Description CTA</FieldLabel>
                        <textarea
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                            value={ctaDescription}
                            onChange={(e) => setCtaDescription(e.target.value)}
                            placeholder="Ex: Bénéficiez de notre outil gratuitement pendant 7 jours"
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
            <div className="flex justify-end gap-5 mt-13">
                <button className="px-5 py-2.5 bg-zinc-800 text-zinc-200 rounded-md hover:bg-zinc-700 transition-colors">Annuler</button>
                <button className="px-5 py-2.5 bg-zinc-100 text-zinc-900 rounded-md hover:bg-zinc-200 transition-colors" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : "Publier l’article"}
                </button>
            </div>
        </div >
    );
}

"use client";

import React, { useState } from "react";
import ArticleSection from "@/components/admin/article/new/ArticleSection";
import { StepBlock } from "@/components/admin/article/new/StepBlock";
import { RichTextEditor } from "@/components/admin/article/new/RichTextEditor";
import { FieldLabel } from "@/components/admin/article/new/FieldLabel";
import { ChevronDown } from "lucide-react";

export default function NewArticlePage() {
    const [title, setTitle] = useState("");
    const [meta, setMeta] = useState({
        title: "",
        description: ""
    });
    const [category, setCategory] = useState("");
    const [intro, setIntro] = useState("");
    const [steps, setSteps] = useState([
        { title: "", content: "" },
        { title: "", content: "" },
        { title: "", content: "" }
    ]);
    const [quote, setQuote] = useState("");
    const [conclusion, setConclusion] = useState("");
    const [cta, setCta] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleStepChange = (index: number, field: "title" | "content", value: string) => {
        const updated = [...steps];
        updated[index][field] = value;
        setSteps(updated);
    };

    const handleSubmit = async () => {
        setIsSaving(true);

        const cleanHTML = (html: string) => {
            return html
                .replace(/<p>(&nbsp;|\s)*<\/p>/g, "") // supprime aussi les paragraphes vides contenant juste des `&nbsp;`
                .trim(); // optionnel : supprime les espaces en début/fin
        };

        // Appliquer à chaque step :
        const cleanedSteps = steps.map(step => ({
            ...step,
            content: cleanHTML(step.content)
        }));

        const payload = {
            title,
            meta,
            intro: cleanHTML(intro),
            steps: cleanedSteps,
            quote: cleanHTML(quote),
            conclusion: cleanHTML(conclusion),
            cta: cleanHTML(cta),
            category,
        };


        console.log("[API POST /api/articles] payload:", payload);

        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(payload),
            });
            if (!res.ok) throw new Error("Erreur lors de la création de l'article");
            alert("Article créé avec succès !");
            setTitle("");
            setMeta({ title: "", description: "" });
            setIntro("");
            setSteps([{ title: "", content: "" }, { title: "", content: "" }, { title: "", content: "" }]);
            setQuote("");
            setConclusion("");
            setCta("");
        } catch (err) {
            console.error(err);
            alert("Impossible de créer l’article");
        } finally {
            setIsSaving(false);
        }
    };

    const stepTitlePlaceholders = [
        "Préparer votre environnement",
        "Appliquer la stratégie",
        "Évaluer les résultats",
    ];

    const stepPlaceholders = [
        "- Qu’est-ce que [Mot-clé] ?\n- Pourquoi ce sujet est important ?\n- Chiffres-clés ou contexte actuel",
        "- Astuces concrètes\n- Étapes détaillées (avec H3 si besoin)\n- Comparaisons, tableaux, visuels",
        "- FAQ\n- “Est-ce que ça marche aussi pour… ?”\n- “Et si je n’ai pas de budget / d’expérience ?”",
    ];

    return (
        <div className="max-w-4xl mx-auto py-8 px-4 text-zinc-100">
            <h1 className="text-3xl font-bold mb-8 text-center">Rédaction guidée d’un article de blog</h1>

            <ArticleSection title="Catégorie de l'article" tooltip="Classer cet article dans une thématique">
                <div className="relative">
                    <select
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md text-white appearance-none pr-10 relative focus:outline-none focus:ring-0 focus:border-zinc-700"
                        value={category} defaultValue=""
                        onChange={(e) => setCategory(e.target.value)}
                    >
                        <option value="">Choisir une catégorie</option>
                        <option value="agents-ia">Agents IA</option>
                        <option value="llm">Grands modèles de langage</option>
                        <option value="prompting">Prompt Engineering</option>
                        <option value="autonomie">Autonomie des IA</option>
                        <option value="infrastructure">Infra & orchestration</option>
                        <option value="veille">Veille et innovations</option>
                        <option value="tuto">Tutos & démos</option>
                    </select>

                    {/* Icône flèche */}
                    <div className="absolute inset-y-0 right-3 flex items-center pointer-events-none">
                        <ChevronDown size={18} className="text-zinc-400" />
                    </div>
                </div>

            </ArticleSection >

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

            <ArticleSection title="Introduction" badge="<p>" tooltip="Contexte, promesse, plan">
                <textarea
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                    value={intro}
                    onChange={(e) => setIntro(e.target.value)}
                    placeholder={`- Quel est le problème de ton lecteur ?\n- Quelle promesse lui fais-tu ?\n- À quoi doit-il s’attendre en lisant ?`}
                    rows={4}
                />
            </ArticleSection>

            <div className="space-y-10 border-l-[2px] border-white/10 pl-6 mt-10">
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

            <ArticleSection title="Citation ou punchline" badge="<blockquote>" tooltip="Citation ou étude marquante">
                <textarea
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                    value={quote}
                    onChange={(e) => setQuote(e.target.value)}
                    placeholder="Ex: “80% des lecteurs...”"
                    rows={4}
                />
            </ArticleSection>

            <ArticleSection title="Conclusion" badge="H2" tooltip="Résumé final, ouverture">
                <textarea
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                    value={conclusion}
                    onChange={(e) => setConclusion(e.target.value)}
                    placeholder={`- Résumé des 2-3 grandes idées\n- Astuce ou mot de la fin\n- Question ouverte pour générer des commentaires`}
                    rows={4}
                />
            </ArticleSection>

            <ArticleSection title="Call to Action (optionnel)" badge="CTA" tooltip="Inviter à agir">
                <textarea
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 text-md focus:outline-none focus:ring-0 focus:border-zinc-700"
                    value={cta}
                    onChange={(e) => setCta(e.target.value)}
                    placeholder={`- “Télécharger le guide PDF”\n- “Tester notre outil gratuit”\n- “S’abonner à la newsletter”`}
                    rows={4}
                />
            </ArticleSection>

            <div className="flex justify-end gap-4 mt-8">
                <button className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600">Annuler</button>
                <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : "Publier l’article"}
                </button>
            </div>
        </div >
    );
}

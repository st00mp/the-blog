// app/admin/articles/new/page.tsx
"use client";

import React, { useState } from "react";
import ArticleSection from "@/components/admin/article/new/ArticleSection";
import { StepBlock } from "@/components/admin/article/new/StepBlock";
import { RichTextEditor } from "@/components/admin/article/new/RichTextEditor";

export default function NewArticlePage() {
    const [title, setTitle] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [step1Title, setStep1Title] = useState("");
    const [step1Content, setStep1Content] = useState("");
    const [step2Title, setStep2Title] = useState("");
    const [step2Content, setStep2Content] = useState("");
    const [step3Title, setStep3Title] = useState("");
    const [step3Content, setStep3Content] = useState("");
    const [objections, setObjections] = useState("");
    const [quote, setQuote] = useState("");
    const [conclusion, setConclusion] = useState("");
    const [cta, setCta] = useState("");
    const [isSaving, setIsSaving] = useState(false);

    const handleSubmit = async () => {
        setIsSaving(true);
        try {
            const res = await fetch("/api/articles", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    title,
                    metaTitle,
                    intro,
                    step1Title,
                    step1Content,
                    step2Title,
                    step2Content,
                    step3Title,
                    step3Content,
                    objections,
                    quote,
                    conclusion,
                    cta,
                }),
            });
            if (!res.ok) throw new Error("Erreur lors de la création de l'article");
            alert("Article créé avec succès !");
            setTitle(""); setMetaTitle(""); setIntro("");
            setStep1Title(""); setStep1Content("");
            setStep2Title(""); setStep2Content("");
            setStep3Title(""); setStep3Content("");
            setObjections(""); setQuote(""); setConclusion(""); setCta("");
        } catch (err) {
            console.error(err);
            alert("Impossible de créer l’article");
        } finally {
            setIsSaving(false);
        }
    };

    return (
        <div className="max-w-3xl mx-auto py-8 px-4 text-zinc-100">
            <h1 className="text-3xl font-bold mb-8 text-center">Créer un nouvel article</h1>

            <ArticleSection
                title="Titre de l’article"
                tooltip="Le titre principal s’affiche en haut de l’article. Le meta title est utilisé par Google dans les résultats de recherche."
                badge="H1"
            >
                <div className="space-y-6">
                    {/* H1 visible */}
                    <div>
                        <label className="text-sm py-2 font-medium text-zinc-400 mb-1 block rounded-sm">
                            Titre principal
                        </label>
                        <input
                            type="text"
                            className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 placeholder:text-zinc-500"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            placeholder="7 astuces pour [Résultat clé] en moins de [temps]"
                        />
                    </div>

                    {/* Meta Title SEO */}
                    <div>
                        <label className="text-xs font-medium text-zinc-400 mb-1 block">
                            Meta Title (SEO)
                        </label>
                        <input
                            type="text"
                            className="w-full text-sm bg-zinc-800 border border-zinc-700 rounded-sm p-3 placeholder:text-zinc-500"
                            value={metaTitle}
                            onChange={(e) => setMetaTitle(e.target.value)}
                            placeholder="Titre affiché sur Google (~60-70 caractères)"
                        />
                    </div>
                </div>
            </ArticleSection>

            <ArticleSection title="Introduction" badge="<p>" tooltip="Résume le sujet en 2-4 phrases. Présente le problème et ce que le lecteur va apprendre.">
                <RichTextEditor
                    value={intro}
                    onChange={setIntro}
                    placeholder={`- Problème / contexte du lecteur \n- Ce que l’article va lui apporter\n- Ce qu’il va découvrir`}
                />
            </ArticleSection>

            <div className="space-y-10 border-l-[2px] border-white/10 pl-6 mt-10">
                <h2 className="text-xl font-semibold text-white mb-4">Les étapes de l’article</h2>

                <StepBlock
                    stepNumber={1}
                    title={step1Title}
                    onChangeTitle={setStep1Title}
                    content={step1Content}
                    onChangeContent={setStep1Content}
                    titlePlaceholder="Préparer votre environnement"
                    tooltip="Titre court + contenu qui introduit clairement cette étape de l’article.">
                    <RichTextEditor
                        value={step1Content}
                        onChange={setStep1Content}
                        placeholder={`Qu’est-ce que [Mot-clé] ?\nPourquoi ce sujet est important ?\nChiffres-clés ou contexte actuel`}
                    />
                </StepBlock>


                <StepBlock
                    stepNumber={2}
                    title={step2Title}
                    onChangeTitle={setStep2Title}
                    content={step2Content}
                    onChangeContent={setStep2Content}
                    titlePlaceholder="Appliquer la stratégie"
                    tooltip="Titre clair + contenu pour décrire précisément les bénéfices ou les étapes de mise en œuvre."
                >
                    <RichTextEditor
                        value={step2Content}
                        onChange={setStep2Content}
                        placeholder={`- Astuces concrètes\n- Étapes détaillées (avec H3 si besoin)\n- Comparaisons, tableaux, visuels`}
                    />
                </StepBlock>

                <StepBlock
                    stepNumber={3}
                    title={step3Title}
                    onChangeTitle={setStep3Title}
                    content={step3Content}
                    onChangeContent={setStep3Content}
                    titlePlaceholder="Évaluer les résultats"
                    tooltip="Titre court + contenu pour anticiper les objections, variantes ou erreurs classiques."
                >
                    <RichTextEditor
                        value={step3Content}
                        onChange={setStep3Content}
                        placeholder={`- FAQ\n- “Est-ce que ça marche aussi pour… ?”\n- “Et si je n’ai pas de budget / d’expérience ?”`}
                    />
                </StepBlock>

            </div>

            <ArticleSection title="Citation ou punchline" badge="<p>" tooltip="Citation client, punchline, étude de cas ou chiffre impactant. Utiliser un block quote/ Highlight.">
                <textarea rows={2} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 placeholder:text-zinc-500" value={quote} onChange={(e) => setQuote(e.target.value)} placeholder="“80% des lecteurs...”" />
            </ArticleSection>

            <ArticleSection title="Conclusion" badge="H2" tooltip="Récapitule les points-clés, donne un conseil final, ouvre sur une question ou perspective.">
                <textarea rows={4} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 placeholder:text-zinc-500" value={conclusion} onChange={(e) => setConclusion(e.target.value)} placeholder={`- Résumé des 2-3 grandes idées\n- Astuce ou mot de la fin\n- Question ouverte pour générer des commentaires`} />
            </ArticleSection>

            <ArticleSection title="Call to Action (optionnel)" badge="CTA" tooltip="Proposer une action concrète à faire après lecture.">
                <textarea rows={3} className="w-full bg-zinc-800 border border-zinc-700 rounded-sm p-3 placeholder:text-zinc-500" value={cta} onChange={(e) => setCta(e.target.value)} placeholder={`- “Télécharger le guide PDF”\n- “Tester notre outil gratuit”\n- “S’abonner à la newsletter”`} />
            </ArticleSection>

            <div className="flex justify-end gap-4 mt-8">
                {/* Bouton "Annuler" */}
                <button className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600">Annuler</button>
                {/* Bouton "Publier" */}
                <button className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500" onClick={handleSubmit} disabled={isSaving}>
                    {isSaving ? "Enregistrement..." : "Publier l’article"}
                </button>
            </div>
        </div >
    );
}
"use client";

import React, { useState } from "react";
// import TipTapEditor from "@/components/TipTapEditor"; // <-- à implémenter si tu veux TipTap
// import Tooltip from "@/components/Tooltip"; // <-- composant custom ou librairie tierce

export default function NewArticlePage() {
    const [title, setTitle] = useState("");
    const [metaTitle, setMetaTitle] = useState("");
    const [intro, setIntro] = useState("");
    const [definition, setDefinition] = useState("");

    // Étapes : champ pour le titre H3 + champ pour le contenu
    const [step1Title, setStep1Title] = useState("Étape 1 : ");
    const [step1Content, setStep1Content] = useState("");
    const [step2Title, setStep2Title] = useState("Étape 2 : ");
    const [step2Content, setStep2Content] = useState("");
    const [step3Title, setStep3Title] = useState("Étape 3 : ");
    const [step3Content, setStep3Content] = useState("");

    const [objections, setObjections] = useState("");
    const [quote, setQuote] = useState("");
    const [conclusion, setConclusion] = useState("");
    const [cta, setCta] = useState("");

    const [isSaving, setIsSaving] = useState(false);
    const [previewMode, setPreviewMode] = useState(false);

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
                    definition,
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
            // Réinitialiser les champs
            setTitle(""); setMetaTitle(""); setIntro(""); setDefinition("");
            setStep1Title("Étape 1 : "); setStep1Content("");
            setStep2Title("Étape 2 : "); setStep2Content("");
            setStep3Title("Étape 3 : "); setStep3Content("");
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
            <h1 className="text-3xl font-bold mb-6 text-center">
                Créer un nouvel article
            </h1>

            {/* Titre principal (H1) */}
            <SectionInput
                label="Titre de l’article (H1)"
                tooltip="70 caractères max. Doit contenir ton mot-clé principal."
                placeholder="Ex: Pourquoi [Mot-clé] va changer..."
                value={title}
                onChange={setTitle}
            />

            {/* Meta Title */}
            <SectionInput
                label="Meta Title (SEO)"
                tooltip="Le titre qui apparaît dans l'onglet du navigateur et sur Google. ~60-70 caractères."
                placeholder="Ton titre SEO optimisé"
                value={metaTitle}
                onChange={setMetaTitle}
            />

            {/* Introduction */}
            <SectionTextarea
                label="Introduction"
                tooltip="2-4 phrases pour accrocher le lecteur, présenter le problème et l'intérêt de l'article."
                placeholder="Ex: Vous cherchez à [objectif] ? Dans cet article, vous allez..."
                value={intro}
                onChange={setIntro}
            />

            {/* Définition / Contexte (H2) */}
            <SectionTextarea
                label="Définition ou Contexte (H2)"
                tooltip="Explique les bases du sujet, pourquoi il est important, quelques chiffres clés si nécessaire."
                placeholder="Ex: Qu’est-ce que [mot-clé] ? Pourquoi c'est crucial ?"
                value={definition}
                onChange={setDefinition}
            />

            {/* Étape 1 : Titre (H3) + Contenu */}
            <SectionInput
                label="Titre de l’Étape 1 (H3)"
                tooltip="Donne un titre court et explicite, ex: Étape 1 : Préparer votre environnement"
                placeholder="Étape 1 : ..."
                value={step1Title}
                onChange={setStep1Title}
            />

            <SectionTiptap
                label="Contenu de l’Étape 1"
                tooltip="Explique la première étape, prérequis, détails concrets. Formatage enrichi possible."
                placeholder="Décris la première étape..."
                value={step1Content}
                onChange={setStep1Content}
            />

            {/* Étape 2 : Titre (H3) + Contenu */}
            <SectionInput
                label="Titre de l’Étape 2 (H3)"
                tooltip="Ex: Étape 2 : Appliquer la stratégie"
                placeholder="Étape 2 : ..."
                value={step2Title}
                onChange={setStep2Title}
            />

            <SectionTiptap
                label="Contenu de l’Étape 2"
                tooltip="Explique la seconde étape, mise en œuvre, etc."
                placeholder="Décris la deuxième étape..."
                value={step2Content}
                onChange={setStep2Content}
            />

            {/* Étape 3 : Titre (H3) + Contenu */}
            <SectionInput
                label="Titre de l’Étape 3 (H3)"
                tooltip="Ex: Étape 3 : Évaluer les résultats"
                placeholder="Étape 3 : ..."
                value={step3Title}
                onChange={setStep3Title}
            />

            <SectionTiptap
                label="Contenu de l’Étape 3"
                tooltip="Explique comment valider ou mesurer les résultats, retours d’expérience, etc."
                placeholder="Décris la troisième étape..."
                value={step3Content}
                onChange={setStep3Content}
            />

            {/* Objections / FAQ */}
            <SectionTextarea
                label="Objections fréquentes"
                tooltip="Réponds aux doutes et questions typiques : budget, temps, alternatives..."
                placeholder="Et si je n'ai pas de budget ?..."
                value={objections}
                onChange={setObjections}
            />

            {/* Citation / Punchline */}
            <SectionTextarea
                label="Citation / Punchline / Chiffre fort"
                tooltip="Une phrase marquante, un chiffre d'étude, un témoignage client..."
                placeholder="“80% des lecteurs…”"
                value={quote}
                onChange={setQuote}
            />

            {/* Conclusion */}
            <SectionTextarea
                label="Conclusion (H2)"
                tooltip="Récapitule les points clés et ouvre sur une perspective ou une question."
                placeholder="En résumé..."
                value={conclusion}
                onChange={setConclusion}
            />

            {/* CTA */}
            <SectionTextarea
                label="Call To Action (optionnel)"
                tooltip="Incite à une action : télécharger, s'inscrire, laisser un commentaire, etc."
                placeholder="Ex: ‘Télécharge notre guide gratuit’"
                value={cta}
                onChange={setCta}
            />

            {/* Boutons d'action */}
            <div className="flex flex-wrap justify-end gap-4 mt-6">
                <button
                    type="button"
                    className="px-4 py-2 bg-zinc-700 rounded-md hover:bg-zinc-600"
                    onClick={() => {
                        // Optionnel : action "Annuler"
                        // On pourrait faire un router.push('/admin/articles') par ex.
                    }}
                >
                    Annuler
                </button>

                <button
                    type="button"
                    onClick={() => setPreviewMode(!previewMode)}
                    className="px-4 py-2 bg-green-600 rounded-md hover:bg-green-500"
                >
                    {previewMode ? "Retour édition" : "Aperçu"}
                </button>

                <button
                    type="button"
                    className="px-4 py-2 bg-blue-600 rounded-md hover:bg-blue-500"
                    disabled={isSaving}
                    onClick={handleSubmit}
                >
                    {isSaving ? "Enregistrement..." : "Publier l’article"}
                </button>
            </div>

            {/* Section d'aperçu si previewMode est true */}
            {previewMode && (
                <div className="bg-zinc-800 p-4 mt-8 rounded-md">
                    <h2 className="text-xl font-semibold mb-4">Aperçu</h2>
                    <div
                        dangerouslySetInnerHTML={{
                            __html: generatePreviewHTML(),
                        }}
                    />
                </div>
            )}
        </div>
    );

    // Génère un HTML simple pour l'aperçu
    function generatePreviewHTML() {
        return `
      <h1>${title || ""}</h1>
      <p><strong>[Intro]</strong> ${intro || ""}</p>

      <h2>[Définition]</h2>
      <p>${definition || ""}</p>

      <h3>${step1Title || ""}</h3>
      <div>${step1Content || ""}</div>

      <h3>${step2Title || ""}</h3>
      <div>${step2Content || ""}</div>

      <h3>${step3Title || ""}</h3>
      <div>${step3Content || ""}</div>

      <h2>Objections / FAQ</h2>
      <p>${objections || ""}</p>

      <blockquote>${quote || ""}</blockquote>

      <h2>Conclusion</h2>
      <p>${conclusion || ""}</p>

      <p><strong>CTA :</strong> ${cta || ""}</p>
    `;
    }
}

/* ---------------------
   Composants réutilisables
---------------------- */

// Champ input + tooltip
function SectionInput({ label, tooltip, placeholder, value, onChange }) {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center space-x-2 mb-1">
                <label className="font-semibold text-zinc-300">{label}</label>
                <span
                    className="cursor-pointer text-sm text-blue-400"
                    title={tooltip}
                >
                    ℹ️
                </span>
            </div>
            <input
                type="text"
                placeholder={placeholder}
                className="bg-zinc-800 border border-zinc-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

// Champ textarea + tooltip
function SectionTextarea({ label, tooltip, placeholder, value, onChange }) {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center space-x-2 mb-1">
                <label className="font-semibold text-zinc-300">{label}</label>
                <span
                    className="cursor-pointer text-sm text-blue-400"
                    title={tooltip}
                >
                    ℹ️
                </span>
            </div>
            <textarea
                rows={4}
                placeholder={placeholder}
                className="bg-zinc-800 border border-zinc-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

// Champ Tiptap + tooltip (ici simplifié, juste un <textarea>)
function SectionTiptap({ label, tooltip, placeholder, value, onChange }) {
    return (
        <div className="flex flex-col mb-6">
            <div className="flex items-center space-x-2 mb-1">
                <label className="font-semibold text-zinc-300">{label}</label>
                <span
                    className="cursor-pointer text-sm text-blue-400"
                    title={tooltip}
                >
                    ℹ️
                </span>
            </div>
            {/* 
        Si tu implémentes Tiptap, remplace ce <textarea> par <TipTapEditor />
        <TipTapEditor initialContent={value} onUpdate={onChange} ... />
      */}
            <textarea
                rows={5}
                placeholder={placeholder}
                className="bg-zinc-800 border border-zinc-700 rounded-md p-3 focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={value}
                onChange={(e) => onChange(e.target.value)}
            />
        </div>
    );
}

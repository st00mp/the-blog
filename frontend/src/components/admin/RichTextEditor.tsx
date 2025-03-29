"use client";

import React from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import TextAlign from "@tiptap/extension-text-align";
import Highlight from "@tiptap/extension-highlight";
import Image from "@tiptap/extension-image";
import Dropcursor from "@tiptap/extension-dropcursor";
import Placeholder from "@tiptap/extension-placeholder";


// Barre d’outils (boutons)
function MenuBar({ editor }: { editor: any }) {
    if (!editor) {
        return null;
    }

    // Exemple de fonction "Add image" (URL)
    const addImage = () => {
        const url = window.prompt("URL de l’image ?");
        if (url) {
            editor.chain().focus().setImage({ src: url }).run();
        }
    };

    return (
        <div className="flex flex-wrap gap-2 bg-zinc-800 p-2 rounded-md mb-3">
            {/* Titres */}
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "btn-active" : "btn"}
            >
                H1
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "btn-active" : "btn"}
            >
                H2
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHeading({ level: 3 }).run()}
                className={editor.isActive("heading", { level: 3 }) ? "btn-active" : "btn"}
            >
                H3
            </button>

            {/* Paragraph */}
            <button
                onClick={() => editor.chain().focus().setParagraph().run()}
                className={editor.isActive("paragraph") ? "btn-active" : "btn"}
            >
                ¶
            </button>

            {/* Gras / italic / souligné / surligné */}
            <button
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "btn-active" : "btn"}
            >
                Bold
            </button>
            <button
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "btn-active" : "btn"}
            >
                Italic
            </button>
            <button
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "btn-active" : "btn"}
            >
                Strike
            </button>
            <button
                onClick={() => editor.chain().focus().toggleHighlight().run()}
                className={editor.isActive("highlight") ? "btn-active" : "btn"}
            >
                Highlight
            </button>

            {/* Alignement */}
            <button
                onClick={() => editor.chain().focus().setTextAlign("left").run()}
                className={editor.isActive({ textAlign: "left" }) ? "btn-active" : "btn"}
            >
                Left
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("center").run()}
                className={editor.isActive({ textAlign: "center" }) ? "btn-active" : "btn"}
            >
                Center
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("right").run()}
                className={editor.isActive({ textAlign: "right" }) ? "btn-active" : "btn"}
            >
                Right
            </button>
            <button
                onClick={() => editor.chain().focus().setTextAlign("justify").run()}
                className={editor.isActive({ textAlign: "justify" }) ? "btn-active" : "btn"}
            >
                Justify
            </button>

            {/* Image */}
            <button onClick={addImage} className="btn">
                Insert Image
            </button>
        </div>
    );
}

interface RichTextEditorProps {
    content?: string; // éventuellement, si tu pré-remplis
    onChange?: (html: string) => void;
}

// Éditeur principal
export function RichTextEditor({ content = "", onChange }: RichTextEditorProps) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Highlight,
            Image,
            Dropcursor,
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") {
                        return "🖋️ Titre ou sous-titre ici...";
                    }

                    if (node.type.name === "paragraph") {
                        return "💬 Rédige ton contenu ici...";
                    }

                    if (node.type.name === "blockquote") {
                        return "💡 Une citation ou insight percutant ici...";
                    }

                    return "Commence à écrire...";
                },
                includeChildren: true, // Pour que les blocs imbriqués aient aussi un placeholder
            }),
        ],
        content: `
            <h1>Un titre accrocheur contenant le mot-clé principal</h1>

            <p><em>Introduction engageante : présente le problème, les bénéfices de l'article, et ce que le lecteur va découvrir.</em></p>

            <h2>1. Qu’est-ce que [le sujet] ?</h2>
            <p>Définition claire, contexte, ou données clés pour introduire le sujet.</p>

            <h2>2. Comment faire / Méthode détaillée</h2>

            <h3>Étape 1 : Préparer votre environnement</h3>
            <p>Décris ici la première étape ou prérequis.</p>

            <h3>Étape 2 : Appliquer la stratégie</h3>
            <p>Décris ici la phase de mise en œuvre.</p>

            <h3>Étape 3 : Évaluer les résultats</h3>
            <p>Indique comment mesurer ou valider les résultats obtenus.</p>

            <h2>3. Objections fréquentes / Variantes</h2>
            <p>Réponds ici aux doutes ou aux freins potentiels : “et si je suis débutant ?”, “et si j’ai peu de temps ?”, etc.</p>

            <blockquote>“Ajoute ici une citation impactante, un chiffre fort ou une punchline.”</blockquote>

            <h2>Conclusion</h2>
            <p>Résumé rapide des points clés, astuce finale ou question d’ouverture pour inciter à interagir.</p>

            <div data-type="callToAction">
            <p><strong>📣 Call to Action :</strong> Invitez le lecteur à une action concrète : test gratuit, newsletter, partage, etc.</p>
            </div>
        `,
        autofocus: true,
        onUpdate: ({ editor }) => {
            const html = editor.getHTML();
            onChange?.(html);
        },
    });

    return (
        <div className="text-sm text-zinc-100">
            <MenuBar editor={editor} />
            <div className="border border-zinc-700 rounded-md p-4 min-h-[200px]">
                <EditorContent editor={editor} />
            </div>
        </div>
    );
}

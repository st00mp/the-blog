"use client"

import { useState, useCallback } from "react"
import { useEditor, EditorContent } from "@tiptap/react"
import StarterKit from "@tiptap/starter-kit"
import Heading from "@tiptap/extension-heading"
import Image from "@tiptap/extension-image"
import Placeholder from "@tiptap/extension-placeholder"
import { SlashMenu } from "./extensions/SlashMenu" // On va créer ce slash menu plus bas

export default function TiptapEditor() {
    const [title, setTitle] = useState("")

    // Configuration Tiptap
    const editor = useEditor({
        extensions: [
            StarterKit,
            Heading.configure({
                levels: [1, 2, 3], // autoriser <h1>, <h2>, <h3>
            }),
            Image,
            Placeholder.configure({
                placeholder: ({ node }) => {
                    if (node.type.name === "heading") {
                        return "Type a heading…"
                    }
                    return "Type something…"
                },
                showOnlyWhenEmpty: true,
                showOnlyCurrent: false,
            }),
            SlashMenu,
        ],
        content: `
      <h1>Salut Tiptap Notion Style 😎</h1>
      <p>Ici tu peux commencer à taper ton article…</p>
    `,
        autofocus: "end",
    })

    // Méthode pour extraire le contenu JSON
    const handleSave = useCallback(() => {
        if (!editor) return

        const json = editor.getJSON()
        console.log("JSON content:", json)

        // Envoi vers ton API Symfony par exemple
        // fetch("/api/articles", { method: "POST", body: JSON.stringify({...}) })
    }, [editor])

    return (
        <div className="flex flex-col gap-4">
            {/* Un champ pour ton titre d’article */}
            <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Titre de l’article"
                className="
          text-2xl font-bold px-2 py-1
          bg-transparent border-b border-white/20
          focus:outline-none mb-2
        "
            />

            {/* L’éditeur Tiptap en lui-même */}
            <div
                className="
          bg-neutral-900 text-white p-4
          rounded-md border border-white/10
          min-h-[300px] 
        "
            >
                {editor && <EditorContent editor={editor} />}
            </div>

            {/* Bouton Save */}
            <button
                onClick={handleSave}
                className="
          self-start bg-white/10 text-white px-4 py-2
          rounded-md hover:bg-white/20 transition
        "
            >
                Publier
            </button>
        </div>
    )
}

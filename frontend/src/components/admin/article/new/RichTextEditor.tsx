"use client";

import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import React, { useEffect } from "react";
import Placeholder from "@tiptap/extension-placeholder";
import { Bold, Italic, Strikethrough, List, ListOrdered, ImageIcon } from 'lucide-react'
import Image from '@tiptap/extension-image'


type Props = {
    value: string;
    onChange: (value: string) => void;
    placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: Props) {
    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({
                placeholder: ({ editor }) => {
                    // Si l'éditeur est totalement vide
                    if (editor.isEmpty) {
                        return placeholder || "Commence à écrire ici...";
                    }
                    // Sinon, aucun placeholder
                    return "";
                },
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
            }),
            Image.configure({
                inline: false,
                allowBase64: false,
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "tiptap min-h-[120px] focus:outline-none",
            },
        },
        onUpdate: ({ editor }) => {
            onChange(editor.getHTML());
        },
    });

    useEffect(() => {
        if (editor && value !== editor.getHTML()) {
            editor.commands.setContent(value || "", false);
        }
    }, [value]);

    if (!editor) return null;

    return (
        <div className="relative border border-zinc-700 rounded-sm bg-zinc-800 p-4">
            <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="flex gap-2 bg-zinc-800 border border-zinc-600 shadow-lg rounded-md px-2 py-2"
            >
                <button
                    onClick={() => editor.chain().focus().toggleBold().run()}
                    className={
                        editor.isActive("bold")
                            ? "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded"
                            : "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded"
                    }                >
                    <Bold size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleItalic().run()}
                    className={
                        editor.isActive("italic")
                            ? "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded"
                            : "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded"
                    }                >
                    <Italic size={16} />
                </button>
                <button
                    onClick={() => editor.chain().focus().toggleStrike().run()}
                    className={
                        editor.isActive("strike")
                            ? "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded"
                            : "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded"
                    }                >
                    <Strikethrough size={16} />
                </button>
                {/* Bouton pour la liste non ordonnée */}
                <button
                    onClick={() => editor.chain().focus().toggleBulletList().run()}
                    className={
                        editor.isActive("bulletList")
                            ? "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded"
                            : "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded"
                    }
                >
                    <List size={16} />
                </button>

                {/* Bouton pour la liste ordonnée */}
                <button
                    onClick={() => editor.chain().focus().toggleOrderedList().run()}
                    className={
                        editor.isActive("orderedList")
                            ? "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded"
                            : "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded"
                    }                >
                    <ListOrdered size={16} />
                </button>

                {/* Bouton insertion image */}
                <button
                    onClick={() => {
                        const url = prompt("URL de l’image")
                        if (url) {
                            editor.chain().focus().setImage({ src: url }).run()
                        }
                    }}
                    className={
                        editor.isActive("image")
                            ? "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded"
                            : "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded"
                    }
                >
                    <ImageIcon size={16} />
                </button>

            </BubbleMenu>

            <EditorContent editor={editor} />

            <style jsx global>
                {`

                /* 
                Cette règle cible tous les paragraphes (<p>) qui se trouvent dans un élément 
                avec la classe "ProseMirror" et qui possèdent un attribut "data-placeholder".
                On va utiliser ce style pour afficher un texte de placeholder dans l'éditeur TipTap.
                */
                    .ProseMirror p[data-placeholder] {
                    position: relative;
                    }

                /* 
                Ce style applique un pseudo-élément ::before aux mêmes paragraphes, 
                et affiche le contenu de l'attribut "data-placeholder" comme texte.
                */
                    .ProseMirror p[data-placeholder]::before {
                    content: attr(data-placeholder);
                    position: absolute;
                    left: 0;
                    top: 0;
                    pointer-events: none;
                    color: #71717A;
                    }              
                `}
            </style>

        </div>
    );
}

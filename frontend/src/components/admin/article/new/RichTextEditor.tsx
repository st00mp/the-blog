"use client";

import { useState, useEffect } from "react";
import { useEditor, EditorContent, BubbleMenu } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Image from "@tiptap/extension-image";
import ListItem from "@tiptap/extension-list-item";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import { Node, mergeAttributes } from '@tiptap/core';
import { Bold, Italic, Strikethrough, List, ListOrdered, Plus, ImagesIcon, X, Table as TableIcon, Minus, Link as LinkIcon, AlignLeft, AlignCenter, AlignRight, Quote, Highlighter, Palette, Video, FileText } from "lucide-react";
import { MediaUploader } from './MediaUploader';

// Création d'une extension pour gérer directement les vidéos
const VideoExtension = Node.create({
    name: 'video',
    group: 'block',
    atom: true, // Ne peut pas être séparé plus loin

    addAttributes() {
        return {
            src: { default: null },
            controls: { default: true },
            width: { default: '100%' },
            height: { default: null },
            type: { default: null },
            class: { default: 'rounded-md my-4' },
        };
    },

    parseHTML() {
        return [
            {
                tag: 'video',
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return ['video', mergeAttributes(HTMLAttributes)];
    },
});


// Type
type Props = {
    value: any;
    onChange: (value: any) => void;
    placeholder?: string;
};

export function RichTextEditor({ value, onChange, placeholder }: Props) {
    const [hasMounted, setHasMounted] = useState(false);
    const [open, setOpen] = useState(false);
    const active = "px-2 py-1 text-white bg-zinc-700 border border-zinc-600 rounded";
    const inactive = "px-2 py-1 text-zinc-400 hover:text-white hover:bg-zinc-700 border border-zinc-700 rounded";


    useEffect(() => {
        setHasMounted(true);
    }, []);

    const editor = useEditor({
        extensions: [
            TextStyle,
            Color,
            Highlight,
            Link,
            TextAlign.configure({
                types: ['heading', 'paragraph'],
            }),
            StarterKit.configure({
                bulletList: false,
                orderedList: false,
                listItem: false,
            }),
            ListItem.configure({
                // @ts-expect-error
                exitOnBackspace: true,
            }),
            BulletList,
            OrderedList,
            Image.configure({ inline: false, allowBase64: false }),
            Table.configure({ resizable: true }),
            TableRow,
            TableHeader,
            TableCell,
            // Extension vidéo personnalisée
            VideoExtension,
            Placeholder.configure({
                placeholder: ({ editor }) => {
                    if (editor.isEmpty) {
                        return placeholder || "Commence à écrire ici...";
                    }
                    return "";
                },
                showOnlyWhenEditable: true,
                showOnlyCurrent: false,
            }),
        ],
        content: "",
        editorProps: {
            attributes: {
                class: "tiptap min-h-[120px] focus:outline-none",
            },
        },
        immediatelyRender: false,
        onUpdate: ({ editor }) => {
            onChange(editor.getJSON())
        },
    });

    useEffect(() => {
        if (editor && JSON.stringify(editor.getJSON()) !== JSON.stringify(value)) {
            editor.commands.setContent(value || {}, false);
        }
    }, [value]);

    if (!editor) return null;

    const isRed = editor.isActive("textStyle", { color: "#ef4444" });

    return (
        <div className="relative border border-zinc-700 rounded-md bg-zinc-800 p-4">
            <BubbleMenu
                editor={editor}
                tippyOptions={{ duration: 100 }}
                className="max-w-[310px] overflow-x-auto no-scrollbar flex gap-2 bg-zinc-800 border border-zinc-600 shadow-lg rounded-md px-2 py-2 z-50"
            >
                {/* Groupe 1 : Style */}
                <button onClick={() => editor.chain().focus().toggleBold().run()} className={editor.isActive("bold") ? active : inactive}><Bold size={16} /></button>
                <button onClick={() => editor.chain().focus().toggleItalic().run()} className={editor.isActive("italic") ? active : inactive}><Italic size={16} /></button>
                <button onClick={() => editor.chain().focus().toggleStrike().run()} className={editor.isActive("strike") ? active : inactive}><Strikethrough size={16} /></button>

                {/* | séparateur */}
                <span className="mx-1 h-4 w-px bg-zinc-600" />

                {/* Groupe 2 : Couleurs */}
                <button onClick={() => editor.chain().focus().toggleHighlight().run()} className={editor.isActive("highlight") ? active : inactive}><Highlighter size={16} /></button>
                <button onClick={() => {
                    const isRed = editor.isActive("textStyle", { color: "#ef4444" });
                    editor.chain().focus()[isRed ? "unsetColor" : "setColor"]("#ef4444").run();
                }} className={editor.isActive("textStyle", { color: "#ef4444" }) ? active : inactive}><Palette size={16} /></button>

                {/* | séparateur */}
                <span className="mx-1 h-4 w-px bg-zinc-600" />

                {/* Groupe 3 : Listes */}
                <button onClick={() => editor.chain().focus().toggleBulletList().run()} className={editor.isActive("bulletList") ? active : inactive}><List size={16} /></button>
                <button onClick={() => editor.chain().focus().toggleOrderedList().run()} className={editor.isActive("orderedList") ? active : inactive}><ListOrdered size={16} /></button>

                {/* | séparateur */}
                <span className="mx-1 h-4 w-px bg-zinc-600" />

                {/* Blocquote / lien */}
                <button onClick={() => editor.chain().focus().toggleBlockquote().run()} className={editor.isActive("blockquote") ? active : inactive}><Quote size={16} /></button>
                <button
                    onClick={() => {
                        const previousUrl = editor.getAttributes("link").href;
                        const url = window.prompt("URL", previousUrl);
                        if (url === null) return;
                        if (url === "") {
                            editor.chain().focus().extendMarkRange("link").unsetLink().run();
                            return;
                        }
                        editor.chain().focus().setLink({ href: url }).run();
                    }}
                    className={editor.isActive("link") ? active : inactive}
                >
                    <LinkIcon size={16} />
                </button>

                {/* | séparateur */}
                <span className="mx-1 h-4 w-px bg-zinc-600" />

                {/* Alignement */}
                <button onClick={() => editor.chain().focus().setTextAlign("left").run()} className={editor.isActive({ textAlign: "left" }) ? active : inactive}><AlignLeft size={16} /></button>
                <button onClick={() => editor.chain().focus().setTextAlign("center").run()} className={editor.isActive({ textAlign: "center" }) ? active : inactive}><AlignCenter size={16} /></button>
                <button onClick={() => editor.chain().focus().setTextAlign("right").run()} className={editor.isActive({ textAlign: "right" }) ? active : inactive}><AlignRight size={16} /></button>
            </BubbleMenu>

            <EditorContent editor={editor} />

            {hasMounted && (
                <>
                    <button onClick={() => setOpen(true)} className="absolute bottom-4 right-4 bg-blue-600 text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-blue-500">
                        <Plus size={20} />
                    </button>

                    {open && (
                        <div
                            className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center"
                            onClick={() => setOpen(false)} // clic en dehors => ferme
                        >
                            <div
                                className="relative bg-zinc-900 p-6 rounded-xl w-full max-w-md shadow-xl"
                                onClick={(e) => e.stopPropagation()}
                            >
                                {/* Croisillon */}
                                <button
                                    onClick={() => setOpen(false)}
                                    className="absolute top-3 right-3 text-zinc-400 hover:text-white"
                                    aria-label="Fermer"
                                >
                                    <X size={20} />
                                </button>

                                <h3 className="text-lg font-bold mb-4 text-white">Ajouter un bloc</h3>
                                <div className="flex flex-col gap-5">

                                    {/* Groupe Image */}
                                    <div className="border border-zinc-700 rounded-lg p-1">
                                        <h4 className="text-zinc-300 text-sm mb-2 px-3 pt-2 font-medium">Image</h4>
                                        <div className="flex flex-col gap-1">
                                            {/* Upload d'image */}
                                            <MediaUploader
                                                type="image"
                                                label="Télécharger une image"
                                                icon={<ImagesIcon size={20} />}
                                                onSuccess={(url, mimeType) => {
                                                    if (mimeType.startsWith('image/')) {
                                                        const alt = prompt("Texte alternatif (description de l'image) ?") || "Image ajoutée";
                                                        editor?.chain().focus().setImage({ src: url, alt }).run();
                                                        setOpen(false);
                                                    }
                                                }}
                                                onError={(error) => {
                                                    console.error("Erreur d'upload:", error);
                                                    alert(`Erreur lors de l'upload : ${error}`);
                                                }}
                                            />

                                            {/* Image par URL */}
                                            <button className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-white text-base" onClick={() => {
                                                const url = prompt("URL de l'image ?");
                                                if (url) {
                                                    const alt = prompt("Texte alternatif (description de l'image) ?") || "Image ajoutée";
                                                    editor?.chain().focus().setImage({ src: url, alt }).run();
                                                    setOpen(false);
                                                }
                                            }}>
                                                <LinkIcon size={20} /> Image depuis une URL
                                            </button>
                                        </div>
                                    </div>

                                    {/* Groupe Vidéo */}
                                    <div className="border border-zinc-700 rounded-lg p-1">
                                        <h4 className="text-zinc-300 text-sm mb-2 px-3 pt-2 font-medium">Vidéo</h4>
                                        <div className="flex flex-col gap-1">
                                            {/* Upload de vidéo */}
                                            <MediaUploader
                                                type="video"
                                                label="Télécharger une vidéo"
                                                icon={<Video size={20} />}
                                                onSuccess={(url, mimeType) => {
                                                    // Utiliser l'extension vidéo pour insérer la vidéo correctement
                                                    editor?.chain().focus().insertContent({
                                                        type: 'video',
                                                        attrs: {
                                                            src: url,
                                                            controls: true,
                                                            width: '100%',
                                                            type: mimeType,
                                                            class: 'rounded-md my-4',
                                                        }
                                                    }).run();
                                                    setOpen(false);
                                                }}
                                                onError={(error) => {
                                                    console.error("Erreur d'upload:", error);
                                                    alert(`Erreur lors de l'upload : ${error}`);
                                                }}
                                            />

                                            {/* Vidéo par URL (YouTube/Vimeo) */}
                                            <button
                                                className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-white text-base"
                                                onClick={() => {
                                                    const url = prompt("URL YouTube ou Vimeo ?");
                                                    if (!url) return;

                                                    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                                                    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/);

                                                    let label = "📹 Vidéo intégrée";
                                                    let link = url;

                                                    if (youtubeMatch) {
                                                        label = "Vidéo YouTube";
                                                        link = `https://www.youtube.com/watch?v=${youtubeMatch[1]}`;
                                                    } else if (vimeoMatch) {
                                                        label = "🎥 Vidéo Vimeo";
                                                        link = `https://vimeo.com/${vimeoMatch[1]}`;
                                                    }

                                                    const html = `<blockquote class="video-preview-block"><strong>${label}</strong> — <a href="${link}" target="_blank" rel="noopener noreferrer">${link}</a></blockquote>`;
                                                    editor?.chain().focus().insertContent(html).run();
                                                    setOpen(false);
                                                }}
                                            >
                                                <LinkIcon size={20} /> YouTube ou Vimeo
                                            </button>
                                        </div>
                                    </div>

                                    {/* Groupe Document */}
                                    <div className="border border-zinc-700 rounded-lg p-1">
                                        <h4 className="text-zinc-300 text-sm mb-2 px-3 pt-2 font-medium">Document</h4>
                                        <div className="flex flex-col gap-1">
                                            {/* Upload de document */}
                                            <MediaUploader
                                                type="document"
                                                label="Télécharger un document"
                                                icon={<FileText size={20} />}
                                                onSuccess={(url, mimeType) => {
                                                    // Pour les documents (PDF, Word, etc.)
                                                    const fileExt = url.split('.').pop()?.toLowerCase();
                                                    let label = "📄 Document";

                                                    if (fileExt === "pdf") label = "📕 PDF à consulter";
                                                    else if (["doc", "docx"].includes(fileExt || '')) label = "📘 Fichier Word";
                                                    else if (["ppt", "pptx"].includes(fileExt || '')) label = "📙 Présentation PowerPoint";
                                                    else if (["xls", "xlsx"].includes(fileExt || '')) label = "📗 Tableur Excel";

                                                    const html = `<blockquote class="doc-preview-block"><strong>${label}</strong> — <a href="${url}" target="_blank" rel="noopener noreferrer">${url.split('/').pop()}</a></blockquote>`;
                                                    editor?.chain().focus().insertContent(html).run();
                                                    setOpen(false);
                                                }}
                                                onError={(error) => {
                                                    console.error("Erreur d'upload:", error);
                                                    alert(`Erreur lors de l'upload : ${error}`);
                                                }}
                                            />

                                            {/* Document par URL */}
                                            <button
                                                className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-white text-base"
                                                onClick={() => {
                                                    const url = prompt("URL du document ?");
                                                    if (!url) return;

                                                    const ext = url.split(".").pop()?.toLowerCase();
                                                    let label = "📄 Document";

                                                    if (ext === "pdf") label = "📕 PDF à consulter";
                                                    else if (ext === "doc" || ext === "docx") label = "📘 Fichier Word";
                                                    else if (ext === "ppt" || ext === "pptx") label = "📙 Présentation PowerPoint";
                                                    else if (ext === "xls" || ext === "xlsx") label = "📗 Tableur Excel";

                                                    const html = `<blockquote class="doc-preview-block">📄 <strong>${label}</strong> — <a href="${url}" target="_blank" rel="noopener noreferrer">${url}</a></blockquote>`;
                                                    editor?.chain().focus().insertContent(html).run();
                                                    setOpen(false);
                                                }}
                                            >
                                                <LinkIcon size={20} /> Document depuis une URL
                                            </button>
                                        </div>
                                    </div>

                                    {/* Groupe Mise en page */}
                                    <div className="border border-zinc-700 rounded-lg p-1">
                                        <h4 className="text-zinc-300 text-sm mb-2 px-3 pt-2 font-medium">Mise en page</h4>
                                        <div className="flex flex-col gap-1">
                                            {/* Séparateur */}
                                            <button className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-white text-base" onClick={() => {
                                                setOpen(false);
                                                editor?.chain().focus().setHorizontalRule().run();
                                            }}>
                                                <Minus size={20} /> Ligne de séparation
                                            </button>

                                            {/* Tableau */}
                                            <button className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-white text-base" onClick={() => {
                                                setOpen(false);
                                                editor?.chain().focus().insertTable({ rows: 3, cols: 3, withHeaderRow: true }).run();
                                            }}>
                                                <TableIcon size={20} /> Insérer un tableau
                                            </button>
                                        </div>
                                    </div>

                                </div>
                            </div>
                        </div>
                    )}
                </>
            )
            }

            <style jsx global>{`
        .ProseMirror p[data-placeholder] {
          position: relative;
        }

        .ProseMirror p[data-placeholder]::before {
            content: attr(data-placeholder);
            position: absolute;
            left: 0;
            top: 0;
            pointer-events: none;
            color: #8D8D8F;
        }

        .no-scrollbar {
            scrollbar-width: none; /* Firefox */
            -ms-overflow-style: none; /* IE & Edge */
        }

        .no-scrollbar::-webkit-scrollbar {
            display: none; /* Chrome, Safari, Opera */
        }

        .no-scrollbar::-webkit-scrollbar-track {
            background: transparent;
        }

        .no-scrollbar::-webkit-scrollbar-thumb {
            background: transparent;
        }

        .ProseMirror a {
            color: #3b82f6; /* bleu clair (tailwind blue-500) */
            text-decoration: underline;
            cursor: pointer;
        }

        .ProseMirror a:hover {
            color: #60a5fa; /* blue-400 */
        }

        .ProseMirror img {
            max-width: 100%;
            max-height: 300px;
            object-fit: contain;
            display: block;
            margin: 1rem auto;
            border-radius: 0.5rem;
        }

        .ProseMirror blockquote.video-preview-block {
            background-color: #18181b;
            border: 1px solid #3f3f46;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
        }

        .ProseMirror blockquote.doc-preview-block {
            background-color: #18181b;
            border: 1px solid #3f3f46;
            padding: 1rem;
            border-radius: 0.5rem;
            margin: 1rem 0;
            font-style: normal;
            line-height: 1.4;
        }

        .ProseMirror blockquote {
            border-left: 4px solid #71717A; /* zinc-500 */
            padding-left: 1rem;
            margin: 1rem 0;
            color: #d4d4d8; /* zinc-200 */
            font-style: italic;
            background-color: #27272a; /* zinc-800 */
        }

        .ProseMirror table {
            width: 100%;
            border-collapse: collapse;
            margin: 1rem 0;
        }

        .ProseMirror table td,
        .ProseMirror table th {
            border: 1px solid #3f3f46; /* couleur zinc-700 */
            padding: 8px;
            text-align: left;
        }

        .ProseMirror table th {
            background-color: #27272a; /* zinc-800 */
            font-weight: 600;
        }

        .ProseMirror table td {
            background-color: #18181b; /* zinc-900 */
        }
        
        .ProseMirror hr {
            border: none;
            height: 1px;
            background-color: #4b5563; /* Gris zinc-600 */
            margin: 1.5rem 0;
        }

        .ProseMirror colgroup,
        .ProseMirror col {
            width: auto;
        }
      `}</style>
        </div >
    );
}

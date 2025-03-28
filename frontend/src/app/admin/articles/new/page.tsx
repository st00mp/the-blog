"use client";

import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { useState } from "react";
import Bold from '@tiptap/extension-bold'
import Italic from '@tiptap/extension-italic'
import Underline from '@tiptap/extension-underline'
import Strike from '@tiptap/extension-strike'
import Code from '@tiptap/extension-code'
import CodeBlock from '@tiptap/extension-code-block'
import Blockquote from '@tiptap/extension-blockquote'
import BulletList from '@tiptap/extension-bullet-list'
import OrderedList from '@tiptap/extension-ordered-list'
import ListItem from '@tiptap/extension-list-item'
import HorizontalRule from '@tiptap/extension-horizontal-rule'
import Link from '@tiptap/extension-link'
import Heading from '@tiptap/extension-heading'
import Table from '@tiptap/extension-table'
import TableRow from '@tiptap/extension-table-row'
import TableCell from '@tiptap/extension-table-cell'
import TableHeader from '@tiptap/extension-table-header'
import EditorMenuBar from "@/components/editor/extensions/EditorMenuBar";
import TiptapEditor from "@/components/editor/TiptapEditor";

export default function NewArticlePage() {
    const [output, setOutput] = useState<string>("");

    const editor = useEditor({
        extensions: [
            StarterKit,
            Placeholder.configure({ placeholder: "Écris ton article ici..." }),
            Bold,
            Italic,
            Underline,
            Strike,
            Code,
            CodeBlock,
            Blockquote,
            Image,
            BulletList,
            OrderedList,
            ListItem,
            HorizontalRule,
            Link,
            Heading.configure({ levels: [1, 2, 3] }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
        ],
        content: "",
    })

    const handleSave = () => {
        if (!editor) return;
        const html = editor.getHTML();
        setOutput(html);
        // Tu peux ici l'envoyer à ton backend Symfony via fetch POST
    };

    return (
        <main className="min-h-screen bg-black text-white py-12 px-4">
            <div className="max-w-4xl mx-auto space-y-8">
                <h1 className="text-3xl font-bold text-center">Nouvel Article</h1>
                <Card className="bg-white/5 border-white/10">
                    {editor && <EditorMenuBar editor={editor} />}
                    <EditorContent editor={editor} className="prose prose-invert max-w-none min-h-[300px] focus:outline-none" />
                </Card>

                <TiptapEditor />
                <div className="flex justify-between items-center">
                    <Button onClick={handleSave} variant="secondary">
                        Enregistrer
                    </Button>
                </div>

                {output && (
                    <div>
                        <h2 className="text-xl mt-10 mb-2 font-semibold">HTML sauvegardé :</h2>
                        <div className="bg-neutral-900 p-4 rounded-md text-sm whitespace-pre-wrap border border-white/10">
                            {output}
                        </div>
                    </div>
                )}
            </div>
        </main>
    );
}

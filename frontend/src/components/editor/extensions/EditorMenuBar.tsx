"use client";

import { Editor } from "@tiptap/react";
import Bold from "@tiptap/extension-bold";
import Italic from "@tiptap/extension-italic";
import Underline from "@tiptap/extension-underline";
import Strike from "@tiptap/extension-strike";
import Code from "@tiptap/extension-code";
import CodeBlock from "@tiptap/extension-code-block";
import Blockquote from "@tiptap/extension-blockquote";
import BulletList from "@tiptap/extension-bullet-list";
import OrderedList from "@tiptap/extension-ordered-list";
import ListItem from "@tiptap/extension-list-item";
import Heading from "@tiptap/extension-heading";
import HorizontalRule from "@tiptap/extension-horizontal-rule";
import Link from "@tiptap/extension-link";
import { Button } from "@/components/ui/button";

interface Props {
    editor: Editor | null;
}

export default function EditorMenuBar({ editor }: Props) {
    if (!editor) return null;

    return (
        <div className="flex flex-wrap gap-2 border border-white/10 p-2 rounded-md bg-white/5 text-white text-sm mb-4">
            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleBold().run()}
                className={editor.isActive("bold") ? "bg-white/10" : ""}
            >
                Bold
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleItalic().run()}
                className={editor.isActive("italic") ? "bg-white/10" : ""}
            >
                Italic
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={editor.isActive("underline") ? "bg-white/10" : ""}
            >
                Underline
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleStrike().run()}
                className={editor.isActive("strike") ? "bg-white/10" : ""}
            >
                Strike
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleHeading({ level: 1 }).run()}
                className={editor.isActive("heading", { level: 1 }) ? "bg-white/10" : ""}
            >
                H1
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleHeading({ level: 2 }).run()}
                className={editor.isActive("heading", { level: 2 }) ? "bg-white/10" : ""}
            >
                H2
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={editor.isActive("bulletList") ? "bg-white/10" : ""}
            >
                Bullet List
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={editor.isActive("orderedList") ? "bg-white/10" : ""}
            >
                Ordered List
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleCodeBlock().run()}
                className={editor.isActive("codeBlock") ? "bg-white/10" : ""}
            >
                Code
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().toggleBlockquote().run()}
                className={editor.isActive("blockquote") ? "bg-white/10" : ""}
            >
                Quote
            </Button>

            <Button
                variant="secondary"
                onClick={() => editor.chain().focus().setHorizontalRule().run()}
            >
                Divider
            </Button>
        </div>
    );
}

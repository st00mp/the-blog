"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Highlight from "@tiptap/extension-highlight";
import TextStyle from "@tiptap/extension-text-style";
import Color from "@tiptap/extension-color";
import Link from "@tiptap/extension-link";
import TextAlign from "@tiptap/extension-text-align";
import Table from "@tiptap/extension-table";
import TableRow from "@tiptap/extension-table-row";
import TableCell from "@tiptap/extension-table-cell";
import TableHeader from "@tiptap/extension-table-header";
import HorizontalRule from "@tiptap/extension-horizontal-rule";

type Props = {
    content: any; // JSON provenant de ton article
};

export default function TiptapRenderer({ content }: Props) {
    const editor = useEditor({
        editable: false,
        extensions: [
            StarterKit,
            Image,
            Highlight,
            TextStyle,
            Color,
            Link,
            TextAlign.configure({
                types: ["heading", "paragraph"],
            }),
            Table.configure({ resizable: true }),
            TableRow,
            TableCell,
            TableHeader,
            HorizontalRule,
        ],
        content,
    });

    if (!editor) return null;

    return (
        <div className="prose prose-invert max-w-none">
            <EditorContent editor={editor} />
        </div>
    );
}
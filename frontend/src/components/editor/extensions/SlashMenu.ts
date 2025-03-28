import { Extension } from "@tiptap/core"
import Suggestion from "@tiptap/suggestion"
import { ReactRenderer } from "@tiptap/react"
import tippy from "tippy.js"
import "tippy.js/dist/tippy.css"
import { useCallback, useEffect, useRef, useState } from "react"

export const SlashMenu = Extension.create({
    name: "slash-menu",

    addOptions() {
        return {
            suggestion: {
                char: "/",
                command: ({ editor, range, props }) => {
                    // par ex. /h1 => transforme en heading
                    editor.chain().focus().deleteRange(range).setNode(props.item).run()
                },
                items: ({ query }) => {
                    // On retourne la liste possible
                    return [
                        { title: "Heading 1", item: { type: "heading", attrs: { level: 1 } } },
                        { title: "Heading 2", item: { type: "heading", attrs: { level: 2 } } },
                        { title: "Paragraph", item: { type: "paragraph" } },
                        { title: "Image", item: { type: "image", attrs: { src: "https://placekitten.com/300" } } },
                        // etc.
                    ].filter((item) =>
                        item.title.toLowerCase().includes(query.toLowerCase())
                    )
                },
            },
        }
    },

    addProseMirrorPlugins() {
        return [
            Suggestion({
                editor: this.editor,
                ...this.options.suggestion,
            })
        ]
    },

})

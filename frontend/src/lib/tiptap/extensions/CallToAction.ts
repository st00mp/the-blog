import { Node } from "@tiptap/core";

export const CallToAction = Node.create({
    name: "callToAction",

    group: "block", // on peut le placer dans un bloc
    draggable: true, // si tu veux autoriser le drag & drop

    /**
     * parseHTML, renderHTML -> pour gérer la sérialisation
     */
    parseHTML() {
        return [
            {
                tag: "div[data-type='callToAction']",
            },
        ];
    },

    renderHTML({ HTMLAttributes }) {
        return [
            "div",
            { ...HTMLAttributes, "data-type": "callToAction" },
            0, // 0 = place le contenu à l'intérieur
        ];
    },

    /**
     * addCommands -> tu peux définir des commandes
     * pour insérer ce bloc CTA à la demande
     */
});

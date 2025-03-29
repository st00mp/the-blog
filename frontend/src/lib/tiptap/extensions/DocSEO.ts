// /lib/tiptap/extensions/DocSEO.ts
import { Node } from "@tiptap/core";

/**
 * On étend ou on surcharge la node "doc" existante,
 * pour imposer un ordre de contenu.
 */
export const DocSEO = Node.create({
    name: "doc",
    topNode: true,

    /**
     * ProseMirror 'content' syntax :
     * - "heading[level=1]" : impose un heading de niveau 1
     * - "paragraph" : impose la présence d'un paragraphe après
     * - "block+" : un ou plusieurs blocs (paragraph, heading, etc.)
     *
     * Astuce : Si tu veux autoriser explicitement heading H2/H3, assure-toi que
     * le schema ou l'extension StarterKit autorise `heading` sur d'autres niveaux.
     */
    content: "heading paragraph block*"
});

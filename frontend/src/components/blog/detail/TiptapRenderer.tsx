"use client";

import { EditorContent, useEditor } from "@tiptap/react";
import { useEffect, useRef } from "react";
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

type Props = {
    content: any; // JSON provenant de ton article
};

export default function TiptapRenderer({ content }: Props) {
    const containerRef = useRef<HTMLDivElement>(null);
    
    const editor = useEditor({
        editable: false,
        content,
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
        ],
        editorProps: {
            attributes: { class: "prose" },
        },
        injectCSS: false,
    });

    // Traiter les vidéos et documents après le rendu
    useEffect(() => {
        if (!containerRef.current) return;
        
        // Fonction pour traiter les médias
        const processMedia = () => {
            if (!containerRef.current) return;
            
            // Sélectionner tous les blockquotes dans le contenu rendu
            const mediaBlocks = containerRef.current.querySelectorAll('blockquote');
            console.log('Nombre de blockquotes trouvés:', mediaBlocks.length);
            
            mediaBlocks.forEach((block) => {
                const content = block.innerHTML;
                console.log('Contenu du blockquote:', content);
                
                // Vérifier s'il s'agit d'un contenu vidéo (plus flexible)
                if (content.includes('youtube.com/watch') || content.includes('youtu.be')) {
                    console.log('Contenu YouTube détecté!');
                    // Recherche de l'URL YouTube dans le contenu HTML
                    const urlMatch = content.match(/href="(https?:\/\/(www\.)?(youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)[^"]*)"/);
                    
                    if (urlMatch && urlMatch[1]) {
                        const videoUrl = urlMatch[1];
                        console.log('URL vidéo trouvée:', videoUrl);
                        let videoId;
                        
                        // Extraire l'ID de la vidéo YouTube avec une regex plus permissive
                        const ytMatch = videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([a-zA-Z0-9_-]+)/);
                        if (ytMatch && ytMatch[1]) {
                            videoId = ytMatch[1];
                            console.log('ID YouTube extrait:', videoId);
                            
                            // Créer l'iframe avec l'ID de la vidéo
                            const iframe = document.createElement('iframe');
                            iframe.width = '100%';
                            iframe.height = '400px';
                            iframe.src = `https://www.youtube.com/embed/${videoId}`;
                            iframe.frameBorder = '0';
                            iframe.allow = 'accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture';
                            iframe.allowFullscreen = true;
                            iframe.classList.add('rounded-md', 'my-4');
                            
                            // Remplacer le blockquote par l'iframe
                            console.log('Remplacement du blockquote par iframe YouTube');
                            block.parentNode?.replaceChild(iframe, block);
                        } else {
                            console.log('Impossible d\'extraire l\'ID YouTube');
                        }
                    } else {
                        console.log('Pas de lien YouTube trouvé dans le contenu');
                    }
                }
                // Vérifier s'il s'agit d'un blockquote de vidéo Vimeo
                else if (content.includes('vimeo.com')) {
                    console.log('Contenu Vimeo détecté!');
                    const linkMatch = content.match(/href="(https?:\/\/(www\.)?vimeo\.com\/([0-9]+)[^"]*)"/);
                    if (linkMatch && linkMatch[1]) {
                        const videoUrl = linkMatch[1];
                        console.log('URL Vimeo trouvée:', videoUrl);
                        let videoId;
                        
                        // Extraire l'ID de la vidéo Vimeo
                        const vimeoMatch = videoUrl.match(/vimeo\.com\/(\d+)/);
                        if (vimeoMatch && vimeoMatch[1]) {
                            videoId = vimeoMatch[1];
                            console.log('ID Vimeo extrait:', videoId);
                            
                            // Créer l'iframe avec l'ID de la vidéo
                            const iframe = document.createElement('iframe');
                            iframe.width = '100%';
                            iframe.height = '400px';
                            iframe.src = `https://player.vimeo.com/video/${videoId}`;
                            iframe.frameBorder = '0';
                            iframe.allow = 'autoplay; fullscreen; picture-in-picture';
                            iframe.allowFullscreen = true;
                            iframe.classList.add('rounded-md', 'my-4');
                            
                            // Remplacer le blockquote par l'iframe
                            console.log('Remplacement du blockquote par iframe Vimeo');
                            block.parentNode?.replaceChild(iframe, block);
                        } else {
                            console.log('Impossible d\'extraire l\'ID Vimeo');
                        }
                    } else {
                        console.log('Pas de lien Vimeo trouvé dans le contenu');
                    }
                } else {
                    console.log('Pas de contenu vidéo détecté');
                }
            });
        };
        
        // Exécuter après un court délai pour s'assurer que le contenu est rendu
        const timer = setTimeout(processMedia, 200); // Délai augmenté pour s'assurer que le DOM est prêt
        
        return () => clearTimeout(timer);
    }, [editor, content]); // Traiter chaque fois que l'éditeur ou le contenu change

    if (!editor) return null;

    return (
        <div ref={containerRef} className="prose prose-invert max-w-none">
            <EditorContent editor={editor} />
            <style jsx global>{`
                .ProseMirror img {
                    max-width: 100%;
                    height: auto;
                    display: block;
                    margin: 1rem auto;
                    border-radius: 0.5rem;
                }
                
                .ProseMirror iframe {
                    max-width: 100%;
                    margin: 1.5rem 0;
                    border-radius: 0.5rem;
                    box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06);
                }
            `}</style>
        </div>
    );
}
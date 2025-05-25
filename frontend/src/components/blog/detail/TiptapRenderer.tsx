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
// Extension personnalisée
import { Node, mergeAttributes } from '@tiptap/core';

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

// Extension pour les blockquotes contenant du HTML spécial
const CustomBlockquote = Node.create({
  name: 'customblockquote',
  group: 'block',
  content: 'inline*',
  addAttributes() {
    return {
      html: { default: '' },
    };
  },
  parseHTML() {
    return [
      {
        tag: 'blockquote[data-html]',
        getAttrs: (node) => ({
          html: node.getAttribute('data-html'),
        }),
      },
    ];
  },
  renderHTML({ HTMLAttributes }) {
    const { html, ...rest } = HTMLAttributes;
    return ['blockquote', mergeAttributes(rest, { 'data-html': html }), 0];
  },
});

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
            // Nos extensions personnalisées
            VideoExtension,
            CustomBlockquote,
        ],
        editorProps: {
            attributes: { class: "prose" },
            handleDOMEvents: {
                // Gérer la transformation du contenu vidéo après le rendu
                focus: (view, event) => {
                    setTimeout(() => {
                        processVideos();
                    }, 0);
                    return false; // Pour permettre d'autres gestionnaires
                }
            },
        },
        injectCSS: false,
    });

    // Fonction pour traiter les balises vidéo et s'assurer qu'elles sont bien rendues
    const processVideos = () => {
        if (!containerRef.current) return;

        // Traiter directement les balises vidéo qui sont correctement insérées via l'extension
        const videos = containerRef.current.querySelectorAll('video');
        console.log('Vidéos trouvées:', videos.length);
        
        videos.forEach((videoEl) => {
            // S'assurer que chaque vidéo a les bonnes propriétés
            videoEl.controls = true;
            videoEl.style.width = '100%';
            videoEl.classList.add('rounded-md');
            videoEl.style.maxHeight = '400px';
        });

        // Maintenir la compatibilité avec l'ancienne méthode (blockquotes avec vidéos)
        const blockquotes = containerRef.current.querySelectorAll('blockquote');
        console.log('Recherche de vidéos dans', blockquotes.length, 'blockquotes');
        
        blockquotes.forEach((block) => {
            const content = block.innerHTML;
            
            // Si le blockquote contient une balise vidéo
            if (content.includes('<video') || content.includes('</video>')) {
                console.log('Blockquote avec balise vidéo détecté !');
                
                try {
                    // Extraire la balise vidéo
                    const videoMatch = content.match(/<video[\s\S]*?<\/video>/i);
                    
                    if (videoMatch) {
                        // Créer un élément div pour remplacer le blockquote
                        const videoContainer = document.createElement('div');
                        videoContainer.className = 'video-container my-4';
                        videoContainer.innerHTML = videoMatch[0];
                        
                        // Récupérer l'élément vidéo et assurer qu'il a les bonnes propriétés
                        const videoEl = videoContainer.querySelector('video');
                        if (videoEl) {
                            videoEl.controls = true;
                            videoEl.style.width = '100%';
                            videoEl.classList.add('rounded-md');
                            videoEl.style.maxHeight = '400px';
                            
                            // Remplacer le blockquote par le conteneur vidéo
                            block.parentNode?.replaceChild(videoContainer, block);
                            console.log('Vidéo remplacée avec succès');
                        }
                    }
                } catch (error) {
                    console.error('Erreur lors du traitement de la vidéo:', error);
                }
            }
        });
    };
    
    // Traiter les vidéos et documents après le rendu
    useEffect(() => {
        if (!containerRef.current) return;
        
        // Fonction pour traiter tous les médias (YouTube, Vimeo, et vidéos locales)
        const processAllMedia = () => {
            if (!containerRef.current) return;
            
            // Traiter d'abord les vidéos locales
            processVideos();
            
            // Sélectionner tous les blockquotes restants dans le contenu rendu
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
                } 
                // Vérifier s'il s'agit d'une balise vidéo MP4/WebM directement uploadée
                else if (content.includes('<video') || content.includes('video>')) {
                    console.log('Balise vidéo détectée!');
                    
                    // Extraire le contenu de la balise vidéo
                    const videoTagMatch = content.match(/<video[\s\S]*?<\/video>/i);
                    
                    if (videoTagMatch && videoTagMatch[0]) {
                        const videoHTML = videoTagMatch[0];
                        console.log('HTML vidéo extrait:', videoHTML);
                        
                        // Créer un conteneur pour le HTML de la vidéo
                        const videoContainer = document.createElement('div');
                        videoContainer.innerHTML = videoHTML;
                        
                        // S'assurer que la vidéo a les bonnes propriétés
                        const videoElement = videoContainer.querySelector('video');
                        if (videoElement) {
                            videoElement.controls = true;
                            videoElement.style.width = '100%';
                            videoElement.classList.add('rounded-md', 'my-4');
                            videoElement.style.maxHeight = '400px';
                            
                            // Remplacer le blockquote par l'élément vidéo
                            console.log('Remplacement du blockquote par lecteur vidéo');
                            block.parentNode?.replaceChild(videoContainer, block);
                        }
                    }
                } else {
                    console.log('Pas de contenu vidéo détecté');
                }
            });
        };
        
        // Exécuter après un court délai pour s'assurer que le contenu est rendu
        const timer = setTimeout(processAllMedia, 200); // Délai augmenté pour s'assurer que le DOM est prêt
        
        return () => clearTimeout(timer);
    }, [editor, content]); // Traiter chaque fois que l'éditeur ou le contenu change
    
    // Style supplémentaire pour les tableaux uniquement (lignes de séparation gérées par CSS)
    useEffect(() => {
        if (!containerRef.current || !editor) return;
        
        // Appliquer les styles aux tableaux
        const applyTableStyles = () => {
            // Styles pour les tableaux
            const tables = containerRef.current?.querySelectorAll('table');
            if (tables?.length) {
                tables.forEach(table => {
                    const tableElement = table as HTMLTableElement;
                    tableElement.style.borderCollapse = 'collapse';
                    tableElement.style.width = '100%';
                    tableElement.style.margin = '1rem 0';
                    tableElement.style.border = '1px solid #374151'; // zinc-700
                });
                
                const cells = containerRef.current?.querySelectorAll('td, th');
                cells?.forEach(cell => {
                    const cellElement = cell as HTMLTableCellElement;
                    cellElement.style.border = '1px solid #374151'; // zinc-700
                    cellElement.style.padding = '0.5rem';
                });
            }
        };
        
        // Appliquer les styles immédiatement
        applyTableStyles();
        
        // Observer les changements pour réappliquer si nécessaire
        const observer = new MutationObserver(applyTableStyles);
        observer.observe(containerRef.current, { childList: true, subtree: true });
        
        return () => observer.disconnect();
    }, [editor]);

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
                
                .ProseMirror hr {
                    border: none;
                    height: 1px;
                    background-color: #4b5563; /* Gris zinc-600 */
                    margin: 1.5rem 0;
                }
            `}</style>
        </div>
    );
}
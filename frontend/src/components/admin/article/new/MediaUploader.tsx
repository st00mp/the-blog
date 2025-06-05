// components/admin/article/new/MediaUploader.tsx
import { useState } from 'react';
import { ReactNode } from 'react';

interface MediaUploaderProps {
    onSuccess: (url: string, mimeType: string) => void;
    onError: (error: string) => void;
    type?: 'image' | 'video' | 'document' | 'all';
    label?: string;
    icon?: ReactNode;
    articleId?: number;
}

export const MediaUploader = ({ onSuccess, onError, type = 'all', label, icon, articleId }: MediaUploaderProps) => {
    const [uploading, setUploading] = useState(false);

    const getAcceptTypes = () => {
        switch (type) {
            case 'image':
                return 'image/*';
            case 'video':
                return 'video/mp4,video/webm,video/ogg';
            case 'document':
                return 'application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
            case 'all':
            default:
                return 'image/*,video/mp4,video/webm,application/pdf,application/msword,application/vnd.openxmlformats-officedocument.wordprocessingml.document';
        }
    };

    const uploadFile = async (file: File) => {
        setUploading(true);

        try {
            // Convertir le fichier en base64 pour éviter les problèmes de gestion des fichiers temporaires
            const reader = new FileReader();

            // Promettre la lecture du fichier
            const fileDataPromise = new Promise<string>((resolve, reject) => {
                reader.onload = () => {
                    // Le résultat contient le fichier en base64 (avec prefix data:...;base64,)
                    const base64data = reader.result as string;
                    // On extrait uniquement la partie base64, sans le préfixe
                    const base64Content = base64data.split(',')[1];
                    resolve(base64Content);
                };
                reader.onerror = () => reject(new Error('Failed to read the file'));
            });

            // Démarrer la lecture
            reader.readAsDataURL(file);

            // Attendre que la lecture soit terminée
            const base64Content = await fileDataPromise;

            // Préparer les données à envoyer
            const payload = {
                fileName: file.name,
                mimeType: file.type,
                content: base64Content,
                articleId: articleId || null
            };

            // Envoyer au serveur
            const response = await fetch('/api/media/upload', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(payload)
            });

            if (!response.ok) {
                const error = await response.json();
                throw new Error(error.error || 'Upload failed');
            }

            const data = await response.json();
            onSuccess(data.url, file.type);
        } catch (error: any) {
            onError(error.message || 'Upload failed');
        } finally {
            setUploading(false);
        }
    };

    const handleClick = () => {
        const input = document.createElement('input');
        input.type = 'file';
        input.accept = getAcceptTypes();
        input.multiple = false;

        input.onchange = (e: Event) => {
            const target = e.target as HTMLInputElement;
            const file = target.files?.[0];
            if (file) {
                uploadFile(file);
            }
        };

        input.click();
    };

    return (
        <button
            className="flex items-center gap-3 bg-zinc-800 hover:bg-zinc-700 p-4 rounded-md text-white text-base"
            onClick={handleClick}
            disabled={uploading}
        >
            {icon}
            {label || 'Télécharger un fichier'}
            {uploading && <span className="ml-2 animate-pulse">...</span>}
        </button>
    );
};
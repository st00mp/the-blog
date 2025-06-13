// components/admin/article/new/MediaUploader.tsx
import { useState } from 'react';
import { ReactNode } from 'react';

interface MediaUploaderProps {
    onSuccess: (url: string, mimeType: string, id: string) => void;
    onError: (error: string) => void;
    type?: 'image' | 'video' | 'document' | 'all';
    label?: string;
    icon?: ReactNode;
}

export const MediaUploader = ({ onSuccess, onError, type = 'all', label, icon }: MediaUploaderProps) => {
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
            const formData = new FormData();
            formData.append('file', file);
            formData.append('mediaType', type || 'default');

            const response = await fetch('/api/upload', {
                method: 'POST',
                body: formData,
                credentials: 'include' // Pour inclure les cookies d'auth
            });
            
            const response_json = await response.json();
            
            if (response_json.url) {
                onSuccess(response_json.url, file.type, response_json.id);
                return;
            }
            
            // Sinon, traitement normal des erreurs et réponses
            if (!response.ok) {
                const errorMsg = `Server error: ${response.status} ${response.statusText}`;
                throw new Error(errorMsg);
            }
            
            // Si nous sommes arrivés jusqu'ici mais que l'URL n'a pas été trouvée dans la réponse
            throw new Error('URL manquante dans la réponse du serveur');
        } catch (error: any) {
            const errorMsg = error.message || 'Upload failed';
            onError(errorMsg);
        }
        finally {
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
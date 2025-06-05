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
            const formData = new FormData();
            formData.append('file', file);
            if (articleId) {
                formData.append('article_id', articleId.toString());
            }

            const response = await fetch('/api/media/upload', {
                method: 'POST',
                body: formData,
            });

            const rawBody = await response.text();
            let data: any;
            try {
                data = JSON.parse(rawBody);
            } catch {
                throw new Error(rawBody || 'Upload failed');
            }

            if (!response.ok) {
                throw new Error(data.error || 'Upload failed');
            }

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
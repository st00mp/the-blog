// Types pour les commentaires
export type Comment = {
  id: number;
  content: string;
  createdAt: string;
  updatedAt: string;
  author: {
    id: number;
    name: string;
  };
  children: Comment[];
  isOwner?: boolean; // Indique si l'utilisateur connecté est l'auteur du commentaire
  articleAuthorId?: number; // ID de l'auteur de l'article pour autoriser la suppression
};

/**
 * Récupère tous les commentaires d'un article par son slug
 */
export async function getArticleComments(articleSlug: string): Promise<Comment[]> {
  try {
    const response = await fetch(`/api/articles/${articleSlug}/comments`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des commentaires');
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Erreur getArticleComments:', error);
    throw error;
  }
}

/**
 * Ajoute un commentaire à un article par son slug
 */
export async function addComment(articleSlug: string, content: string, parentId?: number): Promise<Comment> {
  try {
    const commentData: any = { content };
    if (parentId) {
      commentData.parentId = parentId;
    }

    const response = await fetch(`/api/articles/${articleSlug}/comments`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify(commentData),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de l\'ajout du commentaire');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur addComment:', error);
    throw error;
  }
}

/**
 * Modifie un commentaire existant
 */
export async function updateComment(commentId: number, content: string): Promise<Comment> {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ content }),
    });

    if (!response.ok) {
      const error = await response.json();
      throw new Error(error.error || 'Erreur lors de la modification du commentaire');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur updateComment:', error);
    throw error;
  }
}

/**
 * Supprime un commentaire existant
 */
export async function deleteComment(commentId: number): Promise<void> {
  try {
    const response = await fetch(`/api/comments/${commentId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      const error = await response.json().catch(() => ({}));
      throw new Error(error.error || 'Erreur lors de la suppression du commentaire');
    }
  } catch (error) {
    console.error('Erreur deleteComment:', error);
    throw error;
  }
}

/**
 * Formate la date pour l'affichage en français
 */
export function formatCommentDate(dateString: string): string {
  const date = new Date(dateString);
  const now = new Date();
  const diffInSeconds = Math.floor((now.getTime() - date.getTime()) / 1000);

  // Moins d'une minute
  if (diffInSeconds < 60) {
    return 'À l\'instant';
  }
  
  // Moins d'une heure
  if (diffInSeconds < 3600) {
    const minutes = Math.floor(diffInSeconds / 60);
    return `Il y a ${minutes} minute${minutes > 1 ? 's' : ''}`;
  }
  
  // Moins d'un jour
  if (diffInSeconds < 86400) {
    const hours = Math.floor(diffInSeconds / 3600);
    return `Il y a ${hours} heure${hours > 1 ? 's' : ''}`;
  }
  
  // Moins d'une semaine
  if (diffInSeconds < 604800) {
    const days = Math.floor(diffInSeconds / 86400);
    return `Il y a ${days} jour${days > 1 ? 's' : ''}`;
  }
  
  // Plus d'une semaine
  return date.toLocaleDateString('fr-FR', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });
}

export type Article = {
  id: string;
  title: string;
  slug: string;
  createdAt: string;
  updatedAt: string;
  status: string;
  intro?: string;
  category?: {
    id: number;
    name: string;
  };
  author: {
    id: number;
    name: string;
  };
};

type ArticleResponse = {
  data: Article[];
  meta: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
};

// Récupère tous les articles
export async function getAllArticles(
  searchTerm: string = '',
  status: string = 'all'
): Promise<ArticleResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (status !== 'all') queryParams.append('status', status);

    const response = await fetch(`/api/articles?${queryParams.toString()}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des articles');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur getAllArticles:', error);
    throw error;
  }
}

// Récupère les articles de l'utilisateur connecté
export async function getMyArticles(
  searchTerm: string = '',
  status: string = 'all',
  currentUserId: number | null = null
): Promise<ArticleResponse> {
  try {
    // Récupérer tous les articles
    const allArticlesResponse = await getAllArticles(searchTerm, status);
    
    // Si l'ID de l'utilisateur n'est pas fourni, retourner tous les articles
    if (!currentUserId) {
      return allArticlesResponse;
    }
    
    // Filtrer les articles pour n'inclure que ceux de l'utilisateur connecté
    const filteredArticles = allArticlesResponse.data.filter(article => 
      article.author && article.author.id === currentUserId
    );
    
    // Retourner les données filtrées avec les métadonnées mises à jour
    return {
      data: filteredArticles,
      meta: {
        ...allArticlesResponse.meta,
        total: filteredArticles.length,
        totalPages: Math.ceil(filteredArticles.length / allArticlesResponse.meta.limit)
      }
    };
  } catch (error) {
    console.error('Erreur getMyArticles:', error);
    throw error;
  }
}

// Supprimer un article
export async function deleteArticle(id: string): Promise<void> {
  try {
    const response = await fetch(`/api/articles/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la suppression de l\'article');
    }
  } catch (error) {
    console.error('Erreur deleteArticle:', error);
    throw error;
  }
}

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

// Fonction pour convertir le statut de l'API (number) en string pour l'UI
// et corriger les noms des champs de date (snake_case -> camelCase)
function convertApiDataForUI(apiData: any[]): Article[] {
  return apiData.map(article => {
    // Logging pour débogage
    console.log('Article brut de l\'API:', JSON.stringify(article));
    
    const convertedArticle = {
      ...article,
      // Convertir les dates du format snake_case vers camelCase
      createdAt: article.created_at || article.createdAt,
      updatedAt: article.updated_at || article.updatedAt,
      // Convertir status de nombre (0/1) à chaîne (draft/published)
      status: typeof article.status === 'number' 
        ? (article.status === 1 ? 'published' : 'draft')
        : article.status
    };
    
    // Suppression des propriétés snake_case après conversion
    delete convertedArticle.created_at;
    delete convertedArticle.updated_at;
    
    console.log('Article converti:', JSON.stringify({
      id: convertedArticle.id,
      title: convertedArticle.title,
      status: convertedArticle.status,
      createdAt: convertedArticle.createdAt
    }));
    
    return convertedArticle;
  });
}

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
  status: string = 'all',
  page: number = 1,
  limit: number = 12
): Promise<ArticleResponse> {
  try {
    const queryParams = new URLSearchParams();
    if (searchTerm) queryParams.append('search', searchTerm);
    if (status !== 'all') queryParams.append('status', status);
    queryParams.append('page', page.toString());
    queryParams.append('limit', limit.toString());

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

    const responseData = await response.json();
    // Convertir les statuts pour l'UI
    return {
      ...responseData,
      data: convertApiDataForUI(responseData.data)
    };
  } catch (error) {
    console.error('Erreur getAllArticles:', error);
    throw error;
  }
}

// Récupère les articles de l'utilisateur connecté
export async function getMyArticles(
  searchTerm: string = '',
  status: string = 'all',
  currentUserId: number | null = null,
  page: number = 1,
  limit: number = 12
): Promise<ArticleResponse> {
  try {
    // Récupérer tous les articles avec pagination
    const allArticlesResponse = await getAllArticles(searchTerm, status, page, limit);
    
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
      data: convertApiDataForUI(filteredArticles),
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
export async function deleteArticle(id: string, slug?: string): Promise<void> {
  try {
    // Si un slug est fourni, l'utiliser pour la suppression
    // sinon utiliser l'ID (compatibilité arrière)
    const identifier = slug || id;
    console.log('Tentative de suppression avec l\'identifiant:', identifier);
    
    const response = await fetch(`/api/articles/${identifier}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error(`Erreur lors de la suppression de l\'article: ${response.status} ${response.statusText}`);
    }
    
    console.log('Suppression réussie de l\'article avec identifiant:', identifier);
  } catch (error) {
    console.error('Erreur deleteArticle:', error);
    throw error;
  }
}

// Change le statut d'un article (publier ou dépublier)
export async function updateArticleStatus(id: string, status: 'published' | 'draft'): Promise<Article> {
  try {
    // Convertir le statut en nombre pour l'API
    const numericStatus = status === 'published' ? 1 : 0;
    
    const response = await fetch(`/api/articles/${id}/status`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      body: JSON.stringify({ status: numericStatus })
    });

    if (!response.ok) {
      throw new Error(`Erreur lors du changement de statut de l'article en ${status}`);
    }

    const data = await response.json();
    // Convertir les données pour l'interface utilisateur
    return convertApiDataForUI([data])[0];
  } catch (error) {
    console.error('Erreur updateArticleStatus:', error);
    throw error;
  }
}

/**
 * Type pour une activité récente
 */
export type RecentActivity = {
  type: 'article_published' | 'draft_updated' | 'article_deleted' | 'article_restored' | 
        'article_unpublished' | 'article_updated' | 'article_created';
  color: string;
  message: string;
  date: string;
  articleId?: string;
};

/**
 * Type pour les statistiques du dashboard
 */
export type DashboardStats = {
  published: number;
  drafts: number;
  viewsThisMonth: number;
  isAdmin?: boolean; // Indique si l'utilisateur connecté a le rôle admin
  recentActivity?: RecentActivity[]; // Activités récentes
};

/**
 * Récupère les statistiques du dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Ajout d'un paramètre cache-busting pour éviter les problèmes de mise en cache
    const timestamp = new Date().getTime();
    console.log('Appel API dashboard stats:', `/api/dashboard/stats?_t=${timestamp}`);
    
    // Utiliser l'API proxy Next.js locale (dans /app/api/dashboard/stats/route.ts)
    const response = await fetch(`/api/dashboard/stats?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      // Désactiver la mise en cache des navigateurs
      cache: 'no-store',
    });

    console.log('Réponse API status:', response.status, response.statusText);
    
    if (!response.ok) {
      // Tentative de récupérer le corps de l'erreur pour plus de détails
      const errorData = await response.json().catch(e => ({ message: 'Impossible de parser l\'erreur' }));
      console.error('Détails erreur API:', errorData);
      throw new Error(`Erreur lors de la récupération des statistiques du dashboard: ${response.status} ${errorData?.message || response.statusText}`);
    }

    const data = await response.json();
    console.log('Dashboard stats reçues:', data); // Log pour débogage
    return data;
  } catch (error) {
    console.error('Erreur getDashboardStats:', error);
    // Valeurs par défaut en cas d'erreur
    return {
      published: 0,
      drafts: 0,
      viewsThisMonth: 0
    };
  }
}

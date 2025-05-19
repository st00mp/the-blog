/**
 * Type pour les statistiques du dashboard
 */
export type DashboardStats = {
  published: number;
  drafts: number;
  comments: number;
  viewsThisMonth: number;
  isAdmin?: boolean; // Indique si l'utilisateur connecté a le rôle admin
};

/**
 * Récupère les statistiques du dashboard
 */
export async function getDashboardStats(): Promise<DashboardStats> {
  try {
    // Ajout d'un paramètre cache-busting pour éviter les problèmes de mise en cache
    const timestamp = new Date().getTime();
    const response = await fetch(`/api/dashboard/stats?_t=${timestamp}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
      // Désactiver la mise en cache des navigateurs
      cache: 'no-store',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des statistiques du dashboard');
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
      comments: 0,
      viewsThisMonth: 0
    };
  }
}

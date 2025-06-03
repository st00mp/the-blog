import { NextRequest, NextResponse } from 'next/server';

/**
 * Récupérer les statistiques du dashboard
 */
export async function GET(request: NextRequest) {
  console.log('---------- Début API /api/dashboard/stats ----------');
  try {
    // Récupérer le cookie de la requête
    const cookie = request.headers.get('cookie');
    console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
    
    if (cookie) {
      // Afficher les noms des cookies sans les valeurs pour débogage
      const cookieNames = cookie.split(';').map(c => c.trim().split('=')[0]);
      console.log('Noms des cookies:', cookieNames.join(', '));
    }
    
    // URL du backend
    const backendUrl = 'http://nginx/api/dashboard/stats';
    console.log('Appel backend vers:', backendUrl);
    
    const backendRes = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}), // Transmettre les cookies exactement comme dans /api/me
      },
      cache: 'no-store', // Désactiver le cache
    });
    
    console.log('Statut de la réponse backend:', backendRes.status);
    
    if (!backendRes.ok) {
      console.log('Échec de récupération stats dashboard:', backendRes.status);
      try {
        // Essayer de lire le corps de l'erreur pour débogage
        const errorBody = await backendRes.text();
        console.log('Détails de l\'erreur backend:', errorBody.substring(0, 200));
      } catch (e) {
        console.log('Impossible de lire le corps de l\'erreur');
      }
      return NextResponse.json(
        { error: `Erreur ${backendRes.status}: ${backendRes.statusText}` },
        { status: backendRes.status }
      );
    }

    // Récupérer les données
    const data = await backendRes.json();
    console.log('Statistiques reçues du backend:', JSON.stringify(data).substring(0, 200));
    console.log('---------- Fin API /api/dashboard/stats ----------');
    
    return NextResponse.json(data);
  } catch (error) {
    console.error('Exception lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}

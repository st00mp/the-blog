import { NextRequest, NextResponse } from 'next/server';

/**
 * API de debug pour examiner la réponse du backend sur un article spécifique
 */
export async function GET(request: NextRequest) {
  console.log('---------- Début API /api/debug/article ----------');
  
  // Récupérer les paramètres de la requête
  const { searchParams } = new URL(request.url);
  const id = searchParams.get('id');
  const status = searchParams.get('status') || '0'; // Par défaut, chercher les brouillons
  
  console.log(`Debug - Recherche article ID: ${id}, Status: ${status}`);
  
  // Récupérer le cookie de la requête
  const cookie = request.headers.get('cookie');
  console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
  
  if (cookie) {
    // Afficher les noms des cookies sans les valeurs pour débogage
    const cookieNames = cookie.split(';').map(c => c.trim().split('=')[0]);
    console.log('Noms des cookies:', cookieNames.join(', '));
  }
  
  try {
    // Essayer l'appel direct au backend
    const backendUrl = `http://nginx/api/articles/${id}?status=${status}`;
    console.log('Appel backend vers:', backendUrl);
    
    const backendRes = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      cache: 'no-store',
    });
    
    console.log('Statut de la réponse backend:', backendRes.status);
    
    // Essayer de lire le corps de la réponse, qu'elle soit réussie ou non
    let responseBody;
    try {
      responseBody = await backendRes.text();
      console.log('Corps de la réponse backend:', responseBody.substring(0, 300) + '...');
    } catch (e) {
      console.log('Impossible de lire le corps de la réponse');
      responseBody = 'Erreur de lecture du corps';
    }
    
    // Tester avec un autre endpoint pour vérifier l'authentification
    const meUrl = 'http://nginx/api/me';
    console.log('Test d\'authentification via:', meUrl);
    
    const meRes = await fetch(meUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      cache: 'no-store',
    });
    
    console.log('Statut de la réponse /api/me:', meRes.status);
    
    let meBody = 'Non disponible';
    try {
      meBody = await meRes.text();
      console.log('Corps de la réponse /api/me:', meBody.substring(0, 100) + '...');
    } catch (e) {
      console.log('Impossible de lire le corps de /api/me');
    }
    
    // Tester l'API des articles pour voir si l'article existe dans la liste
    const articlesUrl = `http://nginx/api/articles?status=${status}`;
    console.log('Test de liste des articles:', articlesUrl);
    
    const articlesRes = await fetch(articlesUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      cache: 'no-store',
    });
    
    console.log('Statut de la réponse articles:', articlesRes.status);
    
    let articlesBody = 'Non disponible';
    try {
      articlesBody = await articlesRes.text();
      console.log('Corps de la réponse articles:', articlesBody.substring(0, 300) + '...');
    } catch (e) {
      console.log('Impossible de lire le corps de articles');
    }
    
    // Renvoyer toutes les informations de débogage
    return NextResponse.json({
      id,
      status,
      backend: {
        url: backendUrl,
        status: backendRes.status,
        body: responseBody,
      },
      auth: {
        url: meUrl,
        status: meRes.status,
        body: meBody,
      },
      articles: {
        url: articlesUrl,
        status: articlesRes.status,
        body: articlesBody,
      }
    });
    
  } catch (error) {
    console.error('Erreur de débogage:', error);
    return NextResponse.json(
      { error: 'Erreur lors du débogage' },
      { status: 500 }
    );
  }
}

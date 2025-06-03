import { NextResponse } from 'next/server';

export async function GET(request: Request) {
  console.log('---------- Début API /api/me ----------');
  console.log('Requête de vérification de session reçue');
  
  try {
    // Récupérer le cookie de la requête
    const cookie = request.headers.get('cookie');
    console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
    if (cookie) {
      // Afficher les noms des cookies sans les valeurs pour débogage
      const cookieNames = cookie.split(';').map(c => c.trim().split('=')[0]);
      console.log('Noms des cookies:', cookieNames.join(', '));
    }

    // URL du backend pour la vérification
    const backendUrl = 'http://nginx/api/me';
    console.log('Appel backend vers:', backendUrl);
    
    // Appeler le backend Symfony via nginx pour vérifier l'utilisateur connecté
    const backendRes = await fetch(backendUrl, {
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}), // Transmettre les cookies
      },
    });

    console.log('Statut de la réponse backend:', backendRes.status);
    
    // Si la requête backend échoue, on considère l'utilisateur comme non connecté
    if (!backendRes.ok) {
      console.log('Échec de vérification session backend:', backendRes.status);
      try {
        // Essayer de lire le corps de l'erreur pour débogage
        const errorBody = await backendRes.text();
        console.log('Détails de l\'erreur backend:', errorBody.substring(0, 200) + '...');
      } catch (e) {
        console.log('Impossible de lire le corps de l\'erreur');
      }
      return NextResponse.json({ user: null }, { status: 401 });
    }

    // Récupérer les données utilisateur du backend
    const userData = await backendRes.json();
    console.log('Réponse backend complète:', JSON.stringify(userData).substring(0, 200) + '...');
    console.log('Utilisateur authentifié via API:', userData?.user?.email || 'Données incomplètes');

    // Retourner les données utilisateur au frontend
    return NextResponse.json(userData);
  } catch (error) {
    console.error('Erreur lors de la vérification de session:', error);
    return NextResponse.json({ user: null }, { status: 500 });
  }
}

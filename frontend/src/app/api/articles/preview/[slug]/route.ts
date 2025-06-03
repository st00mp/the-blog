import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  console.log('---------- Début API /api/articles/preview/[slug] ----------');
  const { slug } = params;
  console.log(`Prévisualisation article avec slug: ${slug}`);
  
  // Récupérer le cookie de la requête
  const cookie = request.headers.get('cookie');
  console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
  if (cookie) {
    // Afficher les noms des cookies sans les valeurs pour débogage
    const cookieNames = cookie.split(';').map(c => c.trim().split('=')[0]);
    console.log('Noms des cookies:', cookieNames.join(', '));
  }

  try {
    // Construire l'URL pour l'API backend en ajoutant le paramètre status=0 pour permettre
    // de voir les brouillons
    const url = `http://nginx/api/articles/${slug}?status=0`;
    console.log('Appel backend vers:', url);
    
    // Appel à l'API du backend avec les cookies de l'utilisateur pour l'authentification
    const response = await fetch(url, {
      cache: 'no-store', // Désactiver le cache
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}), // Transmettre les cookies
      },
    });

    console.log('Statut de la réponse backend:', response.status);

    if (!response.ok) {
      console.log(`Échec de prévisualisation article slug ${slug}:`, response.status);
      
      try {
        // Essayer de lire le corps de l'erreur pour débogage
        const errorBody = await response.text();
        console.log('Détails de l\'erreur backend:', errorBody.substring(0, 200) + '...');
      } catch (e) {
        console.log('Impossible de lire le corps de l\'erreur');
      }
      
      return NextResponse.json(
        { error: `Une erreur est survenue lors de la récupération de l'article: ${response.statusText}` },
        { status: response.status }
      );
    }

    // Récupérer les données de l'article
    const data = await response.json();
    console.log(`Données article slug ${slug} reçues avec succès pour prévisualisation`);
    
    // Renvoyer les données de l'article
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article slug ${slug} en mode prévisualisation:`, error);
    return NextResponse.json(
      { error: 'Erreur lors de la prévisualisation de l\'article' },
      { status: 500 }
    );
  }
}

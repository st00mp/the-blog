import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('---------- Début API /api/articles/[id]/edit ----------');
  const { id } = await Promise.resolve(params);
  console.log(`Récupération de l'article pour édition - ID: ${id}`);
  
  // Récupérer les paramètres de la requête
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '-1'; // -1 = tous les statuts
  console.log(`Paramètre status demandé: ${status}`);
  
  // Récupérer le cookie pour l'authentification
  const cookie = request.headers.get('cookie');
  console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
  
  try {
    // Construire l'URL pour l'API backend avec le paramètre status pour récupérer aussi les brouillons
    const url = `http://nginx/api/articles/${id}?status=${status}`;
    console.log('Appel backend vers:', url);
    
    const response = await fetch(url, {
      cache: 'no-store', // Désactiver le cache
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}), // Transmettre les cookies pour l'authentification
      },
    });

    console.log('Statut de la réponse backend:', response.status);

    if (!response.ok) {
      console.log(`Échec de récupération article ID ${id}:`, response.status);
      
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

    const data = await response.json();
    console.log(`Données article ID ${id} reçues avec succès pour édition`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}

import { NextResponse } from 'next/server';

export async function PUT(
  request: Request,
  { params }: { params: { id: string } }
) {
  // Le paramètre id est utilisé comme slug pour l'API backend
  const { id } = await Promise.resolve(params);
  const cookie = request.headers.get('cookie');
  const body = await request.text();
  
  try {
    // Le backend attend un slug, pas un ID numérique
    const url = `http://nginx/api/articles/${id}`;
    
    const response = await fetch(url, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body,
    });
    
    const data = await response.json();
    return new Response(JSON.stringify(data), { status: response.status });
  } catch (error) {
    console.error(`Erreur lors de la mise à jour de l'article avec slug ${id}:`, error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la mise à jour de l\'article' }),
      { status: 500 }
    );
  }
}

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('---------- Début API /api/articles/[id] ----------');
  const { id } = await Promise.resolve(params);
  console.log(`Récupération article par ID: ${id}`);
  
  // Récupérer le cookie de la requête
  const cookie = request.headers.get('cookie');
  console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
  
  try {
    // Récupérer les paramètres de la requête
    const { searchParams } = new URL(request.url);
    const status = searchParams.get('status') || '1'; // 1 = publiés par défaut, 0 = brouillon
    console.log(`Paramètre status demandé: ${status}`);
    
    // Construire l'URL pour l'API backend - utiliser la route par slug mais ajouter le paramètre status
    // pour permettre de récupérer les brouillons si nécessaire
    const url = `http://nginx/api/articles/${id}?status=${status}`;
    console.log('Appel backend vers:', url);
    
    const response = await fetch(url, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
    });

    console.log('Statut de la réponse backend:', response.status);

    if (!response.ok) {
      console.log(`Échec de récupération article ID ${id}:`, response.status);
      
      try {
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
    console.log(`Données article ID ${id} reçues avec succès`);
    
    return NextResponse.json(data);
  } catch (error) {
    console.error(`Erreur lors de la récupération de l'article ID ${id}:`, error);
    return NextResponse.json(
      { error: 'Erreur serveur lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}

import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  console.log('---------- Début API /api/articles/byid/[id] ----------');
  const { id } = await Promise.resolve(params);
  console.log(`Récupération article par ID: ${id}`);
  
  // Récupérer le cookie de la requête
  const cookie = request.headers.get('cookie');
  console.log('Cookies présents:', cookie ? 'Oui' : 'Non');

  try {
    // D'abord, essayer l'appel direct au backend
    const directUrl = `http://nginx/api/articles/${id}?status=0`;
    console.log('Essai d\'appel direct au backend:', directUrl);
    
    const directResponse = await fetch(directUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {})
      },
    });

    console.log('Statut de la réponse directe:', directResponse.status);
    
    // Si l'appel direct réussit, renvoyer les données
    if (directResponse.ok) {
      const data = await directResponse.json();
      return NextResponse.json(data);
    }
    
    // Si l'appel direct échoue, essayer de récupérer l'article via la liste
    console.log('L\'appel direct a échoué, récupération via liste...');
    
    // Récupérer la liste complète des articles en brouillon
    const articlesUrl = `http://nginx/api/articles?status=0`;
    console.log('Récupération de la liste des articles:', articlesUrl);
    
    const articlesRes = await fetch(articlesUrl, {
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      cache: 'no-store',
    });
    
    if (!articlesRes.ok) {
      console.log('Échec de récupération de la liste des articles:', articlesRes.status);
      return NextResponse.json(
        { error: 'Impossible de récupérer la liste des articles' },
        { status: articlesRes.status }
      );
    }
    
    const articlesData = await articlesRes.json();
    console.log(`Liste récupérée avec ${articlesData.data?.length || 0} articles`);
    
    // Trouver l'article avec l'ID demandé
    const article = articlesData.data?.find((a: any) => a.id.toString() === id.toString());
    
    if (!article) {
      console.log(`Article avec ID ${id} non trouvé dans la liste`);
      return NextResponse.json(
        { error: 'Article non trouvé' },
        { status: 404 }
      );
    }
    
    console.log(`Article ${id} trouvé avec succès via la liste`);
    return NextResponse.json(article);
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération de l\'article' },
      { status: 500 }
    );
  }
}

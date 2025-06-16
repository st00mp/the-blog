import { NextResponse } from 'next/server';

export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  console.log('---------- Début API /api/articles/[id]/edit ----------');
  const { id } = await Promise.resolve(params);
  console.log(`Récupération de l'article pour édition - ID: ${id}`);
  
  // Vérifier que l'ID est un nombre valide
  if (isNaN(Number(id))) {
    console.error(`ID d'article invalide: ${id} (n'est pas un nombre)`);
    return NextResponse.json({ error: "ID d'article invalide" }, { status: 400 });
  }
  
  // Récupérer les paramètres de la requête
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status') || '-1'; // -1 = tous les statuts
  console.log(`Paramètre status demandé: ${status}`);
  
  // Récupérer le cookie pour l'authentification
  const cookie = request.headers.get('cookie');
  console.log('Cookies présents:', cookie ? 'Oui' : 'Non');
  
  // Déclarer la variable targetArticle en dehors du bloc try pour qu'elle soit accessible dans le bloc catch
  let targetArticle: any = null;
  
  try {
    // Débug: Vérifier s'il existe des articles avec cet ID
    const checkUrl = `http://nginx/api/articles?limit=50`;
    console.log('Vérification préliminaire - Récupération de la liste des articles:', checkUrl);
    const checkResponse = await fetch(checkUrl, {
      cache: 'no-store',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
    });
    
    if (checkResponse.ok) {
      const articlesList = await checkResponse.json();
      console.log(`Nombre d'articles récupérés pour vérification: ${articlesList.data?.length || 0}`);
      targetArticle = articlesList.data?.find((a: any) => a.id === parseInt(id) || a.id === id);
      if (targetArticle) {
        console.log(`Article ID ${id} trouvé dans la liste avec le slug: ${targetArticle.slug}`);
      } else {
        console.log(`Attention: Article ID ${id} non trouvé dans la liste!`);
      }
    }
    
    // Construire l'URL pour l'API backend avec le paramètre status pour récupérer aussi les brouillons
    // Utiliser le nouvel endpoint qui supporte la récupération par ID numérique
    const url = `http://nginx/api/article/${id}?status=${status}`;
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
        
        // Si l'erreur est 404, on va tenter une approche alternative
        if (response.status === 404) {
          console.log('Tentative alternative: récupérer les articles et filtrer par ID');
          // On a déjà récupéré la liste d'articles ci-dessus, vérifions si on a trouvé l'article
          if (targetArticle) {
            console.log(`Article ID ${id} trouvé via la liste d'articles. Utilisation du slug ${targetArticle.slug}`)
            // Utiliser l'endpoint par slug qui est fonctionnel
            const slugUrl = `http://nginx/api/articles/${targetArticle.slug}?status=${status}`;
            console.log('Appel backend alternatif vers:', slugUrl);
            
            const slugResponse = await fetch(slugUrl, {
              cache: 'no-store',
              headers: {
                'Content-Type': 'application/json',
                'Accept': 'application/json',
                ...(cookie ? { cookie } : {}),
              },
            });
            
            if (slugResponse.ok) {
              const slugData = await slugResponse.json();
              console.log(`Données article ID ${id} récupérées avec succès via slug`)
              return NextResponse.json(slugData);
            } else {
              console.log(`Échec de la tentative alternative via slug:`, slugResponse.status);
            }
          }
        }
      } catch (e) {
        console.log('Impossible de lire le corps de l\'erreur ou d\'exécuter la solution alternative:', e);
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

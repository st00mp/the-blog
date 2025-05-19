export async function GET(
  request: Request,
  { params }: { params: { slug: string } }
) {
  const { slug } = params;
  const cookie = request.headers.get('cookie');

  try {
    // Construire l'URL pour l'API backend
    const url = `http://nginx/api/articles/${slug}`;
    
    // Appel à l'API du backend avec les cookies de l'utilisateur pour l'authentification
    const response = await fetch(url, {
      headers: {
        ...(cookie ? { cookie } : {}),
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          message: `Erreur lors de la récupération de l'article: ${response.statusText}`,
        }),
        { status: response.status }
      );
    }

    // Récupérer les données de l'article
    const data = await response.json();
    
    // Renvoyer les données de l'article
    return new Response(JSON.stringify(data), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article en mode prévisualisation:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la prévisualisation de l\'article' }),
      { status: 500 }
    );
  }
}

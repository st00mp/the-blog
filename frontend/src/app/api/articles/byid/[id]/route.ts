export async function GET(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cookie = request.headers.get('cookie');

  try {
    // Construire l'URL pour l'API qui utilise l'ID et non le slug
    // Utilisation du point d'accès du backend pour obtenir un article par ID
    const url = `http://nginx/api/articles/byid/${id}`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          message: `Une erreur est survenue lors de la récupération de l'article: ${response.statusText}`,
        }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la récupération de l\'article:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la récupération de l\'article' }),
      { status: 500 }
    );
  }
}

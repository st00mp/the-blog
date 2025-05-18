export async function PATCH(
  request: Request,
  { params }: { params: { id: string } }
) {
  const { id } = params;
  const cookie = request.headers.get('cookie');
  const body = await request.json();

  try {
    // Construire l'URL pour l'API
    const url = `http://nginx/api/articles/${id}/status`;
    
    const response = await fetch(url, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(body),
    });

    if (!response.ok) {
      return new Response(
        JSON.stringify({
          message: `Une erreur est survenue lors de la mise à jour du statut de l'article: ${response.statusText}`,
        }),
        { status: response.status }
      );
    }

    const data = await response.json();
    return new Response(JSON.stringify(data), { status: 200 });
  } catch (error) {
    console.error('Erreur lors de la mise à jour du statut:', error);
    return new Response(
      JSON.stringify({ message: 'Erreur lors de la mise à jour du statut' }),
      { status: 500 }
    );
  }
}

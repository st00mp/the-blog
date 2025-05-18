export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const status = searchParams.get('status');
  const search = searchParams.get('search');
  const cookie = request.headers.get('cookie');

  // Construire l'URL avec les paramètres - on utilise authorId=current pour indiquer l'utilisateur connecté
  let url = new URL('http://nginx/api/articles');
  url.searchParams.append('authorId', 'current'); // Filtre pour obtenir uniquement les articles de l'utilisateur connecté
  if (status && status !== 'all') url.searchParams.append('status', status);
  if (search) url.searchParams.append('search', search);
  
  const res = await fetch(url.toString(), {
    headers: {
      ...(cookie ? { cookie } : {}),
    },
  });

  const data = await res.json();
  return new Response(JSON.stringify(data), { status: res.status });
}

export async function POST(request: Request) {
    const body = await request.text();
    const cookie = request.headers.get('cookie'); // récupère les cookies du client

    const res = await fetch('http://nginx/api/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            ...(cookie ? { cookie } : {}), // forward le cookie s'il existe
        },
        body,
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
}

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const search = searchParams.get('search');
    const category = searchParams.get('category');
    const page = searchParams.get('page') || '1';
    const status = searchParams.get('status');
    const limit = searchParams.get('limit');
    const authorId = searchParams.get('author_id'); // Nouveau paramètre pour filtrer par auteur
    const cookie = request.headers.get('cookie'); // Récupère les cookies du client
    
    let url = new URL('http://nginx/api/articles');
    if (search) url.searchParams.append('search', search);
    if (category) url.searchParams.append('category', category);
    if (status && status !== 'all') url.searchParams.append('status', status);
    if (authorId) url.searchParams.append('author_id', authorId);
    if (limit) url.searchParams.append('limit', limit);
    url.searchParams.append('page', page);
    
    const res = await fetch(url.toString(), {
        cache: 'no-store', // Désactiver le cache
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
            ...(cookie ? { cookie } : {}), // Transmettre le cookie s'il existe
        },
    });

    if (!res.ok) {
        return new Response(JSON.stringify({ error: 'Failed to fetch articles' }), { 
            status: res.status,
            headers: { 'Content-Type': 'application/json' }
        });
    }

    const data = await res.json();
    return new Response(JSON.stringify(data), { 
        status: 200,
        headers: { 'Content-Type': 'application/json' }
    });
}
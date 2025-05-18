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
    
    let url = new URL('http://nginx/api/articles');
    if (search) url.searchParams.append('search', search);
    if (category) url.searchParams.append('category', category);
    url.searchParams.append('page', page);
    
    const res = await fetch(url.toString(), {
        next: { revalidate: 60 },
        headers: {
            'Content-Type': 'application/json',
            'Accept': 'application/json',
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
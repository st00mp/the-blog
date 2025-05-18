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
    const cookie = request.headers.get('cookie');
    const res = await fetch('http://nginx/api/articles', {
        headers: {
            ...(cookie ? { cookie } : {}),
        },
        next: { revalidate: 60 },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
}
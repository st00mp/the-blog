export async function POST(request: Request) {
    const body = await request.text();

    const res = await fetch('http://nginx/api/articles', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body,
    });

    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
}
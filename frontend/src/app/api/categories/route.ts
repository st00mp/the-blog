export async function GET(request: Request) {
    const cookie = request.headers.get('cookie');
    const res = await fetch('http://nginx/api/categories', {
        headers: {
            ...(cookie ? { cookie } : {}),
        },
    });
    const data = await res.json();
    return new Response(JSON.stringify(data), { status: res.status });
}
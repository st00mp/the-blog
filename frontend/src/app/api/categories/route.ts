export async function GET() {
    const res = await fetch('http://nginx/api/categories')
    const data = await res.json()
    return new Response(JSON.stringify(data), { status: res.status })
}
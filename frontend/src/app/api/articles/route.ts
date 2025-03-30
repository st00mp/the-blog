// app/api/articles/route.ts

import { NextResponse } from "next/server";

export async function POST(req: Request) {
    const body = await req.json();

    console.log("[API POST /api/articles] payload:", body);

    // Tu peux faire un appel à ton backend Symfony ici
    // await fetch("https://ton-backend/article", { method: 'POST', body: JSON.stringify(body), ... });

    return NextResponse.json({ success: true });
}

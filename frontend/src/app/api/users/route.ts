import { NextRequest, NextResponse } from 'next/server'

export async function GET(request: Request) {
  try {
    const cookie = request.headers.get('cookie');
    const res = await fetch('http://nginx/api/users', {
      headers: {
        ...(cookie ? { cookie } : {}),
      },
    })

    if (!res.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs')
    }

    const data = await res.json()
    return NextResponse.json(data)
  } catch (error) {
    console.error('Erreur API:', error)
    return NextResponse.json(
      { error: 'Erreur lors de la récupération des utilisateurs' },
      { status: 500 }
    )
  }
}

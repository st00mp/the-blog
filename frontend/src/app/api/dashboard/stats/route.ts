import { NextRequest, NextResponse } from 'next/server';

/**
 * Récupérer les statistiques du dashboard
 */
export async function GET(request: NextRequest) {
  try {
    const cookie = request.headers.get('cookie');
    
    const response = await fetch('http://nginx/api/dashboard/stats', {
      headers: {
        ...(cookie ? { cookie } : {}),
      },
    });
    
    if (!response.ok) {
      return NextResponse.json(
        { error: 'Une erreur est survenue lors de la récupération des statistiques' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    console.log('Dashboard stats from API:', data); // Log pour débogage
    return NextResponse.json(data);
  } catch (error) {
    console.error('Erreur lors de la récupération des statistiques:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la récupération des statistiques' },
      { status: 500 }
    );
  }
}

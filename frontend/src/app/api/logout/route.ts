// route.ts - Route de déconnexion unifiée pour Next.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  try {
    // 1. Appeler le backend Symfony pour déconnecter la session côté serveur
    try {
      console.log('Tentative de déconnexion au backend via: http://nginx/api/logout');
      const backendRes = await fetch('http://nginx/api/logout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (backendRes.ok) {
        console.log('Déconnexion backend réussie');
      } else {
        console.log('Erreur backend:', backendRes.status);
      }
    } catch (backendError) {
      console.error('Erreur lors de la déconnexion backend:', backendError);
      // Continuer même en cas d'échec du backend
    }
    
    // 2. Supprimer le cookie de session côté client
    // @ts-expect-error La méthode delete existe bien en runtime sur RequestCookies
    cookies().delete('auth_token', {
      path: '/', // Important: doit correspondre au path utilisé lors de la création
      secure: process.env.NODE_ENV === 'production',
      httpOnly: true, // Si le cookie est httpOnly
    });
    
    console.log('Suppression du cookie client réussie');
    
    // Réponse de succès
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Erreur globale lors de la déconnexion:', error);
    return NextResponse.json({ success: false, error: 'Erreur lors de la déconnexion' }, { status: 500 });
  }
}

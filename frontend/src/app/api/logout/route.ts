// route.ts - Route de déconnexion pour Next.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Récupérer l'instance des cookies
  const cookieStore = cookies();

  // Supprimer le cookie de session en spécifiant les mêmes attributs que lors de sa création
  // @ts-expect-error La méthode delete existe bien en runtime sur RequestCookies
  cookieStore.delete('auth_token', {
    path: '/', // Important: doit correspondre au path utilisé lors de la création
    secure: process.env.NODE_ENV === 'production',
    httpOnly: true, // Si le cookie est httpOnly
  });

  // Réponse de succès
  return NextResponse.json({ success: true });
}

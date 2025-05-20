// route.ts - Route de déconnexion pour Next.js
import { cookies } from 'next/headers';
import { NextResponse } from 'next/server';

export async function POST() {
  // Récupérer l'instance des cookies
  const cookieStore = cookies();
  
  // Supprimer le cookie de session
  cookieStore.delete('auth_token');
  
  // Réponse de succès
  return NextResponse.json({ success: true });
}

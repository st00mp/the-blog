import { NextRequest, NextResponse } from 'next/server';

/**
 * Modifier un commentaire (PUT)
 */
export async function PUT(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const requestData = await request.json();
    const cookie = request.headers.get('cookie');
    
    const response = await fetch(`http://nginx/api/comments/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
      body: JSON.stringify(requestData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      return NextResponse.json(
        { error: errorData.error || 'Une erreur est survenue lors de la modification du commentaire' },
        { status: response.status }
      );
    }
    
    const data = await response.json();
    return NextResponse.json(data);
  } catch (error: any) {
    console.error('Erreur lors de la modification du commentaire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la modification du commentaire' },
      { status: 500 }
    );
  }
}

/**
 * Supprimer un commentaire (DELETE)
 */
export async function DELETE(
  request: NextRequest,
  { params }: { params: { id: string } }
) {
  try {
    const id = params.id;
    const cookie = request.headers.get('cookie');
    
    const response = await fetch(`http://nginx/api/comments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        ...(cookie ? { cookie } : {}),
      },
    });
    
    if (!response.ok) {
      const errorData = await response.json().catch(() => ({}));
      return NextResponse.json(
        { error: errorData.error || 'Une erreur est survenue lors de la suppression du commentaire' },
        { status: response.status }
      );
    }
    
    return new NextResponse(null, { status: 204 });
  } catch (error: any) {
    console.error('Erreur lors de la suppression du commentaire:', error);
    return NextResponse.json(
      { error: 'Une erreur est survenue lors de la suppression du commentaire' },
      { status: 500 }
    );
  }
}

export type User = {
  id: string;
  name: string;
  email: string;
  role: string;
  lastLogin: string | null;
  createdAt?: string;
};

export async function getUsers(): Promise<User[]> {
  try {
    const response = await fetch('/api/users', {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include',
    });

    if (!response.ok) {
      throw new Error('Erreur lors de la récupération des utilisateurs');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur getUsers:', error);
    throw error;
  }
}

export async function updateUserRole(userId: string, role: string): Promise<User> {
  try {
    const response = await fetch(`/api/users/${userId}/role`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ role }),
      credentials: 'include',
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || 'Erreur lors de la mise à jour du rôle');
    }

    return await response.json();
  } catch (error) {
    console.error('Erreur updateUserRole:', error);
    throw error;
  }
}

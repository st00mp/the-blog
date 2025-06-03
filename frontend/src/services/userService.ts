// Interface User simplifiée pour un administrateur unique
export type User = {
  id: string;
  email: string;
  avatar?: string; // Pour compatibilité avec le composant UserNav
};

// Remarque: Les fonctions getUsers, updateUserRole et importUsersFromCSV ont été supprimées
// car elles ne sont plus nécessaires dans un système avec un seul administrateur

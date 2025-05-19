"use client";

import { createContext, useContext, useState, ReactNode, useCallback } from "react";

// Types d'actions qui peuvent déclencher un rafraîchissement
export type ArticleAction = 
  | "create" 
  | "edit" 
  | "delete" 
  | "publish" 
  | "draft";

// Interface du contexte
interface ArticleActionsContextType {
  // Fonction pour enregistrer une action terminée
  registerAction: (action: ArticleAction) => void;
  
  // Fonction pour vérifier si une action a été effectuée et réinitialiser le flag
  shouldRefresh: () => boolean;
  
  // État actuel
  lastAction: ArticleAction | null;
}

// Création du contexte avec des valeurs par défaut
const ArticleActionsContext = createContext<ArticleActionsContextType>({
  registerAction: () => {},
  shouldRefresh: () => false,
  lastAction: null,
});

// Hook pour utiliser le contexte
export const useArticleActions = () => useContext(ArticleActionsContext);

// Provider du contexte
export function ArticleActionsProvider({ children }: { children: ReactNode }) {
  // État pour suivre la dernière action effectuée
  const [lastAction, setLastAction] = useState<ArticleAction | null>(null);
  // Flag pour indiquer si un rafraîchissement est nécessaire
  const [needsRefresh, setNeedsRefresh] = useState(false);

  // Enregistre une action qui a été effectuée
  const registerAction = useCallback((action: ArticleAction) => {
    console.log(`Action effectuée: ${action}`);
    setLastAction(action);
    setNeedsRefresh(true);
  }, []);

  // Vérifie s'il faut rafraîchir les données et réinitialise le flag
  const shouldRefresh = useCallback(() => {
    if (needsRefresh) {
      setNeedsRefresh(false);
      return true;
    }
    return false;
  }, [needsRefresh]);

  return (
    <ArticleActionsContext.Provider value={{ registerAction, shouldRefresh, lastAction }}>
      {children}
    </ArticleActionsContext.Provider>
  );
}

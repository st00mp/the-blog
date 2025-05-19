"use client";

import { useCallback } from "react";
import { updateArticleStatus, Article, deleteArticle } from "@/services/articleService";
import { useArticleActions } from "@/contexts/ArticleActionsContext";
import { useRouter } from "next/navigation";
import { useToast } from "@/components/ui/use-toast";

export function useArticleHelpers() {
  const { registerAction } = useArticleActions();
  const router = useRouter();
  const { toast } = useToast();

  // Fonction pour la publication d'un article
  const publishArticle = useCallback(async (article: Article) => {
    try {
      await updateArticleStatus(article.id, 'published');
      registerAction('publish');
      return true;
    } catch (error) {
      console.error("Erreur lors de la publication:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de publier l'article."
      });
      return false;
    }
  }, [registerAction, toast]);

  // Fonction pour remettre un article en brouillon
  const unpublishArticle = useCallback(async (article: Article) => {
    try {
      await updateArticleStatus(article.id, 'draft');
      registerAction('draft');
      return true;
    } catch (error) {
      console.error("Erreur lors du passage en brouillon:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre l'article en brouillon."
      });
      return false;
    }
  }, [registerAction, toast]);

  // Fonction pour supprimer un article
  const removeArticle = useCallback(async (article: Article) => {
    try {
      await deleteArticle(article.id, article.slug);
      registerAction('delete');
      return true;
    } catch (error) {
      console.error("Erreur lors de la suppression:", error);
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de supprimer l'article."
      });
      return false;
    }
  }, [registerAction, toast]);

  // Fonction pour naviguer vers la page d'édition
  const editArticle = useCallback((article: Article) => {
    router.push(`/editor/articles/${article.id}`);
  }, [router]);

  return {
    publishArticle,
    unpublishArticle,
    removeArticle,
    editArticle
  };
}

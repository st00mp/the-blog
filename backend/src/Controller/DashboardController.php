<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class DashboardController extends AbstractController
{
    private $entityManager;
    
    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }
    
    /**
     * Endpoint pour récupérer les statistiques du dashboard
     * 
     * Filtre les statistiques selon l'utilisateur connecté :
     * - Admin: voit toutes les statistiques
     * - Auteur: voit uniquement ses propres statistiques
     */
    #[Route('/api/dashboard/stats', name: 'api_dashboard_stats', methods: ['GET'])]
    public function getDashboardStats(): JsonResponse
    {
        try {
            // Vérifier si l'utilisateur est connecté
            $user = $this->getUser();
            if (!$user || !$user instanceof User) {
                throw new AccessDeniedException('Vous devez être connecté pour accéder à cette ressource');
            }
            
            // Déterminer si l'utilisateur est un admin
            $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());
            
            // Construire des requêtes avec filtres pour l'utilisateur connecté
            // Dans tous les cas, on filtre par l'auteur connecté (même pour les admins)
            $qbPublished = $this->entityManager->createQueryBuilder()
                ->select('COUNT(a.id)')
                ->from(Article::class, 'a')
                ->where('a.status = 1') // 1 = publié
                ->andWhere('a.author = :userId')
                ->setParameter('userId', $user->getId());
                
            $qbDrafts = $this->entityManager->createQueryBuilder()
                ->select('COUNT(a.id)')
                ->from(Article::class, 'a')
                ->where('a.status = 0') // 0 = brouillon
                ->andWhere('a.author = :userId')
                ->setParameter('userId', $user->getId());
                
            // Pour les commentaires, récupérer uniquement ceux postés sur les articles de l'auteur
            $qbComments = $this->entityManager->createQueryBuilder()
                ->select('COUNT(c.id)')
                ->from(Comment::class, 'c')
                ->innerJoin('c.article', 'a')
                ->andWhere('a.author = :userId')
                ->setParameter('userId', $user->getId());
            
            // Exécuter les requêtes
            $publishedCount = $qbPublished->getQuery()->getSingleScalarResult();
            $draftsCount = $qbDrafts->getQuery()->getSingleScalarResult();
            $commentsCount = $qbComments->getQuery()->getSingleScalarResult();
            
            // Simuler temporairement les vues ce mois-ci (à remplacer par une vraie implémentation si nécessaire)
            $viewsThisMonth = 1234;
            
            return new JsonResponse([
                'published' => (int)$publishedCount,
                'drafts' => (int)$draftsCount,
                'comments' => (int)$commentsCount,
                'viewsThisMonth' => $viewsThisMonth,
                'isAdmin' => $isAdmin, // Indiquer dans la réponse si l'utilisateur est admin
                'recentActivity' => $this->getRecentActivities($user->getId())
            ]);
        } catch (AccessDeniedException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 403);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la récupération des statistiques'], 500);
        }
    }
    
    /**
     * Récupère les activités récentes pour un utilisateur
     */
    private function getRecentActivities(int $userId): array
    {
        $activities = [];
        
        // 1. Articles récemment publiés par l'utilisateur (max 3)
        $recentPublishedArticles = $this->entityManager->createQueryBuilder()
            ->select('a')
            ->from(Article::class, 'a')
            ->where('a.author = :userId')
            ->andWhere('a.status = 1') // 1 = publié
            ->setParameter('userId', $userId)
            ->orderBy('a.updated_at', 'DESC')
            ->setMaxResults(3)
            ->getQuery()
            ->getResult();
        
        foreach ($recentPublishedArticles as $article) {
            $timeAgo = $this->getTimeAgo($article->getUpdatedAt());
            $activities[] = [
                'type' => 'article_published',
                'color' => 'blue',
                'message' => sprintf('Votre article <strong>"%s"</strong> a été publié %s.', 
                                    $article->getTitle(), 
                                    $timeAgo),
                'date' => $article->getUpdatedAt()->format('c')
            ];
        }
        
        // 2. Commentaires récents sur les articles de l'utilisateur (max 3)
        $recentComments = $this->entityManager->createQueryBuilder()
            ->select('c', 'a')
            ->from(Comment::class, 'c')
            ->join('c.article', 'a')
            ->where('a.author = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('c.created_at', 'DESC')
            ->setMaxResults(3)
            ->getQuery()
            ->getResult();
        
        foreach ($recentComments as $comment) {
            $timeAgo = $this->getTimeAgo($comment->getCreatedAt());
            $activities[] = [
                'type' => 'new_comment',
                'color' => 'purple',
                'message' => sprintf('Nouveau commentaire sur <strong>"%s"</strong> %s.', 
                                    $comment->getArticle()->getTitle(), 
                                    $timeAgo),
                'date' => $comment->getCreatedAt()->format('c')
            ];
        }
        
        // 3. Brouillons récents (max 2)
        $recentDrafts = $this->entityManager->createQueryBuilder()
            ->select('a')
            ->from(Article::class, 'a')
            ->where('a.author = :userId')
            ->andWhere('a.status = 0') // 0 = brouillon
            ->setParameter('userId', $userId)
            ->orderBy('a.updated_at', 'DESC')
            ->setMaxResults(2)
            ->getQuery()
            ->getResult();
        
        foreach ($recentDrafts as $draft) {
            $timeAgo = $this->getTimeAgo($draft->getUpdatedAt());
            $activities[] = [
                'type' => 'draft_updated',
                'color' => 'yellow',
                'message' => sprintf('Votre brouillon <strong>"%s"</strong> a été mis à jour %s.', 
                                     $draft->getTitle(), 
                                     $timeAgo),
                'date' => $draft->getUpdatedAt()->format('c')
            ];
        }
        
        // Trier toutes les activités par date (la plus récente en premier)
        usort($activities, function($a, $b) {
            $dateA = new \DateTime($a['date']);
            $dateB = new \DateTime($b['date']);
            return $dateB <=> $dateA; // Tri décroissant
        });
        
        // Limiter à 5 activités maximum
        return array_slice($activities, 0, 5);
    }
    
    /**
     * Retourne une chaîne de texte "il y a X temps" en français
     */
    private function getTimeAgo(\DateTimeInterface $date): string
    {
        $now = new \DateTime();
        $diff = $now->diff($date);
        
        if ($diff->y > 0) {
            return $diff->y > 1 ? "il y a {$diff->y} ans" : "il y a 1 an";
        }
        
        if ($diff->m > 0) {
            return $diff->m > 1 ? "il y a {$diff->m} mois" : "il y a 1 mois";
        }
        
        if ($diff->d > 0) {
            return $diff->d > 1 ? "il y a {$diff->d} jours" : "hier";
        }
        
        if ($diff->h > 0) {
            return $diff->h > 1 ? "il y a {$diff->h} heures" : "il y a 1 heure";
        }
        
        if ($diff->i > 0) {
            return $diff->i > 1 ? "il y a {$diff->i} minutes" : "il y a 1 minute";
        }
        
        return "il y a quelques instants";
    }
}

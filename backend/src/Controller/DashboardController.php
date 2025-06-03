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
            error_log('Appel /api/dashboard/stats - utilisateur présent: ' . ($user ? 'oui' : 'non'));

            if (!$user || !$user instanceof User) {
                error_log('Erreur: Utilisateur non connecté ou invalide');
                throw new AccessDeniedException('Vous devez être connecté pour accéder à cette ressource');
            }

            // Debug - vérifier le rôle de l'utilisateur (une seule chaîne de caractères)
            try {
                $role = $user->getRole();
                error_log('Rôle utilisateur: ' . $role);
                
                // Déterminer si l'utilisateur est un admin
                $isAdmin = $role === 'ROLE_ADMIN';
            } catch (\Exception $e) {
                error_log('Erreur lors de la récupération du rôle: ' . $e->getMessage());
                // Fallback: essayer la méthode standard de Symfony
                $roles = $user->getRoles();
                $role = !empty($roles) ? $roles[0] : '';
                error_log('Fallback - Rôles via getRoles(): ' . implode(', ', $roles));
                $isAdmin = in_array('ROLE_ADMIN', $roles);
            }
            error_log('isAdmin: ' . ($isAdmin ? 'true' : 'false'));

            // Requêtes pour obtenir les statistiques réelles
            error_log('Récupération des statistiques réelles');
            
            // Récupérer l'ID de l'utilisateur
            $userId = $user->getId();
            
            // Requête pour les articles publiés (status = 1)
            $qb = $this->entityManager->createQueryBuilder()
                ->select('COUNT(a.id)')
                ->from(Article::class, 'a')
                ->where('a.status = 1');
                
            if (!$isAdmin) {
                $qb->andWhere('a.author = :userId')
                   ->setParameter('userId', $userId);
            }
            
            $publishedCount = $qb->getQuery()->getSingleScalarResult();
                
            // Requête pour les brouillons (status = 0)
            $qb = $this->entityManager->createQueryBuilder()
                ->select('COUNT(a.id)')
                ->from(Article::class, 'a')
                ->where('a.status = 0');
                
            if (!$isAdmin) {
                $qb->andWhere('a.author = :userId')
                   ->setParameter('userId', $userId);
            }
            
            $draftsCount = $qb->getQuery()->getSingleScalarResult();
            
            // Récupérer les activités récentes si nécessaire
            $recentActivity = $this->getRecentActivities($userId);
            
            error_log(sprintf('Articles publiés: %d, Brouillons: %d', $publishedCount, $draftsCount));
            
            return new JsonResponse([
                'published' => (int)$publishedCount,
                'drafts' => (int)$draftsCount,
                'viewsThisMonth' => 1234, // Valeur fixe pour les vues comme demandé
                'isAdmin' => $isAdmin,
                'recentActivity' => $recentActivity
            ]);
        } catch (AccessDeniedException $e) {
            error_log('Accès refusé: ' . $e->getMessage());
            return new JsonResponse(['error' => $e->getMessage()], 403);
        } catch (\Exception $e) {
            error_log('Exception dans getDashboardStats: ' . $e->getMessage());
            error_log('Trace: ' . $e->getTraceAsString());
            // Retourner le message d'erreur réel pour le débogage
            return new JsonResponse(['error' => 'Erreur serveur: ' . $e->getMessage()], 500);
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
                'message' => sprintf(
                    'Votre article <strong>"%s"</strong> a été publié %s.',
                    $article->getTitle(),
                    $timeAgo
                ),
                'date' => $article->getUpdatedAt()->format('c')
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
                'message' => sprintf(
                    'Votre brouillon <strong>"%s"</strong> a été mis à jour %s.',
                    $draft->getTitle(),
                    $timeAgo
                ),
                'date' => $draft->getUpdatedAt()->format('c')
            ];
        }

        // Trier toutes les activités par date (la plus récente en premier)
        usort($activities, function ($a, $b) {
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

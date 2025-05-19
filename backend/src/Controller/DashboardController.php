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
                'isAdmin' => $isAdmin // Indiquer dans la réponse si l'utilisateur est admin
            ]);
        } catch (AccessDeniedException $e) {
            return new JsonResponse(['error' => $e->getMessage()], 403);
        } catch (\Exception $e) {
            return new JsonResponse(['error' => 'Une erreur est survenue lors de la récupération des statistiques'], 500);
        }
    }
}

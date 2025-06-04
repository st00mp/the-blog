<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Annotation\Route;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;

class DashboardController extends AbstractController
{
    private EntityManagerInterface $entityManager;

    public function __construct(EntityManagerInterface $entityManager)
    {
        $this->entityManager = $entityManager;
    }

    #[Route('/api/dashboard/stats', name: 'api_dashboard_stats')]
    public function getDashboardStats(): JsonResponse
    {
        try {
            // 1. Vérifier l'authentification et obtenir l'utilisateur courant
            $user = $this->getUser();
            if (!$user || !($user instanceof User)) {
                throw new AccessDeniedException('Non autorisé: Utilisateur non authentifié.');
            }

            $userId = $user->getId();
            $isAdmin = in_array('ROLE_ADMIN', $user->getRoles());

            // 2. Compter les articles par statut pour l'utilisateur
            $publishedArticlesCount = $this->countArticlesByStatus($userId, Article::STATUS_PUBLISHED);
            $draftsCount = $this->countArticlesByStatus($userId, Article::STATUS_DRAFT);
            $publishedCount = $publishedArticlesCount;

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
     * Nouvelle implémentation avec déduplication stricte des événements
     */
    private function getRecentActivities(int $userId): array
    {
        $activities = [];
        $uniqueEventTracker = []; // Pour suivre les événements déjà traités

        // Charger tous les articles récents, quel que soit leur statut
        $allRecentArticles = $this->entityManager->createQueryBuilder()
            ->select('a')
            ->from(Article::class, 'a')
            ->where('a.author = :userId')
            ->setParameter('userId', $userId)
            ->orderBy('a.updated_at', 'DESC')
            ->setMaxResults(20) // Un pool d'articles plus grand pour extraire les événements
            ->getQuery()
            ->getResult();

        // Traiter les articles récents
        foreach ($allRecentArticles as $article) {
            // Récupérer les métadonnées de l'article
            $meta = $article->getMeta() ?? [];
            $articleId = $article->getId();

            // Traiter l'historique des événements
            if (!empty($meta['history']) && is_array($meta['history'])) {
                foreach ($meta['history'] as $historyItem) {
                    // Vérifier que l'événement a les informations minimales requises
                    if (empty($historyItem['action']) || empty($historyItem['timestamp'])) {
                        continue;
                    }

                    // Normaliser le type d'action pour la déduplication
                    // Ex: article_published et published sont considérés identiques
                    $originalAction = $historyItem['action'];
                    $normalizedAction = str_replace(['article_', 'draft_'], '', $originalAction);

                    // Traitement spécial pour les événements 'unpublished' et 'updated'
                    // Si un article est dépublié, nous ne voulons pas afficher aussi l'événement 'updated'
                    if ($normalizedAction === 'updated') {
                        // Vérifier si un événement 'unpublished' existe déjà pour cet article
                        $unpublishedKey = $articleId . '-unpublished';
                        if (isset($uniqueEventTracker[$unpublishedKey])) {
                            continue; // Ignorer les mises à jour si une dépublication existe déjà
                        }
                    }

                    // Créer une clé unique pour cet événement (par article et type normalisé)
                    $eventKey = $articleId . '-' . $normalizedAction;

                    // Vérifier si un événement du même type existe déjà pour cet article
                    // Exception pour les événements de publication - on veut toujours voir la dernière publication
                    if (isset($uniqueEventTracker[$eventKey]) && $normalizedAction !== 'published') {
                        continue; // Ignorer les doublons pour les autres types d'événements
                    }

                    // Si c'est un événement de publication et qu'on en a déjà un, on ne garde que le plus récent
                    if ($normalizedAction === 'published' && isset($uniqueEventTracker[$eventKey])) {
                        // Trouver l'événement précédent et le retirer
                        foreach ($activities as $key => $activity) {
                            if ($activity['type'] === 'article_published' && $activity['articleId'] === $articleId) {
                                unset($activities[$key]);
                                break;
                            }
                        }
                    }

                    // Marquer cet événement comme traité
                    $uniqueEventTracker[$eventKey] = true;

                    // Si c'est une dépublication, marquer aussi la clé 'updated' pour éviter les doublons
                    if ($normalizedAction === 'unpublished') {
                        // Marquer toute mise à jour comme déjà traitée pour éviter les doublons
                        $updatedKey = $articleId . '-updated';
                        $uniqueEventTracker[$updatedKey] = true;
                    }

                    // Formater la date pour l'affichage
                    $historyDate = new \DateTimeImmutable($historyItem['timestamp']);
                    $historyTimeAgo = $this->getTimeAgo($historyDate);

                    // Déterminer le type d'activité et le message en fonction de l'action
                    switch ($normalizedAction) {
                        case 'created':
                            $activities[] = [
                                'type' => 'article_created',
                                'color' => 'green',
                                'message' => sprintf(
                                    'Nouvel article <strong>"%s"</strong> créé %s.',
                                    $article->getTitle(),
                                    $historyTimeAgo
                                ),
                                'date' => $historyItem['timestamp'],
                                'articleId' => $articleId
                            ];
                            break;

                        case 'published':
                            $activities[] = [
                                'type' => 'article_published',
                                'color' => 'green',
                                'message' => sprintf(
                                    'Votre article <strong>"%s"</strong> a été publié %s.',
                                    $article->getTitle(),
                                    $historyTimeAgo
                                ),
                                'date' => $historyItem['timestamp'],
                                'articleId' => $articleId
                            ];
                            break;

                        case 'unpublished':
                            $activities[] = [
                                'type' => 'article_unpublished',
                                'color' => 'yellow',
                                'message' => sprintf(
                                    'Votre article <strong>"%s"</strong> a été remis en brouillon %s.',
                                    $article->getTitle(),
                                    $historyTimeAgo
                                ),
                                'date' => $historyItem['timestamp'],
                                'articleId' => $articleId
                            ];
                            break;

                        case 'updated':
                            // Distinguer entre update d'article et de brouillon
                            if ($originalAction === 'draft_updated') {
                                $activities[] = [
                                    'type' => 'draft_updated',
                                    'color' => 'yellow',
                                    'message' => sprintf(
                                        'Votre brouillon <strong>"%s"</strong> a été mis à jour %s.',
                                        $article->getTitle(),
                                        $historyTimeAgo
                                    ),
                                    'date' => $historyItem['timestamp'],
                                    'articleId' => $articleId
                                ];
                            } else {
                                $activities[] = [
                                    'type' => 'article_updated',
                                    'color' => 'yellow',
                                    'message' => sprintf(
                                        'Votre article <strong>"%s"</strong> a été modifié %s.',
                                        $article->getTitle(),
                                        $historyTimeAgo
                                    ),
                                    'date' => $historyItem['timestamp'],
                                    'articleId' => $articleId
                                ];
                            }
                            break;

                        case 'deleted':
                            $activities[] = [
                                'type' => 'article_deleted',
                                'color' => 'red',
                                'message' => sprintf(
                                    'L\'article <strong>"%s"</strong> a été déplacé dans la corbeille %s.',
                                    $article->getTitle(),
                                    $historyTimeAgo
                                ),
                                'date' => $historyItem['timestamp'],
                                'articleId' => $articleId
                            ];
                            break;

                        case 'restored':
                            $activities[] = [
                                'type' => 'article_restored',
                                'color' => 'green',
                                'message' => sprintf(
                                    'L\'article <strong>"%s"</strong> a été restauré depuis la corbeille %s.',
                                    $article->getTitle(),
                                    $historyTimeAgo
                                ),
                                'date' => $historyItem['timestamp'],
                                'articleId' => $articleId
                            ];
                            break;
                    }
                }
            }

            // Vérifier si l'état actuel de l'article est déjà représenté dans l'historique
            $currentStatus = $article->getStatus();

            // Extraire le dernier événement de l'historique s'il existe
            $lastEvent = !empty($meta['history']) && is_array($meta['history']) ? end($meta['history']) : null;
            $lastAction = $lastEvent ? str_replace(['article_', 'draft_'], '', $lastEvent['action']) : null;
            $lastTimestamp = $lastEvent ? new \DateTimeImmutable($lastEvent['timestamp']) : null;

            // Clés pour vérifier si l'état actuel est déjà représenté
            $publishedKey = $articleId . '-published';
            $deletedKey = $articleId . '-deleted';

            // Si le dernier événement date de moins de 10 secondes, ne pas ajouter d'état actuel
            $recentUpdate = false;
            if ($lastTimestamp) {
                $now = new \DateTimeImmutable();
                $diff = $now->getTimestamp() - $lastTimestamp->getTimestamp();
                $recentUpdate = $diff < 10; // Événement récent (moins de 10 secondes)
            }

            // Ajouter l'état actuel uniquement s'il n'est pas déjà représenté
            $timeAgo = $this->getTimeAgo($article->getUpdatedAt());

            // Toujours afficher le statut actuel si c'est publié (prioritaire)
            // sauf si on a déjà un événement publié très récent
            if (
                $currentStatus === Article::STATUS_PUBLISHED &&
                ($lastAction !== 'published' || !$recentUpdate)
            ) {
                $activities[] = [
                    'type' => 'article_published',
                    'color' => 'green',
                    'message' => sprintf(
                        'Votre article <strong>"%s"</strong> a été publié %s.',
                        $article->getTitle(),
                        $timeAgo
                    ),
                    'date' => $article->getUpdatedAt()->format('c'),
                    'articleId' => $articleId
                ];
            } elseif ($currentStatus === Article::STATUS_DELETED && !isset($uniqueEventTracker[$deletedKey])) {
                $activities[] = [
                    'type' => 'article_deleted',
                    'color' => 'red',
                    'message' => sprintf(
                        'L\'article <strong>"%s"</strong> a été déplacé dans la corbeille %s.',
                        $article->getTitle(),
                        $timeAgo
                    ),
                    'date' => $article->getUpdatedAt()->format('c'),
                    'articleId' => $articleId
                ];
            } elseif ($currentStatus === Article::STATUS_DRAFT && empty($meta['restored'])) {
                // Pour les brouillons, on affiche toujours la dernière mise à jour
                // même s'il existe déjà un événement updated,
                // sauf si c'est une dépublication récente (pour éviter les doublons)
                $updatedKey = $articleId . '-updated';
                $unpublishedKey = $articleId . '-unpublished';
                if (!$recentUpdate || (!isset($uniqueEventTracker[$unpublishedKey]))) {
                    $activities[] = [
                        'type' => 'draft_updated',
                        'color' => 'yellow',
                        'message' => sprintf(
                            'Votre brouillon <strong>"%s"</strong> a été mis à jour %s.',
                            $article->getTitle(),
                            $timeAgo
                        ),
                        'date' => $article->getUpdatedAt()->format('c'),
                        'articleId' => $articleId
                    ];
                }
            }
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
     * Compte les articles par statut
     */
    private function countArticlesByStatus(int $userId, int $status): int
    {
        return $this->entityManager->createQueryBuilder()
            ->select('COUNT(a.id)')
            ->from(Article::class, 'a')
            ->where('a.author = :userId')
            ->andWhere('a.status = :status')
            ->setParameter('userId', $userId)
            ->setParameter('status', $status)
            ->getQuery()
            ->getSingleScalarResult();
    }

    /**
     * Transforme une date en texte relatif (il y a X minutes/heures/jours)
     */
    private function getTimeAgo(\DateTimeInterface $date): string
    {
        $now = new \DateTime();
        $diff = $now->diff($date);

        if ($diff->y > 0) {
            return $diff->y . ' an' . ($diff->y > 1 ? 's' : '');
        }
        if ($diff->m > 0) {
            return 'il y a ' . $diff->m . ' mois';
        }
        if ($diff->d > 0) {
            return 'il y a ' . $diff->d . ' jour' . ($diff->d > 1 ? 's' : '');
        }
        if ($diff->h > 0) {
            return 'il y a ' . $diff->h . ' heure' . ($diff->h > 1 ? 's' : '');
        }
        if ($diff->i > 0) {
            return 'il y a ' . $diff->i . ' minute' . ($diff->i > 1 ? 's' : '');
        }

        return 'à l\'instant';
    }
}

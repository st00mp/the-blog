<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Article;
use App\Entity\ArticleMedia;
use App\Entity\Media;
use App\Entity\User;
use App\Repository\ArticleMediaRepository;
use App\Repository\UserRepository;
use App\Repository\MediaRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Throwable;
use App\Repository\CategoryRepository;

final class ArticleController extends AbstractController
{
    // Endpoint pour récupérer une liste d’articles avec filtres et pagination.
    // Supporte les paramètres facultatifs : search, category, page et limit.
    // GET /api/articles?search=mot&page=1&limit=12
    #[Route('/api/articles', name: 'api_articles', methods: ['GET'])]
    public function list(Request $request, ArticleRepository $repo): JsonResponse
    {
        // 1. Extraction des paramètres de la requête GET (avec valeurs par défaut)
        $search = $request->query->get('search', '');
        $page = (int) $request->query->get('page', 1);
        $limit = (int) $request->query->get('limit', 12);
        $categoryId = $request->query->getInt('category', 0); // 0 = pas de filtre
        // Mode mono-utilisateur: l'auteur est toujours l'administrateur (ID 1)
        $authorId = 1; // Admin fixe avec ID 1
        $status = $request->query->getInt('status', -1); // -1 = tous les statuts (0 = brouillon, 1 = publié)

        // 2. Utilisation de la méthode du repository pour obtenir les articles filtrés et paginés
        $result = $repo->findWithFilters($search, $categoryId, $authorId, $status, $page, $limit);

        // 3. Envoi de la réponse JSON avec les articles et les métadonnées
        $headers = [];

        // Si des brouillons sont demandés (status=0) ou tous les articles (status=-1), ajouter des en-têtes anti-référencement
        if ($status === 0 || $status === -1) {
            // Vérifier que l'utilisateur est authentifié (seul l'admin peut voir les brouillons)
            $user = $this->getUser();
            if ($user instanceof User && $user->getRole() === 'ROLE_ADMIN') {
                $headers['X-Robots-Tag'] = 'noindex, nofollow';
            }
        }

        return $this->json($result, 200, $headers, [
            'groups' => ['article:list', 'article:detail'],
            'json_encode_options' => JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
        ]);
    }

    // Endpoint pour récupérer le détail d’un article par son slug
    // GET /api/articles/{slug}
    #[Route('/api/articles/{slug}', name: 'api_article_detail', methods: ['GET'])]
    public function detail(Request $request, string $slug, ArticleRepository $repo): JsonResponse
    {
        // Par défaut, on récupère uniquement les articles publiés (statut 1)
        $requestedStatus = $request->query->has('status') ? $request->query->getInt('status') : 1;
        $status = 1; // Valeur par défaut: uniquement les articles publiés

        // Si un statut différent de 1 (publié) est demandé, on vérifie l'authentification
        if ($requestedStatus !== 1) {
            $user = $this->getUser();
            // Seuls les utilisateurs connectés peuvent accéder aux brouillons
            if ($user) {
                // Vérification supplémentaire pour les rôles si nécessaire
                // On pourrait ajouter une vérification pour que seul l'auteur
                // ou un admin puisse voir ses brouillons
                $status = $requestedStatus;
            } else {
                // Utilisateur non connecté : ignorer le paramètre status et n'afficher que les publiés
                $status = 1;
            }
        }

        $article = $repo->findOneBySlugWithRelations($slug, $status);
        if (!$article) {
            return $this->json(['error' => 'Article non trouvé'], 404);
        }

        // Si l'article est en brouillon, simple vérification que l'utilisateur est admin
        // Mode mono-utilisateur: seul l'administrateur peut accéder aux brouillons
        if ($article->getStatus() === 0) {
            $user = $this->getUser();
            // Vérification de type : l'IDE saura que $user est bien un App\Entity\User
            if (!$user instanceof User) {
                return $this->json(['error' => 'Utilisateur invalide'], 400);
            }
            if (!$user) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // En mode mono-utilisateur, seul l'administrateur peut accéder aux brouillons
            $isAdmin = $user->getRole() === 'ROLE_ADMIN';

            if (!$isAdmin) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // Ajouter des en-têtes anti-référencement pour les brouillons
            return $this->json($article, 200, [
                'X-Robots-Tag' => 'noindex, nofollow'
            ], ['groups' => 'article:detail']);
        }

        // Pour les articles publiés, comportement normal (sans en-têtes spéciaux)
        return $this->json($article, 200, [], ['groups' => 'article:detail']);
    }

    // Endpoint pour récupérer un article par son ID numérique (spécialement pour l'édition)
    // GET /api/article/{id}
    #[Route('/api/article/{id}', name: 'api_article_by_id', methods: ['GET'])]
    public function getArticleById(Request $request, int $id, ArticleRepository $repo): JsonResponse
    {
        if ($_ENV['APP_ENV'] === 'dev') {
            error_log("==== Début API /api/article/{id} - ID=$id ====");
        }
        
        // Récupérer le paramètre de statut
        $requestedStatus = $request->query->has('status') ? $request->query->getInt('status') : -1;
        $status = 1; // Par défaut, articles publiés uniquement
        
        if ($_ENV['APP_ENV'] === 'dev') {
            error_log("Status demandé: $requestedStatus");
        }
        
        // Si status=-1, on veut récupérer l'article quel que soit son statut (pour édition)
        if ($requestedStatus === -1) {
            $user = $this->getUser();
            // Vérifier que l'utilisateur est connecté et admin pour accéder à tous les statuts
            if ($user && $user instanceof User && $user->getRole() === 'ROLE_ADMIN') {
                $status = -1; // Tous les statuts
                if ($_ENV['APP_ENV'] === 'dev') {
                    error_log("Utilisateur admin détecté, accès à tous les statuts accordé");
                }
            } else {
                if ($_ENV['APP_ENV'] === 'dev') {
                    error_log("Utilisateur non admin, accès limité aux articles publiés");
                }
            }
        } 
        // Pour les autres statuts spécifiques (0=brouillon)
        else if ($requestedStatus !== 1) {
            $user = $this->getUser();
            if ($user && $user instanceof User && $user->getRole() === 'ROLE_ADMIN') {
                $status = $requestedStatus;
                if ($_ENV['APP_ENV'] === 'dev') {
                    error_log("Status spécifique $requestedStatus accordé à l'admin");
                }
            } else {
                if ($_ENV['APP_ENV'] === 'dev') {
                    error_log("Status spécifique $requestedStatus refusé (user non admin)");
                }
            }
        }
        
        // Récupérer l'article par ID
        if ($_ENV['APP_ENV'] === 'dev') {
            error_log("Recherche de l'article avec ID=$id et statut=$status");
        }
        $article = $repo->find($id);
        
        // Vérifier si l'article existe
        if (!$article) {
            if ($_ENV['APP_ENV'] === 'dev') {
                error_log("Article ID=$id non trouvé dans la base de données");
                // Débogage supplémentaire - lister quelques articles
                $sampleArticles = $repo->findBy([], ['id' => 'DESC'], 3);
                error_log("Exemples d'articles existants:");
                foreach ($sampleArticles as $sample) {
                    error_log("  - ID: {$sample->getId()}, Slug: {$sample->getSlug()}, Status: {$sample->getStatus()}");
                }
            }
            return $this->json(['error' => 'Article non trouvé'], 404);
        }
        
        if ($_ENV['APP_ENV'] === 'dev') {
            error_log("Article trouvé - ID: {$article->getId()}, Slug: {$article->getSlug()}, Status: {$article->getStatus()}");
        }
        
        // Si on ne veut pas tous les statuts et que l'article a un autre statut que celui demandé
        if ($status !== -1 && $article->getStatus() !== $status) {
            if ($_ENV['APP_ENV'] === 'dev') {
                error_log("Accès refusé: l'article a le statut {$article->getStatus()} mais l'accès est limité au statut $status");
            }
            // Si l'utilisateur n'est pas autorisé à voir ce statut d'article
            return $this->json(['error' => 'Article non trouvé'], 404);
        }
        
        // Si l'article est un brouillon, ajouter les en-têtes anti-référencement
        if ($article->getStatus() === 0) {
            if ($_ENV['APP_ENV'] === 'dev') {
                error_log("Renvoi de l'article (brouillon) avec en-têtes anti-référencement");
            }
            return $this->json($article, 200, [
                'X-Robots-Tag' => 'noindex, nofollow'
            ], ['groups' => 'article:detail']);
        }
        
        // Pour les articles publiés
        if ($_ENV['APP_ENV'] === 'dev') {
            error_log("Renvoi de l'article (publié) sans en-têtes spéciaux");
        }
        return $this->json($article, 200, [], ['groups' => 'article:detail']);
    }

    // Endpoint pour créer un nouvel article à partir d'un payload JSON
    // POST /api/articles
    #[Route('/api/articles', name: 'api_article_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        CategoryRepository $categoryRepo,
        MediaRepository $mediaRepo
    ): JsonResponse {
        // Tentative de création d'un article à partir des données reçues
        try {
            $data = json_decode($request->getContent(), true);
            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], 400);
            }

            // Vérifie que les données minimales sont présentes
            if (!isset($data['title']) || empty(trim($data['title']))) {
                return $this->json(['error' => 'Titre manquant ou invalide'], 400);
            }

            // 1. Récupération de la catégorie
            $categoryId = $data['category'] ?? null;
            if (!$categoryId) {
                return $this->json(['error' => 'Catégorie manquante'], 400);
            }

            $category = $categoryRepo->find($categoryId);
            if (!$category) {
                return $this->json(['error' => 'Catégorie invalide'], 400);
            }

            // 2. Hydratation de l'article
            $article = new Article();
            $article->setTitle(trim($data['title']));
            $article->setCategory($category);

            // Champs optionnels avec validation
            if (isset($data['metaTitle'])) {
                $article->setMetaTitle(trim($data['metaTitle']));
            }

            if (isset($data['metaDescription'])) {
                $article->setMetaDescription(trim($data['metaDescription']));
            }

            if (isset($data['intro'])) {
                $article->setIntro(trim($data['intro']));
            }

            // Validation du format des steps
            if (isset($data['steps']) && is_array($data['steps'])) {
                $article->setSteps($data['steps']);
            } else {
                $article->setSteps([]);
            }

            if (isset($data['quote'])) {
                $article->setQuote(trim($data['quote']));
            }

            if (isset($data['conclusionTitle'])) {
                $article->setConclusionTitle(trim($data['conclusionTitle']));
            }

            if (isset($data['conclusionDescription']) && is_array($data['conclusionDescription'])) {
                $article->setConclusionDescription($data['conclusionDescription']);
            }

            if (isset($data['ctaDescription'])) {
                $article->setCtaDescription(trim($data['ctaDescription']));
            }

            if (isset($data['ctaButton'])) {
                $article->setCtaButton(trim($data['ctaButton']));
            }

            // 3. Vérification de l'authentification simplifiée pour mono-utilisateur
            $user = $this->getUser();

            if (!$user) {
                return $this->json(['error' => 'Vous devez être connecté pour créer un article'], 401);
            }
            
            // Application mono-utilisateur: l'auteur est toujours implicite
            // Mais on doit quand même associer l'auteur pour la contrainte NOT NULL en base de données
            $article->setAuthor($user);

            // Définition du statut (0 = brouillon, 1 = publié)
            // Par défaut, le statut est publié sauf si explicitement demandé comme brouillon
            $status = isset($data['status']) ? (int)$data['status'] : 1;
            $article->setStatus($status);

            // 4. Validation de l'entité
            $errors = $validator->validate($article);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], 400);
            }

            // Un seul événement simple et clair pour la création d'article
            $meta = [];
            $meta['history'] = [];
            $timestamp = (new \DateTimeImmutable())->format('c');
            
            // Ne créer qu'un seul événement clair selon le statut initial
            if ($status === Article::STATUS_PUBLISHED) {
                // Article créé directement comme publié
                $meta['history'][] = [
                    'action' => 'article_published', // Type standardisé
                    'timestamp' => $timestamp,
                    'status' => $status,
                    'is_creation' => true // Marquer que c'est une publication initiale
                ];
            } else {
                // Article créé comme brouillon
                $meta['history'][] = [
                    'action' => 'article_created',
                    'timestamp' => $timestamp,
                    'status' => $status
                ];
            }
            
            $article->setMeta($meta);
            
            // 5. Persistance
            $em->persist($article);
            $em->flush(); // Flush pour obtenir l'ID de l'article
            
            // 6. Traitement des médias associés à l'article
            if (isset($data['mediaIds']) && is_array($data['mediaIds'])) {
                foreach ($data['mediaIds'] as $mediaId) {
                    $media = $mediaRepo->find($mediaId);
                    if ($media) {
                        $articleMedia = new ArticleMedia();
                        $articleMedia->setArticle($article);
                        $articleMedia->setMedia($media);
                        $articleMedia->setCreatedAt(new \DateTimeImmutable());
                        $em->persist($articleMedia);
                    }
                }
                $em->flush();
            }

            return $this->json(
                [
                    'success' => true,
                    'id' => $article->getId(),
                    'slug' => $article->getSlug(),
                    'redirectUrl' => '/editor/articles'
                ],
                201,
                [],
                ['groups' => 'article:detail']
            );
        } catch (Throwable $e) {
            // Gestion des erreurs serveur avec un message d'erreur générique en production
            $message = $_ENV['APP_ENV'] === 'dev' ? $e->getMessage() : 'Une erreur est survenue';
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $message,
            ], 500);
        }
    }

    // Endpoint pour mettre à jour un article existant
    // PUT /api/articles/{slug}
    #[Route('/api/articles/{slug}', name: 'api_article_update', methods: ['PUT'])]
    public function update(
        string $slug,
        Request $request,
        EntityManagerInterface $em,
        ArticleRepository $articleRepo,
        CategoryRepository $categoryRepo,
        ValidatorInterface $validator,
        MediaRepository $mediaRepo,
        ArticleMediaRepository $articleMediaRepo
    ): JsonResponse {
        try {
            // 1. Récupération de l'article existant
            $article = $articleRepo->findOneBy(['slug' => $slug]);
            if (!$article) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // 2. Récupération et validation des données
            $data = json_decode($request->getContent(), true);
            if (!$data) {
                return $this->json(['error' => 'Données JSON invalides'], 400);
            }

            // 3. Mise à jour des champs modifiables
            if (isset($data['title']) && !empty(trim($data['title']))) {
                $article->setTitle(trim($data['title']));
            }

            // Mise à jour de la catégorie si fournie
            if (isset($data['category'])) {
                $category = $categoryRepo->find($data['category']);
                if (!$category) {
                    return $this->json(['error' => 'Catégorie invalide'], 400);
                }
                $article->setCategory($category);
            }

            // Mise à jour des autres champs
            if (isset($data['metaTitle'])) {
                $article->setMetaTitle(trim($data['metaTitle']));
            }

            if (isset($data['metaDescription'])) {
                $article->setMetaDescription(trim($data['metaDescription']));
            }

            if (isset($data['intro'])) {
                $article->setIntro(trim($data['intro']));
            }

            if (isset($data['steps']) && is_array($data['steps'])) {
                $article->setSteps($data['steps']);
            }

            if (isset($data['quote'])) {
                $article->setQuote(trim($data['quote']));
            }

            if (isset($data['conclusionTitle'])) {
                $article->setConclusionTitle(trim($data['conclusionTitle']));
            }

            if (isset($data['conclusionDescription']) && is_array($data['conclusionDescription'])) {
                $article->setConclusionDescription($data['conclusionDescription']);
            }

            if (isset($data['ctaDescription'])) {
                $article->setCtaDescription(trim($data['ctaDescription']));
            }

            if (isset($data['ctaButton'])) {
                $article->setCtaButton(trim($data['ctaButton']));
            }

            // 4. Validation de l'entité mise à jour
            $errors = $validator->validate($article);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], 400);
            }
            
            // Mettre à jour la date de modification
            $article->setUpdatedAt(new \DateTimeImmutable());
            
            // Ajouter l'événement dans l'historique seulement si le contenu a réellement changé
            // Cela évite d'ajouter des événements quand seul le statut est modifié ailleurs
            if (!empty($requestData)) {
                $meta = $article->getMeta() ?? [];
                $meta['history'] = isset($meta['history']) ? $meta['history'] : [];
                
                $eventType = 'updated';
                $timestamp = (new \DateTimeImmutable())->format('c');
                
                // Ajouter l'événement approprié selon l'état actuel de l'article
                if ($article->getStatus() === Article::STATUS_PUBLISHED) {
                    $meta['history'][] = [
                        'action' => 'article_updated', // Plus spécifique que 'updated'
                        'timestamp' => $timestamp,
                        'status' => $article->getStatus()
                    ];
                } else {
                    $meta['history'][] = [
                        'action' => 'draft_updated',
                        'timestamp' => $timestamp,
                        'status' => $article->getStatus()
                    ];
                }
                
                $article->setMeta($meta);
            }
            
            // 5. Gestion des associations de médias
            if (isset($data['mediaIds']) && is_array($data['mediaIds'])) {
                $newMediaIds = $data['mediaIds'];
                
                // Récupérer les associations existantes
                $existingMedias = $articleMediaRepo->findBy(['article' => $article]);
                $existingMediaIds = [];
                
                foreach ($existingMedias as $articleMedia) {
                    $mediaId = $articleMedia->getMedia()->getId()->__toString();
                    $existingMediaIds[$mediaId] = $articleMedia;
                }
                
                // Supprimer les associations qui ne sont plus présentes
                foreach ($existingMediaIds as $mediaId => $articleMedia) {
                    if (!in_array($mediaId, $newMediaIds)) {
                        $em->remove($articleMedia);
                    }
                }
                
                // Ajouter les nouvelles associations
                foreach ($newMediaIds as $mediaId) {
                    if (!isset($existingMediaIds[$mediaId])) {
                        $media = $mediaRepo->find($mediaId);
                        if ($media) {
                            $articleMedia = new ArticleMedia();
                            $articleMedia->setArticle($article);
                            $articleMedia->setMedia($media);
                            $articleMedia->setCreatedAt(new \DateTimeImmutable());
                            $em->persist($articleMedia);
                        }
                    }
                }
            }
            
            // 6. Persistance des modifications
            $em->flush();

            return $this->json(
                [
                    'success' => true,
                    'id' => $article->getId(),
                    'slug' => $article->getSlug(),
                    'redirectUrl' => '/editor/articles'
                ],
                200,
                [],
                ['groups' => 'article:detail']
            );
        } catch (Throwable $e) {
            // Gestion des erreurs serveur
            $message = $_ENV['APP_ENV'] === 'dev' ? $e->getMessage() : 'Une erreur est survenue';
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $message,
            ], 500);
        }
    }

    // Endpoint pour mettre un article à la corbeille (suppression logique)
    // PATCH /api/articles/{id}/trash
    #[Route('/api/articles/{id}/trash', name: 'api_article_trash', methods: ['PATCH'])]
    public function trashArticle(
        int $id,
        ArticleRepository $articleRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            // 1. Récupération de l'article à mettre à la corbeille
            $article = $articleRepo->find($id);
            if (!$article) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // 2. Enregistrer l'ancien statut avant de le changer
            $previousStatus = $article->getStatus();
            
            // Marquer l'article comme supprimé et mettre à jour le timestamp
            $article->setStatus(Article::STATUS_DELETED);
            $article->setUpdatedAt(new \DateTimeImmutable());
            
            // 3. Enregistrer l'information de suppression dans les métadonnées
            $meta = $article->getMeta() ?? [];
            $meta['history'] = isset($meta['history']) ? $meta['history'] : [];
            $meta['history'][] = [
                'action' => 'article_deleted',
                'timestamp' => (new \DateTimeImmutable())->format('c'),
                'previous_status' => $previousStatus,
                'new_status' => Article::STATUS_DELETED
            ];
            $article->setMeta($meta);
            
            $em->flush();

            return $this->json([
                'success' => true,
                'message' => 'L\'article a été déplacé dans la corbeille',
                'id' => $article->getId(),
                'redirectUrl' => '/editor/articles'
            ], 200);
        } catch (Throwable $e) {
            // Gestion des erreurs serveur
            $message = $_ENV['APP_ENV'] === 'dev' ? $e->getMessage() : 'Une erreur est survenue';
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $message,
            ], 500);
        }
    }

    // Endpoint pour restaurer un article de la corbeille
    // PATCH /api/articles/{id}/restore
    #[Route('/api/articles/{id}/restore', name: 'api_article_restore', methods: ['PATCH'])]
    public function restoreArticle(
        int $id,
        ArticleRepository $articleRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            // 1. Récupération de l'article à restaurer
            $article = $articleRepo->find($id);
            if (!$article) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // 2. Vérifier que l'article est bien dans la corbeille
            if ($article->getStatus() !== Article::STATUS_DELETED) {
                return $this->json(['error' => 'Cet article n\'est pas dans la corbeille'], 400);
            }

            // 3. Restaurer l'article en brouillon
            $article->setStatus(Article::STATUS_DRAFT);
            // Mettre à jour le timestamp pour que l'activité soit récente
            $article->setUpdatedAt(new \DateTimeImmutable());
            
            // 4. Mettre à jour les métadonnées avec un historique complet
            $meta = $article->getMeta() ?? [];
            $meta['restored'] = true;
            $meta['restored_at'] = (new \DateTimeImmutable())->format('c');
            
            // Ajouter l'entrée de restauration à l'historique
            $meta['history'] = isset($meta['history']) ? $meta['history'] : [];
            $meta['history'][] = [
                'action' => 'article_restored',
                'timestamp' => (new \DateTimeImmutable())->format('c'),
                'previous_status' => Article::STATUS_DELETED,
                'new_status' => Article::STATUS_DRAFT
            ];
            
            $article->setMeta($meta);
            
            $em->flush();

            return $this->json([
                'success' => true,
                'message' => 'L\'article a été restauré comme brouillon',
                'id' => $article->getId(),
                'redirectUrl' => '/editor/articles'
            ], 200);
        } catch (\Throwable $e) {
            // Gestion des erreurs serveur
            $message = $_ENV['APP_ENV'] === 'dev' ? $e->getMessage() : 'Une erreur est survenue';
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $message,
            ], 500);
        }
    }

    // Endpoint pour supprimer définitivement un article
    // DELETE /api/articles/{slug}
    #[Route('/api/articles/{slug}', name: 'api_article_delete', methods: ['DELETE'])]
    public function delete(
        string $slug,
        ArticleRepository $articleRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            // 1. Récupération de l'article à supprimer
            $article = $articleRepo->findOneBy(['slug' => $slug]);
            if (!$article) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // 2. Suppression définitive de l'article
            $em->remove($article);
            $em->flush();

            return $this->json(['success' => true], 200);
        } catch (Throwable $e) {
            // Gestion des erreurs serveur
            $message = $_ENV['APP_ENV'] === 'dev' ? $e->getMessage() : 'Une erreur est survenue';
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $message,
            ], 500);
        }
    }

    // Endpoint pour changer le statut d'un article (publier/dépublier)
    // PATCH /api/articles/{id}/status
    #[Route('/api/articles/{id}/status', name: 'api_article_update_status', methods: ['PATCH'])]
    public function updateStatus(
        int $id,
        Request $request,
        ArticleRepository $articleRepo,
        EntityManagerInterface $em
    ): JsonResponse {
        try {
            // 1. Récupération de l'article à mettre à jour
            $article = $articleRepo->find($id);
            if (!$article) {
                return $this->json(['error' => 'Article non trouvé'], 404);
            }

            // 2. Récupération et validation des données
            $data = json_decode($request->getContent(), true);
            if (!$data || !isset($data['status'])) {
                return $this->json(['error' => 'Statut manquant ou invalide'], 400);
            }

            // 3. Vérification que le statut est valide (0 ou 1)
            $status = (int) $data['status'];
            if (!in_array($status, [Article::STATUS_DRAFT, Article::STATUS_PUBLISHED])) {
                return $this->json(['error' => 'Statut invalide. Doit être 0 (brouillon) ou 1 (publié)'], 400);
            }

            // 4. Mise à jour du statut avec enregistrement dans l'historique
            $oldStatus = $article->getStatus();
            $article->setStatus($status);
            $article->setUpdatedAt(new \DateTimeImmutable());
            $timestamp = (new \DateTimeImmutable())->format('c');
            
            // Ajouter à l'historique dans meta
            $meta = $article->getMeta() ?? [];
            $meta['history'] = isset($meta['history']) ? $meta['history'] : [];
            
            // Déterminer le type d'action standardisé
            if ($status === Article::STATUS_PUBLISHED && $oldStatus === Article::STATUS_DRAFT) {
                // Cas de publication : un seul événement standardisé
                $meta['history'][] = [
                    'action' => 'article_published',
                    'timestamp' => $timestamp,
                    'previous_status' => $oldStatus,
                    'new_status' => $status
                ];
            } else if ($status === Article::STATUS_DRAFT && $oldStatus === Article::STATUS_PUBLISHED) {
                // Cas de dépublication : un seul événement standardisé
                $meta['history'][] = [
                    'action' => 'article_unpublished',
                    'timestamp' => $timestamp,
                    'previous_status' => $oldStatus,
                    'new_status' => $status
                ];
            }
            
            $article->setMeta($meta);
            
            // 5. Persistance des modifications
            $em->flush();

            // 6. Réponse avec l'article mis à jour
            return $this->json(
                $article,
                200,
                [],
                ['groups' => 'article:detail']
            );
        } catch (Throwable $e) {
            // Gestion des erreurs serveur
            $message = $_ENV['APP_ENV'] === 'dev' ? $e->getMessage() : 'Une erreur est survenue';
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $message,
            ], 500);
        }
    }
}

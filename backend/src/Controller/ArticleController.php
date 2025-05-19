<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Article;
use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Validator\Validator\ValidatorInterface;
use Symfony\Component\Security\Core\Security;
use Throwable;
use Doctrine\ORM\Tools\Pagination\Paginator;
use App\Entity\Category;
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
        $authorId = $request->query->getInt('author_id', 0); // Ajout du paramètre author_id
        $status = $request->query->getInt('status', -1); // -1 = tous les statuts (0 = brouillon, 1 = publié)

        // 2. Utilisation de la méthode du repository pour obtenir les articles filtrés et paginés
        $result = $repo->findWithFilters($search, $categoryId, $authorId, $status, $page, $limit);

        // 3. Envoi de la réponse JSON avec les articles et les métadonnées
        return $this->json($result, 200, [], [
            'groups' => ['article:list', 'article:detail'],
            'json_encode_options' => JSON_UNESCAPED_SLASHES | JSON_PRETTY_PRINT
        ]);
    }

    // Endpoint pour récupérer le détail d’un article par son slug
    // GET /api/articles/{slug}
    #[Route('/api/articles/{slug}', name: 'api_article_detail', methods: ['GET'])]
    public function detail(string $slug, ArticleRepository $repo): JsonResponse
    {
        $article = $repo->findOneBySlugWithRelations($slug);
        if (!$article) {
            return $this->json(['error' => 'Article non trouvé'], 404);
        }
        return $this->json($article, 200, [], ['groups' => 'article:detail']);
    }

    // Endpoint pour créer un nouvel article à partir d’un payload JSON
    // POST /api/articles
    #[Route('/api/articles', name: 'api_article_create', methods: ['POST'])]
    public function create(
        Request $request,
        EntityManagerInterface $em,
        ValidatorInterface $validator,
        CategoryRepository $categoryRepo,
        UserRepository $userRepo
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

            // 3. Récupération de l'utilisateur connecté
            $user = $this->getUser();

            if (!$user) {
                return $this->json(['error' => 'Vous devez être connecté pour créer un article'], 401);
            }

            // Vérification que l'utilisateur est bien une instance de User
            if (!$user instanceof \App\Entity\User) {
                return $this->json(['error' => 'Utilisateur invalide'], 400);
            }

            $article->setAuthor($user);

            // 4. Validation de l'entité
            $errors = $validator->validate($article);
            if (count($errors) > 0) {
                $errorMessages = [];
                foreach ($errors as $error) {
                    $errorMessages[$error->getPropertyPath()] = $error->getMessage();
                }
                return $this->json(['error' => 'Validation failed', 'details' => $errorMessages], 400);
            }

            // 5. Persistance
            $em->persist($article);
            $em->flush();

            return $this->json(
                ['success' => true, 'id' => $article->getId(), 'slug' => $article->getSlug()],
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
        ValidatorInterface $validator
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

            // 5. Persistance des modifications
            $em->flush();

            return $this->json(
                ['success' => true, 'id' => $article->getId(), 'slug' => $article->getSlug()],
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

    // Endpoint pour supprimer un article
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

            // 2. Suppression de l'article
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
            
            // 4. Mise à jour du statut
            $article->setStatus($status);
            
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

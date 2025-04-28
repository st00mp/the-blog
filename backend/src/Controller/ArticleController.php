<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;
use App\Entity\Article;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\Serializer\SerializerInterface;
use Throwable;
use Doctrine\ORM\Tools\Pagination\Paginator;
use App\Entity\Category;

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
        $page   = max(1, (int) $request->query->get('page', 1));
        $limit  = max(1, (int) $request->query->get('limit', 12));
        $categoryId = $request->query->getInt('category', 0); // 0 = pas de filtre

        // 2. Construction dynamique de la requête Doctrine avec jointure sur la catégorie
        $qb = $repo->createQueryBuilder('a')
            ->addSelect('c')
            ->leftJoin('a.category', 'c')
            ->orderBy('a.updated_at', 'DESC');

        // Ajout d’un filtre de recherche si un mot-clé est fourni
        if ($search !== '') {
            $qb->andWhere('a.title LIKE :kw OR a.intro LIKE :kw')
                ->setParameter('kw', "%{$search}%");
        }

        // Ajout d’un filtre par catégorie si un ID valide est fourni
        if ($categoryId > 0) {
            $qb->andWhere('c.id = :cat')
                ->setParameter('cat', $categoryId);
        }

        // Application de la pagination avec offset et limite
        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        $paginator = new Paginator($qb->getQuery());
        $total     = count($paginator);
        $totalPages = (int) ceil($total / $limit);
        $articles  = iterator_to_array($paginator->getIterator());

        // 3. Envoi de la réponse JSON avec les articles et les métadonnées
        return $this->json([
            'data' => $articles,
            'meta' => [
                'page'       => $page,
                'limit'      => $limit,
                'total'      => $total,
                'totalPages' => $totalPages,
            ],
        ], 200, [], ['groups' => 'article:list']);
    }

    // Endpoint pour récupérer le détail d’un article par son slug
    // GET /api/articles/{slug}
    #[Route('/api/articles/{slug}', name: 'api_article_detail', methods: ['GET'])]
    public function detail(string $slug, ArticleRepository $repo): JsonResponse
    {
        $article = $repo->findOneBy(['slug' => $slug]);
        if (!$article) return $this->json(['error' => 'Not found'], 404);
        return $this->json($article, 200, [], ['groups' => 'article:detail']);
    }

    // Endpoint pour créer un nouvel article à partir d’un payload JSON
    // POST /api/articles
    #[Route('/api/articles', name: 'api_article_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        // Tentative de création d’un article à partir des données reçues
        try {
            $data = json_decode($request->getContent(), true);

            // Vérifie que les données minimales sont présentes (titre requis)
            if (!$data || !isset($data['title'])) {
                return $this->json(['error' => 'Titre manquant'], 400);
            }

            // 1. Récupération de la catégorie
            $categoryId = $data['category'] ?? null;
            if (!$categoryId) {
                return $this->json(['error' => 'Catégorie manquante'], 400);
            }
            /** @var Category|null $category */
            $category = $em->getRepository(Category::class)->find($categoryId);
            if (!$category) {
                return $this->json(['error' => 'Catégorie invalide'], 400);
            }

            // 2. Hydratation de l'article
            $article = new Article();
            $article->setTitle($data['title']);
            $article->setCategory($category); // <-- on passe l'entité Category
            $article->setMetaTitle($data['metaTitle'] ?? null);
            $article->setMetaDescription($data['metaDescription'] ?? null);
            $article->setIntro($data['intro'] ?? null);
            $article->setSteps($data['steps'] ?? []);
            $article->setQuote($data['quote'] ?? null);
            $article->setConclusionTitle($data['conclusionTitle'] ?? null);
            $article->setConclusionDescription($data['conclusionDescription'] ?? null);
            $article->setCtaDescription($data['ctaDescription'] ?? null);
            $article->setCtaButton($data['ctaButton'] ?? null);

            // 3. Auteur et dates
            $user = $em->getRepository(User::class)->find(1);
            $article->setAuthor($user);
            $now = new \DateTimeImmutable();
            $article->setCreatedAt($now);
            $article->setUpdatedAt($now);

            // 4. Persistance
            $em->persist($article);
            $em->flush();

            return $this->json(['success' => true, 'id' => $article->getId()], 201);
        } catch (Throwable $e) {
            // Gestion des erreurs serveur avec un message d’erreur
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage(), // debug rapide
            ], 500);
        }
    }
}

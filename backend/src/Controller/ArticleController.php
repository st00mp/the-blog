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

final class ArticleController extends AbstractController
{
    // GET /api/articles
    #[Route('/api/articles', name: 'api_articles', methods: ['GET'])]
    public function list(ArticleRepository $repo): JsonResponse
    {
        $articles = $repo->findAll();
        return $this->json($articles, 200, [], ['groups' => 'article:list']);
    }

    // GET /api/articles/{slug}
    #[Route('/api/articles/{slug}', name: 'api_article_detail', methods: ['GET'])]
    public function detail(string $slug, ArticleRepository $repo): JsonResponse
    {
        $article = $repo->findOneBy(['slug' => $slug]);
        if (!$article) return $this->json(['error' => 'Not found'], 404);
        return $this->json($article, 200, [], ['groups' => 'article:detail']);
    }

    // POST /api/articles
    #[Route('/api/articles', name: 'api_article_create', methods: ['POST'])]
    public function create(Request $request, EntityManagerInterface $em, SerializerInterface $serializer): JsonResponse
    {
        try {
            $data = json_decode($request->getContent(), true);

            if (!$data || !isset($data['title'])) {
                return $this->json(['error' => 'Titre manquant'], 400);
            }

            $article = new Article();
            $article->setTitle($data['title']);
            $article->setCategory($data['category'] ?? 'null');
            $article->setMetaTitle($data['meta']['title'] ?? null);
            $article->setMetaDescription($data['meta']['description'] ?? null);
            $article->setIntro($data['intro'] ?? null);
            $article->setSteps($data['steps'] ?? []);
            $article->setQuote($data['quote'] ?? null);
            $article->setConclusionTitle($data['conclusionTitle'] ?? null);
            $article->setConclusionDescription($data['conclusionDescription'] ?? null);
            $article->setCtaDescription($data['ctaDescription'] ?? null);
            $article->setCtaButton($data['ctaButton'] ?? null);

            // ⚠️ À adapter : ici on prend un user avec ID 1
            $user = $em->getRepository(User::class)->find(1);
            $article->setAuthor($user);

            $now = new \DateTimeImmutable();
            $article->setCreatedAt($now);
            $article->setUpdatedAt($now);

            $em->persist($article);
            $em->flush();

            return $this->json(['success' => true, 'id' => $article->getId()], 201);
        } catch (Throwable $e) {
            return $this->json([
                'error' => 'Erreur serveur',
                'message' => $e->getMessage(), // 👈 utile pour debug rapide
            ], 500);
        }
    }
}

<?php

namespace App\Controller;

use App\Repository\ArticleRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

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
}

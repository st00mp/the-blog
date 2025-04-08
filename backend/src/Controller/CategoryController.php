<?php

namespace App\Controller;

use App\Repository\CategoryRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\Routing\Attribute\Route;

class CategoryController extends AbstractController
{
    #[Route('/api/categories', name: 'api_categories', methods: ['GET'])]
    public function list(CategoryRepository $repository): JsonResponse
    {
        $categories = $repository->findAll();

        // On renvoie un tableau simple avec les ID et noms
        $data = array_map(fn($c) => [
            'id' => $c->getId(),
            'name' => $c->getName()
        ], $categories);

        return $this->json($data);
    }
}

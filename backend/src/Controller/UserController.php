<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;

#[Route('/api/users')]
class UserController extends AbstractController
{
    private $entityManager;
    private $serializer;

    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer
    ) {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
    }

    #[Route('', name: 'api_users_list', methods: ['GET'])]
    public function list(UserRepository $userRepository): JsonResponse
    {
        $users = $userRepository->findAll();
        
        $data = [];
        foreach ($users as $user) {
            $lastLoginAt = $user->getLastLoginAt();
            
            $data[] = [
                'id' => $user->getId(),
                'name' => $user->getName(),
                'email' => $user->getEmail(),
                'role' => $user->getRole(),
                'lastLogin' => $lastLoginAt ? $lastLoginAt->format('c') : null,
                'createdAt' => $user->getCreatedAt()->format('c')
            ];
        }
        
        return new JsonResponse($data);
    }

    #[Route('/{id}/role', name: 'api_user_update_role', methods: ['PATCH'])]
    public function updateRole(
        Request $request, 
        User $user
    ): JsonResponse
    {
        $data = json_decode($request->getContent(), true);
        
        if (!isset($data['role']) || !in_array($data['role'], User::ROLES)) {
            return new JsonResponse(
                ['error' => 'Rôle invalide. Les valeurs autorisées sont: ' . implode(', ', User::ROLES)],
                Response::HTTP_BAD_REQUEST
            );
        }
        
        $user->setRole($data['role']);
        $this->entityManager->flush();
        
        return new JsonResponse([
            'id' => $user->getId(),
            'name' => $user->getName(),
            'email' => $user->getEmail(),
            'role' => $user->getRole(),
            'lastLogin' => $user->getLastLoginAt() ? $user->getLastLoginAt()->format('c') : null
        ]);
    }
}

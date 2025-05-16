<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Security\Core\Authentication\Token\Storage\TokenStorageInterface;
use Psr\Log\LoggerInterface;
use Symfony\Component\HttpFoundation\Cookie;

class SessionController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function getCurrentUser(Request $request, UserRepository $userRepo): JsonResponse
    {
        try {
            // Récupérer l'ID utilisateur depuis le cookie de session
            $userId = $request->cookies->get('user_id');
            
            if (!$userId) {
                return new JsonResponse(
                    ['error' => 'Non authentifié'],
                    Response::HTTP_UNAUTHORIZED
                );
            }
            
            $user = $userRepo->find($userId);
            
            if (!$user) {
                return new JsonResponse(
                    ['error' => 'Utilisateur non trouvé'],
                    Response::HTTP_UNAUTHORIZED
                );
            }
            
            // Retourner les informations de l'utilisateur
            return new JsonResponse([
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                    'role' => $user->getRole()
                ]
            ]);
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la récupération des informations utilisateur', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la récupération des informations utilisateur'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(Request $request): JsonResponse
    {
        try {
            $response = new JsonResponse(['message' => 'Déconnexion réussie']);
            
            // Supprimer le cookie de session
            $cookie = Cookie::create('user_id')
                ->withValue('')
                ->withExpires(time() - 3600) // Expiration dans le passé
                ->withPath('/')
                ->withSecure(true)
                ->withHttpOnly(true)
                ->withSameSite('lax');
            
            $response->headers->setCookie($cookie);
            
            $this->logger->info('Utilisateur déconnecté');
            
            return $response;
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la déconnexion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);
            
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la déconnexion'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

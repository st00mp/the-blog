<?php

namespace App\Controller;

use App\Entity\User;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;

class SessionController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/api/me', name: 'api_me', methods: ['GET'])]
    public function getCurrentUser(): JsonResponse
    {
        try {
            // Récupérer l'utilisateur depuis la session via le système de sécurité Symfony
            $user = $this->getUser();
            
            if (!$user || !$user instanceof User) {
                return new JsonResponse(
                    ['error' => 'Non authentifié'],
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

    /**
     * Cette route est utilisée comme point d'entrée pour la déconnexion dans security.yaml
     * Le traitement de la déconnexion est géré par Symfony Security
     */
    #[Route('/api/logout', name: 'api_logout', methods: ['POST'])]
    public function logout(): JsonResponse
    {
        // Cette méthode sera appelée après que Symfony ait géré la déconnexion
        $this->logger->info('Utilisateur déconnecté');
        
        return new JsonResponse(['message' => 'Déconnexion réussie']);
    }
}

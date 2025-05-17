<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;

class LoginController extends AbstractController
{
    private $logger;
    private $entityManager;

    public function __construct(LoggerInterface $logger, EntityManagerInterface $entityManager)
    {
        $this->logger = $logger;
        $this->entityManager = $entityManager;
    }

    /**
     * Cette route est utilisée comme point d'entrée pour json_login dans security.yaml
     * Le traitement de l'authentification est géré par Symfony Security
     */
    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(): JsonResponse
    {
        // Cette méthode ne sera jamais exécutée si l'authentification réussit
        // car le AuthenticationSuccessHandler sera appelé à la place
        
        // Si nous arrivons ici, c'est que l'authentification a échoué
        // mais que l'exception n'a pas été capturée par le système de sécurité
        
        return new JsonResponse(
            ['error' => 'Identifiants invalides'],
            Response::HTTP_UNAUTHORIZED
        );
    }
    
    /**
     * Méthode pour mettre à jour la date de dernière connexion
     * Cette méthode est appelée par AuthenticationSuccessHandler
     */
    public function updateLastLogin(string $email): void
    {
        try {
            $user = $this->entityManager->getRepository('App\Entity\User')->findOneBy(['email' => $email]);
            
            if ($user && method_exists($user, 'setLastLoginAt')) {
                $user->setLastLoginAt(new \DateTimeImmutable());
                $this->entityManager->persist($user);
                $this->entityManager->flush();
            }
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la mise à jour de la date de dernière connexion', [
                'error' => $e->getMessage()
            ]);
        }
    }
}

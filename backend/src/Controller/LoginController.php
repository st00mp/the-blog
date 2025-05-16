<?php

namespace App\Controller;

use App\Repository\UserRepository;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\HttpFoundation\Cookie;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Psr\Log\LoggerInterface;

class LoginController extends AbstractController
{
    private $logger;

    public function __construct(LoggerInterface $logger)
    {
        $this->logger = $logger;
    }

    #[Route('/api/login', name: 'api_login', methods: ['POST'])]
    public function login(
        Request $request,
        UserRepository $userRepo,
        UserPasswordHasherInterface $passwordHasher
    ): JsonResponse {
        try {
            $data = json_decode($request->getContent(), true);

            if (json_last_error() !== JSON_ERROR_NONE) {
                throw new \InvalidArgumentException('Invalid JSON data');
            }

            // Vérification des champs obligatoires
            if (empty($data['email']) || empty($data['password'])) {
                return new JsonResponse(
                    ['error' => 'Email et mot de passe sont requis'],
                    Response::HTTP_BAD_REQUEST
                );
            }

            $user = $userRepo->findOneBy(['email' => $data['email']]);

            // Message d'erreur générique pour éviter les fuites d'informations
            $errorMessage = 'Identifiants invalides';

            if (!$user) {
                $this->logger->warning('Tentative de connexion échouée - Email inconnu', ['email' => $data['email']]);
                return new JsonResponse(
                    ['error' => $errorMessage],
                    Response::HTTP_UNAUTHORIZED
                );
            }

            if (!$passwordHasher->isPasswordValid($user, $data['password'])) {
                $this->logger->warning('Tentative de connexion échouée - Mot de passe incorrect', ['email' => $data['email']]);
                return new JsonResponse(
                    ['error' => $errorMessage],
                    Response::HTTP_UNAUTHORIZED
                );
            }

            if (method_exists($user, 'setLastLoginAt')) {
                $user->setLastLoginAt(new \DateTimeImmutable());
            } else {
                $this->logger->warning('La méthode setLastLoginAt() est absente de l\'entité User');
            }
            $userRepo->save($user, true);

            $this->logger->info('Connexion réussie', ['email' => $user->getEmail()]);

            // Création de la réponse avec les informations utilisateur
            $response = new JsonResponse([
                'message' => 'Connexion réussie',
                'user' => [
                    'id' => $user->getId(),
                    'email' => $user->getEmail(),
                    'name' => $user->getName(),
                    'role' => $user->getRole()
                ]
            ]);

            // Création du cookie de session (expire dans 30 jours)
            $cookie = Cookie::create('user_id')
                ->withValue((string)$user->getId())
                ->withExpires(time() + 30 * 24 * 60 * 60) // 30 jours
                ->withPath('/')
                ->withSecure(true)
                ->withHttpOnly(true)
                ->withSameSite('lax');

            $response->headers->setCookie($cookie);

            return $response;
        } catch (\InvalidArgumentException $e) {
            $this->logger->error('Erreur de validation des données de connexion', ['error' => $e->getMessage()]);
            return new JsonResponse(
                ['error' => 'Données de connexion invalides'],
                Response::HTTP_BAD_REQUEST
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la tentative de connexion', [
                'error' => $e->getMessage(),
                'trace' => $e->getTraceAsString()
            ]);

            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la connexion'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

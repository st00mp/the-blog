<?php

namespace App\Controller;

use App\Entity\User;
use App\Repository\UserRepository;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\PasswordHasher\Hasher\UserPasswordHasherInterface;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Validator\Validator\ValidatorInterface;

#[Route('/api/users')]
class UserImportController extends AbstractController
{
    private $entityManager;
    private $userRepository;
    private $passwordHasher;
    private $validator;

    public function __construct(
        EntityManagerInterface $entityManager,
        UserRepository $userRepository,
        UserPasswordHasherInterface $passwordHasher,
        ValidatorInterface $validator
    ) {
        $this->entityManager = $entityManager;
        $this->userRepository = $userRepository;
        $this->passwordHasher = $passwordHasher;
        $this->validator = $validator;
    }

    #[Route('/import', name: 'api_users_import', methods: ['POST'])]
    public function import(Request $request): JsonResponse
    {
        // Vérifier l'authentification et les droits d'admin
        $currentUser = $this->getUser();
        if (!$currentUser || $currentUser->getRole() !== 'admin') {
            return new JsonResponse(['error' => 'Accès refusé'], Response::HTTP_FORBIDDEN);
        }

        // Récupérer le fichier CSV
        $csvFile = $request->files->get('csvFile');
        if (!$csvFile) {
            return new JsonResponse(['error' => 'Aucun fichier CSV reçu'], Response::HTTP_BAD_REQUEST);
        }

        // Vérifier que c'est bien un fichier CSV
        $mimeType = $csvFile->getMimeType();
        if (!in_array($mimeType, ['text/csv', 'text/plain', 'application/csv', 'application/vnd.ms-excel'])) {
            return new JsonResponse(['error' => 'Le fichier doit être au format CSV'], Response::HTTP_BAD_REQUEST);
        }

        // Lire et traiter le fichier CSV
        $filePath = $csvFile->getPathname();
        $handle = fopen($filePath, 'r');
        if ($handle === false) {
            return new JsonResponse(['error' => 'Impossible d\'ouvrir le fichier CSV'], Response::HTTP_INTERNAL_SERVER_ERROR);
        }

        $successCount = 0;
        $failedCount = 0;
        $errors = [];
        $existingEmails = [];

        // Importer les utilisateurs
        while (($data = fgetcsv($handle, 1000, "\t")) !== false) {
            // Vérifier que nous avons au moins 6 colonnes
            if (count($data) < 6) {
                $failedCount++;
                $errors[] = 'Ligne mal formatée, pas assez de colonnes';
                continue;
            }

            // Structure: [prénom, nom, username, password, email, role]
            $firstName = trim($data[0]);
            $lastName = trim($data[1]);
            $username = trim($data[2]);
            $password = trim($data[3]);
            $email = trim($data[4]);
            $role = strtolower(trim($data[5]));

            // Convertir le rôle au format utilisé dans l'application
            switch ($role) {
                case 'author':
                    $role = 'editor'; // AUTHOR dans le CSV correspond à EDITOR dans l'application
                    break;
                case 'user':
                    $role = 'user';
                    break;
                default:
                    // Si le rôle n'est pas reconnu, on met "user" par défaut
                    $role = 'user';
            }

            // Vérifier si l'email existe déjà
            if ($this->userRepository->findOneBy(['email' => $email])) {
                $failedCount++;
                $errors[] = "L'email $email existe déjà";
                $existingEmails[] = $email;
                continue;
            }

            // Créer l'utilisateur
            try {
                $user = new User();
                $user->setName("$firstName $lastName");
                $user->setEmail($email);
                
                // Hasher le mot de passe
                $hashedPassword = $this->passwordHasher->hashPassword($user, $password);
                $user->setPasswordHash($hashedPassword);
                
                $user->setRole($role);
                $user->setCreatedAt(new \DateTimeImmutable());
                $user->setUpdatedAt(new \DateTimeImmutable());

                // Valider l'entité
                $violations = $this->validator->validate($user);
                if (count($violations) > 0) {
                    $failedCount++;
                    $errorMessages = [];
                    foreach ($violations as $violation) {
                        $errorMessages[] = $violation->getMessage();
                    }
                    $errors[] = "Validation échouée pour $email: " . implode(', ', $errorMessages);
                    continue;
                }

                // Enregistrer l'utilisateur
                $this->entityManager->persist($user);
                $successCount++;

            } catch (\Exception $e) {
                $failedCount++;
                $errors[] = "Erreur pour $email: " . $e->getMessage();
            }
        }

        fclose($handle);

        // Enregistrer tous les utilisateurs en une seule transaction
        if ($successCount > 0) {
            $this->entityManager->flush();
        }

        // Retourner un rapport d'import
        return new JsonResponse([
            'success' => $successCount,
            'failed' => $failedCount,
            'errors' => $errors,
            'existingEmails' => $existingEmails
        ]);
    }
}

<?php

namespace App\Controller;

use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\Serializer\SerializerInterface;

// Controller désactivé - fonctionnalités multi-utilisateurs supprimées
// Seules les routes d'authentification et de profil personnel restent actives
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

    // Toutes les routes de gestion d'utilisateurs multiples ont été supprimées
    // Les articles utilisent maintenant tous l'administrateur principal (ID 1) comme auteur
}

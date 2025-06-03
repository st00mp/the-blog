<?php

namespace App\Repository;

use App\Entity\User;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<User>
 * Repository simplifié pour système mono-utilisateur
 * Toutes les méthodes sont optimisées pour ne gérer qu'un seul utilisateur administrateur (ID=1)
 */
class UserRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, User::class);
    }

    /**
     * Sauvegarde l'utilisateur en base de données
     * @param User $user L'utilisateur à sauvegarder
     * @param bool $flush Si true, exécute immédiatement la requête SQL
     */
    public function save(User $user, bool $flush = false): void
    {
        $this->getEntityManager()->persist($user);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
    
    /**
     * Récupère l'administrateur unique du système (ID=1)
     * @return User|null L'administrateur ou null s'il n'existe pas
     */
    public function getAdmin(): ?User
    {
        return $this->find(1);
    }
    
    /**
     * Met à jour la date de dernière connexion de l'administrateur
     */
    public function updateLastLogin(): void
    {
        $admin = $this->find(1);
        if ($admin) {
            $admin->setLastLoginAt(new \DateTimeImmutable());
            $this->save($admin, true);
        }
    }
}

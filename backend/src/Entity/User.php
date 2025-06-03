<?php

namespace App\Entity;

use App\Repository\UserRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;
use Symfony\Component\Validator\Constraints as Assert;
use Symfony\Component\Security\Core\User\UserInterface;
use Symfony\Component\Security\Core\User\PasswordAuthenticatedUserInterface;



#[ORM\Entity(repositoryClass: UserRepository::class)]
class User implements UserInterface, PasswordAuthenticatedUserInterface
{
    // Simplification des rôles - un seul administrateur
    public const ROLE_ADMIN = 'ROLE_ADMIN';

    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:list', 'article:detail'])]
    private ?int $id = null;

    #[ORM\Column(type: 'string', length: 255, nullable: true)]
    private ?string $auth_user_id = null;

    #[ORM\Column(length: 100)]
    #[Groups(['article:list', 'article:detail'])]
    private ?string $name = null;

    // Pour éviter des doublons d'utilisateurs : unique: true
    #[ORM\Column(length: 180, unique: true)]
    private ?string $email = null;

    #[ORM\Column(length: 255)]
    private ?string $password_hash = null;

    // Rôle défini en dur comme admin
    #[ORM\Column(type: 'json')]
    private array $roles = ['ROLE_ADMIN'];

    #[ORM\Column]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    private ?\DateTimeImmutable $updated_at = null;

    #[ORM\Column(type: 'datetime_immutable', nullable: true)]
    private ?\DateTimeImmutable $lastLoginAt = null;

    // La relation OneToMany avec les articles a été supprimée
    // Tous les articles pointent maintenant vers l'admin (ID 1)

    // Suppression de la relation avec les commentaires qui ont été retirés

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $now = new \DateTimeImmutable();
        // créé si pas déjà défini
        $this->created_at = $this->createdAt ?? $now;
        // toujours mis à jour
        $this->updated_at = $now;
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updated_at = new \DateTimeImmutable();
    }

    public function __construct()
    {
        // Constructeur simplifié - la relation avec les articles a été supprimée
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getAuthUserId(): ?string
    {
        return $this->auth_user_id;
    }

    public function setAuthUserId(?string $auth_user_id): static
    {
        $this->auth_user_id = $auth_user_id;

        return $this;
    }

    public function getName(): ?string
    {
        return $this->name;
    }

    public function setName(string $name): static
    {
        $this->name = $name;

        return $this;
    }

    public function getEmail(): ?string
    {
        return $this->email;
    }

    public function setEmail(string $email): static
    {
        $this->email = $email;

        return $this;
    }

    public function getPasswordHash(): ?string
    {
        return $this->password_hash;
    }

    public function getPassword(): string
    {
        return $this->password_hash;
    }

    public function getUserIdentifier(): string
    {
        return $this->email;
    }

    public function getRoles(): array
    {
        // Simplification - toujours retourner le rôle admin
        return $this->roles;
    }
    
    /**
     * Méthode simplifiée qui retourne le rôle principal au singulier
     * Utilisée pour l'API et l'interface utilisateur
     */
    public function getRole(): string
    {
        // Retourner le premier rôle (dans notre cas c'est toujours ROLE_ADMIN)
        return $this->roles[0];
    }

    public function eraseCredentials(): void
    {
        // Optionnel : nettoie des infos sensibles si nécessaire
    }

    public function setPasswordHash(string $password_hash): static
    {
        $this->password_hash = $password_hash;

        return $this;
    }

    // Suppression des méthodes getRole et setRole qui ne sont plus nécessaires

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->created_at;
    }

    public function setCreatedAt(\DateTimeImmutable $created_at): static
    {
        $this->created_at = $created_at;

        return $this;
    }

    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updated_at;
    }

    public function setUpdatedAt(\DateTimeImmutable $updated_at): static
    {
        $this->updated_at = $updated_at;

        return $this;
    }

    public function getLastLoginAt(): ?\DateTimeImmutable
    {
        return $this->lastLoginAt;
    }

    public function setLastLoginAt(?\DateTimeImmutable $lastLoginAt): self
    {
        $this->lastLoginAt = $lastLoginAt;

        return $this;
    }

    // Les méthodes de gestion des articles ont été supprimées
    // pour simplifier le modèle en mono-utilisateur
    // Les articles pointent tous vers l'administrateur (ID 1)

    // Suppression des méthodes liées aux commentaires
}

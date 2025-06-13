<?php

namespace App\Entity;

use App\Repository\MediaRepository;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Uid\Uuid;
use Symfony\Component\Serializer\Annotation\Groups;

#[ORM\Entity(repositoryClass: MediaRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Media
{
    #[ORM\Id]
    #[ORM\Column(type: 'uuid', unique: true)]
    private ?Uuid $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:list', 'media:detail'])]
    private ?string $path = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['media:list', 'media:detail'])]
    private ?string $thumbnailPath = null;

    #[ORM\Column(length: 255)]
    #[Groups(['media:list', 'media:detail'])]
    private ?string $originalFilename = null;

    #[ORM\Column(length: 50)]
    #[Groups(['media:list', 'media:detail'])]
    private ?string $mimeType = null;
    
    #[ORM\Column(length: 50)]
    #[Groups(['media:list', 'media:detail'])]
    private ?string $mediaType = null; // image, video, document, etc

    #[ORM\Column(nullable: true)]
    #[Groups(['media:list', 'media:detail'])]
    private ?int $fileSize = null;
    
    #[ORM\Column(nullable: true)]
    #[Groups(['media:list', 'media:detail'])]
    private ?array $dimensions = null; // [width, height] pour images/vidéos

    #[ORM\Column]
    #[Groups(['media:list', 'media:detail'])]
    private ?\DateTimeImmutable $createdAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $updatedAt = null;

    #[ORM\Column(nullable: true)]
    private ?\DateTimeImmutable $deletedAt = null;

    #[ORM\OneToMany(mappedBy: 'media', targetEntity: ArticleMedia::class, orphanRemoval: true)]
    private Collection $articleMedia;

    public function __construct()
    {
        $this->id = Uuid::v4();
        $this->articleMedia = new ArrayCollection();
        $this->createdAt = new \DateTimeImmutable();
    }

    #[ORM\PreUpdate]
    public function onPreUpdate()
    {
        $this->updatedAt = new \DateTimeImmutable();
    }
    
    public function getId(): ?Uuid
    {
        return $this->id;
    }

    public function getUrl(): ?string
    {
        return $this->path;
    }
    
    public function getPath(): ?string
    {
        return $this->path;
    }

    public function setPath(string $path): static
    {
        $this->path = $path;

        return $this;
    }
    
    public function getThumbnailPath(): ?string
    {
        return $this->thumbnailPath;
    }

    public function setThumbnailPath(?string $thumbnailPath): static
    {
        $this->thumbnailPath = $thumbnailPath;

        return $this;
    }
    
    public function getOriginalFilename(): ?string
    {
        return $this->originalFilename;
    }

    public function setOriginalFilename(string $originalFilename): static
    {
        $this->originalFilename = $originalFilename;

        return $this;
    }

    public function getMimeType(): ?string
    {
        return $this->mimeType;
    }

    public function setMimeType(string $mimeType): static
    {
        $this->mimeType = $mimeType;
        
        // Set mediaType based on mimeType
        $parts = explode('/', $mimeType);
        $this->mediaType = $parts[0] ?? 'other';

        return $this;
    }
    
    public function getMediaType(): ?string
    {
        return $this->mediaType;
    }

    public function setMediaType(string $mediaType): static
    {
        $this->mediaType = $mediaType;

        return $this;
    }
    
    public function getFileSize(): ?int
    {
        return $this->fileSize;
    }

    public function setFileSize(?int $fileSize): static
    {
        $this->fileSize = $fileSize;

        return $this;
    }
    
    public function getDimensions(): ?array
    {
        return $this->dimensions;
    }

    public function setDimensions(?array $dimensions): static
    {
        $this->dimensions = $dimensions;

        return $this;
    }

    public function getCreatedAt(): ?\DateTimeImmutable
    {
        return $this->createdAt;
    }

    public function setCreatedAt(\DateTimeImmutable $createdAt): static
    {
        $this->createdAt = $createdAt;

        return $this;
    }
    
    public function getUpdatedAt(): ?\DateTimeImmutable
    {
        return $this->updatedAt;
    }

    public function setUpdatedAt(?\DateTimeImmutable $updatedAt): static
    {
        $this->updatedAt = $updatedAt;

        return $this;
    }
    
    public function getDeletedAt(): ?\DateTimeImmutable
    {
        return $this->deletedAt;
    }

    public function setDeletedAt(?\DateTimeImmutable $deletedAt): static
    {
        $this->deletedAt = $deletedAt;

        return $this;
    }
    
    public function isDeleted(): bool
    {
        return $this->deletedAt !== null;
    }

    /**
     * @return Collection<int, ArticleMedia>
     */
    public function getArticleMedia(): Collection
    {
        return $this->articleMedia;
    }

    public function addArticleMedia(ArticleMedia $articleMedia): static
    {
        if (!$this->articleMedia->contains($articleMedia)) {
            $this->articleMedia->add($articleMedia);
            $articleMedia->setMedia($this);
        }

        return $this;
    }

    public function removeArticleMedia(ArticleMedia $articleMedia): static
    {
        if ($this->articleMedia->removeElement($articleMedia)) {
            // set the owning side to null (unless already changed)
            if ($articleMedia->getMedia() === $this) {
                $articleMedia->setMedia(null);
            }
        }

        return $this;
    }
}

<?php

namespace App\Entity;

use App\Repository\ArticleRepository;
use Cocur\Slugify\Slugify;
use Doctrine\Common\Collections\ArrayCollection;
use Doctrine\Common\Collections\Collection;
use Doctrine\DBAL\Types\Types;
use Doctrine\ORM\Mapping as ORM;
use Symfony\Component\Serializer\Annotation\Groups;


#[ORM\Entity(repositoryClass: ArticleRepository::class)]
#[ORM\HasLifecycleCallbacks]
class Article
{
    // Définition des constantes pour les statuts d'article
    public const STATUS_DRAFT = 0;
    public const STATUS_PUBLISHED = 1;
    
    public const STATUSES = [
        'draft' => self::STATUS_DRAFT,
        'published' => self::STATUS_PUBLISHED
    ];
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:list', 'article:detail'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:list', 'article:detail'])]
    private ?string $title = null;

    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:list', 'article:detail'])]
    private ?Category $category = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $metaTitle = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $metaDescription = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:list', 'article:detail'])]
    private ?string $intro = null;

    #[ORM\Column(type: Types::JSON)]
    #[Groups(['article:detail'])]
    private array $steps = [];

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $quote = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $conclusionTitle = null;

    #[ORM\Column(type: Types::JSON, nullable: true)]
    #[Groups(['article:detail'])]
    private ?array $conclusionDescription = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $ctaDescription = null;

    #[ORM\Column(length: 255, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $ctaButton = null;

    #[ORM\PrePersist]
    public function onPrePersist(): void
    {
        $now = new \DateTimeImmutable();
        if (!$this->slug && $this->title) {
            $this->slug = (new Slugify())->slugify($this->title);
        }
        $this->created_at = $now;
        $this->updated_at = $now;
    }

    #[ORM\PreUpdate]
    public function onPreUpdate(): void
    {
        $this->updated_at = new \DateTimeImmutable();
    }

    #[ORM\Column(length: 255, unique: true, updatable: false)]
    #[Groups(['article:list', 'article:detail'])]
    private ?string $slug = null;

    #[ORM\Column]
    #[Groups(['article:list', 'article:detail'])]
    private ?\DateTimeImmutable $created_at = null;

    #[ORM\Column]
    #[Groups(['article:list', 'article:detail'])]
    private ?\DateTimeImmutable $updated_at = null;

    // La fonctionnalité multi-utilisateurs a été simplifiée, tous les articles pointent vers l'admin (id=1)
    #[ORM\ManyToOne]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:list', 'article:detail'])]
    private ?User $author = null;

    #[ORM\Column(type: 'smallint')]
    #[Groups(['article:list', 'article:detail'])]
    private int $status = self::STATUS_PUBLISHED; // Par défaut, les articles sont publiés



    /**
     * @var Collection<int, Media>
     */
    #[ORM\OneToMany(targetEntity: Media::class, mappedBy: 'article')]
    private Collection $media;

    public function __construct()
    {

        $this->media = new ArrayCollection();
    }

    public function getId(): ?int
    {
        return $this->id;
    }

    public function getTitle(): ?string
    {
        return $this->title;
    }

    public function setTitle(string $title): static
    {
        $this->title = $title;

        return $this;
    }

    public function getCategory(): ?Category
    {
        return $this->category;
    }

    public function setCategory(?Category $category): static
    {
        $this->category = $category;
        return $this;
    }

    public function getMetaTitle(): ?string
    {
        return $this->metaTitle;
    }

    public function setMetaTitle(?string $metaTitle): static
    {
        $this->metaTitle = $metaTitle;

        return $this;
    }

    public function getMetaDescription(): ?string
    {
        return $this->metaDescription;
    }

    public function setMetaDescription(?string $metaDescription): static
    {
        $this->metaDescription = $metaDescription;

        return $this;
    }

    public function getIntro(): ?string
    {
        return $this->intro;
    }

    public function setIntro(?string $intro): static
    {
        $this->intro = $intro;

        return $this;
    }

    public function getSteps(): array
    {
        return $this->steps;
    }

    public function setSteps(array $steps): static
    {
        $this->steps = $steps;

        return $this;
    }

    public function getQuote(): ?string
    {
        return $this->quote;
    }

    public function setQuote(?string $quote): self
    {
        $this->quote = $quote;

        return $this;
    }
    
    public function getStatus(): int
    {
        return $this->status;
    }
    
    public function setStatus(int $status): self
    {
        $this->status = $status;

        return $this;
    }
    
    public function getStatusAsString(): string
    {
        return $this->status === self::STATUS_PUBLISHED ? 'published' : 'draft';
    }
    
    public function setStatusFromString(string $statusString): self
    {
        $statusString = strtolower(trim($statusString));
        if ($statusString === 'published') {
            $this->status = self::STATUS_PUBLISHED;
        } else {
            $this->status = self::STATUS_DRAFT;
        }
        
        return $this;
    }

    public function getConclusionTitle(): ?string
    {
        return $this->conclusionTitle;
    }

    public function setConclusionTitle(?string $conclusionTitle): static
    {
        $this->conclusionTitle = $conclusionTitle;
        return $this;
    }

    public function getConclusionDescription(): ?array
    {
        return $this->conclusionDescription;
    }

    public function setConclusionDescription(?array $conclusionDescription): static
    {
        $this->conclusionDescription = $conclusionDescription;
        return $this;
    }

    public function getCtaDescription(): ?string
    {
        return $this->ctaDescription;
    }

    public function setCtaDescription(?string $ctaDescription): static
    {
        $this->ctaDescription = $ctaDescription;
        return $this;
    }

    public function getCtaButton(): ?string
    {
        return $this->ctaButton;
    }

    public function setCtaButton(?string $ctaButton): static
    {
        $this->ctaButton = $ctaButton;
        return $this;
    }

    public function getSlug(): ?string
    {
        return $this->slug;
    }

    public function setSlug(string $slug): static
    {
        $this->slug = $slug;

        return $this;
    }


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

    public function getAuthor(): ?User
    {
        return $this->author;
    }

    public function setAuthor(?User $author): static
    {
        $this->author = $author;

        return $this;
    }



    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedia(Media $media): static
    {
        if (!$this->media->contains($media)) {
            $this->media->add($media);
            $media->setArticle($this);
        }

        return $this;
    }

    public function removeMedia(Media $media): static
    {
        if ($this->media->removeElement($media)) {
            // set the owning side to null (unless already changed)
            if ($media->getArticle() === $this) {
                $media->setArticle(null);
            }
        }

        return $this;
    }
}

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
    #[ORM\Id]
    #[ORM\GeneratedValue]
    #[ORM\Column]
    #[Groups(['article:list', 'article:detail'])]
    private ?int $id = null;

    #[ORM\Column(length: 255)]
    #[Groups(['article:list', 'article:detail'])]
    private ?string $title = null;

    #[ORM\Column(length: 100)]
    #[Groups(['article:list', 'article:detail'])]
    private ?string $category = null;

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

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $conclusion = null;

    #[ORM\Column(type: Types::TEXT, nullable: true)]
    #[Groups(['article:detail'])]
    private ?string $cta = null;

    #[ORM\PrePersist]
    #[ORM\PreUpdate]
    public function generateSlug(): void
    {
        if (!$this->slug && $this->title) {
            $slugify = new Slugify();
            $this->slug = $slugify->slugify($this->title);
        }
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

    #[ORM\ManyToOne(inversedBy: 'article')]
    #[ORM\JoinColumn(nullable: false)]
    #[Groups(['article:list', 'article:detail'])]
    private ?User $author = null;

    /**
     * @var Collection<int, Comment>
     */
    #[ORM\OneToMany(targetEntity: Comment::class, mappedBy: 'article')]
    private Collection $comments;

    /**
     * @var Collection<int, Media>
     */
    #[ORM\OneToMany(targetEntity: Media::class, mappedBy: 'article')]
    private Collection $media;

    public function __construct()
    {
        $this->comments = new ArrayCollection();
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

    public function getCategory(): ?string
    {
        return $this->category;
    }

    public function setCategory(string $category): static
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

    public function setQuote(?string $quote): static
    {
        $this->quote = $quote;

        return $this;
    }

    public function getConclusion(): ?string
    {
        return $this->conclusion;
    }

    public function setConclusion(?string $conclusion): static
    {
        $this->conclusion = $conclusion;

        return $this;
    }

    public function getCta(): ?string
    {
        return $this->cta;
    }

    public function setCta(?string $cta): static
    {
        $this->cta = $cta;

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
     * @return Collection<int, Comment>
     */
    public function getComments(): Collection
    {
        return $this->comments;
    }

    public function addComments(Comment $comment): static
    {
        if (!$this->comments->contains($comment)) {
            $this->comments->add($comment);
            $comment->setArticle($this);
        }

        return $this;
    }

    public function removeComments(Comment $comment): static
    {
        if ($this->comments->removeElement($comment)) {
            // set the owning side to null (unless already changed)
            if ($comment->getArticle() === $this) {
                $comment->setArticle(null);
            }
        }

        return $this;
    }

    /**
     * @return Collection<int, Media>
     */
    public function getMedia(): Collection
    {
        return $this->media;
    }

    public function addMedium(Media $medium): static
    {
        if (!$this->media->contains($medium)) {
            $this->media->add($medium);
            $medium->setArticle($this);
        }

        return $this;
    }

    public function removeMedium(Media $medium): static
    {
        if ($this->media->removeElement($medium)) {
            // set the owning side to null (unless already changed)
            if ($medium->getArticle() === $this) {
                $medium->setArticle(null);
            }
        }

        return $this;
    }
}

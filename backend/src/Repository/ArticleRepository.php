<?php

namespace App\Repository;

use App\Entity\Article;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\ORM\QueryBuilder;
use Doctrine\ORM\Tools\Pagination\Paginator;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Article>
 */
class ArticleRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Article::class);
    }

    /**
     * Recherche d'articles avec filtres et pagination
     * 
     * @param string $search Terme de recherche (optionnel)
     * @param int $categoryId ID de catégorie pour filtrer (optionnel)
     * @param int $authorId ID de l'auteur pour filtrer (optionnel)
     * @param int $status Statut des articles (-1 = tous, 0 = brouillon, 1 = publié)
     * @param int $page Numéro de page (commence à 1)
     * @param int $limit Nombre d'éléments par page
     * @return array Tableau contenant les articles et les métadonnées de pagination
     */
    public function findWithFilters(string $search = '', int $categoryId = 0, int $authorId = 0, int $status = -1, int $page = 1, int $limit = 12): array
    {
        // Valider les paramètres de pagination
        $page = max(1, $page);
        $limit = max(1, $limit);

        // Créer la requête de base avec jointure sur la catégorie
        $qb = $this->createBaseQueryBuilder();

        // Ajouter les filtres si nécessaire
        $this->addSearchFilter($qb, $search);
        $this->addCategoryFilter($qb, $categoryId);
        $this->addAuthorFilter($qb, $authorId);
        $this->addStatusFilter($qb, $status);

        // Appliquer la pagination
        $qb->setFirstResult(($page - 1) * $limit)
            ->setMaxResults($limit);

        // Exécuter la requête avec Paginator pour obtenir le nombre total
        $paginator = new Paginator($qb->getQuery());
        $total = count($paginator);
        $totalPages = (int) ceil($total / $limit);
        $articles = iterator_to_array($paginator->getIterator());

        // Retourner les résultats et les métadonnées
        return [
            'data' => $articles,
            'meta' => [
                'page' => $page,
                'limit' => $limit,
                'total' => $total,
                'totalPages' => $totalPages,
            ],
        ];
    }

    /**
     * Crée une requête de base pour les articles
     */
    private function createBaseQueryBuilder(): QueryBuilder
    {
        return $this->createQueryBuilder('a')
            ->addSelect('c') // Sélectionne aussi la catégorie pour éviter les requêtes N+1
            ->addSelect('u') // Sélectionne aussi l'auteur pour éviter les requêtes N+1
            ->leftJoin('a.category', 'c')
            ->leftJoin('a.author', 'u')
            ->orderBy('a.updated_at', 'DESC');
    }

    /**
     * Ajoute un filtre de recherche à la requête
     */
    private function addSearchFilter(QueryBuilder $qb, string $search): void
    {
        if ($search !== '') {
            $qb->andWhere('a.title LIKE :kw OR a.intro LIKE :kw')
                ->setParameter('kw', '%' . $search . '%');
        }
    }

    /**
     * Ajoute un filtre par catégorie à la requête
     */
    private function addCategoryFilter(QueryBuilder $qb, int $categoryId): void
    {
        if ($categoryId > 0) {
            $qb->andWhere('c.id = :cat')
                ->setParameter('cat', $categoryId);
        }
    }
    
    /**
     * Ajoute un filtre par auteur à la requête
     */
    private function addAuthorFilter(QueryBuilder $qb, int $authorId): void
    {
        if ($authorId > 0) {
            $qb->andWhere('u.id = :author')
                ->setParameter('author', $authorId);
        }
    }
    
    /**
     * Ajoute un filtre par statut à la requête
     */
    private function addStatusFilter(QueryBuilder $qb, int $status): void
    {
        if ($status >= 0) { // -1 = tous les statuts, 0 = brouillon, 1 = publié
            $qb->andWhere('a.status = :status')
                ->setParameter('status', $status);
        }
    }

    /**
     * Trouve un article par son slug avec ses relations
     */
    public function findOneBySlugWithRelations(string $slug): ?Article
    {
        return $this->createQueryBuilder('a')
            ->addSelect('c') // Catégorie
            ->addSelect('u') // Auteur
            ->leftJoin('a.category', 'c')
            ->leftJoin('a.author', 'u')
            ->where('a.slug = :slug')
            ->setParameter('slug', $slug)
            ->getQuery()
            ->getOneOrNullResult();
    }
}

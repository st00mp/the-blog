<?php

namespace App\Repository;

use App\Entity\ArticleMedia;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<ArticleMedia>
 *
 * @method ArticleMedia|null find($id, $lockMode = null, $lockVersion = null)
 * @method ArticleMedia|null findOneBy(array $criteria, array $orderBy = null)
 * @method ArticleMedia[]    findAll()
 * @method ArticleMedia[]    findBy(array $criteria, array $orderBy = null, $limit = null, $offset = null)
 */
class ArticleMediaRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, ArticleMedia::class);
    }

    public function save(ArticleMedia $entity, bool $flush = false): void
    {
        $this->getEntityManager()->persist($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }

    public function remove(ArticleMedia $entity, bool $flush = false): void
    {
        $this->getEntityManager()->remove($entity);

        if ($flush) {
            $this->getEntityManager()->flush();
        }
    }
}

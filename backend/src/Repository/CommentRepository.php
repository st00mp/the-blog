<?php

namespace App\Repository;

use App\Entity\Article;
use App\Entity\Comment;
use Doctrine\Bundle\DoctrineBundle\Repository\ServiceEntityRepository;
use Doctrine\Persistence\ManagerRegistry;

/**
 * @extends ServiceEntityRepository<Comment>
 */
class CommentRepository extends ServiceEntityRepository
{
    public function __construct(ManagerRegistry $registry)
    {
        parent::__construct($registry, Comment::class);
    }

    /**
     * Trouve tous les commentaires racine (sans parent) pour un article donné
     * 
     * @param Article $article L'article pour lequel récupérer les commentaires
     * @return Comment[] Tableau des commentaires racine
     */
    public function findRootCommentsByArticle(Article $article): array
    {
        return $this->createQueryBuilder('c')
            ->where('c.article = :article')
            ->andWhere('c.parent IS NULL')
            ->setParameter('article', $article)
            ->orderBy('c.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }

    /**
     * Trouve tous les commentaires pour un article avec toutes les relations préchargées
     * pour optimiser les performances
     *
     * @param Article $article L'article pour lequel récupérer les commentaires
     * @return Comment[] Tableau de tous les commentaires
     */
    public function findAllByArticleWithRelations(Article $article): array
    {
        return $this->createQueryBuilder('c')
            ->select('c', 'a', 'p', 'ch')
            ->leftJoin('c.author', 'a')
            ->leftJoin('c.parent', 'p')
            ->leftJoin('c.children', 'ch')
            ->where('c.article = :article')
            ->setParameter('article', $article)
            ->orderBy('c.created_at', 'DESC')
            ->getQuery()
            ->getResult();
    }
}

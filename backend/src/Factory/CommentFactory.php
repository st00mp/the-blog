<?php

namespace App\Factory;

use App\Entity\Comment;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;


/**
 * @extends PersistentProxyObjectFactory<Comment>
 */
final class CommentFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct() {}

    public static function class(): string
    {
        return Comment::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array|callable
    {
        return [
            'content' => self::faker()->paragraph(),
            'created_at' => \DateTimeImmutable::createFromMutable(self::faker()->dateTimeThisDecade()),
            'updated_at' => \DateTimeImmutable::createFromMutable(self::faker()->dateTimeThisYear()),
            'author' => UserFactory::new(),
            'article' => ArticleFactory::random(),
            // 'parent' => self::faker()->boolean(30) ? CommentFactory::random() : null, // 30% de réponses
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Comment $comment): void {})
        ;
    }
}

<?php

namespace App\Factory;

use App\Entity\Article;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;
use App\Factory\UserFactory;

/**
 * @extends PersistentProxyObjectFactory<Article>
 */
final class ArticleFactory extends PersistentProxyObjectFactory
{
    public function __construct()
    {
        parent::__construct();
    }

    public static function class(): string
    {
        return Article::class;
    }

    protected function defaults(): array|callable
    {
        return [
            'author' => UserFactory::new(),
            'title' => self::faker()->sentence(6),
            'intro' => self::faker()->paragraph(2),
            'quote' => self::faker()->sentence(),
            'conclusion' => self::faker()->paragraph(2),
            'cta' => self::faker()->sentence(),
            'category' => self::faker()->randomElement([
                'agents-ia',
                'llm',
                'prompting',
                'autonomie',
                'infrastructure',
                'veille',
                'tuto',
            ]),
            'metaTitle' => self::faker()->sentence(6),
            'metaDescription' => self::faker()->text(160),
            'steps' => [
                [
                    'title' => self::faker()->sentence(4),
                    'content' => '<p>' . self::faker()->paragraph(2) . '</p>',
                ],
                [
                    'title' => self::faker()->sentence(4),
                    'content' => '<p>' . self::faker()->paragraph(2) . '</p>',
                ],
                [
                    'title' => self::faker()->sentence(4),
                    'content' => '<p>' . self::faker()->paragraph(2) . '</p>',
                ],
            ],
            'created_at' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
            'updated_at' => \DateTimeImmutable::createFromMutable(self::faker()->dateTime()),
        ];
    }

    protected function initialize(): static
    {
        return $this;
    }
}

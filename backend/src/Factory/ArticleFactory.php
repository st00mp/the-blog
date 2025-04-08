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
            'conclusionTitle' => self::faker()->sentence(4),

            // Simuler un contenu Tiptap minimal en JSON (pas du HTML)
            'conclusionDescription' => [
                'type' => 'doc',
                'content' => [
                    [
                        'type' => 'paragraph',
                        'content' => [
                            ['type' => 'text', 'text' => self::faker()->sentence(10)]
                        ]
                    ]
                ]
            ],

            'ctaDescription' => self::faker()->sentence(10),
            'ctaButton' => self::faker()->word(),
            'category' => CategoryFactory::new(),
            'metaTitle' => self::faker()->sentence(6),
            'metaDescription' => self::faker()->text(160),
            'steps' => [
                [
                    'title' => self::faker()->sentence(4),
                    'content' => [
                        'type' => 'doc',
                        'content' => [
                            [
                                'type' => 'paragraph',
                                'content' => [
                                    ['type' => 'text', 'text' => self::faker()->paragraph(2)]
                                ]
                            ]
                        ]
                    ]
                ],
                [
                    'title' => self::faker()->sentence(4),
                    'content' => [
                        'type' => 'doc',
                        'content' => [
                            [
                                'type' => 'paragraph',
                                'content' => [
                                    ['type' => 'text', 'text' => self::faker()->paragraph(2)]
                                ]
                            ]
                        ]
                    ]
                ],
                [
                    'title' => self::faker()->sentence(4),
                    'content' => [
                        'type' => 'doc',
                        'content' => [
                            [
                                'type' => 'paragraph',
                                'content' => [
                                    ['type' => 'text', 'text' => self::faker()->paragraph(2)]
                                ]
                            ]
                        ]
                    ]
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

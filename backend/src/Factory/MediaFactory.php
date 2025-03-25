<?php

namespace App\Factory;

use App\Entity\Media;
use Zenstruck\Foundry\Persistence\PersistentProxyObjectFactory;

/**
 * @extends PersistentProxyObjectFactory<Media>
 */
final class MediaFactory extends PersistentProxyObjectFactory
{
    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#factories-as-services
     *
     * @todo inject services if required
     */
    public function __construct() {}

    public static function class(): string
    {
        return Media::class;
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#model-factories
     *
     * @todo add your default values here
     */
    protected function defaults(): array
    {
        $mediaType = self::faker()->randomElement(['image', 'video', 'audio']);

        return [
            'type' => $mediaType,
            'url' => match ($mediaType) {
                'image' => self::faker()->imageUrl(),
                'video' => 'https://example.com/video.mp4',
                'audio' => 'https://example.com/audio.mp3',
            },
            'uploaded_at' => \DateTimeImmutable::createFromMutable(self::faker()->dateTimeThisDecade()),
            'article' => ArticleFactory::random(),
        ];
    }

    /**
     * @see https://symfony.com/bundles/ZenstruckFoundryBundle/current/index.html#initialization
     */
    protected function initialize(): static
    {
        return $this
            // ->afterInstantiate(function(Media $media): void {})
        ;
    }
}

<?php

namespace App\Command;

use App\Entity\Article;
use App\Factory\ArticleFactory;
use App\Factory\CommentFactory;
use App\Factory\MediaFactory;
use App\Factory\UserFactory;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:load-fixtures',
    description: 'Réinitialise et charge des données fictives via Foundry',
)]
class LoadFixturesCommand extends Command
{
    public function __construct(private EntityManagerInterface $em)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('🎯 Réinitialisation de la base + génération des données via Foundry');

        // 🔥 Purge la base de données (attention, irréversible)
        $connection = $this->em->getConnection();
        $platform = $connection->getDatabasePlatform();
        $connection->executeStatement('SET FOREIGN_KEY_CHECKS=0');
        foreach (['comment', 'media', 'article', 'user'] as $table) {
            $connection->executeStatement($platform->getTruncateTableSQL($table, true));
        }
        $connection->executeStatement('SET FOREIGN_KEY_CHECKS=1');
        $io->warning('Base de données vidée');

        // 👥 Utilisateurs
        $io->section('Utilisateurs');
        $users = UserFactory::createMany(5);

        // 📁 Catégories
        $io->section('Catégories');
        $categories = [
            'Agents IA',
            'Grands modèles de langage',
            'Prompt Engineering',
            'Autonomie des IA',
            'Infra & orchestration',
            'Veille et innovations',
            'Tutos & démos',
        ];
        $categoryObjects = [];

        foreach ($categories as $name) {
            $categoryObjects[] = \App\Factory\CategoryFactory::new(['name' => $name])->create();
        }

        // 📝 Articles
        $io->section('Articles');
        ArticleFactory::createMany(10, fn() => [
            'author' => $users[array_rand($users)],
            'category' => $categoryObjects[array_rand($categoryObjects)],
        ]);

        // 📸 Médias
        $io->section('Médias');
        MediaFactory::createMany(8);

        // 💬 Commentaires imbriqués
        $io->section('Commentaires');
        $root = CommentFactory::createMany(10, ['parent' => null]);
        $lvl1 = CommentFactory::createMany(10, fn() => ['parent' => $root[array_rand($root)]]);
        $lvl2 = CommentFactory::createMany(5, fn() => ['parent' => $lvl1[array_rand($lvl1)]]);
        CommentFactory::createMany(3, fn() => ['parent' => $lvl2[array_rand($lvl2)]]);

        $io->success('🎉 Données fictives générées avec succès !');
        return Command::SUCCESS;
    }
}

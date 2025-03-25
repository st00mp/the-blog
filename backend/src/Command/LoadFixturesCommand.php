<?php

namespace App\Command;

use App\Factory\ArticleFactory;
use App\Factory\CommentFactory;
use App\Factory\MediaFactory;
use App\Factory\UserFactory;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:load-fixtures',
    description: 'Charge les données fictives via Foundry',
)]
class LoadFixturesCommand extends Command
{
    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $io->title('Génération des données via Foundry 🧪');

        $io->section('Utilisateurs');
        UserFactory::createMany(5);

        $io->section('Articles');
        ArticleFactory::createMany(10);

        $io->section('Médias');
        MediaFactory::createMany(8);

        $io->section('Commentaires');

        // Étape 1 : commentaires racine
        $rootComments = CommentFactory::createMany(10, [
            'parent' => null,
        ]);

        // Étape 2 : réponses à des commentaires racine
        $level1Comments = CommentFactory::createMany(10, function () use ($rootComments) {
            return [
                'parent' => $rootComments[array_rand($rootComments)],
            ];
        });

        // Étape 3 : réponses à des réponses (niveau 2)
        $level2Comments = CommentFactory::createMany(5, function () use ($level1Comments) {
            return [
                'parent' => $level1Comments[array_rand($level1Comments)],
            ];
        });

        // (Optionnel) Étape 4 : encore un niveau si tu veux du nested deep
        CommentFactory::createMany(3, function () use ($level2Comments) {
            return [
                'parent' => $level2Comments[array_rand($level2Comments)],
            ];
        });

        $io->success('Fixtures imbriquées générées avec succès ✅');
        return Command::SUCCESS;
    }
}

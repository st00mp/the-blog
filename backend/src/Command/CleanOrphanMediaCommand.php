<?php

namespace App\Command;

use App\Entity\Media;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Component\Console\Attribute\AsCommand;
use Symfony\Component\Console\Command\Command;
use Symfony\Component\Console\Input\InputInterface;
use Symfony\Component\Console\Output\OutputInterface;
use Symfony\Component\Console\Style\SymfonyStyle;

#[AsCommand(
    name: 'app:clean-orphan-media',
    description: 'Remove files from the uploads directory that are not referenced in the media table.'
)]
final class CleanOrphanMediaCommand extends Command
{
    public function __construct(private EntityManagerInterface $em, private string $projectDir)
    {
        parent::__construct();
    }

    protected function execute(InputInterface $input, OutputInterface $output): int
    {
        $io = new SymfonyStyle($input, $output);

        $uploadDir = $this->projectDir . '/public/uploads';
        if (!is_dir($uploadDir)) {
            $io->error(sprintf('Upload directory "%s" does not exist.', $uploadDir));
            return Command::FAILURE;
        }

        $urls = $this->em->getRepository(Media::class)
            ->createQueryBuilder('m')
            ->select('m.url')
            ->getQuery()
            ->getArrayResult();
        $urls = array_column($urls, 'url');
        $urls = array_map(fn($u) => ltrim($u, '/'), $urls);

        $removed = 0;
        $files = new \RecursiveIteratorIterator(new \RecursiveDirectoryIterator($uploadDir, \FilesystemIterator::SKIP_DOTS));
        foreach ($files as $file) {
            if (!$file->isFile()) {
                continue;
            }
            $relative = ltrim(str_replace($this->projectDir . '/public/', '', $file->getPathname()), '/');
            if (!in_array($relative, $urls, true)) {
                unlink($file->getPathname());
                $removed++;
            }
        }

        $io->success(sprintf('%d orphan file(s) removed.', $removed));

        return Command::SUCCESS;
    }
}

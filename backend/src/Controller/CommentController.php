<?php

namespace App\Controller;

use App\Entity\Article;
use App\Entity\Comment;
use App\Entity\User;
use Doctrine\ORM\EntityManagerInterface;
use Symfony\Bundle\FrameworkBundle\Controller\AbstractController;
use Symfony\Component\HttpFoundation\JsonResponse;
use Symfony\Component\HttpFoundation\Request;
use Symfony\Component\HttpFoundation\Response;
use Symfony\Component\Routing\Attribute\Route;
use Symfony\Component\Serializer\SerializerInterface;
use Symfony\Component\Security\Core\Exception\AccessDeniedException;
use Psr\Log\LoggerInterface;

class CommentController extends AbstractController
{
    private $entityManager;
    private $serializer;
    private $logger;

    public function __construct(
        EntityManagerInterface $entityManager,
        SerializerInterface $serializer,
        LoggerInterface $logger
    ) {
        $this->entityManager = $entityManager;
        $this->serializer = $serializer;
        $this->logger = $logger;
    }

    /**
     * Récupérer tous les commentaires d'un article par son slug
     */
    #[Route('/api/articles/{slug}/comments', name: 'api_article_comments', methods: ['GET'])]
    public function getArticleComments(string $slug): JsonResponse
    {
        try {
            $article = $this->entityManager->getRepository(Article::class)->findOneBy(['slug' => $slug]);
            
            if (!$article) {
                return new JsonResponse(['error' => 'Article non trouvé'], Response::HTTP_NOT_FOUND);
            }
            
            // Récupérer seulement les commentaires de premier niveau (sans parent)
            $comments = $this->entityManager->getRepository(Comment::class)
                ->createQueryBuilder('c')
                ->where('c.article = :article')
                ->andWhere('c.parent IS NULL')
                ->setParameter('article', $article)
                ->orderBy('c.created_at', 'DESC')
                ->getQuery()
                ->getResult();
            
            $formattedComments = [];
            foreach ($comments as $comment) {
                $formattedComments[] = $this->formatComment($comment);
            }
            
            return new JsonResponse($formattedComments);
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la récupération des commentaires', [
                'error' => $e->getMessage(),
                'article_slug' => $slug
            ]);
            
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la récupération des commentaires'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Ajouter un commentaire à un article
     */
    #[Route('/api/articles/{slug}/comments', name: 'api_add_comment', methods: ['POST'])]
    public function addComment(Request $request, string $slug): JsonResponse
    {
        try {
            // Vérifier si l'utilisateur est connecté
            $user = $this->getUser();
            if (!$user || !$user instanceof User) {
                return new JsonResponse(
                    ['error' => 'Vous devez être connecté pour ajouter un commentaire'],
                    Response::HTTP_UNAUTHORIZED
                );
            }
            
            $data = json_decode($request->getContent(), true);
            if (!isset($data['content']) || empty(trim($data['content']))) {
                return new JsonResponse(
                    ['error' => 'Le contenu du commentaire ne peut pas être vide'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            
            $article = $this->entityManager->getRepository(Article::class)->findOneBy(['slug' => $slug]);
            if (!$article) {
                return new JsonResponse(['error' => 'Article non trouvé'], Response::HTTP_NOT_FOUND);
            }
            
            $comment = new Comment();
            $comment->setContent($data['content']);
            $comment->setArticle($article);
            $comment->setAuthor($user);
            $comment->setCreatedAt(new \DateTimeImmutable());
            $comment->setUpdatedAt(new \DateTimeImmutable());
            
            // Si c'est une réponse à un commentaire existant
            if (isset($data['parentId']) && !empty($data['parentId'])) {
                $parentComment = $this->entityManager->getRepository(Comment::class)->find($data['parentId']);
                if ($parentComment) {
                    $comment->setParent($parentComment);
                }
            }
            
            $this->entityManager->persist($comment);
            $this->entityManager->flush();
            
            return new JsonResponse(
                $this->formatComment($comment),
                Response::HTTP_CREATED
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de l\'ajout d\'un commentaire', [
                'error' => $e->getMessage(),
                'article_slug' => $slug
            ]);
            
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de l\'ajout du commentaire'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }

    /**
     * Mettre en forme un commentaire pour l'API
     */
    private function formatComment(Comment $comment): array
    {
        $children = [];
        foreach ($comment->getChildren() as $child) {
            $children[] = $this->formatComment($child);
        }
        
        $currentUser = $this->getUser();
        $isAuthor = $currentUser && $currentUser instanceof User && $currentUser->getId() === $comment->getAuthor()->getId();
        
        return [
            'id' => $comment->getId(),
            'content' => $comment->getContent(),
            'createdAt' => $comment->getCreatedAt()->format('c'),
            'updatedAt' => $comment->getUpdatedAt()->format('c'),
            'author' => [
                'id' => $comment->getAuthor()->getId(),
                'name' => $comment->getAuthor()->getName()
            ],
            'children' => $children,
            'isOwner' => $isAuthor // Indique si l'utilisateur courant est l'auteur du commentaire
        ];
    }
    
    /**
     * Modifier un commentaire
     */
    #[Route('/api/comments/{id}', name: 'api_update_comment', methods: ['PUT'])]
    public function updateComment(Request $request, int $id): JsonResponse
    {
        try {
            // Vérifier si l'utilisateur est connecté
            $user = $this->getUser();
            if (!$user || !$user instanceof User) {
                return new JsonResponse(
                    ['error' => 'Vous devez être connecté pour modifier un commentaire'],
                    Response::HTTP_UNAUTHORIZED
                );
            }
            
            // Récupérer le commentaire
            $comment = $this->entityManager->getRepository(Comment::class)->find($id);
            
            if (!$comment) {
                return new JsonResponse(['error' => 'Commentaire non trouvé'], Response::HTTP_NOT_FOUND);
            }
            
            // Vérifier que l'utilisateur est l'auteur du commentaire
            if ($comment->getAuthor()->getId() !== $user->getId()) {
                throw new AccessDeniedException('Vous n\'avez pas l\'autorisation de modifier ce commentaire');
            }
            
            $data = json_decode($request->getContent(), true);
            if (!isset($data['content']) || empty(trim($data['content']))) {
                return new JsonResponse(
                    ['error' => 'Le contenu du commentaire ne peut pas être vide'],
                    Response::HTTP_BAD_REQUEST
                );
            }
            
            // Mettre à jour le commentaire
            $comment->setContent($data['content']);
            $comment->setUpdatedAt(new \DateTimeImmutable());
            
            $this->entityManager->flush();
            
            return new JsonResponse(
                $this->formatComment($comment),
                Response::HTTP_OK
            );
        } catch (AccessDeniedException $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                Response::HTTP_FORBIDDEN
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la modification d\'un commentaire', [
                'error' => $e->getMessage(),
                'comment_id' => $id
            ]);
            
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la modification du commentaire'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
    
    /**
     * Supprimer un commentaire
     */
    #[Route('/api/comments/{id}', name: 'api_delete_comment', methods: ['DELETE'])]
    public function deleteComment(int $id): JsonResponse
    {
        try {
            // Vérifier si l'utilisateur est connecté
            $user = $this->getUser();
            if (!$user || !$user instanceof User) {
                return new JsonResponse(
                    ['error' => 'Vous devez être connecté pour supprimer un commentaire'],
                    Response::HTTP_UNAUTHORIZED
                );
            }
            
            // Récupérer le commentaire
            $comment = $this->entityManager->getRepository(Comment::class)->find($id);
            
            if (!$comment) {
                return new JsonResponse(['error' => 'Commentaire non trouvé'], Response::HTTP_NOT_FOUND);
            }
            
            // Vérifier que l'utilisateur est l'auteur du commentaire
            if ($comment->getAuthor()->getId() !== $user->getId()) {
                throw new AccessDeniedException('Vous n\'avez pas l\'autorisation de supprimer ce commentaire');
            }
            
            // Pour les commentaires avec des réponses, on supprime le contenu mais on garde la structure
            if (count($comment->getChildren()) > 0) {
                $comment->setContent('[Ce commentaire a été supprimé]');
                $this->entityManager->flush();
            } else {
                // Si c'est une feuille (pas d'enfants), on peut le supprimer complètement
                $this->entityManager->remove($comment);
                $this->entityManager->flush();
            }
            
            return new JsonResponse(null, Response::HTTP_NO_CONTENT);
        } catch (AccessDeniedException $e) {
            return new JsonResponse(
                ['error' => $e->getMessage()],
                Response::HTTP_FORBIDDEN
            );
        } catch (\Exception $e) {
            $this->logger->error('Erreur lors de la suppression d\'un commentaire', [
                'error' => $e->getMessage(),
                'comment_id' => $id
            ]);
            
            return new JsonResponse(
                ['error' => 'Une erreur est survenue lors de la suppression du commentaire'],
                Response::HTTP_INTERNAL_SERVER_ERROR
            );
        }
    }
}

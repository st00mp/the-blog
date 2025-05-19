"use client"

import { useState, useEffect } from "react"
import { Textarea } from "@/components/ui/textarea"
import { Button } from "@/components/ui/button"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { getArticleComments, addComment, formatCommentDate, type Comment } from "@/services/commentService"
import { cn } from "@/lib/utils"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { LoginForm } from "@/components/login-form"
import { useRouter } from "next/navigation"

type CommentSectionProps = {
  articleId: string
  isLoggedIn: boolean
  currentUser?: {
    id: number
    name: string
  }
  onLogin?: () => void
}

export default function CommentSection({ articleId, isLoggedIn, currentUser, onLogin }: CommentSectionProps) {
  const router = useRouter()
  const [loginDialogOpen, setLoginDialogOpen] = useState(false)
  const [comments, setComments] = useState<Comment[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [newComment, setNewComment] = useState("") // Pour le commentaire principal
  const [submitting, setSubmitting] = useState(false)

  useEffect(() => {
    loadComments()
  }, [articleId])

  const loadComments = async () => {
    try {
      setIsLoading(true)
      setError(null)
      const data = await getArticleComments(articleId)
      setComments(data)
    } catch (err) {
      setError("Impossible de charger les commentaires.")
      console.error(err)
    } finally {
      setIsLoading(false)
    }
  }

  // Gère l'ajout d'un commentaire principal (sans parent)
  const handleAddRootComment = async () => {
    if (!newComment.trim() || submitting) return
    
    try {
      setSubmitting(true)
      const comment = await addComment(articleId, newComment)
      setComments(prevComments => [comment, ...prevComments])
      setNewComment("")
    } catch (err) {
      console.error("Erreur lors de l'ajout du commentaire:", err)
    } finally {
      setSubmitting(false)
    }
  }
  
  // Cette fonction est passée aux CommentItem pour mettre à jour l'arbre de commentaires
  const updateCommentTree = (parentId: number, newReply: Comment) => {
    setComments(prevComments => {
      return prevComments.map(c => {
        // Si c'est le commentaire parent direct, ajouter la réponse à ses enfants
        if (c.id === parentId) {
          return { ...c, children: [...c.children, newReply] }
        }
        // Sinon, vérifier récursivement dans les enfants
        if (c.children.length > 0) {
          return { ...c, children: updateChildrenRecursively(c.children, parentId, newReply) }
        }
        return c
      })
    })
  }
  
  // Fonction récursive pour mettre à jour les commentaires enfants à n'importe quel niveau
  const updateChildrenRecursively = (children: Comment[], parentId: number, newReply: Comment): Comment[] => {
    return children.map(child => {
      if (child.id === parentId) {
        return { ...child, children: [...child.children, newReply] }
      }
      if (child.children.length > 0) {
        return { ...child, children: updateChildrenRecursively(child.children, parentId, newReply) }
      }
      return child
    })
  }

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(n => n[0])
      .join('')
      .toUpperCase()
      .substring(0, 2)
  }

  // Composant CommentItem avec gestion locale de son propre état de réponse
  function CommentItem({ comment, level = 0 }: { comment: Comment; level?: number }) {
    // État local pour ce commentaire spécifique
    const [isReplying, setIsReplying] = useState(false)
    const [replyText, setReplyText] = useState("")
    const [isSubmitting, setIsSubmitting] = useState(false)

    // Limiter la profondeur de l'imbrication visuelle
    const effectiveLevel = Math.min(level, 3);

    // Fonction pour gérer la soumission de la réponse à ce commentaire spécifique
    const handleSubmitReply = async () => {
      if (!replyText.trim() || isSubmitting) return

      try {
        setIsSubmitting(true)
        const reply = await addComment(articleId, replyText, comment.id)
        
        // Mettre à jour l'arbre de commentaires via la fonction du parent
        updateCommentTree(comment.id, reply)
        
        // Réinitialiser l'état local
        setReplyText("")
        setIsReplying(false)
      } catch (err) {
        console.error("Erreur lors de l'ajout de la réponse:", err)
      } finally {
        setIsSubmitting(false)
      }
    }

    return (
      <div className={`flex items-start gap-3 md:gap-4 pt-5 pb-3 ${level > 0 ? 'relative' : ''}`}>
        <div className={`${effectiveLevel > 0 ? 'pl-2 sm:pl-3 md:pl-4' : ''}`}>
          <Avatar className={`w-8 h-8 md:h-10 md:w-10 border border-zinc-800 bg-zinc-900 flex-shrink-0`}>
            <AvatarFallback className="bg-zinc-800 text-zinc-300 text-xs md:text-sm">
              {getInitials(comment.author.name)}
            </AvatarFallback>
          </Avatar>
        </div>
        <div className="grid gap-1.5 w-full">
          <div className="flex items-center flex-wrap gap-1 sm:gap-2">
            <div className="font-medium text-zinc-200 text-sm md:text-base">{comment.author.name}</div>
            <div className="text-xs text-zinc-500">{formatCommentDate(comment.createdAt)}</div>
          </div>
          <div className="text-xs sm:text-sm text-zinc-400">
            {comment.content}
          </div>

          {isLoggedIn && (
            <div className="pt-1">
              <button
                onClick={() => setIsReplying(true)}
                className="text-xs text-zinc-500 hover:text-zinc-300 transition"
              >
                Répondre
              </button>
            </div>
          )}

          {isReplying && (
            <div className="mt-3 grid gap-2">
              <div className="overflow-hidden">
                <Textarea
                  placeholder="Écrire une réponse..."
                  className="bg-zinc-800/50 border-zinc-700 placeholder:text-zinc-500 resize-none min-h-[80px] w-full outline-none focus-visible:ring-4 focus-visible:ring-zinc-700/50 rounded-md focus-visible:border-zinc-600"
                  value={replyText}
                  onChange={(e) => setReplyText(e.target.value)}
                  spellCheck="false"
                  dir="ltr"
                />
              </div>
              <div className="flex gap-2">
                <Button
                  onClick={handleSubmitReply}
                  className="bg-zinc-800 hover:bg-zinc-700 text-white"
                  disabled={isSubmitting || !replyText.trim()}
                  size="sm"
                >
                  {isSubmitting ? "Envoi..." : "Répondre"}
                </Button>
                <Button
                  onClick={() => {
                    setIsReplying(false)
                    setReplyText("")
                  }}
                  variant="outline"
                  className="border-zinc-700 text-zinc-400 hover:bg-zinc-800 hover:text-zinc-300"
                  size="sm"
                >
                  Annuler
                </Button>
              </div>
            </div>
          )}

          {/* Commentaires enfants (réponses) avec niveau incrémenté - responsive pour mobile */}
          {comment.children && comment.children.length > 0 && (
            <div className="ml-4 sm:ml-6 md:ml-8 mt-3 border-l border-zinc-800 pl-3 sm:pl-4 md:pl-6 space-y-4">
              {comment.children.map(childComment => (
                <CommentItem key={childComment.id} comment={childComment} level={level + 1} />
              ))}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto space-y-8 py-8 mt-8">
      <h2 className="text-2xl font-bold text-zinc-200">Commentaires</h2>

      {isLoggedIn ? (
        <div className="grid gap-3">
          {/* Ajouté overflow-hidden pour stabiliser le textarea principal */}
          <div className="overflow-hidden">
            <Textarea
              placeholder="Écrire un commentaire..."
              className="bg-zinc-800/50 border-zinc-700 placeholder:text-zinc-500 resize-none min-h-[100px] w-full outline-none focus-visible:ring-4 focus-visible:ring-zinc-700/50 rounded-md focus-visible:border-zinc-600"
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              spellCheck="false"
              dir="ltr"
            />
          </div>
          <div>
            <Button
              onClick={handleAddRootComment}
              className="bg-zinc-800 hover:bg-zinc-700 text-white"
              disabled={submitting || !newComment.trim()}
            >
              {submitting ? "Envoi en cours..." : "Publier le commentaire"}
            </Button>
          </div>
        </div>
      ) : (
        <Dialog open={loginDialogOpen} onOpenChange={setLoginDialogOpen}>
          <DialogTrigger asChild>
            <div className="p-4 bg-zinc-800/30 border border-zinc-800 rounded-md cursor-pointer hover:bg-zinc-800/50 transition-colors">
              <p className="text-zinc-400 text-sm flex items-center justify-between">
                Vous devez être connecté pour ajouter un commentaire.
                <Button variant="outline" size="sm" className="text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700">
                  Se connecter
                </Button>
              </p>
            </div>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md bg-zinc-900 border-zinc-800">
            <DialogHeader>
              <DialogTitle className="text-center text-xl text-white mb-2">
                Se connecter
              </DialogTitle>
            </DialogHeader>
            <LoginForm
              onSuccess={() => {
                setLoginDialogOpen(false);
                // Rafraîchir la page pour mettre à jour l'état de connexion
                router.refresh();
                if (onLogin) onLogin();
              }}
            />
          </DialogContent>
        </Dialog>
      )}

      {isLoading ? (
        <div className="py-4 text-center text-zinc-500">Chargement des commentaires ...</div>
      ) : error ? (
        <div className="py-4 text-center text-red-400">{error}</div>
      ) : comments.length === 0 ? (
        <div className="py-4 text-center text-zinc-500">Aucun commentaire pour le moment. Soyez le premier à commenter !</div>
      ) : (
        <div className="divide-y divide-zinc-800">
          {comments.map(comment => (
            <CommentItem key={comment.id} comment={comment} />
          ))}
        </div>
      )}
    </div>
  )
}

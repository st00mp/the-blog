"use client"

import { useState } from "react"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { MoreHorizontal, Eye, FileEdit, Trash2, FilePlus, Send, FileQuestion, FileMinus } from "lucide-react"
import Link from "next/link"
import { useToast } from "@/components/ui/use-toast"

import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import { Button } from "@/components/ui/button"
import { updateArticleStatus } from "@/services/articleService"

import { Article } from "@/services/articleService"

type ArticlesTableProps = {
  articles: Article[]
  onDelete: (id: string, slug?: string) => void
  isDeleting?: boolean
  onStatusChange?: (article: Article) => void
}

export function AdminArticlesTable({ articles, onDelete, isDeleting = false, onStatusChange }: ArticlesTableProps) {
  const { toast } = useToast()
  const [updatingStatusId, setUpdatingStatusId] = useState<string | null>(null)
  // État pour la confirmation de suppression
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Formater la date pour l'affichage avec gestion des fuseaux horaires
  const formatDate = (dateString: string | undefined): string => {
    try {
      // Vérification si la date est au format créé par notre backend
      if (dateString && dateString.length > 0) {
        // Conversion de la date en tenant compte du fuseau horaire
        // Format de dateString attendu: 2025-05-18T22:30:00+00:00 (format ISO)
        // ou 2025-05-18T22:30:00.000Z (format ISO avec Z pour UTC)
        
        // 1. Convertir en objet Date (qui sera interprété selon le fuseau local)
        const date = new Date(dateString);
        
        // 2. Vérifier si la date est valide
        if (!isNaN(date.getTime())) {
          // 3. Formater avec le locale français
          // Le format 'dd MMM yyyy' affichera par exemple "19 mai 2025"
          return format(date, "dd MMM yyyy", { locale: fr });
        }
      }
      
      // En cas de date invalide ou manquante, afficher un message
      return "Date inconnue";
    } catch (error) {
      console.error("Erreur de formatage de date:", error, dateString);
      return "Date inconnue";
    }
  }

  // Récupérer l'extrait de l'article (utilisant intro si disponible)
  const getExcerpt = (article: Article): string => {
    return article.intro || ""
  }

  // Gérer la demande de suppression
  const handleDeleteRequest = (id: string, slug?: string) => {
    setDeleteConfirmId(id)
  }

  // Confirmer la suppression
  const confirmDelete = (id: string, slug?: string) => {
    onDelete(id, slug)
    setDeleteConfirmId(null)
  }
  
  // Changer le statut d'un article (publier ou dépublier) - sans notification
  const handleStatusChange = async (id: string, newStatus: 'published' | 'draft') => {
    try {
      setUpdatingStatusId(id)
      const updatedArticle = await updateArticleStatus(id, newStatus)
      
      // Mettre à jour l'interface utilisateur sans notification
      if (onStatusChange) {
        onStatusChange(updatedArticle)
      } else {
        // Attendre un peu avant de rafraîchir la page
        setTimeout(() => {
          window.location.reload()
        }, 500)
      }
      
    } catch (error) {
      console.error("Erreur lors du changement de statut:", error)
      // Afficher une notification uniquement en cas d'erreur
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de changer le statut de l'article."
      })
    } finally {
      setUpdatingStatusId(null)
    }
  }

  // Annuler la suppression
  const cancelDelete = () => {
    setDeleteConfirmId(null)
  }

  return (
    <div className="relative overflow-x-auto">
      <table className="w-full text-sm text-left text-zinc-300">
        <thead className="text-xs uppercase bg-zinc-800 text-zinc-400">
          <tr>
            <th scope="col" className="px-6 py-3">Titre</th>
            <th scope="col" className="px-6 py-3">Date de création</th>
            <th scope="col" className="px-6 py-3">Statut</th>
            <th scope="col" className="px-6 py-3 text-right">Actions</th>
          </tr>
        </thead>
        <tbody>
          {articles.map((article) => (
            <tr key={article.id} className="border-b border-zinc-800 bg-zinc-900 hover:bg-zinc-800">
              <td className="px-6 py-4 font-medium whitespace-nowrap">
                <div className="flex flex-col">
                  <span className="text-zinc-200">{article.title}</span>
                  <span className="text-xs text-zinc-400 mt-1 line-clamp-1">{getExcerpt(article)}</span>
                </div>
              </td>
              <td className="px-6 py-4">{formatDate(article.createdAt)}</td>
              <td className="px-6 py-4">
                <Badge
                  className={
                    article.status === "published"
                      ? "bg-green-900/30 text-green-400 hover:bg-green-900/40"
                      : "bg-amber-900/30 text-amber-400 hover:bg-amber-900/40"
                  }
                >
                  <div className="flex items-center">
                    <span className={`w-2 h-2 rounded-full mr-2 ${article.status === "published" ? "bg-green-500" : "bg-amber-500"}`}></span>
                    {article.status === "published" ? "Publié" : "Brouillon"}
                  </div>
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                {deleteConfirmId === article.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-zinc-400 mr-2">Confirmer ?</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => confirmDelete(article.id, article.slug)}
                      className="h-8 px-2 text-xs"
                    >
                      Oui
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={cancelDelete}
                      className="h-8 px-2 text-xs bg-transparent border-zinc-700 text-zinc-300 hover:bg-zinc-800"
                    >
                      Non
                    </Button>
                  </div>
                ) : (
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="icon" className="h-8 w-8">
                        <MoreHorizontal className="h-4 w-4" />
                        <span className="sr-only">Actions pour {article.title}</span>
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="end"
                      className="w-48 bg-zinc-900 border border-zinc-800 text-zinc-200"
                    >
                      <DropdownMenuLabel className="text-zinc-400">Actions</DropdownMenuLabel>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      
                      {/* Actions de statut - contextuelles selon l'état de publication */}
                      {article.status === "published" ? (
                        // Actions pour un article publié
                        <>
                          <DropdownMenuItem asChild className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800">
                            <Link href={`/blog/${article.slug}`} target="_blank">
                              <Eye className="h-4 w-4" />
                              <span>Voir sur le site</span>
                            </Link>
                          </DropdownMenuItem>
                          <DropdownMenuItem
                            className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800"
                            onClick={() => handleStatusChange(article.id, 'draft')}
                            disabled={updatingStatusId === article.id}
                          >
                            <FileMinus className="h-4 w-4" />
                            <span>{updatingStatusId === article.id ? 'En cours...' : 'Dépublier'}</span>
                          </DropdownMenuItem>
                        </>
                      ) : (
                        // Actions pour un article en brouillon
                        <>
                          <DropdownMenuItem
                            className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800"
                            onClick={() => handleStatusChange(article.id, 'published')}
                            disabled={updatingStatusId === article.id}
                          >
                            <Send className="h-4 w-4" />
                            <span>{updatingStatusId === article.id ? 'En cours...' : 'Publier'}</span>
                          </DropdownMenuItem>
                          <DropdownMenuItem asChild className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800">
                            <Link href={`/preview/${article.slug}`} target="_blank">
                              <FileQuestion className="h-4 w-4" />
                              <span>Prévisualiser</span>
                            </Link>
                          </DropdownMenuItem>
                        </>
                      )}
                      
                      {/* Actions communes à tous les articles */}
                      <DropdownMenuItem asChild className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800">
                        <Link href={`/editor/articles/edit/${article.slug}`}>
                          <FileEdit className="h-4 w-4" />
                          <span>Modifier</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        className={`cursor-pointer ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'text-red-400 hover:bg-zinc-800'}`}
                        onClick={() => !isDeleting && handleDeleteRequest(article.id, article.slug)}
                        disabled={isDeleting}
                      >
                        <Trash2 className="h-4 w-4 mr-2" />
                        <span>Supprimer</span>
                      </DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                )}
              </td>
            </tr>
          ))}

          {articles.length === 0 && (
            <tr className="border-b border-zinc-800 bg-zinc-900">
              <td colSpan={4} className="px-6 py-8 text-center text-zinc-400">
                Aucun article trouvé. Créez votre premier article en cliquant sur le bouton "Nouvel article".
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  )
}

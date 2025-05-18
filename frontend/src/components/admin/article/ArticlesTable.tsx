"use client"

import { useState } from "react"
import Link from "next/link"
import { format } from "date-fns"
import { fr } from "date-fns/locale"
import { FileEdit, Trash2, MoreHorizontal, Eye } from "lucide-react"

import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"

// Import du type Article depuis notre service
import { Article } from "@/services/articleService"

type ArticlesTableProps = {
  articles: Article[]
  onDelete: (id: string) => void
  isDeleting?: boolean
}

export function AdminArticlesTable({ articles, onDelete, isDeleting = false }: ArticlesTableProps) {
  // État pour la confirmation de suppression
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null)

  // Formater la date pour l'affichage en gérant les erreurs potentielles
  const formatDate = (dateString: string) => {
    try {
      // Vérification si la date est au format créé par notre backend
      if (dateString && dateString.length > 0) {
        const date = new Date(dateString)
        // Vérifier si la date est valide
        if (!isNaN(date.getTime())) {
          return format(date, "dd MMM yyyy", { locale: fr })
        }
      }
      return "Date inconnue"
    } catch (error) {
      console.error("Erreur de formatage de date:", error, dateString)
      return "Date inconnue"
    }
  }
  
  // Récupérer l'extrait de l'article (utilisant intro si disponible)
  const getExcerpt = (article: Article): string => {
    return article.intro || ""
  }

  // Gérer la demande de suppression
  const handleDeleteRequest = (id: string) => {
    setDeleteConfirmId(id)
  }

  // Confirmer la suppression
  const confirmDelete = (id: string) => {
    onDelete(id)
    setDeleteConfirmId(null)
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
                  {article.status === "published" ? "Publié" : "Brouillon"}
                </Badge>
              </td>
              <td className="px-6 py-4 text-right">
                {deleteConfirmId === article.id ? (
                  <div className="flex items-center justify-end gap-2">
                    <span className="text-xs text-zinc-400 mr-2">Confirmer ?</span>
                    <Button
                      size="sm"
                      variant="destructive"
                      onClick={() => confirmDelete(article.id)}
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
                      <DropdownMenuItem asChild className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800">
                        <Link href={`/blog/${article.id}`}>
                          <Eye className="h-4 w-4" />
                          <span>Voir</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuItem asChild className="cursor-pointer text-zinc-200 flex items-center gap-2 hover:bg-zinc-800">
                        <Link href={`/admin/articles/edit/${article.id}`}>
                          <FileEdit className="h-4 w-4" />
                          <span>Modifier</span>
                        </Link>
                      </DropdownMenuItem>
                      <DropdownMenuSeparator className="bg-zinc-800" />
                      <DropdownMenuItem
                        className={`cursor-pointer ${isDeleting ? 'opacity-50 cursor-not-allowed' : 'text-red-400 hover:bg-zinc-800'}`}
                        onClick={() => !isDeleting && handleDeleteRequest(article.id)}
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

import { ChevronLeft, ChevronRight, MoreHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { cn } from "@/lib/utils"

interface PaginationProps {
  total: number
  currentPage: number
  pageSize: number
  onPageChange: (page: number) => void
  className?: string
}

export function Pagination({ 
  total, 
  currentPage, 
  pageSize, 
  onPageChange,
  className 
}: PaginationProps) {
  // Calculer le nombre total de pages
  const totalPages = Math.ceil(total / pageSize)
  
  // Si aucune page à afficher, ne rien rendre
  if (totalPages <= 1) return null

  // Déterminer les pages à afficher
  const pagesToShow = generatePagination(currentPage, totalPages)

  return (
    <div className={cn("flex items-center justify-center space-x-3", className)}>
      {/* Bouton précédent */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/80"
        onClick={() => onPageChange(Math.max(1, currentPage - 1))}
        disabled={currentPage === 1}
      >
        <ChevronLeft className="h-4 w-4" />
        <span className="sr-only">Page précédente</span>
      </Button>
      
      {/* Pages */}
      {pagesToShow.map((page, i) => {
        if (page === '...') {
          return (
            <span
              key={`ellipsis-${i}`}
              className="text-zinc-500 px-1"
            >
              <MoreHorizontal className="h-4 w-4" />
              <span className="sr-only">Pages intermédiaires</span>
            </span>
          )
        }
        
        const pageNumber = page as number
        const isCurrentPage = pageNumber === currentPage
        
        return (
          <Button
            key={page}
            variant={isCurrentPage ? "secondary" : "ghost"}
            size="sm"
            className={cn(
              "h-8 w-8 text-sm rounded-full",
              isCurrentPage 
                ? "bg-zinc-800 text-white" 
                : "text-zinc-400 hover:text-zinc-200 hover:bg-zinc-800/60"
            )}
            onClick={() => onPageChange(pageNumber)}
          >
            {pageNumber}
            <span className="sr-only">Page {pageNumber}</span>
          </Button>
        )
      })}
      
      {/* Bouton suivant */}
      <Button
        variant="ghost"
        size="icon"
        className="h-9 w-9 text-zinc-400 hover:text-zinc-300 hover:bg-zinc-800/80"
        onClick={() => onPageChange(Math.min(totalPages, currentPage + 1))}
        disabled={currentPage === totalPages}
      >
        <ChevronRight className="h-4 w-4" />
        <span className="sr-only">Page suivante</span>
      </Button>
    </div>
  )
}

// Fonction pour générer les numéros de page à afficher
function generatePagination(currentPage: number, totalPages: number) {
  // Si peu de pages, montrer toutes les pages
  if (totalPages <= 7) {
    return Array.from({ length: totalPages }, (_, i) => i + 1)
  }

  // Stratégie pour davantage de pages
  if (currentPage <= 3) {
    return [1, 2, 3, 4, '...', totalPages - 1, totalPages]
  } else if (currentPage >= totalPages - 2) {
    return [1, 2, '...', totalPages - 3, totalPages - 2, totalPages - 1, totalPages]
  } else {
    return [1, '...', currentPage - 1, currentPage, currentPage + 1, '...', totalPages]
  }
}

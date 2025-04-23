"use client"

import { cn } from "@/lib/utils"

// Type représentant une catégorie avec un id et un nom
type Category = {
    id: number
    name: string
}

// Props attendues par le composant CategoryFilter
type CategoryFilterProps = {
    categories: Category[]
    selected: Category | null
    onSelect: (category: Category | null) => void
    className?: string
}

// Composant affichant les filtres de catégories sous forme de boutons (type pill)
export function CategoryFilter({ categories, selected, onSelect, className = '' }: CategoryFilterProps) {
    // Conteneur horizontal scrollable contenant tous les boutons de catégories
    return (
        <div className={cn("flex flex-nowrap items-center space-x-4 overflow-x-auto py-1.5", className)}>
            {/* Bouton spécial permettant de réinitialiser le filtre (aucune catégorie sélectionnée) */}
            <button
                key="all"
                onClick={() => onSelect(null)}
                className={cn(
                    "text-xs px-3 py-2 rounded-full font-medium transition-colors",
                    selected === null
                        ? "bg-white text-black"
                        : "text-zinc-400 hover:text-white"
                )}
            >
                All Posts
            </button>
            {/* Boutons pour chaque catégorie. Le style change si la catégorie est sélectionnée. */}
            {categories.map((category) => (
                <button
                    key={category.id}
                    onClick={() => onSelect(category)}
                    className={cn(
                        "text-xs px-3 py-2 rounded-full font-medium transition-colors",
                        selected?.id === category.id
                            ? "bg-white text-black"
                            : "text-zinc-400 hover:text-white"
                    )}
                >
                    {category.name}
                </button>
            ))}
        </div>
    )
}

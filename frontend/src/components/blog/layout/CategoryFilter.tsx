"use client"

import { cn } from "@/lib/utils"

type Category = {
    id: number
    name: string
}

type CategoryFilterProps = {
    categories: Category[]
    selected: Category | null
    onSelect: (category: Category | null) => void
    className?: string
}

export function CategoryFilter({ categories, selected, onSelect, className = '' }: CategoryFilterProps) {
    return (
        <div className={cn("flex flex-nowrap items-center space-x-4 overflow-x-auto py-1.5", className)}>
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

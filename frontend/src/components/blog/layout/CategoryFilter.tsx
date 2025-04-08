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
}

export function CategoryFilter({ categories, selected, onSelect }: CategoryFilterProps) {
    return (
        <div className="flex flex-wrap justify-start gap-4 mt-10 overflow-x-auto">
            <button
                key="all"
                onClick={() => onSelect(null)}
                className={cn(
                    "text-sm px-4 py-2 rounded-full font-medium transition-colors",
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
                        "text-sm px-4 py-2 rounded-full font-medium transition-colors",
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

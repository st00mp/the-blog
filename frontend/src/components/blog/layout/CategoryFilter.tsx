"use client"

import { useState } from "react"
import { cn } from "@/lib/utils"

const categories = [
    "All Posts",
    "Engineering",
    "Community",
    "Company News",
    "Customers",
    "v0",
    "Changelog",
    "Press",
]

export function CategoryFilter() {
    const [selected, setSelected] = useState("All Posts")

    return (
        <div className="flex flex-wrap justify-start gap-4 mt-10 overflow-x-auto">
            {categories.map((category) => (
                <button
                    key={category}
                    onClick={() => setSelected(category)}
                    className={cn(
                        "text-sm px-4 py-2 rounded-full font-medium transition-colors",
                        selected === category
                            ? "bg-white text-black"
                            : "text-zinc-400 hover:text-white"
                    )}
                >
                    {category}
                </button>
            ))}
        </div>
    )
}

"use client"

import { Button } from "@/components/ui/button"

export function NavBar() {
    return (
        <header className="w-full border-b border-zinc-800">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-12 py-4 flex items-center justify-between">
                <h1 className="text-white text-xl font-bold">TechBlog</h1>

                <div className="flex items-center space-x-3">
                    {/* Log In = fond noir, texte blanc, hover légèrement plus clair */}
                    <Button
                        variant="ghost"
                        className="bg-black text-white text-sm px-4 py-1 rounded-md border border-white/60 hover:bg-zinc-700 hover:text-white"
                    >
                        Log In
                    </Button>

                    {/* Sign Up = fond blanc, texte noir, hover fond gris clair */}
                    <Button
                        variant="ghost"
                        className="bg-white text-black text-sm px-4 py-1 rounded-md hover:bg-zinc-300"
                    >
                        Sign Up
                    </Button>
                </div>
            </div>
        </header>
    )
}

// components/layout/NavBar.tsx
"use client"

export function NavBar() {
    return (
        <header className="w-full border-b border-zinc-800">
            <div className="mx-auto max-w-[1440px] px-6 sm:px-12 py-4 flex items-center justify-between">
                <h1 className="text-white text-xl font-bold">TechBlog</h1>
                {/* Actions à droite */}
                <div className="flex items-center space-x-3">
                    <button className="border border-white text-white text-sm px-4 py-1 rounded-md hover:bg-white hover:text-black transition-colors">
                        Log In
                    </button>
                    <button className="bg-white text-black text-sm px-4 py-1 rounded-md hover:opacity-90 transition-colors">
                        Sign Up
                    </button>
                </div>
            </div>
        </header>
    )
}

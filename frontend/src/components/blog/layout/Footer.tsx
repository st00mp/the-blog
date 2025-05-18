import Link from "next/link"
import { cn } from "@/lib/utils"

type FooterProps = {
  className?: string
}

export function Footer({ className }: FooterProps) {
  const currentYear = new Date().getFullYear()

  return (
    <footer className={cn("bg-black border-t border-zinc-800/50", className)}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-6">
        {/* Ligne principale avec les liens */}
        <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">

          {/* Logo et copyright */}
          <div className="flex items-center space-x-2">
            <span className="text-zinc-300 text-sm font-medium">TechBlog</span>
            <p className="text-zinc-500 text-sm">
              &copy; {currentYear} Tous droits réservés
            </p>
          </div>

          {/* Liens de navigation — on ajoute flex-1 */}
          <nav className="flex-1 flex items-center justify-center text-sm gap-8">
            <Link
              href="/a-propos"
              className="relative text-zinc-400 hover:text-white transition-colors"
            >
              À propos
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                •
              </span>
            </Link>

            <Link
              href="/blog"
              className="relative text-zinc-400 hover:text-white transition-colors"
            >
              Blog
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                •
              </span>
            </Link>

            <Link
              href="/contact"
              className="relative text-zinc-400 hover:text-white transition-colors"
            >
              Contact
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                •
              </span>
            </Link>

            <Link
              href="/mentions-legales"
              className="relative text-zinc-400 hover:text-white transition-colors"
            >
              Mentions légales
              <span className="absolute -right-4 top-1/2 -translate-y-1/2 text-zinc-600">
                •
              </span>
            </Link>

            <Link
              href="/confidentialite"
              className="text-zinc-400 hover:text-white transition-colors"
            >
              Confidentialité
            </Link>
          </nav>

          {/* Réseaux sociaux */}
          <div className="flex space-x-4">
            <a
              href="#"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="Twitter"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8.29 20.251c7.547 0 11.675-6.253 11.675-11.675 0-.178 0-.355-.012-.53A8.348 8.348 0 0022 5.92a8.19 8.19 0 01-2.357.646 4.118 4.118 0 001.804-2.27 8.224 8.224 0 01-2.605.996 4.107 4.107 0 00-6.993 3.743 11.65 11.65 0 01-8.457-4.287 4.106 4.106 0 001.27 5.477A4.072 4.072 0 012.8 9.713v.052a4.105 4.105 0 003.292 4.022 4.095 4.095 0 01-1.853.07 4.108 4.108 0 003.834 2.85A8.233 8.233 0 012 18.407a11.616 11.616 0 006.29 1.84" />
              </svg>
            </a>
            <a
              href="#"
              className="text-zinc-500 hover:text-white transition-colors"
              aria-label="GitHub"
            >
              <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 24 24">
                <path
                  fillRule="evenodd"
                  d="M12 2C6.477 2 2 6.484 2 12.017c0 4.425 2.865 8.18 6.839 9.504.5.092.682-.217.682-.483 0-.237-.008-.868-.013-1.703-2.782.605-3.369-1.343-3.369-1.343-.454-1.158-1.11-1.466-1.11-1.466-.908-.62.069-.608.069-.608 1.003.07 1.531 1.032 1.531 1.032.892 1.53 2.341 1.088 2.91.832.092-.647.35-1.088.636-1.338-2.22-.253-4.555-1.11-4.555-4.943 0-1.091.39-1.984 1.029-2.683-.103-.253-.446-1.27.098-2.647 0 0 .84-.269 2.75 1.026A9.564 9.564 0 0112 6.844c.85.004 1.705.115 2.504.337 1.909-1.296 2.747-1.027 2.747-1.027.546 1.379.202 2.398.1 2.651.64.7 1.028 1.595 1.028 2.688 0 3.848-2.339 4.695-4.566 4.943.359.309.678.919.678 1.852 0 1.336-.012 2.415-.012 2.743 0 .267.18.578.688.48A10.019 10.019 0 0022 12.017C22 6.484 17.522 2 12 2z"
                  clipRule="evenodd"
                />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </footer>
  )
}
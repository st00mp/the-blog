// /app/login/page.tsx - Accès administrateur discret
import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft, Shield } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-130px)] px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-sm">
        {/* Toute l'interface est maintenant dans une seule carte bien structurée */}
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 shadow-md overflow-hidden">
          {/* En-tête intégré dans la carte avec un fond légèrement plus foncé */}
          <div className="bg-black/30 p-5 text-center border-b border-zinc-800">
            <div className="flex justify-center mb-2">
              <Shield className="h-5 w-5 text-zinc-500" />
            </div>
            <h1 className="text-base font-medium tracking-tight text-zinc-300">Administration</h1>
            <p className="mt-1 text-xs text-zinc-500">
              Accès réservé
            </p>
          </div>
          
          {/* Corps du formulaire avec padding optimisé */}
          <div className="p-6">
            <LoginForm />
            
            {/* Bouton retour plus discret */}
            <div className="mt-4 text-center">
              <Button variant="ghost" size="sm" asChild className="text-zinc-600 hover:text-zinc-400 transition-colors">
                <Link href="/">
                  <ArrowLeft className="mr-1 h-3 w-3" />
                  <span className="text-xs">Quitter</span>
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
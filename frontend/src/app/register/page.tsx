// /app/register/page.tsx
import { RegisterForm } from "@/components/register-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function RegisterPage() {
  return (
    <div className="flex items-center justify-center min-h-[calc(100vh-140px)] pt-12 pb-8 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-6 mx-auto">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Inscription</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Créez votre compte pour participer à la communauté
          </p>
        </div>

        <div className="rounded-lg border bg-zinc-900 p-8 shadow-sm">
          <RegisterForm />

          <div className="mt-4 text-center text-sm">
            <Button variant="link" asChild className="text-zinc-400 hover:text-white transition-colors">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Retour à l'accueil
              </Link>
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}

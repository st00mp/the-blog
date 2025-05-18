// /app/login/page.tsx
import { LoginForm } from "@/components/login-form"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { ArrowLeft } from "lucide-react"

export default function LoginPage() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-black py-12 px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md space-y-8">
        <div className="text-center">
          <h1 className="text-3xl font-bold tracking-tight text-white">Connexion</h1>
          <p className="mt-2 text-sm text-zinc-400">
            Accédez à votre compte
          </p>
        </div>

        <div className="rounded-lg border bg-zinc-900 p-8 shadow-sm">
          <LoginForm />

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
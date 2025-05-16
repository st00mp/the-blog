"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter, useSearchParams } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import { useAuth } from "@/contexts/AuthContext"

type FormData = {
  email: string
  password: string
}

type LoginFormProps = React.ComponentProps<"div"> & {
  onSuccess?: () => void
  switchToRegister?: () => void
}

export function LoginForm({
  className,
  onSuccess,
  switchToRegister,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  const registered = searchParams?.get("registered")
  const { login } = useAuth()

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>()

  const onSubmit = async (data: FormData) => {
    setIsLoading(true)
    setError(null)

    try {
      console.log("Tentative de connexion via:", `${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/login`)
      console.log("Données envoyées:", data)

      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        credentials: "include",
        body: JSON.stringify(data),
      })

      console.log("Statut réponse:", response.status)

      if (!response.ok) {
        const err = await response.json().catch(() => ({}))
        throw new Error(err.error || "Email ou mot de passe incorrect")
      }

      // Récupérer les données utilisateur et les stocker dans le contexte
      const userData = await response.json()
      login(userData.user)

      // Si la connexion réussit et qu'une fonction onSuccess est fournie, on l'appelle
      // Sinon, on redirige vers la page d'accueil
      if (onSuccess) {
        onSuccess()
      } else {
        router.push("/")
        router.refresh() // Pour s'assurer que les données utilisateur sont à jour
      }
    } catch (err) {
      console.error("Échec lors de l'appel fetch vers l'API login")
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de la connexion"
      setError(errorMessage)
      console.error("Erreur lors de la connexion:", err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-white">Connexion</h2>
          <p className="text-sm text-zinc-400">
            Entrez vos identifiants pour accéder à votre compte
          </p>
        </div>

        {registered && (
          <div className="p-3 text-sm text-green-400 bg-green-900/30 rounded-md">
            Inscription réussie ! Vous pouvez maintenant vous connecter.
          </div>
        )}

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/30 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              placeholder="email@exemple.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email", {
                required: "L'email est requis",
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                  message: "Adresse email invalide",
                },
              })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>


          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-zinc-300">
                Mot de passe
              </Label>
              <Link
                href="/forgot-password"
                className="text-xs text-zinc-400 hover:text-blue-400 transition-colors"
              >
                Mot de passe oublié ?
              </Link>
            </div>
            <Input
              id="password"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password", {
                required: "Le mot de passe est requis",
              })}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-zinc-400">
        <span>Pas encore de compte ? </span>
        {switchToRegister ? (
          <button
            onClick={switchToRegister}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            S'inscrire
          </button>
        ) : (
          <Link
            href="/register"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            S'inscrire
          </Link>
        )}
      </div>
    </div>
  )
}

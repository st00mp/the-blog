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
}

export function LoginForm({
  className,
  onSuccess,
  ...props
}: LoginFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()
  const searchParams = useSearchParams()
  // Simplification - suppression de la vérification d'inscription
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
      console.log("Tentative de connexion via:", `/api/login`)
      console.log("Données envoyées:", data)

      const response = await fetch(`/api/login`, {
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
      // Sinon, on redirige l'utilisateur vers une page appropriée selon son rôle
      if (onSuccess) {
        onSuccess() // Pour la modale
      } else {
        // Si un paramètre redirect est fourni, on l'utilise en priorité
        const customRedirect = searchParams?.get('redirect')
        if (customRedirect) {
          router.push(customRedirect)
          router.refresh()
          return
        }
        
        // Redirection vers l'interface d'administration unique
        router.push('/editor/dashboard')
        router.refresh()
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
    <div className={cn("w-full", className)} {...props}>
      {error && (
        <div className="mb-4 p-2 text-xs text-red-400 bg-red-900/30 border border-red-900/50 rounded">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-3">
        <div className="space-y-3">
          <div className="space-y-1">
            <Label htmlFor="email" className="text-xs font-medium text-zinc-400">
              Email
            </Label>
            <Input
              id="email"
              placeholder="admin@exemple.com"
              type="email"
              autoCapitalize="none"
              autoComplete="email"
              autoCorrect="off"
              disabled={isLoading}
              {...register("email")}
              className={cn(
                "flex h-9 w-full rounded-sm border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-300 focus:bg-black/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                errors.email && "border-red-900/50 bg-red-900/10"
              )}
            />
            {errors.email && (
              <p className="text-xs font-medium text-red-400">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-1">
            <Label htmlFor="password" className="text-xs font-medium text-zinc-400">
              Mot de passe
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
              className={cn(
                "flex h-9 w-full rounded-sm border border-zinc-700 bg-zinc-800/50 px-3 py-2 text-xs text-zinc-300 focus:bg-black/30 focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-zinc-500 focus-visible:ring-offset-0 disabled:cursor-not-allowed disabled:opacity-50",
                errors.password && "border-red-900/50 bg-red-900/10"
              )}
            />
            {errors.password && (
              <p className="text-xs font-medium text-red-400">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button 
            type="submit" 
            className="w-full mt-2 bg-zinc-800 text-zinc-300 hover:bg-zinc-700 hover:text-white" 
            size="sm"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-3 w-3 animate-spin" />}
            Se connecter
          </Button>
        </div>
      </form>

      {/* Suppression des options d'authentification alternatives */}

      {/* Suppression du lien d'inscription */}
    </div>
  )
}

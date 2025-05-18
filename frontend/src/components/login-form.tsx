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
      // Sinon, on redirige vers la page des paramètres du compte
      if (onSuccess) {
        onSuccess() // Pour la modale
      } else {
        const redirectTo = searchParams?.get('redirect') || '/account/settings'
        router.push(redirectTo)
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
    <div className={cn("grid gap-6 w-full max-w-md mx-auto p-6", className)} {...props}>


      {registered && (
        <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/30 dark:text-green-400 rounded-md">
          Inscription réussie ! Vous pouvez maintenant vous connecter.
        </div>
      )}

      {error && (
        <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md">
          {error}
        </div>
      )}

      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="email" className="text-sm font-medium leading-none">
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
              {...register("email")}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.email && "border-destructive"
              )}
            />
            {errors.email && (
              <p className="text-sm font-medium text-destructive">
                {errors.email.message}
              </p>
            )}
          </div>

          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="password" className="text-sm font-medium leading-none">
                Mot de passe
              </Label>
              <Button
                type="button"
                variant="link"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={() => router.push('/forgot-password')}
              >
                Mot de passe oublié ?
              </Button>
            </div>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="current-password"
              disabled={isLoading}
              {...register("password")}
              className={cn(
                "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                errors.password && "border-destructive"
              )}
            />
            {errors.password && (
              <p className="text-sm font-medium text-destructive">
                {errors.password.message}
              </p>
            )}
          </div>

          <Button type="submit" className="w-full" disabled={isLoading}>
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Se connecter
          </Button>
        </div>
      </form>

      <div className="relative">
        <div className="absolute inset-0 flex items-center">
          <span className="w-full border-t" />
        </div>
        <div className="relative flex justify-center text-xs uppercase">
          <span className="bg-background px-2 text-muted-foreground">
            Ou continuez avec
          </span>
        </div>
      </div>

      <Button variant="outline" type="button" disabled={isLoading}>
        {isLoading ? (
          <Loader2 className="mr-2 h-4 w-4 animate-spin" />
        ) : (
          <>
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" fill="currentColor">
              <path d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z" />
            </svg>
            Google
          </>
        )}
      </Button>

      <p className="px-8 text-center text-sm text-muted-foreground">
        <Button
          variant="link"
          className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
          onClick={switchToRegister}
        >
          Pas encore de compte ? Créez-en un
        </Button>
      </p>
    </div>
  )
}

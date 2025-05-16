"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"
import Link from "next/link"

type FormData = {
  name: string
  email: string
  password: string
  confirmPassword: string
}

type RegisterFormProps = React.ComponentProps<"div"> & {
  onSuccess?: () => void
  switchToLogin?: () => void
}

export function RegisterForm({
  className,
  onSuccess,
  switchToLogin,
  ...props
}: RegisterFormProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const router = useRouter()

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
    setError: setFormError,
  } = useForm<FormData>()

  // Fonctions de validation
  const validateName = (value: string) => {
    if (!value) return "Ce champ est requis"
    if (!/^[\p{L} -]+$/u.test(value)) {
      return "Caractères spéciaux non autorisés (sauf les espaces et les tirets)"
    }
    if (value.length < 2) return "Le nom doit contenir au moins 2 caractères"
    if (value.length > 50) return "Le nom ne peut pas dépasser 50 caractères"
    return true
  }

  const validateEmail = (value: string) => {
    if (!value) return "L'email est requis"
    if (!/^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i.test(value)) {
      return "Adresse email invalide"
    }
    return true
  }

  const validatePassword = (value: string) => {
    if (!value) return "Le mot de passe est requis"
    if (value.length < 8) return "Le mot de passe doit contenir au moins 8 caractères"
    if (!/[A-Z]/.test(value)) return "Le mot de passe doit contenir au moins une majuscule"
    if (!/[a-z]/.test(value)) return "Le mot de passe doit contenir au moins une minuscule"
    if (!/[0-9]/.test(value)) return "Le mot de passe doit contenir au moins un chiffre"
    if (!/[!@#$%^&*(),.?":{}|<>]/.test(value)) return "Le mot de passe doit contenir au moins un caractère spécial"
    return true
  }

  const onSubmit = async (data: FormData) => {
    if (data.password !== data.confirmPassword) {
      setError("Les mots de passe ne correspondent pas")
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      const responseData = await response.json()

      if (!response.ok) {
        throw new Error(responseData.error || 'Erreur lors de l\'inscription')
      }

      // Si l'inscription réussit, on peut rediriger vers la page de connexion
      // ou appeler la fonction onSuccess si elle est fournie
      if (onSuccess) {
        onSuccess()
      } else {
        // Redirection vers la page de connexion avec un message de succès
        router.push('/login?registered=true')
      }

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription"
      setError(errorMessage)
      console.error('Erreur lors de l\'inscription:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full max-w-md mx-auto p-6 bg-zinc-900 rounded-lg shadow-lg", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2 text-center">
          <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
          <p className="text-sm text-zinc-400">
            Entrez vos informations pour créer un compte
          </p>
        </div>

        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/30 rounded-md">
            {error}
          </div>
        )}

        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="name" className="text-zinc-300">
              Nom complet
            </Label>
            <Input
              id="name"
              placeholder="Votre nom"
              type="text"
              autoCapitalize="words"
              autoComplete="name"
              disabled={isLoading}
              {...register("name", { validate: validateName })}
              className={errors.name ? 'border-red-500' : ''}
            />
            {errors.name && (
              <p className="text-xs text-red-500 mt-1">{errors.name.message}</p>
            )}
          </div>

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
              disabled={isLoading}
              {...register("email", { validate: validateEmail })}
              className={errors.email ? 'border-red-500' : ''}
            />
            {errors.email && (
              <p className="text-xs text-red-500 mt-1">{errors.email.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">
              Mot de passe
            </Label>
            <Input
              id="password"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("password", { validate: validatePassword })}
              className={errors.password ? 'border-red-500' : ''}
            />
            {errors.password && (
              <p className="text-xs text-red-500 mt-1">{errors.password.message}</p>
            )}
            <p className="text-xs text-zinc-500 mt-1">
              Au moins 8 caractères, avec des majuscules, minuscules, chiffres et caractères spéciaux
            </p>
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              placeholder="••••••••"
              type="password"
              autoComplete="new-password"
              disabled={isLoading}
              {...register("confirmPassword", {
                validate: value => value === watch('password') || "Les mots de passe ne correspondent pas"
              })}
              className={errors.confirmPassword ? 'border-red-500' : ''}
            />
            {errors.confirmPassword && (
              <p className="text-xs text-red-500 mt-1">{errors.confirmPassword.message}</p>
            )}
          </div>

          <Button
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white"
            disabled={isLoading}
          >
            {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            S'inscrire
          </Button>
        </div>
      </form>

      <div className="mt-4 text-center text-sm text-zinc-400">
        <span>Déjà un compte ? </span>
        {switchToLogin ? (
          <button
            onClick={switchToLogin}
            className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            Se connecter
          </button>
        ) : (
          <Link
            href="/login"
            className="text-blue-400 hover:text-blue-300 underline underline-offset-4"
          >
            Se connecter
          </Link>
        )}
      </div>
    </div>
  )
}

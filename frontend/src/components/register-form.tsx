"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { useRouter } from "next/navigation"
import Link from "next/link"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

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
  const [isSuccess, setIsSuccess] = useState(false)
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
      const response = await fetch(`/api/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
        },
        credentials: 'include',
        body: JSON.stringify({
          name: data.name,
          email: data.email,
          password: data.password,
        }),
      })

      // Vérifier si la réponse est en JSON
      const contentType = response.headers.get('content-type');
      let responseData;

      if (contentType && contentType.includes('application/json')) {
        responseData = await response.json();
      } else {
        const text = await response.text();
        console.error('Réponse non-JSON reçue:', text);
        throw new Error('Erreur inattendue du serveur');
      }

      if (!response.ok) {
        const errorMessage = responseData.error ||
          responseData.message ||
          'Erreur lors de l\'inscription';
        throw new Error(errorMessage);
      }

      // Si l'inscription réussit, on peut rediriger vers la page de connexion
      // ou appeler la fonction onSuccess si elle est fournie
      // Afficher le message de succès
      setIsSuccess(true)

      // Afficher le message de succès pendant 1.5 secondes
      setTimeout(() => {
        if (switchToLogin) {
          // Si switchToLogin est fourni, l'utiliser pour basculer vers le formulaire de connexion
          // La gestion de la transition est maintenant gérée par le composant parent
          switchToLogin()
        } else if (onSuccess) {
          // Sinon, utiliser onSuccess si fourni
          onSuccess()
        } else {
          // Fallback : redirection vers /login
          router.push('/login?registered=true')
        }
      }, 1500)

    } catch (err) {
      const errorMessage = err instanceof Error ? err.message : "Une erreur est survenue lors de l'inscription"
      setError(errorMessage)
      console.error('Erreur lors de l\'inscription:', err)
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("grid gap-6 w-full max-w-md mx-auto p-6", className)} {...props}>
      {isSuccess ? (
        <div className="text-center space-y-2">
          <div className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-green-100 dark:bg-green-900/30 mb-2">
            <svg className="w-5 h-5 text-green-600 dark:text-green-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <p className="text-sm text-green-600 dark:text-green-400">Compte créé avec succès</p>
        </div>
      ) : (
        <>
          {error && (
            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/30 dark:text-red-400 rounded-md">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">

            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-medium leading-none">
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
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.name && "border-destructive"
                  )}
                />
                {errors.name && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.name.message}
                  </p>
                )}
              </div>

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
                  disabled={isLoading}
                  {...register("email", { validate: validateEmail })}
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
                <Label htmlFor="password" className="text-sm font-medium leading-none">
                  Mot de passe
                </Label>
                <Input
                  id="password"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("password", { validate: validatePassword })}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.password && "border-destructive"
                  )}
                />
                {errors.password && watch('password') && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.password.message}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <Label htmlFor="confirmPassword" className="text-sm font-medium leading-none">
                  Confirmer le mot de passe
                </Label>
                <Input
                  id="confirmPassword"
                  placeholder="••••••••"
                  type="password"
                  autoComplete="new-password"
                  disabled={isLoading}
                  {...register("confirmPassword", {
                    validate: (value) =>
                      value === watch("password") || "Les mots de passe ne correspondent pas",
                  })}
                  className={cn(
                    "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
                    errors.confirmPassword && "border-destructive"
                  )}
                />
                {errors.confirmPassword && (
                  <p className="text-sm font-medium text-destructive">
                    {errors.confirmPassword.message}
                  </p>
                )}
              </div>

              <Button
                type="submit"
                className="w-full"
                disabled={isLoading}
              >
                {isLoading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                S'inscrire
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
            {switchToLogin ? (
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                onClick={switchToLogin}
              >
                Déjà un compte ? Connectez-vous
              </Button>
            ) : (
              <Button
                variant="link"
                className="h-auto p-0 text-xs text-muted-foreground hover:text-foreground"
                asChild
              >
                <Link href="/login">Déjà un compte ? Connectez-vous</Link>
              </Button>
            )}
          </p>
        </>
      )}
    </div>
  )
}

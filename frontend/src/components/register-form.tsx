"use client"

import { useState } from "react"
import { useForm } from "react-hook-form"
import { cn } from "@/lib/utils"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Loader2 } from "lucide-react"

type FormData = {
  firstName: string
  lastName: string
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
      // Ici, vous intégrerez l'appel à votre API d'inscription
      // Par exemple :
      // const response = await fetch('/api/register', {
      //   method: 'POST',
      //   body: JSON.stringify({
      //     firstName: data.firstName,
      //     lastName: data.lastName,
      //     email: data.email,
      //     password: data.password,
      //   }),
      // })
      
      // Simuler un délai de chargement
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // En cas de succès
      if (onSuccess) onSuccess()
      
    } catch (err) {
      setError("Une erreur est survenue lors de l'inscription. Veuillez réessayer.")
    } finally {
      setIsLoading(false)
    }
  }

  return (
    <div className={cn("w-full", className)} {...props}>
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white">Créer un compte</h2>
          <p className="text-sm text-zinc-400">
            Créez votre compte pour accéder à toutes les fonctionnalités
          </p>
        </div>
        
        {error && (
          <div className="p-3 text-sm text-red-400 bg-red-900/30 rounded-md">
            {error}
          </div>
        )}
        
        <div className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName" className="text-zinc-300">
                Prénom
              </Label>
              <Input
                id="firstName"
                placeholder="Jean"
                className={errors.firstName ? "border-red-500" : "border-zinc-700"}
                {...register("firstName", {
                  validate: validateName
                })}
              />
              {errors.firstName && (
                <p className="text-sm text-red-500">{errors.firstName.message}</p>
              )}
            </div>
            <div className="space-y-2">
              <Label htmlFor="lastName" className="text-zinc-300">
                Nom
              </Label>
              <Input
                id="lastName"
                placeholder="Dupont"
                className={errors.lastName ? "border-red-500" : "border-zinc-700"}
                {...register("lastName", {
                  validate: validateName
                })}
              />
              {errors.lastName && (
                <p className="text-sm text-red-500">{errors.lastName.message}</p>
              )}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email" className="text-zinc-300">
              Email
            </Label>
            <Input
              id="email"
              type="email"
              placeholder="votre@email.com"
              className={errors.email ? "border-red-500" : "border-zinc-700"}
              {...register("email", {
                validate: validateEmail
              })}
            />
            {errors.email && (
              <p className="text-sm text-red-500">{errors.email.message}</p>
            )}
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="password" className="text-zinc-300">
              Mot de passe
            </Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              className={errors.password ? "border-red-500" : "border-zinc-700"}
              {...register("password", {
                validate: validatePassword
              })}
            />
            {!errors.password && (
              <p className="text-xs text-zinc-500 mt-1">
                Le mot de passe doit contenir au moins 8 caractères, une majuscule, une minuscule, un chiffre et un caractère spécial
              </p>
            )}
            {errors.password && (
              <p className="text-sm text-red-500">{errors.password.message}</p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirmPassword" className="text-zinc-300">
              Confirmer le mot de passe
            </Label>
            <Input
              id="confirmPassword"
              type="password"
              placeholder="••••••••"
              className={errors.confirmPassword ? "border-red-500" : "border-zinc-700"}
              {...register("confirmPassword", {
                required: "Veuillez confirmer votre mot de passe",
              })}
            />
            {errors.confirmPassword && (
              <p className="text-sm text-red-500">{errors.confirmPassword.message}</p>
            )}
          </div>
          
          <Button 
            type="submit" 
            className="w-full bg-white text-black hover:bg-zinc-200 hover:text-black transition-colors"
            disabled={isLoading}
            size="lg"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Création du compte...
              </>
            ) : (
              "S'inscrire"
            )}
          </Button>

          <div className="relative my-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-zinc-800"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-zinc-900 text-zinc-400">Ou continuer avec</span>
            </div>
          </div>
          
          <Button
            type="button"
            variant="outline"
            className="w-full bg-transparent border-zinc-700 text-white hover:bg-zinc-800/50 hover:border-zinc-600 hover:text-white"
            size="lg"
            disabled={isLoading}
          >
            <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24">
              <path
                d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                fill="#4285F4"
              />
              <path
                d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                fill="#34A853"
              />
              <path
                d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l3.66-2.84z"
                fill="#FBBC05"
              />
              <path
                d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                fill="#EA4335"
              />
              <path d="M1 1h22v22H1z" fill="none" />
            </svg>
            Google
          </Button>
        </div>
        
        <p className="px-8 text-center text-sm text-zinc-400">
          Déjà un compte ?{" "}
          <button
            type="button"
            className="underline underline-offset-4 hover:text-white transition-colors bg-transparent border-none p-0 cursor-pointer text-sm"
            onClick={(e) => {
              e.preventDefault()
              if (switchToLogin) {
                switchToLogin()
              } else {
                onSuccess?.()
              }
            }}
          >
            Se connecter
          </button>
        </p>
      </form>
    </div>
  )
}

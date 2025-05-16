"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

type RouteGuardProps = {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: string
}

export function RouteGuard({ 
  children, 
  requireAuth = false,
  requireRole
}: RouteGuardProps) {
  const { user, isLoading, isAuthenticated } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // Attendre que la vérification d'authentification soit terminée
    if (isLoading) return

    // Si l'authentification est requise et l'utilisateur n'est pas connecté
    if (requireAuth && !isAuthenticated) {
      router.push("/login")
      return
    }

    // Si un rôle spécifique est requis et l'utilisateur n'a pas ce rôle
    if (requireRole && user?.role !== requireRole) {
      router.push("/")
      return
    }
  }, [isLoading, isAuthenticated, user, requireAuth, requireRole, router])

  // Afficher un indicateur de chargement pendant la vérification
  if (isLoading) {
    return <div className="flex justify-center items-center min-h-screen bg-zinc-900 text-white">Chargement...</div>
  }

  // Si l'authentification est requise et l'utilisateur n'est pas connecté, ne rien afficher
  if (requireAuth && !isAuthenticated) {
    return null
  }

  // Si un rôle spécifique est requis et l'utilisateur n'a pas ce rôle, ne rien afficher
  if (requireRole && user?.role !== requireRole) {
    return null
  }

  // Sinon, afficher le contenu
  return <>{children}</>
}

"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

// Plus besoin d'une hiérarchie de rôles, un seul rôle administrateur

type RouteGuardProps = {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: string
}

// Fonction simplifiée pour vérifier si l'utilisateur est admin
const isAdmin = (user: any): boolean => {
  return user && user.role === 'ROLE_ADMIN'
}

export function RouteGuard({ 
  children, 
  requireAuth = false,
  requireRole = 'admin' // Par défaut, l'accès administrateur est requis
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

    // Vérifier si l'utilisateur est admin lorsque c'est requis
    if (requireRole === 'admin' && !isAdmin(user)) {
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

  // Si un rôle admin est requis et l'utilisateur n'est pas admin, ne rien afficher
  if (requireRole === 'admin' && !isAdmin(user)) {
    return null
  }

  // Sinon, afficher le contenu
  return <>{children}</>
}

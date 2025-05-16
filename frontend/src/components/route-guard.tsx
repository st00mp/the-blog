"use client"

import { useEffect } from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "@/contexts/AuthContext"

type Role = 'admin' | 'editor' | 'user'

// Définition de la hiérarchie des rôles
const ROLE_HIERARCHY: Record<Role, number> = {
  'admin': 3,
  'editor': 2,
  'user': 1
}

type RouteGuardProps = {
  children: React.ReactNode
  requireAuth?: boolean
  requireRole?: Role
}

// Fonction utilitaire pour vérifier les droits d'accès
const hasRequiredRole = (userRole: Role | undefined, requiredRole: Role): boolean => {
  if (!userRole) return false
  return ROLE_HIERARCHY[userRole] >= ROLE_HIERARCHY[requiredRole]
}

export function RouteGuard({ 
  children, 
  requireAuth = false,
  requireRole = 'user' // Par défaut, seul l'accès utilisateur est requis
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

    // Si un rôle spécifique est requis et l'utilisateur n'a pas les droits nécessaires
    if (requireRole && !hasRequiredRole(user?.role as Role | undefined, requireRole)) {
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

  // Si un rôle spécifique est requis et l'utilisateur n'a pas les droits nécessaires, ne rien afficher
  if (requireRole && !hasRequiredRole(user?.role as Role | undefined, requireRole)) {
    return null
  }

  // Sinon, afficher le contenu
  return <>{children}</>
}

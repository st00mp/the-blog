"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type User = {
  id: number
  name: string
  email: string
  role: string
  avatar?: string
}

type AuthContextType = {
  user: User | null
  isLoading: boolean
  login: (user: User) => void
  logout: () => void
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifie si l'utilisateur est déjà connecté au chargement
    const checkSession = async () => {
      try {
        const response = await fetch(`/api/me`, {
          method: "GET",
          credentials: "include",
          headers: {
            "Content-Type": "application/json",
            Accept: "application/json",
          },
        })

        if (response.ok) {
          const userData = await response.json()
          setUser(userData.user)
        }
      } catch (error) {
        console.error("Erreur lors de la vérification de session:", error)
      } finally {
        setIsLoading(false)
      }
    }

    checkSession()
  }, [])

  const login = (userData: User) => {
    setUser(userData)
  }

  const logout = async () => {
    try {
      // On commence par réinitialiser l'utilisateur localement
      setUser(null)
      
      // Appel à l'API backend Symfony pour la déconnexion
      const backendPromise = fetch(`${process.env.NEXT_PUBLIC_BACKEND_API_URL}/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).catch(err => {
        // Silencieusement ignorer les erreurs du backend
        console.log("Backend logout: ", err.message)
      })

      // Appel également à l'API frontend pour nettoyer le cookie côté client
      const frontendPromise = fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).catch(err => {
        // Silencieusement ignorer les erreurs du frontend
        console.log("Frontend logout: ", err.message)
      })
      
      // Attendre que les deux opérations soient terminées (réussies ou échouées)
      await Promise.allSettled([backendPromise, frontendPromise])
      
      // Déterminer si la page actuelle nécessite une authentification
      const currentPath = window.location.pathname
      const authRequiredPaths = [
        '/editor',
        '/admin',
        '/preview',
        '/account'
      ]
      
      const needsRedirect = authRequiredPaths.some(path => currentPath.startsWith(path))
      
      if (needsRedirect) {
        // Rediriger uniquement si l'utilisateur est sur une page protégée
        window.location.href = "/";
      } else {
        // Sinon, rafraîchir la page pour mettre à jour l'UI sans changer d'URL
        window.location.reload();
      }
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      // Même logique en cas d'erreur
      const currentPath = window.location.pathname
      const authRequiredPaths = [
        '/editor',
        '/admin',
        '/preview',
        '/account'
      ]
      
      const needsRedirect = authRequiredPaths.some(path => currentPath.startsWith(path))
      
      if (needsRedirect) {
        window.location.href = "/";
      } else {
        window.location.reload();
      }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth doit être utilisé à l'intérieur d'un AuthProvider")
  }
  return context
}

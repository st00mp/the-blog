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
      
      // Maintenant que toutes les opérations sont terminées, rediriger
      window.location.href = "/";
    } catch (error) {
      console.error("Erreur lors de la déconnexion:", error)
      // En cas d'échec général, quand même rediriger
      window.location.href = "/";
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

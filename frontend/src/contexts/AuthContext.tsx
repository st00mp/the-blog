"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"

export type User = {
  id: number
  email: string
  role: string // Rôle principal (ex: 'ROLE_ADMIN')
  name: string
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

  // Fonction de déconnexion simplifiée et cohérente avec l'architecture
  const logout = async () => {
    try {
      // On commence par réinitialiser l'utilisateur localement
      setUser(null)
      
      // Appel uniquement à l'API proxy Next.js qui s'occupera de transmettre au backend
      // et de gérer les cookies d'authentification côté client
      console.log('Tentative de déconnexion via API proxy Next.js')
      const response = await fetch(`/api/logout`, {
        method: "POST",
        credentials: "include",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
      }).catch(err => {
        // Capturer les erreurs pour éviter les rejets non gérés
        console.error("Erreur lors de la déconnexion via l'API proxy:", err.message)
        return null
      })
      
      // Déterminer si la page actuelle nécessite une authentification
      const currentPath = window.location.pathname
      const authRequiredPaths = [
        '/admin' // Simplifié pour n'inclure que le chemin d'administration
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

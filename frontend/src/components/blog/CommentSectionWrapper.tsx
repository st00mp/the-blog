"use client"

import { useState, useEffect } from "react"
import CommentSection from "@/components/CommentSection"
import { useAuth } from "@/contexts/AuthContext"

// Ce wrapper permet d'utiliser le composant client CommentSection dans un contexte serveur
export default function CommentSectionWrapper({ articleId }: { articleId: string }) {
  const { user, isAuthenticated } = useAuth()
  const [isLoggedIn, setIsLoggedIn] = useState(isAuthenticated)
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | undefined>(
    user ? { id: user.id, name: user.name } : undefined
  )

  // Effet qui s'exécute lorsque l'état d'authentification change
  useEffect(() => {
    setIsLoggedIn(isAuthenticated)
    if (user) {
      setCurrentUser({
        id: user.id,
        name: user.name
      })
    } else {
      setCurrentUser(undefined)
    }
  }, [isAuthenticated, user])

  // Conserver également la vérification API pour la résilience
  useEffect(() => {
    // Vérifier si l'utilisateur est connecté en appelant l'API de session
    const checkAuth = async () => {
      try {
        const response = await fetch('/api/me', {
          method: 'GET',
          headers: {
            'Content-Type': 'application/json',
          },
          credentials: 'include',
        })

        if (response.ok) {
          const data = await response.json()
          if (data.user) {
            setIsLoggedIn(true)
            setCurrentUser({
              id: data.user.id,
              name: data.user.name
            })
          } else {
            setIsLoggedIn(false)
            setCurrentUser(undefined)
          }
        } else {
          setIsLoggedIn(false)
          setCurrentUser(undefined)
        }
      } catch (error) {
        console.error('Erreur lors de la vérification de l\'authentification:', error)
        setIsLoggedIn(false)
        setCurrentUser(undefined)
      }
    }

    checkAuth()
  }, [])

  // Fonction pour rafraîchir l'état de connexion après login
  const refreshAuthState = async () => {
    try {
      const response = await fetch('/api/me', {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
        },
        credentials: 'include',
      })

      if (response.ok) {
        const data = await response.json()
        if (data.user) {
          setIsLoggedIn(true)
          setCurrentUser({
            id: data.user.id,
            name: data.user.name
          })
        }
      }
    } catch (error) {
      console.error('Erreur lors du rafraîchissement de l\'authentification:', error)
    }
  }

  return (
    <CommentSection 
      articleId={articleId} 
      isLoggedIn={isLoggedIn} 
      currentUser={currentUser} 
      onLogin={refreshAuthState}
    />
  )
}

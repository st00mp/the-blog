"use client"

import { useState, useEffect } from "react"
import CommentSection from "@/components/CommentSection"

// Ce wrapper permet d'utiliser le composant client CommentSection dans un contexte serveur
export default function CommentSectionWrapper({ articleId }: { articleId: string }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ id: number; name: string } | undefined>(undefined)

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

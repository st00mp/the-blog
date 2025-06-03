"use client"

import { useEffect, useState } from 'react'
import { useSearchParams } from 'next/navigation'

export default function DebugPage() {
  const searchParams = useSearchParams()
  const [debugData, setDebugData] = useState<any>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const fetchDebugData = async () => {
      try {
        setIsLoading(true)
        const id = searchParams.get('id') || '195' // ID par défaut à tester
        const status = searchParams.get('status') || '0' // Statut par défaut: brouillon
        
        const response = await fetch(`/api/debug/article?id=${id}&status=${status}`, {
          method: 'GET',
          credentials: 'include',
          cache: 'no-store'
        })
        
        if (!response.ok) {
          throw new Error(`Erreur: ${response.status}`)
        }
        
        const data = await response.json()
        setDebugData(data)
      } catch (err: any) {
        setError(err.message || 'Une erreur est survenue')
        console.error('Erreur lors du débogage:', err)
      } finally {
        setIsLoading(false)
      }
    }
    
    fetchDebugData()
  }, [searchParams])
  
  return (
    <div className="container mx-auto p-6 bg-gray-900 text-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6">Débogage d'article</h1>
      
      {isLoading ? (
        <div className="text-blue-300">Chargement des données de débogage...</div>
      ) : error ? (
        <div className="text-red-400 p-4 bg-red-900 bg-opacity-20 rounded">
          <h2 className="text-xl font-bold mb-2">Erreur</h2>
          <p>{error}</p>
        </div>
      ) : (
        <div className="space-y-6">
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Paramètres</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">ID:</div>
              <div>{debugData.id}</div>
              <div className="font-medium">Status:</div>
              <div>{debugData.status}</div>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Appel direct à l'article</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">URL:</div>
              <div className="text-blue-300 break-all">{debugData.backend.url}</div>
              <div className="font-medium">Statut:</div>
              <div className={debugData.backend.status === 200 ? "text-green-400" : "text-red-400"}>
                {debugData.backend.status}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Réponse:</h3>
              <pre className="bg-gray-900 p-3 rounded overflow-x-auto text-sm max-h-60 overflow-y-auto">
                {debugData.backend.body}
              </pre>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Vérification d'authentification</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">URL:</div>
              <div className="text-blue-300">{debugData.auth.url}</div>
              <div className="font-medium">Statut:</div>
              <div className={debugData.auth.status === 200 ? "text-green-400" : "text-red-400"}>
                {debugData.auth.status}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Réponse:</h3>
              <pre className="bg-gray-900 p-3 rounded overflow-x-auto text-sm max-h-40 overflow-y-auto">
                {debugData.auth.body}
              </pre>
            </div>
          </div>
          
          <div className="bg-gray-800 p-4 rounded">
            <h2 className="text-xl font-bold mb-2">Liste des articles</h2>
            <div className="grid grid-cols-2 gap-2">
              <div className="font-medium">URL:</div>
              <div className="text-blue-300">{debugData.articles.url}</div>
              <div className="font-medium">Statut:</div>
              <div className={debugData.articles.status === 200 ? "text-green-400" : "text-red-400"}>
                {debugData.articles.status}
              </div>
            </div>
            <div className="mt-4">
              <h3 className="text-lg font-semibold mb-2">Réponse:</h3>
              <pre className="bg-gray-900 p-3 rounded overflow-x-auto text-sm max-h-60 overflow-y-auto">
                {debugData.articles.body}
              </pre>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

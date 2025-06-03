"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/AuthContext"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Plus,
  FileText,
  Loader2
} from "lucide-react"
// Suppression des imports de userService.ts
import { useToast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/ui/pagination"

// Type User est importé depuis userService.ts

export default function AdminPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const router = useRouter()
  const [loading, setLoading] = useState<boolean>(false)

  // Suppression du chargement des utilisateurs

  // Statistiques simplifiées pour un blog personnel
  const stats = {
    totalArticles: 0, // À connecter à une API pour obtenir le nombre d'articles
    publishedArticles: 0,
    draftArticles: 0
  }
  
  // Note: Ces statistiques sont pour l'instant statiques, vous pourriez vouloir
  // les connecter à une API pour obtenir les vrais chiffres

  return (
    <RouteGuard requireAuth={true} requireRole="admin">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
            <p className="text-zinc-400 mt-1">Administration du blog</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Total Articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalArticles}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Publiés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.publishedArticles}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-yellow-400" />
              <CardTitle className="text-lg">Brouillons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.draftArticles}</p>
            </CardContent>
          </Card>
        </div>

        {/* Section de raccourcis rapides */}
        <Card className="bg-zinc-900 border-zinc-800 shadow-lg overflow-hidden transition-all duration-300">
          <CardHeader className="pb-3 border-b border-zinc-800">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <div className="h-8 w-1 bg-blue-500 rounded-full"></div>
                <CardTitle className="text-xl font-semibold">Raccourcis</CardTitle>
              </div>
              <Button 
                variant="default" 
                size="sm" 
                className="bg-blue-600 hover:bg-blue-700 transition-all duration-200 shadow-md hover:shadow-lg"
                onClick={() => router.push('/editor/articles/new')}
              >
                <Plus className="mr-2 h-4 w-4" />
                Nouvel article
              </Button>
            </div>
          </CardHeader>
          <CardContent className="pt-5">
            <p className="text-zinc-300 mb-6 max-w-3xl text-sm">
              Bienvenue dans votre interface d'administration simplifiée. Utilisez cette interface pour gérer vos articles et le contenu de votre blog personnel.
            </p>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {/* Carte de gestion des articles */}
              <div className="p-6 bg-zinc-800/60 rounded-xl border border-zinc-700/30 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all flex flex-col">

                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">Gestion des articles</h3>
                  <FileText className="h-6 w-6 text-blue-400" />
                </div>
                <p className="text-zinc-400 text-sm mb-6 flex-grow">Créez, modifiez et publiez vos articles de blog.</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-center bg-zinc-700/50 hover:bg-zinc-700 hover:text-white border-zinc-600 transition-all"
                  onClick={() => router.push('/editor/articles')}
                >
                  Gérer les articles
                </Button>
              </div>
              
              {/* Carte des paramètres */}
              <div className="p-6 bg-zinc-800/60 rounded-xl border border-zinc-700/30 hover:border-zinc-600 hover:bg-zinc-800/80 transition-all flex flex-col">

                <div className="flex justify-between items-start mb-3">
                  <h3 className="text-lg font-medium">Paramètres du blog</h3>
                  <svg className="h-6 w-6 text-emerald-400" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <p className="text-zinc-400 text-sm mb-6 flex-grow">Configurez les paramètres de votre blog personnel.</p>
                <Button 
                  variant="outline" 
                  className="w-full justify-center bg-zinc-700/50 hover:bg-zinc-700 hover:text-white border-zinc-600 transition-all"
                  onClick={() => router.push('/account/settings')}
                >
                  Paramètres
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}
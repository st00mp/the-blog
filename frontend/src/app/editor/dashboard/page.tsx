"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Edit2,
  Eye,
  MessageCircle,
  Loader2
} from "lucide-react";
import { useEffect, useState } from "react";
import { getDashboardStats, type DashboardStats } from "@/services/dashboardService";

export default function EditorDashboardPage() {
  const [stats, setStats] = useState<DashboardStats>({
    published: 0,
    drafts: 0,
    viewsThisMonth: 1234 // On garde cette valeur fixe comme demandé
  });
  
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadStats = async () => {
      try {
        setLoading(true);
        setError(null);
        const data = await getDashboardStats();
        // On conserve viewsThisMonth fixe comme demandé
        setStats(prev => ({ ...data, viewsThisMonth: prev.viewsThisMonth }));
      } catch (err) {
        setError("Impossible de charger les statistiques du tableau de bord.");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    loadStats();
  }, []);

  return (
    <div className="space-y-6">
      {/* En-tête */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
          <p className="text-zinc-400 mt-1">Bienvenue dans votre espace, suivez vos performances.</p>
        </div>
      </div>

      {/* Cartes de stats */}
      {loading ? (
        <div className="flex items-center justify-center py-12">
          <div className="flex flex-col items-center gap-2">
            <Loader2 className="h-8 w-8 animate-spin text-zinc-400" />
            <span className="text-sm text-zinc-500">Chargement des statistiques...</span>
          </div>
        </div>
      ) : error ? (
        <div className="bg-zinc-900 border border-zinc-800 border-l-red-500 border-l-4 rounded-lg p-4">
          <p className="text-red-400">{error}</p>
          <button 
            onClick={() => window.location.reload()} 
            className="text-sm text-zinc-400 hover:text-zinc-300 underline mt-2"
          >
            Réessayer
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Articles publiés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.published}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <Edit2 className="mr-2 h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Brouillons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.drafts}</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <Eye className="mr-2 h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Vues ce mois-ci</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.viewsThisMonth.toLocaleString()}</p>
            </CardContent>
          </Card>

          {/* Carte Commentaires supprimée */}
        </div>
      )}

      {/* Section d'activité récente */}
      <div className="mt-8">
        <Card className="bg-zinc-900 border-zinc-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 border-b border-zinc-800">
            <CardTitle className="text-xl text-zinc-100">Activité récente</CardTitle>
          </CardHeader>
          <CardContent className="px-6 py-8">
            {loading ? (
              <div className="flex items-center justify-center py-8">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                  <span className="text-xs text-zinc-500">Chargement des activités...</span>
                </div>
              </div>
            ) : error ? (
              <div className="py-4 text-center text-zinc-500">Impossible de charger les activités récentes.</div>
            ) : !stats.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="py-4 text-center text-zinc-500">Aucune activité récente à afficher.</div>
            ) : (
              <ul className="space-y-6 pl-1">
                {stats.recentActivity.map((activity, index) => (
                  <li key={index} className="flex items-start space-x-4 py-1">
                    <span 
                      className={`mt-1.5 inline-block h-3 w-3 rounded-full ${
                        activity.color === 'blue' ? 'bg-blue-400' : 
                        activity.color === 'purple' ? 'bg-purple-400' : 
                        activity.color === 'yellow' ? 'bg-yellow-400' : 
                        'bg-gray-400'
                      } shadow-glow`} 
                    />
                    <span 
                      className="text-sm text-zinc-300 leading-relaxed"
                      dangerouslySetInnerHTML={{ __html: activity.message }}
                    />
                  </li>
                ))}
              </ul>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
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
  Clock,
  AlertCircle,
  CheckCircle2,
  FileEdit,
  FilePlus2,
  Calendar,
  Loader2,
  Trash2,
  RefreshCw,
  PenLine,
  FileIcon
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
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
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
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {/* Total des articles */}
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-amber-400" />
              <CardTitle className="text-lg">Total des articles</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.published + stats.drafts}</p>
            </CardContent>
          </Card>

          {/* Articles publiés */}
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Articles publiés</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.published}</p>
            </CardContent>
          </Card>

          {/* Brouillons */}
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <Edit2 className="mr-2 h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Brouillons</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.drafts}</p>
            </CardContent>
          </Card>

          {/* Vues */}
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <Eye className="mr-2 h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Vues ce mois-ci</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.viewsThisMonth.toLocaleString()}</p>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Section d'activité récente - Timeline moderne */}
      <div className="mt-8">
        <Card className="bg-zinc-900 border-zinc-800 shadow-md hover:shadow-lg transition-shadow">
          <CardHeader className="pb-2 border-b border-zinc-800 flex flex-row items-center justify-between">
            <div className="flex items-center">
              <Clock className="h-5 w-5 text-zinc-400 mr-2" />
              <CardTitle className="text-xl text-zinc-100">Activité récente</CardTitle>
            </div>
            {!loading && !error && stats.recentActivity && stats.recentActivity.length > 0 && (
              <div className="text-xs text-zinc-500 flex items-center">
                <Calendar className="h-3.5 w-3.5 mr-1" />
                Dernière mise à jour aujourd'hui
              </div>
            )}
          </CardHeader>
          <CardContent className="p-0">
            {loading ? (
              <div className="flex items-center justify-center py-12">
                <div className="flex flex-col items-center gap-2">
                  <Loader2 className="h-6 w-6 animate-spin text-zinc-500" />
                  <span className="text-xs text-zinc-500">Chargement des activités...</span>
                </div>
              </div>
            ) : error ? (
              <div className="p-6 flex flex-col items-center justify-center text-center">
                <AlertCircle className="h-8 w-8 text-red-400 mb-2" />
                <p className="text-zinc-400">Impossible de charger les activités récentes.</p>
                <button 
                  onClick={() => window.location.reload()}
                  className="mt-3 px-4 py-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 text-sm rounded-md transition-colors"
                >
                  Actualiser
                </button>
              </div>
            ) : !stats.recentActivity || stats.recentActivity.length === 0 ? (
              <div className="p-6 flex flex-col items-center justify-center text-center py-12">
                <AlertCircle className="h-8 w-8 text-zinc-500 mb-2" />
                <p className="text-zinc-500">Aucune activité récente à afficher.</p>
              </div>
            ) : (
              <div className="relative timeline-container pb-2">
                {/* Ligne verticale qui connecte les événements */}
                <div className="absolute left-8 top-0 bottom-0 w-px bg-zinc-800"></div>
                
                {stats.recentActivity.map((activity, index) => {
                  // Déterminer l'icône appropriée en fonction du type d'activité
                  let icon;
                  let iconColor;
                  
                  // Utiliser le type d'activité plutôt que le contenu du message
                  // pour une meilleure distinction visuelle
                  switch (activity.type) {
                    case 'article_restored':
                      icon = <RefreshCw className="h-4 w-4" />;
                      iconColor = 'text-emerald-400'; // Vert émeraude distinctif pour restauration
                      break;
                    case 'article_deleted':
                      icon = <Trash2 className="h-4 w-4" />;
                      iconColor = 'text-rose-500'; // Rouge vif pour la corbeille
                      break;
                    case 'article_published':
                      icon = <CheckCircle2 className="h-4 w-4" />;
                      iconColor = 'text-green-500'; // Vert standard pour publication
                      break;
                    case 'article_unpublished':
                      icon = <FileEdit className="h-4 w-4" />;
                      iconColor = 'text-amber-400'; // Jaune ambré pour retour à brouillon
                      break;
                    case 'article_updated':
                      icon = <Edit2 className="h-4 w-4" />;
                      iconColor = 'text-blue-400'; // Bleu pour modification
                      break;
                    case 'article_created':
                      icon = <FilePlus2 className="h-4 w-4" />;
                      iconColor = 'text-indigo-400'; // Violet/indigo pour création
                      break;
                    case 'draft_updated':
                      icon = <PenLine className="h-4 w-4" />;
                      iconColor = 'text-yellow-300'; // Jaune clair pour mise à jour de brouillon
                      break;
                    default:
                      icon = <FileIcon className="h-4 w-4" />;
                      iconColor = 'text-gray-400';
                  }
                  
                  // Extraire le titre de l'article du message et les IDs pour les liens
                  const titleMatch = activity.message.match(/<strong>([^<]+)<\/strong>/i);
                  const articleTitle = titleMatch ? titleMatch[1] : 'Article';
                  // L'API renvoie l'ID dans la structure d'activité si disponible
                  const articleId = activity.articleId || '';
                  
                  // Essayer d'extraire un slug potentiel
                  const slugMatch = activity.message.match(/\/([\w-]+)(?:\.html|\/|$)/i);
                  const slug = slugMatch ? slugMatch[1] : '';
                  
                  // Extraire la durée relative (ex: "il y a 24 minutes")
                  const timeAgo = activity.message.match(/il y a ([^.]+)/)?.[1] || '';
                  
                  return (
                    <div key={index} className="relative pl-16 pr-6 py-5 hover:bg-zinc-800/30 transition-colors">
                      {/* Indicateur et icône */}
                      <div className={`absolute left-6 w-5 h-5 rounded-full flex items-center justify-center border-2 border-zinc-900 bg-zinc-800 ${iconColor} z-10`}>
                        {icon}
                      </div>
                      
                      {/* Contenu de l'activité */}
                      <div className="min-w-0">
                        <div className="flex items-start justify-between">
                          <h4 className="text-sm font-medium text-zinc-200 truncate">{articleTitle}</h4>
                          <span className="ml-2 text-xs whitespace-nowrap text-zinc-500 flex items-center">
                            <Clock className="inline h-3 w-3 mr-1" />
                            {timeAgo}
                          </span>
                        </div>
                        
                        <p className="mt-0.5 text-sm text-zinc-400">
                          {activity.message
                            .replace(/<\/?strong>/g, '') // Supprimer les balises strong
                            .replace(/il y a [^.]+/, '') // Supprimer la partie temporelle
                          }
                        </p>
                        
                        {/* Actions adaptées selon le type d'article */}
                        <div className="mt-2 flex space-x-2">
                          {/* Articles restaurés - afficher Voir brouillon */}
                          {activity.message.includes('restauré') ? (
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                              onClick={() => window.location.href = `/editor/articles/edit/${articleId || '1'}`}
                            >
                              <FileEdit className="h-3.5 w-3.5 mr-1.5" /> Voir brouillon
                            </Button>
                          ) : activity.message.includes('supprimé') || activity.message.includes('corbeille') ? (
                            // Action pour les articles dans la corbeille
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                              // Nous utiliserons le service restoreArticle
                              onClick={() => {
                                if (articleId) {
                                  import('@/services/articleService').then(({ restoreArticle }) => {
                                    restoreArticle(articleId)
                                      .then(response => {
                                        if (response.success) {
                                          // Rafraîchir la page pour montrer les changements
                                          window.location.reload();
                                        }
                                      })
                                      .catch(error => console.error('Erreur lors de la restauration:', error));
                                  });
                                }
                              }}
                            >
                              <RefreshCw className="h-3.5 w-3.5 mr-1.5" /> Restaurer
                            </Button>
                          ) : activity.message.includes('brouillon') ? (
                            // Action pour les brouillons
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                              onClick={() => window.location.href = `/editor/articles/edit/${articleId || '1'}`}
                            >
                              <FileEdit className="h-3.5 w-3.5 mr-1.5" /> Voir brouillon
                            </Button>
                          ) : (
                            // Action pour les articles publiés
                            <Button 
                              variant="outline" 
                              size="sm" 
                              className="h-8 text-xs bg-zinc-800 border-zinc-700 hover:bg-zinc-700 hover:text-zinc-200"
                              onClick={() => window.open(`/article/${slug || articleId || '1'}`, '_blank')}
                            >
                              <Eye className="h-3.5 w-3.5 mr-1.5" /> Voir article
                            </Button>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
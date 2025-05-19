"use client";

import Link from "next/link";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  Plus,
  FileText,
  Edit2,
  Eye,
  MessageCircle
} from "lucide-react";

export default function EditorDashboardPage() {
  // TODO: remplacer par vos hooks / fetch réels
  const stats = {
    published: 12,
    drafts: 3,
    viewsThisMonth: 1234,
    comments: 24
  };

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
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
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

        <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
          <CardHeader className="flex items-center pb-2">
            <MessageCircle className="mr-2 h-5 w-5 text-yellow-400" />
            <CardTitle className="text-lg">Commentaires</CardTitle>
          </CardHeader>
          <CardContent>
            <p className="text-3xl font-bold text-white">{stats.comments}</p>
          </CardContent>
        </Card>
      </div>

      {/* Section de mise à jour rapide */}
      <Card className="bg-zinc-900 border-zinc-800">
        <CardHeader>
          <CardTitle>Activité récente</CardTitle>
        </CardHeader>
        <CardContent className="px-4 py-6">
          <ul className="space-y-4">
            <li className="flex items-start space-x-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-blue-400" />
              <span className="text-sm text-zinc-300">
                Votre article <strong>« Comment déployer un LLM en production »</strong> a été publié il y a 2 heures.
              </span>
            </li>
            <li className="flex items-start space-x-3">
              <span className="mt-1 inline-block h-2 w-2 rounded-full bg-purple-400" />
              <span className="text-sm text-zinc-300">
                Nouveau commentaire sur <strong>« Optimiser les coûts GPU »</strong>.
              </span>
            </li>
            {/* … */}
          </ul>
        </CardContent>
      </Card>
    </div>
  );
}
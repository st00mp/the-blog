"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/AuthContext"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus, Users, FileText, MessageSquare, User } from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: string
  lastLogin: string
}

// Données fictives pour simuler des utilisateurs
const MOCK_USERS: User[] = [
  {
    id: "1",
    name: "Admin",
    email: "admin@example.com",
    role: "admin",
    lastLogin: "2025-05-16T14:30:00Z"
  },
  {
    id: "2",
    name: "Éditeur",
    email: "editeur@example.com",
    role: "editor",
    lastLogin: "2025-05-15T10:20:00Z"
  },
  {
    id: "3",
    name: "Utilisateur",
    email: "user@example.com",
    role: "user",
    lastLogin: "2025-05-10T08:15:00Z"
  }
];

export default function AdminPage() {
  const { user } = useAuth()
  const [users] = useState<User[]>(MOCK_USERS)

  // Statistiques
  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    totalEditors: users.filter(u => u.role === 'editor').length,
    totalRegularUsers: users.filter(u => u.role === 'user').length
  }

  return (
    <RouteGuard requireAuth={true} requireRole="admin">
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-white">Administration</h1>
          <p className="text-zinc-400 mt-1">Gestion des utilisateurs et des paramètres</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <User className="mr-2 h-5 w-5" />
                Administrateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalAdmins}</p>
              <p className="text-sm text-zinc-400 mt-1">Comptes administrateur</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <FileText className="mr-2 h-5 w-5" />
                Éditeurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalEditors}</p>
              <p className="text-sm text-zinc-400 mt-1">Éditeurs enregistrés</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <MessageSquare className="mr-2 h-5 w-5" />
                Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalRegularUsers}</p>
              <p className="text-sm text-zinc-400 mt-1">Utilisateurs standards</p>
            </CardContent>
          </Card>

          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader className="pb-2">
              <CardTitle className="text-lg flex items-center">
                <Users className="mr-2 h-5 w-5" />
                Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
              <p className="text-sm text-zinc-400 mt-1">Utilisateurs enregistrés</p>
            </CardContent>
          </Card>

        </div>

        <Card className="bg-zinc-900 border border-zinc-800">
          <CardHeader>
            <CardTitle>Derniers utilisateurs</CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="text-left text-sm text-zinc-400 border-b border-zinc-800">
                    <th className="pb-3 px-4">Nom</th>
                    <th className="pb-3 px-4">Email</th>
                    <th className="pb-3 px-4">Rôle</th>
                    <th className="pb-3 px-4">Dernière connexion</th>
                    <th className="pb-3 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user.id} className="border-b border-zinc-800 hover:bg-zinc-800/50">
                      <td className="py-3 px-4">{user.name}</td>
                      <td className="py-3 px-4 text-zinc-400">{user.email}</td>
                      <td className="py-3 px-4">
                        <span className={`px-2 py-1 text-xs rounded-full ${user.role === 'admin' ? 'bg-blue-900/50 text-blue-300' :
                          user.role === 'editor' ? 'bg-purple-900/50 text-purple-300' :
                            'bg-zinc-800 text-zinc-300'
                          }`}>
                          {user.role}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-zinc-400">
                        {new Date(user.lastLogin).toLocaleString()}
                      </td>
                      <td className="py-3 px-4 text-right">
                        <Button variant="ghost" size="sm" className="text-blue-400 hover:bg-blue-900/20">
                          Modifier
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>

        <div className="flex justify-end">
          <Button className="bg-blue-600 hover:bg-blue-700">
            <Plus className="mr-2 h-4 w-4" />
            Ajouter un utilisateur
          </Button>
        </div>
      </div>
    </RouteGuard>
  )
}

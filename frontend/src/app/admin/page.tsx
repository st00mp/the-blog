"use client"

import { useState } from "react"
import { RouteGuard } from "@/components/route-guard"
import { useAuth } from "@/contexts/AuthContext"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle
} from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue
} from "@/components/ui/select"
import {
  Plus,
  Users,
  FileText,
  MessageSquare,
  User as UserIcon,
  Check
} from "lucide-react"

type User = {
  id: string
  name: string
  email: string
  role: string
  lastLogin: string
}

const MOCK_USERS: User[] = [
  { id: "1", name: "Admin", email: "admin@example.com", role: "admin", lastLogin: "2025-05-16T14:30:00Z" },
  { id: "2", name: "Éditeur", email: "editeur@example.com", role: "editor", lastLogin: "2025-05-15T10:20:00Z" },
  { id: "3", name: "Utilisateur", email: "user@example.com", role: "user", lastLogin: "2025-05-10T08:15:00Z" },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [users, setUsers] = useState<User[]>([...MOCK_USERS])

  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    totalEditors: users.filter(u => u.role === 'editor').length,
    totalRegularUsers: users.filter(u => u.role === 'user').length
  }

  const handleRoleChange = (userId: string, newRole: string) => {
    setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x))
    // TODO: appeler l'API pour persister la nouvelle valeur
  }

  return (
    <RouteGuard requireAuth={true} requireRole="admin">
      <div className="space-y-8">
        {/* En-tête */}
        <header>
          <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
          <p className="text-zinc-400 mt-1">Gestion des utilisateurs et des rôles</p>
        </header>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <UserIcon className="mr-2 h-5 w-5 text-blue-400" /> Administrateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalAdmins}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <FileText className="mr-2 h-5 w-5 text-purple-400" /> Éditeurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalEditors}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <MessageSquare className="mr-2 h-5 w-5 text-green-400" /> Utilisateurs
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalRegularUsers}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border border-zinc-800">
            <CardHeader>
              <CardTitle className="flex items-center">
                <Users className="mr-2 h-5 w-5 text-zinc-400" /> Total
              </CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold">{stats.totalUsers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Tableau des utilisateurs */}
        <Card className="bg-zinc-900 border border-zinc-800">
          <CardHeader className="pb-0">
            <div className="flex justify-between items-center">
              <CardTitle>Derniers utilisateurs</CardTitle>
              <Button variant="outline" size="sm" className="flex items-center">
                <Plus className="mr-1 h-4 w-4" /> Ajouter
              </Button>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            <div className="overflow-x-auto">
              <table className="w-full table-fixed border-collapse">
                <thead className="bg-zinc-800">
                  <tr className="text-sm font-medium text-zinc-400">
                    <th className="w-1/4 px-6 py-3 text-left">Nom</th>
                    <th className="w-1/4 px-6 py-3 text-left">Email</th>
                    <th className="w-1/6 px-6 py-3 text-left">Rôle</th>
                    <th className="w-1/4 px-6 py-3 text-left">Dernière connexion</th>
                    <th className="w-1/6 px-6 py-3" />
                  </tr>
                </thead>
                <tbody>
                  {users.map(u => (
                    <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                      <td className="px-6 py-4">{u.name}</td>
                      <td className="px-6 py-4 text-zinc-400">{u.email}</td>
                      <td className="px-6 py-4">
                        <Select
                          defaultValue={u.role}
                          onValueChange={val => handleRoleChange(u.id, val)}
                        >
                          <SelectTrigger
                            className="w-full bg-[#18181B] border border-zinc-700"
                          >
                            <SelectValue placeholder="Rôle" />
                          </SelectTrigger>
                          <SelectContent className="bg-zinc-900">
                            <SelectItem value="admin">Admin</SelectItem>
                            <SelectItem value="editor">Éditeur</SelectItem>
                            <SelectItem value="user">Utilisateur</SelectItem>
                          </SelectContent>
                        </Select>
                      </td>
                      <td className="px-6 py-4 text-zinc-400">
                        {new Date(u.lastLogin).toLocaleString()}
                      </td>
                      <td className="px-6 py-4 text-right">
                        <Button
                          size="icon"
                          variant="ghost"
                          onClick={() => alert(`Rôle de ${u.name} mis à jour : ${u.role}`)}
                          className="text-green-400 hover:bg-green-900/20"
                        >
                          <Check className="h-4 w-4" />
                        </Button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}
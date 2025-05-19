"use client"

import { useState, useEffect } from "react"
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
  Check,
  Loader2,
  Search,
  X
} from "lucide-react"
import { getUsers, updateUserRole, User } from "@/services/userService"
import { useToast } from "@/components/ui/use-toast"
import { Pagination } from "@/components/ui/pagination"

// Type User est importé depuis userService.ts

export default function AdminPage() {
  const { user } = useAuth()
  const { toast } = useToast()
  const [users, setUsers] = useState<User[]>([])
  const [loading, setLoading] = useState<boolean>(true)
  const [updatingRole, setUpdatingRole] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [currentPage, setCurrentPage] = useState<number>(1)
  const pageSize = 4 // Nombre d'utilisateurs par page

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setLoading(true)
        const data = await getUsers()
        setUsers(data)
      } catch (error) {
        toast({
          variant: "destructive",
          title: "Erreur",
          description: "Impossible de charger les utilisateurs."
        })
        console.error(error)
      } finally {
        setLoading(false)
      }
    }

    loadUsers()
  }, [])

  // Filtrer les utilisateurs en fonction du terme de recherche
  const filteredUsers = users.filter(u =>
    searchTerm === "" ||
    u.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  // Calculer les indices de début et de fin pour la pagination
  const totalFilteredUsers = filteredUsers.length
  const lastUserIndex = Math.min(currentPage * pageSize, totalFilteredUsers)
  const firstUserIndex = (currentPage - 1) * pageSize

  // Récupérer uniquement les utilisateurs de la page actuelle
  const currentUsers = filteredUsers.slice(firstUserIndex, lastUserIndex)

  // Réinitialiser la pagination si on fait une recherche ou si le nombre total d'utilisateurs change
  useEffect(() => {
    setCurrentPage(1) // Retour à la première page quand on filtre
  }, [searchTerm])

  const stats = {
    totalUsers: users.length,
    totalAdmins: users.filter(u => u.role === 'admin').length,
    totalEditors: users.filter(u => u.role === 'editor').length,
    totalRegularUsers: users.filter(u => u.role === 'user').length
  }

  const handleRoleChange = async (userId: string, newRole: string) => {
    try {
      setUpdatingRole(userId)
      await updateUserRole(userId, newRole)
      setUsers(u => u.map(x => x.id === userId ? { ...x, role: newRole } : x))

      toast({
        title: "Succès",
        description: "Le rôle a été mis à jour avec succès",
        variant: "default"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "Erreur",
        description: "Impossible de mettre à jour le rôle de l'utilisateur."
      })
      console.error(error)
    } finally {
      setUpdatingRole(null)
    }
  }

  return (
    <RouteGuard requireAuth={true} requireRole="admin">
      <div className="space-y-6">
        {/* En-tête */}
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Tableau de bord</h1>
            <p className="text-zinc-400 mt-1">Gestion des utilisateurs et des rôles</p>
          </div>
        </div>

        {/* Statistiques */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <UserIcon className="mr-2 h-5 w-5 text-blue-400" />
              <CardTitle className="text-lg">Administrateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalAdmins}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <FileText className="mr-2 h-5 w-5 text-purple-400" />
              <CardTitle className="text-lg">Éditeurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalEditors}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <Users className="mr-2 h-5 w-5 text-green-400" />
              <CardTitle className="text-lg">Utilisateurs</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalRegularUsers}</p>
            </CardContent>
          </Card>
          <Card className="bg-zinc-900 border-zinc-800 hover:shadow-lg transition-shadow">
            <CardHeader className="flex items-center pb-2">
              <Users className="mr-2 h-5 w-5 text-yellow-400" />
              <CardTitle className="text-lg">Total</CardTitle>
            </CardHeader>
            <CardContent>
              <p className="text-3xl font-bold text-white">{stats.totalUsers}</p>
            </CardContent>
          </Card>
        </div>

        {/* Liste des utilisateurs */}
        <Card className="bg-zinc-900 border-zinc-800 overflow-hidden">
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle className="text-lg">Utilisateurs</CardTitle>
            </div>

            {/* Champ de recherche */}
            <div className="relative mt-4">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                <Search className="h-4 w-4 text-zinc-500" />
              </div>
              <input
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Rechercher par email ou nom..."
                className="w-full pl-10 pr-10 py-2 bg-zinc-800 border border-zinc-700 rounded-md text-zinc-200 placeholder-zinc-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              {searchTerm && (
                <button
                  className="absolute inset-y-0 right-0 flex items-center pr-3 text-zinc-500 hover:text-zinc-300"
                  onClick={() => setSearchTerm("")}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          </CardHeader>
          <CardContent className="pt-3 px-0 pb-0">
            {loading ? (
              <div className="flex justify-center items-center h-40">
                <Loader2 className="h-8 w-8 text-blue-500 animate-spin" />
                <span className="ml-2 text-zinc-400">Chargement des utilisateurs...</span>
              </div>
            ) : (
              <div className="overflow-x-auto">
                {filteredUsers.length === 0 ? (
                  <div className="text-center py-6 text-zinc-400">
                    {searchTerm ? "Aucun utilisateur ne correspond à votre recherche" : "Aucun utilisateur trouvé"}
                  </div>
                ) : (
                  <>
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
                        {currentUsers.map(u => (
                          <tr key={u.id} className="border-t border-zinc-800 hover:bg-zinc-800/50">
                            <td className="px-6 py-4">{u.name}</td>
                            <td className="px-6 py-4 text-zinc-400">{u.email}</td>
                            <td className="px-6 py-4">
                              {u.role === "admin" ? (
                                <div className="flex items-center space-x-1 text-sm px-2 py-1.5 bg-zinc-800/40 border border-zinc-700 rounded text-zinc-300">
                                  <span className="font-medium">Admin</span>
                                  <span className="text-xs text-zinc-500"> (Protégé)</span>
                                </div>
                              ) : (
                                <Select
                                  defaultValue={u.role}
                                  onValueChange={val => handleRoleChange(u.id, val)}
                                  disabled={updatingRole === u.id}
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
                              )}
                            </td>
                            <td className="px-6 py-4 text-zinc-400">
                              {u.lastLogin ? new Date(u.lastLogin).toLocaleString() : 'Jamais connecté'}
                            </td>
                            <td className="px-6 py-4 text-right">
                              {updatingRole === u.id ? (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  disabled
                                  className="text-blue-400"
                                >
                                  <Loader2 className="h-4 w-4 animate-spin" />
                                </Button>
                              ) : (
                                <Button
                                  size="icon"
                                  variant="ghost"
                                  onClick={() => toast({
                                    title: "Information",
                                    description: `${u.name} a le rôle ${u.role}`,
                                    variant: "default"
                                  })}
                                  className="text-green-400 hover:bg-green-900/20"
                                >
                                  <Check className="h-4 w-4" />
                                </Button>
                              )}
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>

                    {/* Pagination */}
                    {totalFilteredUsers > pageSize && (
                      <div className="mt-4 py-4 flex justify-center bg-zinc-900 border-t border-zinc-800">
                        <Pagination
                          total={totalFilteredUsers}
                          currentPage={currentPage}
                          pageSize={pageSize}
                          onPageChange={setCurrentPage}
                          className="mt-2"
                        />
                      </div>
                    )}
                  </>
                )}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </RouteGuard>
  )
}
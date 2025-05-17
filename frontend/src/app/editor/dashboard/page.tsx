export default function EditorDashboardPage() {
  return (
    <div>
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-white">Vue d'ensemble</h1>
        <p className="text-zinc-400">Bienvenue dans votre espace éditeur</p>
      </div>

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-medium text-zinc-300">Articles publiés</h3>
          <p className="text-2xl font-bold text-white">12</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-medium text-zinc-300">Brouillons</h3>
          <p className="text-2xl font-bold text-white">3</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-medium text-zinc-300">Vues ce mois-ci</h3>
          <p className="text-2xl font-bold text-white">1,234</p>
        </div>
        <div className="rounded-lg border border-zinc-800 bg-zinc-900 p-6">
          <h3 className="font-medium text-zinc-300">Commentaires</h3>
          <p className="text-2xl font-bold text-white">24</p>
        </div>
      </div>
    </div>
  )
}

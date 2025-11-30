"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Election } from "@/lib/storage"
import { PlusCircle, Eye, Lock, Trash2, ArrowLeft } from "lucide-react"

export default function ElectionsManagementPage() {
  const router = useRouter()
  const [elections, setElections] = useState<Election[]>([])
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
    loadElections()
  }, [router])

  const loadElections = () => {
    setElections(storage.getElections())
  }

  const handleCloseElection = (electionId: string) => {
    const allElections = storage.getElections()
    const updated = allElections.map((e) => (e.id === electionId ? { ...e, status: "closed" as const } : e))
    storage.saveElections(updated)
    loadElections()
  }

  const handleDeleteElection = (electionId: string) => {
    if (confirm("Tem certeza que deseja excluir esta eleição? Esta ação não pode ser desfeita.")) {
      const allElections = storage.getElections()
      const updated = allElections.filter((e) => e.id !== electionId)
      storage.saveElections(updated)
      loadElections()
    }
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="GERENCIAR ELEIÇÕES" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="gap-2 rounded-xl">
              <ArrowLeft className="h-4 w-4" />
              Voltar ao Dashboard
            </Button>
            <Button
              onClick={() => router.push("/admin/eleicoes/nova")}
              className="bg-[#00c23d] hover:bg-[#006e32] text-white rounded-xl gap-2"
            >
              <PlusCircle className="h-4 w-4" />
              Nova Eleição
            </Button>
          </div>

          <Card className="rounded-2xl border-neutral-200">
            <CardHeader>
              <CardTitle className="text-2xl">Todas as Eleições</CardTitle>
              <CardDescription>Gerencie e visualize todas as eleições criadas</CardDescription>
            </CardHeader>
            <CardContent>
              {elections.length === 0 ? (
                <div className="text-center py-12">
                  <p className="text-muted-foreground mb-4">Nenhuma eleição criada ainda</p>
                  <Button
                    onClick={() => router.push("/admin/eleicoes/nova")}
                    className="bg-[#1e237e] hover:bg-primary-dark text-white rounded-xl gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Criar Primeira Eleição
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {elections.map((election) => {
                    const totalVotes = Object.values(election.votes).reduce((a, b) => a + b, 0)
                    return (
                      <div
                        key={election.id}
                        className="flex flex-col md:flex-row md:items-center justify-between p-6 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors gap-4"
                      >
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2">
                            <h3 className="font-bold text-lg text-foreground">{election.title}</h3>
                            <span
                              className={`text-xs px-3 py-1 rounded-full font-medium ${
                                election.status === "open"
                                  ? "bg-success/10 text-success"
                                  : "bg-neutral-200 text-neutral-700"
                              }`}
                            >
                              {election.status === "open" ? "Aberta" : "Fechada"}
                            </span>
                          </div>
                          <p className="text-sm text-muted-foreground mb-3">{election.description}</p>
                          <div className="flex flex-wrap items-center gap-4 text-sm">
                            <span className="text-muted-foreground">
                              <strong className="text-foreground">{totalVotes}</strong> votos
                            </span>
                            <span className="text-muted-foreground">
                              <strong className="text-foreground">{election.chapas.length}</strong> chapas
                            </span>
                            <span className="text-muted-foreground">
                              <strong className="text-foreground">{election.voters.length}</strong> eleitores
                            </span>
                          </div>
                        </div>
                        <div className="flex flex-wrap gap-2">
                          <Button
                            onClick={() => router.push(`/admin/eleicoes/${election.id}`)}
                            variant="outline"
                            size="sm"
                            className="bg-[#008BDA] text-white hover:bg-[#004e84] hover:text-white rounded-xl"
                          >
                            <Eye className="h-4 w-4" />
                            Ver Detalhes
                          </Button>
                          {election.status === "open" && (
                            <Button
                              onClick={() => handleCloseElection(election.id)}
                              variant="outline"
                              size="sm"
                              className="bg-[#CF0E0E] rounded-xl gap-2 text-white hover:text-red-700 hover:bg-orange-50"
                            >
                              <Lock className="h-4 w-4" />
                              Encerrar
                            </Button>
                          )}
                          <Button
                            onClick={() => handleDeleteElection(election.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-xl gap-2 text-danger hover:text-danger hover:bg-red-50"
                          >
                            <Trash2 className="h-4 w-4" />
                            Excluir
                          </Button>
                        </div>
                      </div>
                    )
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

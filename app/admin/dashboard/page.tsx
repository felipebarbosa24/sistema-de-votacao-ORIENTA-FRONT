"use client"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Election } from "@/lib/storage"
import { PlusCircle, Vote, Users, BarChart3, LogOut } from "lucide-react"

export default function AdminDashboardPage() {
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
    setElections(storage.getElections())
  }, [router])

  const handleLogout = () => {
    localStorage.removeItem("adminAuth")
    router.push("/admin")
  }

  if (!isAuthenticated) {
    return null
  }

  const activeElections = elections.filter((e) => e.status === "open")
  const totalVotes = elections.reduce((sum, e) => {
    return sum + Object.values(e.votes).reduce((a, b) => a + b, 0)
  }, 0)
  const totalVoters = elections.reduce((sum, e) => sum + e.voters.length, 0)

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="PAINEL ADMINISTRATIVO" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-6xl">
          <div className="flex items-center justify-between mb-8">
            <div>
              <h2 className="text-3xl font-bold text-foreground">Dashboard</h2>
              <p className="text-muted-foreground mt-1">Gerencie eleições e visualize resultados</p>
            </div>
            <Button onClick={handleLogout} variant="outline" className="gap-2 rounded-xl bg-transparent">
              <LogOut className="h-4 w-4" />
              Sair
            </Button>
          </div>

          {/* Statistics Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eleições</CardTitle>
                <Vote className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{elections.length}</div>
                <p className="text-xs text-muted-foreground mt-1">{activeElections.length} eleição(ões) ativa(s)</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Votos</CardTitle>
                <BarChart3 className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalVotes}</div>
                <p className="text-xs text-muted-foreground mt-1">Em todas as eleições</p>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eleitores</CardTitle>
                <Users className="h-5 w-5 text-secondary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalVoters}</div>
                <p className="text-xs text-muted-foreground mt-1">Participantes únicos</p>
              </CardContent>
            </Card>
          </div>

          {/* Quick Actions */}
          <Card className="rounded-2xl border-neutral-200 mb-8">
            <CardHeader>
              <CardTitle className="text-xl">Ações Rápidas</CardTitle>
              <CardDescription>Gerencie suas eleições</CardDescription>
            </CardHeader>
            <CardContent className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <Button
                onClick={() => router.push("/admin/eleicoes/nova")}
                className="h-16 bg-primary hover:bg-primary-dark text-white rounded-xl gap-2 text-base"
              >
                <PlusCircle className="h-5 w-5" />
                Criar Nova Eleição
              </Button>
              <Button
                onClick={() => router.push("/admin/eleicoes")}
                variant="outline"
                className="h-16 rounded-xl gap-2 text-base"
              >
                <Vote className="h-5 w-5" />
                Gerenciar Eleições
              </Button>
              <Button
                onClick={() => router.push("/admin/relatorios")}
                variant="outline"
                className="h-16 rounded-xl gap-2 text-base"
              >
                <BarChart3 className="h-5 w-5" />
                Relatórios e Backup
              </Button>
            </CardContent>
          </Card>

          {/* Recent Elections */}
          <Card className="rounded-2xl border-neutral-200">
            <CardHeader>
              <CardTitle className="text-xl">Eleições Recentes</CardTitle>
              <CardDescription>Últimas eleições criadas</CardDescription>
            </CardHeader>
            <CardContent>
              {elections.length === 0 ? (
                <div className="text-center py-12">
                  <Vote className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <p className="text-muted-foreground mb-4">Nenhuma eleição criada ainda</p>
                  <Button
                    onClick={() => router.push("/admin/eleicoes/nova")}
                    className="bg-primary hover:bg-primary-dark text-white rounded-xl gap-2"
                  >
                    <PlusCircle className="h-4 w-4" />
                    Criar Primeira Eleição
                  </Button>
                </div>
              ) : (
                <div className="space-y-4">
                  {elections.slice(0, 5).map((election) => {
                    const totalVotesInElection = Object.values(election.votes).reduce((a, b) => a + b, 0)
                    return (
                      <div
                        key={election.id}
                        className="flex items-center justify-between p-4 border border-neutral-200 rounded-xl hover:bg-neutral-50 transition-colors"
                      >
                        <div className="flex-1">
                          <h3 className="font-semibold text-foreground">{election.title}</h3>
                          <p className="text-sm text-muted-foreground mt-1">{election.description}</p>
                          <div className="flex items-center gap-4 mt-2">
                            <span
                              className={`text-xs px-2 py-1 rounded-full ${
                                election.status === "open"
                                  ? "bg-success/10 text-success"
                                  : "bg-neutral-200 text-neutral-700"
                              }`}
                            >
                              {election.status === "open" ? "Aberta" : "Fechada"}
                            </span>
                            <span className="text-xs text-muted-foreground">{totalVotesInElection} votos</span>
                            <span className="text-xs text-muted-foreground">{election.chapas.length} chapas</span>
                          </div>
                        </div>
                        <Button
                          onClick={() => router.push(`/admin/eleicoes/${election.id}`)}
                          variant="outline"
                          size="sm"
                          className="rounded-xl"
                        >
                          Ver Detalhes
                        </Button>
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

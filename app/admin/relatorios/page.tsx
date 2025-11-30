"use client"

import type React from "react"

import { useEffect, useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage } from "@/lib/storage"
import { ArrowLeft, Download, Upload, Trash2, FileText, BarChart3 } from "lucide-react"

export default function ReportsPage() {
  const router = useRouter()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [importError, setImportError] = useState("")
  const [importSuccess, setImportSuccess] = useState(false)

  useEffect(() => {
    const auth = localStorage.getItem("adminAuth")
    if (auth !== "true") {
      router.push("/admin")
      return
    }
    setIsAuthenticated(true)
  }, [router])

  const handleExportData = () => {
    const data = storage.exportAllData()
    const blob = new Blob([data], { type: "application/json" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `backup-votacao-${new Date().toISOString().split("T")[0]}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  const handleImportData = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setImportError("")
    setImportSuccess(false)

    const reader = new FileReader()
    reader.onload = (event) => {
      const content = event.target?.result as string
      const success = storage.importData(content)

      if (success) {
        setImportSuccess(true)
        setTimeout(() => {
          router.push("/admin/dashboard")
        }, 2000)
      } else {
        setImportError("Erro ao importar dados. Verifique se o arquivo está correto.")
      }
    }
    reader.readAsText(file)
  }

  const handleClearData = () => {
    if (
      confirm(
        "ATENÇÃO: Esta ação irá apagar TODOS os dados do sistema, incluindo eleições, votos e eleitores. Esta ação não pode ser desfeita. Deseja continuar?",
      )
    ) {
      if (confirm("Tem certeza absoluta? Esta é sua última chance de cancelar.")) {
        storage.clearAllData()
        router.push("/admin")
      }
    }
  }

  const handleExportSummary = () => {
    const elections = storage.getElections()
    let summary = "RELATÓRIO GERAL DO SISTEMA DE VOTAÇÃO\n"
    summary += "=".repeat(50) + "\n\n"
    summary += `Data de Exportação: ${new Date().toLocaleString("pt-BR")}\n`
    summary += `Total de Eleições: ${elections.length}\n\n`

    elections.forEach((election, index) => {
      const stats = storage.getElectionStats(election.id)
      if (!stats) return

      summary += `\n${"=".repeat(50)}\n`
      summary += `ELEIÇÃO ${index + 1}: ${election.title}\n`
      summary += `${"=".repeat(50)}\n\n`
      summary += `Descrição: ${election.description}\n`
      summary += `Status: ${election.status === "open" ? "Aberta" : "Fechada"}\n`
      summary += `Data de Início: ${new Date(election.startDate).toLocaleString("pt-BR")}\n`
      summary += `Total de Votos: ${stats.totalVotes}\n`
      summary += `Total de Eleitores: ${stats.totalVoters}\n\n`

      summary += "RESULTADOS POR CHAPA:\n"
      summary += "-".repeat(50) + "\n"
      stats.chapaStats.forEach((chapa, idx) => {
        summary += `${idx + 1}. Chapa ${chapa.number} - ${chapa.name}\n`
        summary += `   Votos: ${chapa.votes} (${chapa.percentage.toFixed(2)}%)\n`
        if (idx === 0 && stats.totalVotes > 0) {
          summary += `   ⭐ VENCEDOR\n`
        }
        summary += "\n"
      })

      if (stats.totalVoters > 0) {
        summary += "\nLISTA DE ELEITORES:\n"
        summary += "-".repeat(50) + "\n"
        election.voters.forEach((voter, idx) => {
          summary += `${idx + 1}. ${voter.name} (CPF: ${voter.cpf})\n`
          summary += `   Votou em: ${new Date(voter.votedAt).toLocaleString("pt-BR")}\n`
        })
      }
      summary += "\n"
    })

    const blob = new Blob([summary], { type: "text/plain;charset=utf-8" })
    const url = URL.createObjectURL(blob)
    const a = document.createElement("a")
    a.href = url
    a.download = `relatorio-geral-${new Date().toISOString().split("T")[0]}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  if (!isAuthenticated) {
    return null
  }

  const elections = storage.getElections()
  const totalVotes = elections.reduce((sum, e) => {
    return sum + Object.values(e.votes).reduce((a, b) => a + b, 0)
  }, 0)

  return (
    <div className="min-h-screen flex flex-col [bg-#f5f5f5]">
      <Header title="RELATÓRIOS E BACKUP" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={() => router.push("/admin/dashboard")} variant="outline" className="gap-2 rounded-xl mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar ao Dashboard
          </Button>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Eleições</CardTitle>
                <BarChart3 className="h-5 w-5 text-primary" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{elections.length}</div>
              </CardContent>
            </Card>

            <Card className="rounded-2xl border-neutral-200">
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <CardTitle className="text-sm font-medium text-muted-foreground">Total de Votos</CardTitle>
                <FileText className="h-5 w-5 text-success" />
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-foreground">{totalVotes}</div>
              </CardContent>
            </Card>
          </div>

          <Card className="rounded-2xl border-neutral-200 mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Relatórios</CardTitle>
              <CardDescription>Exporte relatórios detalhados do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExportSummary}
                className="w-full h-14 bg-[#1e237e] hover:bg-primary-dark text-white rounded-xl gap-2 justify-start px-6"
              >
                <FileText className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Exportar Relatório Geral</div>
                  <div className="text-xs opacity-90">Relatório completo de todas as eleições em formato texto</div>
                </div>
              </Button>
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-neutral-200 mb-6">
            <CardHeader>
              <CardTitle className="text-xl">Backup de Dados</CardTitle>
              <CardDescription>Faça backup ou restaure os dados do sistema</CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              <Button
                onClick={handleExportData}
                className="w-full h-14 bg-success hover:bg-success/90 text-white rounded-xl gap-2 justify-start px-6"
              >
                <Download className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Exportar Backup (JSON)</div>
                  <div className="text-xs opacity-90">Salve todos os dados do sistema em formato JSON</div>
                </div>
              </Button>

              <div>
                <input type="file" accept=".json" onChange={handleImportData} className="hidden" id="import-file" />
                <label htmlFor="import-file">
                  <Button
                    type="button"
                    onClick={() => document.getElementById("import-file")?.click()}
                    variant="outline"
                    className="w-full h-14 rounded-xl gap-2 justify-start px-6 cursor-pointer"
                  >
                    <Upload className="h-5 w-5" />
                    <div className="text-left">
                      <div className="font-semibold">Importar Backup (JSON)</div>
                      <div className="text-xs text-muted-foreground">Restaure dados de um arquivo de backup</div>
                    </div>
                  </Button>
                </label>
              </div>

              {importError && (
                <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                  {importError}
                </div>
              )}

              {importSuccess && (
                <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded-xl text-sm">
                  Dados importados com sucesso! Redirecionando...
                </div>
              )}
            </CardContent>
          </Card>

          <Card className="rounded-2xl border-red-100 border-2">
            <CardHeader>
              <CardTitle className="text-xl text-danger">Zona de Perigo</CardTitle>
              <CardDescription>Ações irreversíveis - use com extrema cautela</CardDescription>
            </CardHeader>
            <CardContent>
              <Button
                onClick={handleClearData}
                variant="outline"
                className="w-full h-14 rounded-xl gap-2 justify-start px-6 text-danger hover:text-danger hover:bg-red-50 border-danger bg-transparent"
              >
                <Trash2 className="h-5 w-5" />
                <div className="text-left">
                  <div className="font-semibold">Limpar Todos os Dados</div>
                  <div className="text-xs opacity-75">Remove permanentemente todas as eleições e votos</div>
                </div>
              </Button>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

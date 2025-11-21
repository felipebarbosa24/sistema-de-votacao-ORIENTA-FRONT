"use client"

import type React from "react"
import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { storage, type Chapa } from "@/lib/storage"
import { PlusCircle, Trash2, ArrowLeft } from "lucide-react"

export default function NewElectionPage() {
  const router = useRouter()
  const [title, setTitle] = useState("")
  const [description, setDescription] = useState("")
  const [chapas, setChapas] = useState<Chapa[]>([
    { id: "1", name: "", number: 1 },
    { id: "2", name: "", number: 2 },
  ])
  const [error, setError] = useState("")

  const addChapa = () => {
    const newNumber = Math.max(...chapas.map((c) => c.number)) + 1
    setChapas([...chapas, { id: Date.now().toString(), name: "", number: newNumber }])
  }

  const removeChapa = (id: string) => {
    if (chapas.length <= 2) {
      setError("É necessário ter pelo menos 2 chapas")
      return
    }
    setChapas(chapas.filter((c) => c.id !== id))
  }

  const updateChapa = (id: string, field: "name" | "number", value: string | number) => {
    setChapas(chapas.map((c) => (c.id === id ? { ...c, [field]: value } : c)))
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!title.trim()) {
      setError("Por favor, insira o título da eleição")
      return
    }

    if (!description.trim()) {
      setError("Por favor, insira a descrição da eleição")
      return
    }

    if (chapas.some((c) => !c.name.trim())) {
      setError("Por favor, preencha o nome de todas as chapas")
      return
    }

    const numbers = chapas.map((c) => c.number)
    if (new Set(numbers).size !== numbers.length) {
      setError("Os números das chapas devem ser únicos")
      return
    }

    const elections = storage.getElections()
    const newElection = {
      id: Date.now().toString(),
      title: title.trim(),
      description: description.trim(),
      startDate: new Date().toISOString(),
      endDate: "",
      chapas: chapas.map((c) => ({ ...c, name: c.name.trim() })),
      votes: Object.fromEntries(chapas.map((c) => [c.id, 0])),
      voters: [],
      status: "open" as const,
    }

    storage.saveElections([...elections, newElection])
    router.push("/admin/eleicoes")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="NOVA ELEIÇÃO" variant="admin" />

      <main className="flex-1 p-4 py-8">
        <div className="container mx-auto max-w-4xl">
          <Button onClick={() => router.push("/admin/eleicoes")} variant="outline" className="gap-2 rounded-xl mb-6">
            <ArrowLeft className="h-4 w-4" />
            Voltar
          </Button>

          <Card className="rounded-2xl border-neutral-200">
            <CardHeader>
              <CardTitle className="text-2xl">Criar Nova Eleição</CardTitle>
              <CardDescription>Preencha os dados para criar uma nova eleição estudantil</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-sm font-medium">
                    Título da Eleição *
                  </Label>
                  <Input
                    id="title"
                    type="text"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Ex: Eleição para Grêmio Estudantil 2025"
                    className="h-12 rounded-xl"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description" className="text-sm font-medium">
                    Descrição *
                  </Label>
                  <Textarea
                    id="description"
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    placeholder="Descreva o propósito e detalhes da eleição"
                    className="min-h-24 rounded-xl"
                  />
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <Label className="text-sm font-medium">Chapas Concorrentes *</Label>
                    <Button
                      type="button"
                      onClick={addChapa}
                      variant="outline"
                      size="sm"
                      className="gap-2 rounded-xl bg-transparent"
                    >
                      <PlusCircle className="h-4 w-4" />
                      Adicionar Chapa
                    </Button>
                  </div>

                  <div className="space-y-3">
                    {chapas.map((chapa, index) => (
                      <div key={chapa.id} className="flex gap-3 items-start p-4 border border-neutral-200 rounded-xl">
                        <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                          <div className="md:col-span-2 space-y-2">
                            <Label htmlFor={`chapa-name-${chapa.id}`} className="text-xs text-muted-foreground">
                              Nome da Chapa
                            </Label>
                            <Input
                              id={`chapa-name-${chapa.id}`}
                              type="text"
                              value={chapa.name}
                              onChange={(e) => updateChapa(chapa.id, "name", e.target.value)}
                              placeholder="Ex: Chapa Renovação"
                              className="h-10 rounded-lg"
                            />
                          </div>
                          <div className="space-y-2">
                            <Label htmlFor={`chapa-number-${chapa.id}`} className="text-xs text-muted-foreground">
                              Número
                            </Label>
                            <Input
                              id={`chapa-number-${chapa.id}`}
                              type="number"
                              value={chapa.number}
                              onChange={(e) => updateChapa(chapa.id, "number", Number.parseInt(e.target.value) || 0)}
                              min="1"
                              className="h-10 rounded-lg"
                            />
                          </div>
                        </div>
                        {chapas.length > 2 && (
                          <Button
                            type="button"
                            onClick={() => removeChapa(chapa.id)}
                            variant="outline"
                            size="sm"
                            className="rounded-lg text-danger hover:text-danger hover:bg-red-50 mt-7"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                    ))}
                  </div>
                </div>

                {error && (
                  <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-xl text-sm">
                    {error}
                  </div>
                )}

                <div className="flex gap-3 pt-4">
                  <Button
                    type="button"
                    onClick={() => router.push("/admin/eleicoes")}
                    variant="outline"
                    className="flex-1 h-12 rounded-xl"
                  >
                    Cancelar
                  </Button>
                  <Button
                    type="submit"
                    className="flex-1 h-12 bg-primary hover:bg-primary-dark text-white rounded-xl font-semibold"
                  >
                    Criar Eleição
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </div>
      </main>

      <Footer />
    </div>
  )
}

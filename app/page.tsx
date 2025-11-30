"use client"

import type React from "react"

import { useState } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { formatCPF, isValidCPF } from "@/lib/utils/cpf"
import { storage } from "@/lib/storage"

export default function StudentIdentificationPage() {
  const router = useRouter()
  const [name, setName] = useState("")
  const [cpf, setCpf] = useState("")
  const [error, setError] = useState("")

  const handleCPFChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const formatted = formatCPF(e.target.value)
    setCpf(formatted)
    setError("")
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    setError("")

    if (!name.trim()) {
      setError("Por favor, insira seu nome completo")
      return
    }

    if (!isValidCPF(cpf)) {
      setError("Por favor, insira um CPF válido")
      return
    }

    const activeElections = storage.getActiveElections()
    if (activeElections.length === 0) {
      setError("Não há eleições abertas no momento")
      return
    }

    localStorage.setItem("voter", JSON.stringify({ name, cpf }))
    router.push("/selecionar-eleicoes")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="ESTUDANTE" variant="student" />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-lg">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-neutral-200">
            <div className="bg-[#1e237e] text-white py-4 px-6 rounded-xl mb-8 -mx-2">
              <h2 className="text-xl font-bold text-center uppercase">Acesso Estudante - Identificação do Eleitor</h2>
            </div>

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="space-y-2">
                <Label htmlFor="name" className="text-sm font-semibold text-neutral-700">
                  Nome Completo
                </Label>
                <Input
                  id="name"
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Digite seu nome completo"
                  className="h-12 rounded-lg border-neutral-300"
                />
              </div>

              <div className="space-y-2">
                <Label htmlFor="cpf" className="text-sm font-semibold text-neutral-700">
                  CPF:
                </Label>
                <Input
                  id="cpf"
                  type="text"
                  value={cpf}
                  onChange={handleCPFChange}
                  placeholder="___.___.___-__"
                  className="h-12 rounded-lg border-neutral-300 font-mono text-lg"
                />
              </div>

              {error && (
                <div className="bg-red-50 border border-red-300 text-red-700 px-4 py-3 rounded-lg text-sm font-medium">
                  {error}
                </div>
              )}

              <p className="text-sm text-neutral-600 text-center pt-2">Para votar, por favor, insira seu CPF:</p>

              <Button
                type="submit"
                className="w-full h-14 bg-[#00c13e] hover:bg-[#00a835] text-white font-bold rounded-lg text-base uppercase transition-all hover:shadow-lg"
              >
                VOTAR
              </Button>
            </form>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

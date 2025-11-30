"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { storage, type Election } from "@/lib/storage"
import { ChevronRight } from "lucide-react"

export default function SelectElectionsPage() {
  const router = useRouter()
  const [elections, setElections] = useState<Election[]>([])
  const [selectedElections, setSelectedElections] = useState<string[]>([])
  const [voter, setVoter] = useState<{ name: string; cpf: string } | null>(null)

  useEffect(() => {
    const voterData = localStorage.getItem("voter")
    if (!voterData) {
      router.push("/")
      return
    }

    const parsedVoter = JSON.parse(voterData)
    setVoter(parsedVoter)

    const activeElections = storage.getActiveElections()
    const availableElections = activeElections.filter((e) => !storage.hasVotedInElection(parsedVoter.cpf, e.id))
    setElections(availableElections)
  }, [router])

  const handleToggleElection = (electionId: string) => {
    setSelectedElections((prev) =>
      prev.includes(electionId) ? prev.filter((id) => id !== electionId) : [...prev, electionId],
    )
  }

  const handleStartVoting = () => {
    if (selectedElections.length === 0) return

    localStorage.setItem("selectedElections", JSON.stringify(selectedElections))
    localStorage.setItem("currentElectionIndex", "0")
    router.push("/votar")
  }

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="ESTUDANTE" variant="student" />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-neutral-200">
            <div className="bg-[#1e237e] text-white py-4 px-6 rounded-xl mb-8 -mx-2">
              <h2 className="text-xl font-bold text-center uppercase">Selecione as Eleições</h2>
            </div>

            {elections.length === 0 ? (
              <div className="text-center py-12">
                <p className="text-neutral-600 mb-6">Você já votou em todas as eleições disponíveis.</p>
                <Button
                  onClick={() => {
                    localStorage.removeItem("voter")
                    localStorage.removeItem("selectedElections")
                    localStorage.removeItem("currentElectionIndex")
                    router.push("/")
                  }}
                  className="bg-[#007bce] hover:bg-[#005fa3] text-white rounded-lg font-bold uppercase"
                >
                  Voltar para Identificação
                </Button>
              </div>
            ) : (
              <>
                <div className="space-y-4 mb-8">
                  {elections.map((election) => (
                    <div
                      key={election.id}
                      onClick={() => handleToggleElection(election.id)}
                      className={`p-6 rounded-lg border-2 cursor-pointer transition-all ${
                        selectedElections.includes(election.id)
                          ? "border-[#007bce] bg-blue-50"
                          : "border-neutral-300 bg-white hover:border-neutral-400"
                      }`}
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-4">
                            <div
                              className={`w-6 h-6 rounded border-2 flex items-center justify-center flex-shrink-0 ${
                                selectedElections.includes(election.id)
                                  ? "border-[#007bce] bg-[#007bce]"
                                  : "border-neutral-400"
                              }`}
                            >
                              {selectedElections.includes(election.id) && (
                                <span className="text-white text-sm font-bold">✓</span>
                              )}
                            </div>
                            <div>
                              <h3 className="font-bold text-lg text-[#1e237e]">{election.title}</h3>
                              <p className="text-neutral-600 text-sm mt-1">{election.description}</p>
                              <div className="flex items-center gap-4 mt-2">
                                <span className="text-xs text-neutral-600">{election.chapas.length} chapas</span>
                              </div>
                            </div>
                          </div>
                        </div>
                        <ChevronRight
                          className={`w-5 h-5 flex-shrink-0 transition-transform ${
                            selectedElections.includes(election.id) ? "text-[#007bce] rotate-90" : "text-neutral-400"
                          }`}
                        />
                      </div>
                    </div>
                  ))}
                </div>

                <Button
                  onClick={handleStartVoting}
                  disabled={selectedElections.length === 0}
                  className="w-full h-14 bg-[#00c13e] hover:bg-[#00a835] text-white font-bold rounded-lg text-base uppercase transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  INICIAR VOTAÇÃO
                </Button>
              </>
            )}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

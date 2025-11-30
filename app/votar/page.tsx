"use client"

import { useState, useEffect } from "react"
import { useRouter } from "next/navigation"
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { Button } from "@/components/ui/button"
import { storage, type Election } from "@/lib/storage"

export default function VotingBallotPage() {
  const router = useRouter()
  const [elections, setElections] = useState<Election[]>([])
  const [currentIndex, setCurrentIndex] = useState(0)
  const [selectedChapa, setSelectedChapa] = useState<string | null>(null)
  const [voter, setVoter] = useState<{ name: string; cpf: string } | null>(null)

  useEffect(() => {
    const voterData = localStorage.getItem("voter")
    if (!voterData) {
      router.push("/")
      return
    }

    setVoter(JSON.parse(voterData))

    const selectedElectionsData = localStorage.getItem("selectedElections")
    const currentIndexData = localStorage.getItem("currentElectionIndex")

    if (!selectedElectionsData) {
      router.push("/")
      return
    }

    const selectedIds = JSON.parse(selectedElectionsData)
    const allElections = storage.getElections()
    const selectedElections = selectedIds
      .map((id: string) => allElections.find((e) => e.id === id))
      .filter((e: Election | undefined) => e !== undefined)

    if (selectedElections.length === 0) {
      router.push("/")
      return
    }

    setElections(selectedElections)
    setCurrentIndex(currentIndexData ? Number.parseInt(currentIndexData) : 0)
  }, [router])

  const handleConfirm = () => {
    if (!selectedChapa || !elections[currentIndex] || !voter) return

    const currentElection = elections[currentIndex]

    storage.addVote(currentElection.id, selectedChapa, {
      name: voter.name,
      cpf: voter.cpf,
      votedAt: new Date().toISOString(),
      electionId: currentElection.id,
    })

    if (currentIndex < elections.length - 1) {
      setCurrentIndex(currentIndex + 1)
      setSelectedChapa(null)
      localStorage.setItem("currentElectionIndex", (currentIndex + 1).toString())
    } else {
      localStorage.removeItem("voter")
      localStorage.removeItem("selectedElections")
      localStorage.removeItem("currentElectionIndex")
      router.push("/confirmacao")
    }
  }

  if (elections.length === 0) {
    return null
  }

  const currentElection = elections[currentIndex]
  const isLastElection = currentIndex === elections.length - 1

  return (
    <div className="min-h-screen flex flex-col bg-[#f5f5f5]">
      <Header title="ESTUDANTE" variant="student" />

      <main className="flex-1 flex items-center justify-center p-4 py-16">
        <div className="w-full max-w-2xl">
          <div className="bg-white rounded-2xl shadow-card p-10 border border-neutral-200">
            {elections.length > 1 && (
              <div className="mb-6 pb-6 border-b border-neutral-200">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-semibold text-neutral-700">
                    Eleição {currentIndex + 1} de {elections.length}
                  </span>
                  <span className="text-xs text-neutral-500">
                    {Math.round(((currentIndex + 1) / elections.length) * 100)}%
                  </span>
                </div>
                <div className="w-full bg-neutral-200 rounded-full h-2 overflow-hidden">
                  <div
                    className="bg-[#007bce] h-full transition-all duration-300"
                    style={{ width: `${((currentIndex + 1) / elections.length) * 100}%` }}
                  />
                </div>
              </div>
            )}

            <div className="bg-[#1e237e] text-white py-4 px-6 rounded-xl mb-8 -mx-2">
              <h2 className="text-xl font-bold text-center uppercase">Cédula de Votação - {currentElection.title}</h2>
            </div>

            <div className="space-y-4 mb-8">
              {currentElection.chapas.map((chapa) => (
                <button
                  key={chapa.id}
                  onClick={() => setSelectedChapa(chapa.id)}
                  className={`w-full p-5 rounded-lg border-2 transition-all font-bold text-base uppercase ${
                    selectedChapa === chapa.id
                      ? "border-[#007bce] bg-[#007bce] text-white shadow-lg scale-[1.02]"
                      : "border-[#007bce] bg-white text-[#007bce] hover:bg-[#007bce] hover:text-white hover:shadow-md"
                  }`}
                >
                  {chapa.name}
                </button>
              ))}
            </div>

            <Button
              onClick={handleConfirm}
              disabled={!selectedChapa}
              className="w-full h-14 bg-[#00c13e] hover:bg-[#00a835] text-white font-bold rounded-lg text-base uppercase transition-all hover:shadow-lg disabled:opacity-50 disabled:cursor-not-allowed disabled:hover:scale-100"
            >
              {isLastElection ? "CONFIRMAR VOTAÇÃO FINAL" : "PRÓXIMA ELEIÇÃO"}
            </Button>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  )
}

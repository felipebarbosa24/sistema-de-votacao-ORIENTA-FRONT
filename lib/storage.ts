export interface Voter {
  name: string
  cpf: string
  votedAt: string
  electionId: string
}

export interface Chapa {
  id: string
  name: string
  number: number
}

export interface Election {
  id: string
  title: string
  description: string
  startDate: string
  endDate: string
  chapas: Chapa[]
  votes: Record<string, number>
  voters: Voter[]
  status: "open" | "closed"
}

export const storage = {
  getElections: (): Election[] => {
    if (typeof window === "undefined") return []
    const data = localStorage.getItem("elections")
    return data ? JSON.parse(data) : []
  },

  saveElections: (elections: Election[]) => {
    if (typeof window === "undefined") return
    localStorage.setItem("elections", JSON.stringify(elections))
  },

  getActiveElections: (): Election[] => {
    const elections = storage.getElections()
    return elections.filter((e) => e.status === "open")
  },

  getActiveElection: (): Election | null => {
    const active = storage.getActiveElections()
    return active.length > 0 ? active[0] : null
  },

  addVote: (electionId: string, chapaId: string, voter: Voter) => {
    const elections = storage.getElections()
    const election = elections.find((e) => e.id === electionId)

    if (election) {
      election.votes[chapaId] = (election.votes[chapaId] || 0) + 1
      election.voters.push({
        ...voter,
        electionId,
      })
      storage.saveElections(elections)
    }
  },

  hasVotedInElection: (cpf: string, electionId: string): boolean => {
    const elections = storage.getElections()
    const election = elections.find((e) => e.id === electionId)
    return election ? election.voters.some((v) => v.cpf === cpf) : false
  },

  hasVoted: (cpf: string): boolean => {
    const elections = storage.getElections()
    return elections.some((e) => e.voters.some((v) => v.cpf === cpf && v.electionId === e.id))
  },

  getElectionStats: (electionId: string) => {
    const elections = storage.getElections()
    const election = elections.find((e) => e.id === electionId)

    if (!election) return null

    const totalVotes = Object.values(election.votes).reduce((a, b) => a + b, 0)
    const chapaStats = election.chapas.map((chapa) => {
      const votes = election.votes[chapa.id] || 0
      const percentage = totalVotes > 0 ? (votes / totalVotes) * 100 : 0
      return {
        ...chapa,
        votes,
        percentage,
      }
    })

    return {
      election,
      totalVotes,
      totalVoters: election.voters.length,
      chapaStats: chapaStats.sort((a, b) => b.votes - a.votes),
      winner: chapaStats.length > 0 ? chapaStats.reduce((a, b) => (a.votes > b.votes ? a : b)) : null,
    }
  },

  exportAllData: () => {
    const elections = storage.getElections()
    const data = {
      elections,
      exportDate: new Date().toISOString(),
      version: "1.0",
    }
    return JSON.stringify(data, null, 2)
  },

  importData: (jsonData: string): boolean => {
    try {
      const data = JSON.parse(jsonData)
      if (data.elections && Array.isArray(data.elections)) {
        storage.saveElections(data.elections)
        return true
      }
      return false
    } catch {
      return false
    }
  },

  clearAllData: () => {
    if (typeof window === "undefined") return
    localStorage.removeItem("elections")
    localStorage.removeItem("adminAuth")
    localStorage.removeItem("voter")
  },
}

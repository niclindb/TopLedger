'use client'

import React, { useEffect, useState } from 'react'
import BetSlip from '@/components/ui/BetSlip'

type Sport = { id: string; name: string }
type Bet = { label: string; odds: string, point?: string }
type Game = { id: string; sport: string; home: string; away: string; startsAt: string; bets: Bet[] }

export default function OddsPage() {
  const [sports, setSports] = useState<Sport[]>([])
  const [selectedSport, setSelectedSport] = useState<string | null>(null)
  const [games, setGames] = useState<Game[]>([])
  const [loadingSports, setLoadingSports] = useState(false)
  const [loadingGames, setLoadingGames] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedBet, setSelectedBet] = useState<{ game: Game; bet: Bet } | null>(null)

  useEffect(() => {
    const loadSports = async () => {
      setLoadingSports(true)
      setError(null)
      try {
        const response = await fetch('/api/odds/getSports')
        if (!response.ok) throw new Error(`Failed to load sports (${response.status})`)
        const json = await response.json()
        setSports(json.sports || [])
        if (json.sports?.length) setSelectedSport(json.sports[0].id)
      } catch (err: any) {
        setError(err.message || 'Error loading sports')
      } finally {
        setLoadingSports(false)
      }
    }
    loadSports()
  }, [])

  useEffect(() => {
    if (!selectedSport) return
    
    const loadGames = async () => {
      setLoadingGames(true)
      setError(null)
      try {
        const res = await fetch(`/api/odds/games?sport=${encodeURIComponent(selectedSport)}`)
        if (!res.ok) throw new Error(`Failed to load games (${res.status})`)
        const json = await res.json()
        setGames(json.games || [])
      } catch (err: any) {
        setError(err.message || 'Error loading games')
      } finally {
        setLoadingGames(false)
      }
    }
    loadGames()
  }, [selectedSport])

  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold mb-4">Live Odds</h1>

      <section className="mb-6">
        <h2 className="text-lg font-medium mb-2">Sports</h2>
        <div className="flex gap-2 overflow-x-auto pb-2">
          {loadingSports ? (
            <div className="text-sm text-gray-500">Loading sports...</div>
          ) : (
            sports.map((s) => (
              <button
                key={s.id}
                onClick={() => setSelectedSport(s.id)}
                className={`px-3 py-1 rounded-full border ${
                  selectedSport === s.id ? 'bg-blue-600 text-white' : 'bg-white text-gray-800'
                }`}
              >
                {s.name}
              </button>
            ))
          )}
        </div>
      </section>

      <section>
        <h2 className="text-lg font-medium mb-2">
          {selectedSport ? `Upcoming games — ${sports.find((x) => x.id === selectedSport)?.name}` : 'Select a sport'}
        </h2>

        {error && <div className="text-red-600 mb-2">{error}</div>}

        {loadingGames ? (
          <div className="text-sm text-gray-500">Loading games…</div>
        ) : games.length === 0 ? (
          <div className="text-sm text-gray-500">No upcoming games available.</div>
        ) : (
          <div className="space-y-4">
            {games.map((g) => (
              <div key={g.id} className="p-4 border rounded-md">
                <div className="flex justify-between items-start mb-2">
                  <div>
                    <div className="font-semibold">{g.away} @ {g.home}</div>
                    <div className="text-sm text-gray-500">Starts: {new Date(g.startsAt).toLocaleString()}</div>
                  </div>
                </div>

                <div className="mt-3 grid grid-cols-1 sm:grid-cols-3 gap-2">
                    {g.bets.map((b, idx) => (
                    <button
                        key={idx}
                        onClick={() => setSelectedBet({ game: g, bet: b })}
                        className="border rounded-md px-3 py-2 m-1 text-sm hover:bg-gray-100 transition"
                    >
                        {b.label}
                        {b.point ? ` (${b.point})` : ""} @ {b.odds}
                    </button>
                    ))}
                </div>
              </div>
            ))}
            {selectedBet && (
                <BetSlip selectedBet={selectedBet} onClose={() => setSelectedBet(null)} />
            )}
          </div>
        )}
      </section>
    </div>
  )
}
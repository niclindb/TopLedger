"use client";

import React, { useEffect, useState } from "react";
import Games from "@/components/ui/games";
import BetSports from "@/components/ui/BetSports";

type Sport = { id: string; name: string };
type Bet = { label: string; odds: string; point?: string };
type Game = {
  id: string;
  sport: string;
  home: string;
  away: string;
  startsAt: string;
  bets: Bet[];
};

export default function OddsPage() {
  const [sports, setSports] = useState<Sport[]>([]);
  const [selectedSport, setSelectedSport] = useState<string | null>(null);
  const [games, setGames] = useState<Game[]>([]);
  const [loadingSports, setLoadingSports] = useState(false);
  const [loadingGames, setLoadingGames] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadSports = async () => {
      setLoadingSports(true);
      setError(null);
      try {
        const response = await fetch("/api/odds/getSports");
        if (!response.ok)
          throw new Error(`Failed to load sports (${response.status})`);
        const json = await response.json();
        setSports(json.sports || []);
        if (json.sports?.length) setSelectedSport(json.sports[0].id);
      } catch (err: any) {
        setError(err.message || "Error loading sports");
      } finally {
        setLoadingSports(false);
      }
    };
    loadSports();
  }, []);

  useEffect(() => {
    if (!selectedSport) return;

    const loadGames = async () => {
      setLoadingGames(true);
      setError(null);
      try {
        const res = await fetch(
          `/api/odds/games?sport=${encodeURIComponent(selectedSport)}`
        );
        if (!res.ok) throw new Error(`Failed to load games (${res.status})`);
        const json = await res.json();
        setGames(json.games || []);
      } catch (err: any) {
        setError(err.message || "Error loading games");
      } finally {
        setLoadingGames(false);
      }
    };
    loadGames();
  }, [selectedSport]);

  return (
    <>
      {error ? (
        <div className="text-red-500 text-center mt-8">{error}</div>
      ) : (
        <>
          <BetSports
            sports={sports}
            selectedSport={selectedSport}
            loadingSports={loadingSports}
            onSelectSport={setSelectedSport}
          />

          <Games
            selectedSport={selectedSport}
            sports={sports}
            loadingGames={loadingGames}
            games={games}
          />
        </>
      )}
    </>
  );
}

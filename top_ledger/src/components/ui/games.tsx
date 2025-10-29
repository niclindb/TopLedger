"use client";
import React, { useState } from "react";
import BetSlip from "./BetSlip";

interface Bet {
  label: string;
  point?: string;
  odds: string;
}

interface Game {
  id: string;
  home: string;
  away: string;
  startsAt: string;
  bets: Bet[];
}

interface Sport {
  id: string;
  name: string;
}

interface UpcomingGamesSectionProps {
  selectedSport: string | null;
  sports: Sport[];
  loadingGames: boolean;
  games: Game[];
}

function getCategorizedBets(bets: Bet[], game: Game) {
  let awaySpread: string = "";
  let homeSpread: string = "";
  let overBet: string = "";
  let underBet: string = "";
  let awayML: string = "";
  let homeML: string = "";

  bets.forEach((b) => {
    if (!b.point) {
      // Moneyline
      if (b.label === game.away) awayML = `${b.label} ${b.odds}`;
      else if (b.label === game.home) homeML = `${b.label} ${b.odds}`;
    } //Over/Under
    else if (b.label === "Over") {
      overBet = `${b.label} ${b.point} ${b.odds}`;
    } else if (b.label === "Under") {
      underBet = `${b.label} ${b.point} ${b.odds}`;
    } // Spread
    else if (b.label === game.away) {
      awaySpread = `${b.label} ${b.point} ${b.odds}`;
    } else if (b.label === game.home) {
      homeSpread = `${b.label} ${b.point} ${b.odds}`;
    }
  });

  return { awaySpread, homeSpread, overBet, underBet, awayML, homeML };
}

// Function to format game date
function formatGameDate(timestamp: string) {
  const d = new Date(timestamp);
  const t = new Date();

  const isSameDay = (a: Date, b: Date) => a.toDateString() === b.toDateString();

  if (isSameDay(d, t)) return "Today";
  t.setDate(t.getDate() + 1);
  if (isSameDay(d, t)) return "Tomorrow";
  return d.toLocaleDateString();
}

export default function UpcomingGamesSection({
  selectedSport,
  sports,
  loadingGames,
  games,
}: UpcomingGamesSectionProps) {
  const [selectedBet, setSelectedBet] = useState<{
    game: Game;
    bet: Bet;
  } | null>(null);

  // Filter out past games
  const upcomingGames = games.filter(
    (g) => new Date(g.startsAt) > new Date() && g.bets.length > 0
  );

  return (
    <>
      <section className="w-full px-8">
        <h2 className="text-lg font-medium mb-2">
          {selectedSport
            ? `Upcoming games — ${
                sports.find((x) => x.id === selectedSport)?.name
              }`
            : "Select a sport"}
        </h2>

        {loadingGames ? (
          <div className="text-sm text-[var(--light_color)]">
            Loading games…
          </div>
        ) : upcomingGames.length === 0 ? (
          <div className="text-sm text-[var(--light_color)]">
            No upcoming games available.
          </div>
        ) : (
          <div>
            {upcomingGames.map((g) => {
              const {
                awaySpread,
                homeSpread,
                overBet,
                underBet,
                awayML,
                homeML,
              } = getCategorizedBets(g.bets, g);

              return (
                <div
                  className="bg-[var(--orange_color)] border rounded p-4 mb-4 flex justify-between items-start"
                  key={g.id}
                >
                  {/* Left side: date and teams */}
                  <div className="mr-6 text-center">
                    <p className="text-xs mb-2">{formatGameDate(g.startsAt)}</p>
                    <p className="text-[var(--blue_color)] font-semibold">
                      {g.away}
                    </p>
                    <p className="text-xs">At</p>
                    <p className="text-[var(--blue_color)] font-semibold">
                      {g.home}
                    </p>
                  </div>

                  {/* Right side: table */}

                  <div className="overflow-x-auto flex-1 pl-15">
                    <table className="w-full border-collapse">
                      <thead className="text-[var(--blue_color)]">
                        <tr className="border-b">
                          <th className="px-3 py-1 text-left text-sm">
                            Spread
                          </th>
                          <th className="px-3 py-1 text-left text-sm">Total</th>
                          <th className="px-3 py-1 text-left text-sm">
                            Moneyline
                          </th>
                        </tr>
                      </thead>
                      <tbody>
                        <tr>
                          {/* Spread column */}
                          <td className="px-3 py-1">
                            {awaySpread && (
                              <div
                                className="cursor-pointer hover:bg-[#5c2018] px-1 rounded"
                                onClick={() => {
                                  const bet = g.bets.find(
                                    (b) =>
                                      `${b.label} ${b.point} ${b.odds}` ===
                                      awaySpread
                                  );
                                  if (bet) setSelectedBet({ game: g, bet });
                                }}
                              >
                                {awaySpread}
                              </div>
                            )}
                            {homeSpread && (
                              <div
                                className="cursor-pointer hover:bg-[#5c2018] px-1 rounded mt-1"
                                onClick={() => {
                                  const bet = g.bets.find(
                                    (b) =>
                                      `${b.label} ${b.point} ${b.odds}` ===
                                      homeSpread
                                  );
                                  if (bet) setSelectedBet({ game: g, bet });
                                }}
                              >
                                {homeSpread}
                              </div>
                            )}
                          </td>

                          {/* Total column */}
                          <td className="px-3 py-1">
                            {overBet && (
                              <div
                                className="cursor-pointer hover:bg-[#5c2018] px-1 rounded"
                                onClick={() => {
                                  const bet = g.bets.find(
                                    (b) =>
                                      `${b.label} ${b.point} ${b.odds}` ===
                                      overBet
                                  );
                                  if (bet) setSelectedBet({ game: g, bet });
                                }}
                              >
                                {overBet}
                              </div>
                            )}
                            {underBet && (
                              <div
                                className="cursor-pointer hover:bg-[#5c2018] px-1 rounded mt-1"
                                onClick={() => {
                                  const bet = g.bets.find(
                                    (b) =>
                                      `${b.label} ${b.point} ${b.odds}` ===
                                      underBet
                                  );
                                  if (bet) setSelectedBet({ game: g, bet });
                                }}
                              >
                                {underBet}
                              </div>
                            )}
                          </td>

                          {/* Moneyline column */}
                          <td className="px-3 py-1">
                            {awayML && (
                              <div
                                className="cursor-pointer hover:bg-[#5c2018] px-1 rounded"
                                onClick={() => {
                                  const bet = g.bets.find(
                                    (b) => `${b.label} ${b.odds}` === awayML
                                  );
                                  if (bet) setSelectedBet({ game: g, bet });
                                }}
                              >
                                {awayML}
                              </div>
                            )}
                            {homeML && (
                              <div
                                className="cursor-pointer hover:bg-[#5c2018] px-1 rounded mt-1"
                                onClick={() => {
                                  const bet = g.bets.find(
                                    (b) => `${b.label} ${b.odds}` === homeML
                                  );
                                  if (bet) setSelectedBet({ game: g, bet });
                                }}
                              >
                                {homeML}
                              </div>
                            )}
                          </td>
                        </tr>
                      </tbody>
                    </table>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </section>

      {/* Bet Slip Modal */}
      {selectedBet && (
        <BetSlip
          selectedBet={selectedBet}
          onClose={() => setSelectedBet(null)}
        />
      )}
    </>
  );
}

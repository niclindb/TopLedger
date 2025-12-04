"use client";

import { supabase } from "@/lib/supabase";
import { useState, useEffect } from "react";

export function calculatePayout(stake: number, odds: number): string {
  if (isNaN(odds) || stake <= 0) return ""
  let payout = 0;
  if (odds > 0) payout = stake * (1 + odds / 100);

  else payout = stake * (1 + 100 / Math.abs(odds));
  return payout.toFixed(2);
}
export default function BetSlip({
  selectedBet,
  onClose,
}: {
  selectedBet: { game: any; bet: any };
  onClose: () => void;
}) {
  const [stake, setStake] = useState<number>(1);
  const [accessToken, setAccessToken] = useState<string | null>(null);

  // Fetch the current user session on mount
  useEffect(() => {
    const fetchSession = async () => {
      const { data: sessionData } = await supabase.auth.getSession();
      if (!sessionData?.session) {
        alert("Please log in first");
        onClose();
        return;
      }
      setAccessToken(sessionData.session.access_token);
    };
    fetchSession();
  }, [onClose]);

  // Convert American odds to payout multiplier
  const handlePlaceBet = async () => {
    if (!accessToken) {
      alert("No user session found.");
      return;
    }

    const betData = {
      gameId: selectedBet.game.id,
      sport: selectedBet.game.sport,
      home: selectedBet.game.home,
      away: selectedBet.game.away,
      pick: selectedBet.bet.label,
      odds: selectedBet.bet.odds,
      point: selectedBet.bet.point,
      stake,
      startsAt: selectedBet.game.startsAt,
    };

    try {
      const response = await fetch("/api/bets/placeBet", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({ betData }),
      });

      if (!response.ok) {
        const errorData = await response.json();
        console.error("Error placing bet:", errorData.message);
        return;
      }
      const data = await response.json();

      if (data.message === "Cannot place bet on already started game")
        alert(`Can't place bet game already start`);
      else
        alert(
          `You placed a bet on ${
            selectedBet.bet.label
          } for $${stake}. Potential payout: $${calculatePayout(stake, parseFloat(selectedBet.bet.odds))}`
        );

      onClose();
    } catch (error) {
      console.error("Network error placing bet:", error);
    }
  };

  return (
    <div className="fixed inset-0 bg-gray-800/30 backdrop-blur-sm flex items-center justify-center">
      <div className="bg-[var(--orange_color)] rounded-lg p-6 w-80 shadow-lg">
        <h2 className="text-center text-lg font-semibold mb-4">Bet Slip</h2>
        <p className="mb-2">
          <strong>Match:</strong> {selectedBet.game.home} vs{" "}
          {selectedBet.game.away}
        </p>
        <p className="mb-2">
          <strong>Pick:</strong> {selectedBet.bet.label}{" "}
          {selectedBet.bet.point ? `(${selectedBet.bet.point})` : ""}
        </p>
        <p className="mb-4">
          <strong>Odds:</strong> {selectedBet.bet.odds}
        </p>

        <label className="block mb-2 text-sm">Stake ($)</label>
        <input
          type="number"
          value={stake}
          onChange={(e) => {
            let num = Number(e.target.value);
            if (num > 1000) num = 1000;
            if (num < 1) num = 1;
            setStake(isNaN(num) ? 1 : num);
          }}
          max={1000}
          min={1}
          className="border rounded px-2 py-1 w-full mb-4"
        />

        <p className="mb-4 text-sm">
          <strong>Potential Payout:</strong> ${calculatePayout(stake, parseFloat(selectedBet.bet.odds))}
        </p>

        <div className="flex justify-between">
          <button
            onClick={onClose}
            className="px-3 py-1 rounded bg-[var(--background)]"
          >
            Cancel
          </button>
          <button
            onClick={handlePlaceBet}
            className="px-3 py-1 rounded bg-blue-500 text-white"
          >
            Place Bet
          </button>
        </div>
      </div>
    </div>
  );
}

// components/Leaderboard.tsx
"use client";

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

interface User {
  id: string;
  username: string;
  overall_win_percent: number;
  total_profit: number;
  profit_last_month: number;
  profit_last_year: number;
}

export default function Leaderboard() {
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    );

    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Users")
        .select(
          "id, username, overall_win_percent, total_profit, profit_last_month, profit_last_year"
        )
        .order("total_profit", { ascending: false }) // Top users by total profit
        .limit(20); // optional: top 20

      if (error) {
        console.error("Error fetching leaderboard:", error);
      } else if (data) {
        setUsers(data);
      }

      setLoading(false);
    };

    fetchUsers();
  }, []);

  if (loading) return <p>Loading leaderboard...</p>;
  return (
    <div className="p-6 m-4 bg-[var(--background)] rounded-xl border-2 border-[var(--tan_color)]">
      <h2 className="text-3xl font-bold mb-6 text-[var(--light_color)] text-center">
        Top Players
      </h2>

      <div>
        <table className="min-w-full border-collapse rounded-lg">
          <thead>
            <tr className="border-b border-[var(--light_color)] bg-[var(--blue_color)] text-[var(--light_color)] text-xl font-bold">
              <th className="p-3 uppercase">Rank</th>
              <th className="p-3 uppercase">Player</th>
              <th className="p-3 uppercase">Total Profit</th>
              <th className="p-3 uppercase">Win %</th>
            </tr>
          </thead>
          <tbody className="bg-[var(--orange_color)]">
            {users.map((user, index) => {
              const rowStyle =
                "hover:bg-[var(--tan_color)] transition duration-200";
              return (
                <tr key={user.id} className={`text-center ${rowStyle}`}>
                  <td className="p-3 text-[var(--light_color)] font-bold">
                    {index + 1}
                  </td>
                  <td className="p-3 text-[var(--light_color)]">
                    {user.username}
                  </td>
                  <td className="p-3 text-[var(--light_color)]">
                    ${user.total_profit.toFixed(2)}
                  </td>
                  <td className="p-3 text-[var(--light_color)]">
                    {user.overall_win_percent.toFixed(1)}%
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </div>
  );
}

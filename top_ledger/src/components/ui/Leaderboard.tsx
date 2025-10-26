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

  const supabase = createClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
  );

  useEffect(() => {
    const fetchUsers = async () => {
      setLoading(true);
      const { data, error } = await supabase
        .from("Users")
        .select("id, username, overall_win_percent, total_profit, profit_last_month, profit_last_year")
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
    <div className="p-4">
      <h2 className="text-2xl font-bold mb-4">Leaderboard</h2>
      <table className="min-w-full border border-gray-300">
        <thead className="bg-gray-200">
          <tr>
            <th className="p-2 border">Rank</th>
            <th className="p-2 border">Username</th>
            <th className="p-2 border">Total Profit</th>
            <th className="p-2 border">Win %</th>
            <th className="p-2 border">Profit Last Month</th>
            <th className="p-2 border">Profit Last Year</th>
          </tr>
        </thead>
        <tbody>
          {users.map((user, index) => (
            <tr key={user.id} className="text-center border-b hover:bg-gray-100">
              <td className="p-2 border">{index + 1}</td>
              <td className="p-2 border">{user.username}</td>
              <td className="p-2 border">${user.total_profit.toFixed(2)}</td>
              <td className="p-2 border">{user.overall_win_percent.toFixed(1)}%</td>
              <td className="p-2 border">${user.profit_last_month.toFixed(2)}</td>
              <td className="p-2 border">${user.profit_last_year.toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

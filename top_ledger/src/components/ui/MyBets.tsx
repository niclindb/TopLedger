import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function getCurrentSession() {
  try {
    const { data: { session }, error } = await supabase.auth.getSession();
    if (error) {
      console.error("Error getting session:", error);
      return null;
    }
    return session;
  } catch (error) {
    console.error("Error getting session:", error);
    return null;
  }
}

export default function MyBets() {
  const [user, setUser] = useState<any | null>(null);
  const [bets, setBets] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBets = async () => {
      const session = await getCurrentSession();
      if (!session?.user) {
        setLoading(false);
        return;
      }

      setUser(session.user);

      const { data, error } = await supabase
        .from("Bets")
        .select("*")
        .eq("user_id", session.user.id)
        .order("start_time", { ascending: false })
        .limit(100);

      if (error) console.error(error);
      else setBets(data || []);

      setLoading(false);
    };

    fetchBets();
  }, []);

  if (loading) return <p>Loading...</p>;
  if (!user) return <p>Please log in.</p>;

  return (
    <div>
      <h2>My Bets</h2>
      {bets.length === 0 ? (
        <p>No bets found.</p>
      ) : (
        <table className="min-w-full border border-gray-300">
  <thead className="bg-gray-200">
    <tr>
      <th className="p-2 border">Sport</th>
      <th className="p-2 border">Match</th>
      <th className="p-2 border">Bet</th>
      <th className="p-2 border">Point</th>
      <th className="p-2 border">Odds</th>
      <th className="p-2 border">Stake</th>
      <th className="p-2 border">Potential Payout</th>
      <th className="p-2 border">Status</th>
    </tr>
  </thead>
  <tbody>
    {bets.map((bet) => (
      <tr
        key={bet.id}
        className={`text-center border-b hover:bg-gray-100 ${
          bet.status === "won"
            ? "bg-green-100"
            : bet.status === "lost"
            ? "bg-red-100"
            : bet.status === "push"
            ? "bg-yellow-100"
            : ""
        }`}
      >
        <td className="p-2 border">{bet.sport}</td>
        <td className="p-2 border">
          {bet.home_team} vs {bet.away_team}
        </td>
        <td className="p-2 border">{bet.bet_label}</td>
        <td className="p-2 border">{bet.bet_point ?? "-"}</td>
        <td className="p-2 border">{bet.odds}</td>
        <td className="p-2 border">${bet.stake.toFixed(2)}</td>
        <td className="p-2 border">${bet.potential_payout.toFixed(2)}</td>
        <td className="p-2 border capitalize">{bet.status}</td>
      </tr>
    ))}
  </tbody>
</table>

      )}
    </div>
  );
}

import { useEffect, useState } from "react";
import { createClient } from "@supabase/supabase-js";
import {
  FaCheckCircle,
  FaTimesCircle,
  FaHourglassHalf,
  FaMinusCircle,
} from "react-icons/fa";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

async function getCurrentSession() {
  try {
    const {
      data: { session },
      error,
    } = await supabase.auth.getSession();
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
    <>
      <div className="m-4 max-w-l mx-4 p-6 bg-[var(--background)] rounded-2xl border-2 border-[var(--light_color)] shadow-lg space-y-4">
        <h2 className="text-center text-2xl font-bold pb-2">Recent Bets</h2>

        {bets.length === 0 ? (
          <p className="text-[var(--light_color)] text-center mt-4">
            No bets found.
          </p>
        ) : (
          <table className="min-w-full">
            <thead className="bg-[var(--blue_color)] sticky top-16">
              <tr className="text-xl border-b p-2">
                <th>League</th>
                <th>Match</th>
                <th>Bet</th>
                <th>Point</th>
                <th>Odds</th>
                <th>Stake</th>
                <th>Payout</th>
                <th>Status</th>
              </tr>
            </thead>
            <tbody className="bg-[var(--orange_color)]">
              {bets.map((bet) => (
                <tr
                  key={bet.id}
                  className="hover:bg-[var(--tan_color)] transition duration-200 text-center"
                >
                  <td className="p-2 border">
                    {bet.sport.split("_").pop()?.toUpperCase()}
                  </td>
                  <td className="p-2 border">
                    {bet.home_team} vs {bet.away_team}
                  </td>
                  <td className="p-2 border">{bet.bet_label}</td>
                  <td className="p-2 border">{bet.bet_point ?? "-"}</td>
                  <td className="p-2 border">
                    {bet.odds > 0 ? `+${bet.odds}` : bet.odds}
                  </td>
                  <td className="p-2 border">${bet.stake.toFixed(2)}</td>
                  <td className="p-2 border">
                    ${bet.potential_payout.toFixed(2)}
                  </td>
                  <td className="p-2 border text-center">
                    {bet.status === "won" && (
                      <FaCheckCircle className="inline-block text-[var(--blue_color)]" />
                    )}
                    {bet.status === "lost" && (
                      <FaTimesCircle className="inline-block text-[var(--orange_color)]" />
                    )}
                    {bet.status === "pending" && (
                      <FaHourglassHalf className="inline-block text-[var(--tan_color)]" />
                    )}
                    {bet.status === "push" && (
                      <FaMinusCircle className="inline-block text-[var(--tan_color)]" />
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </>
  );
}

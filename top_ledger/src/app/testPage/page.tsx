"use client";
import { useState, useEffect, useRef, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import Confetti from "react-confetti";

interface Player {
  rank: number;
  name: string;
  score: number;
  avatar: string;
  isCurrentUser?: boolean;
}

export default function HomePage() {
  const [filter, setFilter] = useState<"today" | "week" | "all">("today");
  const loggedInUser = "PlayerFour";
  const isLoading = false;
  const [confettiActive, setConfettiActive] = useState(false);

  const leaderboard: Player[] = [
    { rank: 1, name: "PlayerOne", score: 1500, avatar: "/avatar1.png" },
    { rank: 2, name: "PlayerTwo", score: 1400, avatar: "/avatar2.png" },
    { rank: 3, name: "PlayerThree", score: 1300, avatar: "/avatar3.png" },
    {
      rank: 4,
      name: "PlayerFour",
      score: 1200,
      avatar: "/avatar4.png",
      isCurrentUser: true,
    },
    { rank: 5, name: "PlayerFive", score: 1100, avatar: "/avatar5.png" },
  ];

  const userRowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (userRowRef.current)
      userRowRef.current.scrollIntoView({
        behavior: "smooth",
        block: "center",
      });
  }, [isLoading]);

  useEffect(() => {
    // Trigger confetti if rank 1 exists
    if (leaderboard[0]?.rank === 1) {
      setConfettiActive(true);
      const timer = setTimeout(() => setConfettiActive(false), 5000); // confetti for 5 seconds
      return () => clearTimeout(timer);
    }
  }, [leaderboard]);

  const getBadgeColor = (rank: number) => {
    if (rank === 1)
      return "bg-yellow-400 text-black shadow-[0_0_20px_rgba(255,215,0,0.7)]";
    if (rank === 2)
      return "bg-gray-400 text-black shadow-[0_0_15px_rgba(192,192,192,0.6)]";
    if (rank === 3)
      return "bg-orange-600 text-black shadow-[0_0_15px_rgba(255,140,0,0.6)]";
    return "bg-[#1A142F]/30 text-white";
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-[#0F0C24] to-[#1A142F] text-white flex flex-col items-center p-6 space-y-12">
      {confettiActive && <Confetti numberOfPieces={200} recycle={false} />}

      {/* Hero Section */}
      <section className="w-full max-w-6xl flex flex-col items-center text-center space-y-6">
        <h1 className="text-6xl font-bold tracking-wide animate-pulse">
          TopLedger
        </h1>
        <p className="text-xl text-gray-300">
          Track, Compete, and Rise to the Top!
        </p>
      </section>

      {/* Top 3 Spotlight */}
      <section className="w-full max-w-6xl flex flex-col md:flex-row justify-center items-center gap-6">
        {leaderboard.slice(0, 3).map((player) => (
          <motion.div
            key={player.rank}
            className="bg-[#1A142F]/50 rounded-xl p-6 flex flex-col items-center shadow-lg hover:scale-105 transition-transform duration-300 relative"
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
          >
            <div
              className={`h-24 w-24 flex items-center justify-center rounded-full font-bold text-2xl ${getBadgeColor(
                player.rank
              )} mb-4`}
            >
              {player.rank}
            </div>
            <img
              src={player.avatar}
              alt={player.name}
              className="h-20 w-20 rounded-full border-2 border-[#A350A3] mb-2"
            />
            <span className="font-semibold text-lg">{player.name}</span>
            <span className="font-bold text-xl">{player.score}</span>
          </motion.div>
        ))}
      </section>

      {/* Leaderboard Section */}
      <section className="w-full max-w-6xl flex flex-col space-y-3">
        <AnimatePresence>
          {leaderboard.map((player) => {
            const isCurrentUser = player.isCurrentUser;
            return (
              <motion.div
                key={player.rank}
                ref={isCurrentUser ? userRowRef : null}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 20 }}
                transition={{ duration: 0.5 }}
                className={`flex items-center justify-between p-4 rounded-xl shadow-md transition-all duration-300 ${
                  isCurrentUser
                    ? "bg-[#A350A3]/50 border-2 border-[#A350A3]"
                    : player.rank % 2 === 0
                    ? "bg-[#1A142F]/50"
                    : "bg-[#1A142F]/30"
                } hover:scale-105 hover:shadow-lg`}
              >
                <div className="flex items-center space-x-4">
                  <div
                    className={`h-14 w-14 flex items-center justify-center rounded-full font-bold text-lg ${getBadgeColor(
                      player.rank
                    )}`}
                  >
                    {player.rank}
                  </div>
                  <img
                    src={player.avatar}
                    alt={player.name}
                    className="h-14 w-14 rounded-full border-2 border-[#A350A3]"
                  />
                  <span className="font-semibold text-lg">{player.name}</span>
                </div>
                <motion.div
                  key={player.score}
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.5 }}
                  className="font-bold text-lg"
                >
                  {player.score}
                </motion.div>
              </motion.div>
            );
          })}
        </AnimatePresence>
      </section>
    </div>
  );
}

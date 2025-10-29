'use client'

import { useAuth } from "@/hooks/useAuth";
import Leaderboard from "@/components/ui/Leaderboard";


export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {// later change to a skeleton card
    return <div>Loading...</div>
  }
  return (
    <>
    <Leaderboard/>
    </>
  );
}

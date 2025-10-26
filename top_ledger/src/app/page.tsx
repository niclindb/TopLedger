'use client'

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";
import Leaderboard from "@/components/ui/Leaderboard";


export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {// later change to a skeleton card
    return <div>Loading...</div>
  }
  return (
    <>
    <div>
      
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.email}!</p>
          <button onClick={() => supabase.auth.signOut()}>
            Sign Out
          </button>
          
          <p>profile info here</p>
          <Link href="/profile">Profile</Link>
        </div>
      ) : (
        <div>
          <Link href="/login">Login</Link>
          <Link href="/createAccount">Create Account</Link>
        </div>
      )}
    </div>
    <Leaderboard/>
    </>
  );
}

'use client'

import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function Home() {
  const { user, loading, isAuthenticated } = useAuth()

  if (loading) {// later change to a skeleton card
    return <div>Loading...</div>
  }
  return (
    <>
    <div>
      <h1>Top Ledger</h1>
      
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
    <div><p>leaderboards here</p></div>
    </>
  );
}

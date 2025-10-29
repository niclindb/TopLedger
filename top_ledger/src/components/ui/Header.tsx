'use client';
import Link from "next/link";
import { useAuth } from "@/hooks/useAuth";
import { supabase } from "@/lib/supabase";

export default function Header() {
  const { isAuthenticated } = useAuth()
  const navItems = isAuthenticated
  ? [
    { label: "Make a Bet", to: "/betting" },
    { label: "Profile", to: "/profile" },
    { label: "Log Out", to: "/" },
  ]
  : [{ label: "Login", to: "/login" }];

  return (
    <div className="sticky top-0">
      {/* Header */}
    <header className="flex items-center justify-between px-10 py-4 bg-[var(--tan_color)] shadow-md ">
      {/* Logo */}

      <Link href="/" className="text-2xl font-bold">
        Top Ledger
      </Link>
      {/* Navigation */}
      <nav className="flex gap-8 text-xl uppercase">
        {navItems.map((item) => (
          <Link
            key={item.label}
            href={item.to}
            className="transition-colors duration-300 hover:text-[var(--orange_color)]"
            onClick={() => {
              if (item.label === "Log Out") { // only this link triggers the function
                supabase.auth.signOut()
              }
            }}

          >
            {item.label}
          </Link>
        ))}
      </nav>
    </header>
    </div>
  );
}

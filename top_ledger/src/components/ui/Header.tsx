// components/Header.tsx
import Link from "next/link";

export default function Header() {
  return (
    <header className="bg-gray-800 text-white p-4 flex justify-between items-center">
      {/* Logo / Home */}
      <Link href="/" className="text-xl font-bold">
        TopLedger
      </Link>

      {/* Navigation Links */}
      <nav className="space-x-6">
        <Link href="/profile" className="hover:text-gray-300">
          Profile
        </Link>
        <Link href="/betting" className="hover:text-gray-300">
          Make a Bet
        </Link>
      </nav>
    </header>
  );
}

import type { Metadata } from "next";
import { Geist, Geist_Mono, Sen, Bangers } from "next/font/google";
import "./globals.css";
import Header from "@/components/ui/Header";



const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});
const sen = Sen({
  variable: '--font-sen',
  subsets: ['latin'],
  weight: ['400', '700'],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "Top Ledger",
  description: "Top Ledger: Sports betting tracker and leaderboard",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body
        className={`${sen.variable} antialiased`}
      >
        <Header />
        {children}
      </body>
    </html>
  );
}

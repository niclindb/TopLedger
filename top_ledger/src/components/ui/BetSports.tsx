"use client";
import React from "react";

interface Sport {
  id: string;
  name: string;
}

interface SportsSelectorProps {
  sports: Sport[];
  selectedSport: string | null;
  loadingSports: boolean;
  onSelectSport: (id: string) => void;
  error?: string;
}

export default function SportsSelector({
  sports,
  selectedSport,
  loadingSports,
  onSelectSport,
}: SportsSelectorProps) {
  return (
    <div className="w-full mx-auto p-6 bg-[var(--background)] rounded-xl">
      <section>
        <h2 className="text-xl font-semibold mb-2 text-[var(--light_color)]">
          Sports
        </h2>

        {loadingSports ? (
          <div className="text-sm text-[var(--light_color)]">
            Loading sports...
          </div>
        ) : (
          <div className="flex overflow-x-auto flex-nowrap border-b border-[var(--light_color)] scrollbar-thin">
            {sports.map((s) => (
              <div
                key={s.id}
                onClick={() => onSelectSport(s.id)}
                className={`cursor-pointer text-center p-4 flex-shrink-0 font-medium transition-colors duration-300
        ${
          selectedSport === s.id
            ? "border-b-4 border-[var(--blue_color)] text-[var(--blue_color)]"
            : "text-[var(--light_color)] hover:bg-[var(--tan_color)]"
        }`}
              >
                {s.name}
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}

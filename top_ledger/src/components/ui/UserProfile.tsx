'use client';
import React from 'react';

interface ProfileData {
  id: string
  username: string
  email: string
  total_profit: number
  profit_last_month: number
  profit_last_year: number
  overall_win_percent: number
}

export default function UserProfile({ profile }: { profile?: ProfileData | null }){
  if (!profile) {
    return <p>No profile data found</p>;
  }

  return (
    <div className="m-4  max-w-sm mx-auto p-6 bg-[var(--background)] rounded-2xl border-2 border-[var(--light_color)] shadow-lg space-y-4">
      {/* Username */}
      <h2 className="text-center text-2xl font-bold pb-2">{profile.username}</h2>
      {/* Total Profit */}
      <div className="p-2 space-y-4 bg-[var(--orange_color)] rounded-lg">
        <div className="flex justify-between">
          Total Profit:
          <span>${profile.total_profit?.toFixed(2) || '0.00'}</span>
        </div>
        {/* Last Month */}
          <div className="flex justify-between">
          Profit Last Month:
          <span>${profile.profit_last_month?.toFixed(2) || '0.00'}</span>
        </div>
        {/* Last Year */}
        <div className="flex justify-between">
          Profit Last Year:
          <span>${profile.profit_last_year?.toFixed(2) || '0.00'}</span>
        </div>
        {/* Win Percentage */}
        <div className="flex justify-between">
          Win Percentage:
          <span >{profile.overall_win_percent?.toFixed(1) || '0.0'}%</span>
        </div>
      </div>
    </div>


  );
};


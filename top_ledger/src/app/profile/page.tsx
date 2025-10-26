'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'

interface ProfileData {
  id: string
  username: string
  email: string
  total_profit: number
  profit_last_month: number
  profit_last_year: number
  overall_win_percent: number
}

export default function Profile() {
  const router = useRouter()
  const { user, loading, isAuthenticated } = useAuth()
  const [profile, setProfile] = useState<ProfileData | null>(null)
  const [profileLoading, setProfileLoading] = useState(true)

  const fetchProfile = useCallback(async () => { // this keeps fetchProfile from being called every render
  console.log("id")
  try {
    const { data, error } = await supabase
      .from('Users')
      .select('*')
      .eq('id', user?.id)
      .single()

    if (error) {
      console.error('Error fetching profile:', error)
    } else {
      setProfile(data)
    }
  } catch (error) {
    console.error('Error fetching profile:', error)
  } finally {
    setProfileLoading(false)
  }
}, [user?.id]) 

useEffect(() => {
  if (!loading && !isAuthenticated) {
    router.replace('/login')
    return
  }

  if (user) {
    console.log("id: ", user.id)
    fetchProfile()
  }
}, [user, loading, isAuthenticated, router, fetchProfile])

  if (loading || profileLoading) {
    return <div>Loading profile...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">Profile</h1>
      
      {profile ? (
        <div className="space-y-4">
          <p><strong>Username:</strong> {profile.username}</p>
          <p><strong>Total Profit:</strong> ${profile.total_profit?.toFixed(2) || '0.00'}</p>
          <p><strong>Profit Last Month:</strong> ${profile.profit_last_month?.toFixed(2) || '0.00'}</p>
          <p><strong>Profit Last Year:</strong> ${profile.profit_last_year?.toFixed(2) || '0.00'}</p>
          <p><strong>Win Percentage:</strong> {(profile.overall_win_percent)?.toFixed(1) || '0.0'}%</p>
        </div>
      ) : (
        <p>No profile data found</p>
      )}
    </div>
  )
}
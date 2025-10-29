'use client'

import { useAuth } from '@/hooks/useAuth'
import { useRouter } from 'next/navigation'
import { useEffect, useState, useCallback } from 'react'
import { supabase } from '@/lib/supabase'
import MyBets from '@/components/ui/MyBets'
import UserProfile from '@/components/ui/UserProfile'

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
    <>
    <UserProfile profile={profile} />
    <MyBets/>
    </>
  )
}
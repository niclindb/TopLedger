'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'

export default function CreateAccount() {
  const router = useRouter()
  const { isAuthenticated } = useAuth()

  // Handle redirect when user is already authenticated
  useEffect(() => {
    if (isAuthenticated) {
      router.replace('/')
    }
  }, [isAuthenticated, router])

  return (
<div
  className="relative overflow-hidden"
  style={{
    backgroundImage: `url('/roulete.jpg')`,
    backgroundPosition: 'top',
    backgroundSize: 'cover',
    backgroundRepeat: 'no-repeat',
    height: 'calc(100vh - 65px)' // this accounts for header height
  }}
>
    {/* Overlay for form area only */}
    <div className="absolute inset-0 bg-[var(--background)] opacity-73"></div>

    {/* Form container above overlay */}
    <div className="relative flex justify-center pt-20">
      <AuthForm mode="signup" title="Create Account"/>
    </div>
  </div>
  )
}
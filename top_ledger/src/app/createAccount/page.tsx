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
    <AuthForm
      mode="signup"
      title="Create Account"
      buttonText="Create Account"
      loadingText="Creating account..."
    />
  )
}
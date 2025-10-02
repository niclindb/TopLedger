'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '@/hooks/useAuth'
import { AuthForm } from '@/components/auth/AuthForm'

export default function Login() {
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
      mode="login"
      title="Login"
    />
  )
}
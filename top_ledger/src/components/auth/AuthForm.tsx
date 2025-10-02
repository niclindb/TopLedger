'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { FormInput } from '@/components/ui/FormInput'
import { FormButton } from '@/components/ui/FormButton'

interface AuthFormProps {
  mode: 'login' | 'signup'
  title: string
}

export function AuthForm({ mode, title }: AuthFormProps) {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')

  const labels = mode === 'login'
    ? { button: 'Login', loading: 'Logging in...' }
    : { button: 'Create Account', loading: 'Creating account...' }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault() // prevents page reload
    setLoading(true)
    setMessage('')

    try {
      if (mode === 'login') {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        })

        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Login successful!')
          router.replace('/')
        }
      } else {
        const { error } = await supabase.auth.signUp({
          email,
          password,
        })

        if (error) {
          setMessage(error.message)
        } else {
          setMessage('Account created successfully!')
          router.replace('/')
        }
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto mt-8 p-6 bg-white rounded-lg shadow-md">
      <h1 className="text-2xl font-bold text-center mb-6">{title}</h1>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />
        
        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />
        
        <FormButton loading={loading} loadingText={labels.loading}>
          {labels.button}
        </FormButton>
      </form>
      
      {message && (
        <p className={`mt-4 text-center ${
          message.includes('successful') ? 'text-green-600' : 'text-red-600'
        }`}>
          {message}
        </p>
      )}
    </div>
  )
}

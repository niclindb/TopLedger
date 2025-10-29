'use client'

import React, { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import { FormInput } from '@/components/ui/FormInput'
import { FormButton } from '@/components/ui/FormButton'
import Link from "next/link";

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
  const [username, setUsername] = useState('')

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
        // Call signup API
        const response = await fetch('/api/signup', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            username,
            email,
            password,
          }),
        })

        const data = await response.json()

        if (response.ok) {
          setMessage('Account created successfully!')
          await supabase.auth.signInWithPassword({
          email,
          password,
          })
          router.replace('/')
        } else {
          setMessage(data.error || 'Signup failed')
        }
      }
    } catch (error) {
      setMessage('An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  return (
  <>
    <div
      className="max-w-md mx-auto mt-12 p-6 bg-[var(--background)] rounded-xl shadow-[0_0_30px_var(--orange_color)] border-4 border-[var(--light_color)] relative 
      before:absolute before:inset-0 before:rounded-xl before:bg-[var(--background)] before:opacity-40 before:blur-[20px] before:pointer-events-none"
    >
      {/* Form Title */}
      <h1 className="text-3xl font-fredoka font-bold text-[var(--light_color)] text-center mb-6 neon-tube">
        {title}
      </h1>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4 relative z-10">
        <FormInput
          type="email"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
          disabled={loading}
        />

        {mode !== "login" && (
          <FormInput
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            disabled={loading}
          />
        )}

        <FormInput
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          disabled={loading}
        />

        <FormButton
          loading={loading}
          loadingText={labels.loading}
        >
          { labels.button}
        </FormButton>
      </form>

      {/* Messages */}
      {message && (
        <p
          className={`mt-4 text-center ${
            message.includes("successful") ? "text-green-400" : "text-red-400"
          }`}
        >
          {message}
        </p>
      )}

      {message.includes("taken") && (
        <p className="mt-4 text-center">
          <Link
            href="/login"
            className="text-[var(--orange_color)] hover:text-[var(--blue_color)] underline"
          >
            Already have an account? Sign in
          </Link>
        </p>
      )}
      {mode === "login" && (
        <div className="mt-4 text-center">
          <Link
            href="/createAccount"
            className="text-[var(--tan_color)] hover:text-[var(--blue_color)] underline"
          >
            Don't have an account? Sign up
          </Link>
        </div>
      )}
    </div>
  </>
);

}

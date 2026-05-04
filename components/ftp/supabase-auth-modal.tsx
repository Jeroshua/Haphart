'use client'

import { useState } from 'react'
import { createClient } from '@/lib/supabase/client'

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function SupabaseAuthModal({ isOpen, onClose }: AuthModalProps) {
  const [tab, setTab] = useState<'login' | 'register'>('login')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [message, setMessage] = useState('')

  const supabase = createClient()

  const handleSignUp = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setMessage('')
    setLoading(true)

    try {
      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            username: email.split('@')[0],
          },
        },
      })

      if (signUpError) {
        setError(signUpError.message)
        return
      }

      if (data?.user?.identities?.length === 0) {
        setError('This email is already registered')
        return
      }

      setMessage(
        'Check your email for a confirmation link to complete sign up'
      )
      setEmail('')
      setPassword('')
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  const handleSignIn = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const { error: signInError } = await supabase.auth.signInWithPassword(
        email,
        password
      )

      if (signInError) {
        setError(signInError.message)
        return
      }

      setEmail('')
      setPassword('')
      onClose()
    } catch (err: any) {
      setError(err.message || 'An error occurred')
    } finally {
      setLoading(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 animate-modal-in">
      <div className="bg-[#1a1f2e] border border-[#2d3a50] rounded-lg p-8 w-full max-w-md max-h-screen overflow-y-auto">
        <div className="flex gap-2 mb-6">
          <button
            onClick={() => {
              setTab('login')
              setError('')
              setMessage('')
            }}
            className={`flex-1 py-2 px-4 rounded transition ${
              tab === 'login'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-[#2d3a50] text-[#94a3b8] hover:bg-[#3a4657]'
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              setTab('register')
              setError('')
              setMessage('')
            }}
            className={`flex-1 py-2 px-4 rounded transition ${
              tab === 'register'
                ? 'bg-cyan-500 text-black font-semibold'
                : 'bg-[#2d3a50] text-[#94a3b8] hover:bg-[#3a4657]'
            }`}
          >
            Register
          </button>
          <button
            onClick={onClose}
            className="ml-2 text-[#94a3b8] hover:text-white transition"
          >
            ✕
          </button>
        </div>

        <form
          onSubmit={tab === 'login' ? handleSignIn : handleSignUp}
          className="space-y-4"
        >
          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="your@email.com"
              disabled={loading}
              className="w-full bg-[#0f1419] border border-[#2d3a50] rounded px-3 py-2 text-white placeholder-[#475569] focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-[#94a3b8] mb-2">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="••••••••"
              disabled={loading}
              className="w-full bg-[#0f1419] border border-[#2d3a50] rounded px-3 py-2 text-white placeholder-[#475569] focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
              required
            />
          </div>

          {error && <p className="text-red-400 text-sm">{error}</p>}
          {message && <p className="text-cyan-400 text-sm">{message}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-cyan-500 hover:bg-cyan-600 disabled:opacity-50 text-black font-semibold py-2 px-4 rounded transition"
          >
            {loading ? 'Loading...' : tab === 'login' ? 'Sign In' : 'Sign Up'}
          </button>
        </form>

        {tab === 'login' && (
          <p className="text-xs text-[#475569] mt-4">
            Demo: Use any email and password combination to register, then use
            those credentials to login.
          </p>
        )}
      </div>
    </div>
  )
}

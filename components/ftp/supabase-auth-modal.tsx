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
  const [isAdmin, setIsAdmin] = useState(false)
  const [adminSecret, setAdminSecret] = useState('')
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
      // Verify admin secret if creating admin account
      if (isAdmin) {
        if (adminSecret !== process.env.NEXT_PUBLIC_ADMIN_SECRET) {
          setError('Invalid admin secret')
          setLoading(false)
          return
        }
      }

      const { data, error: signUpError } = await supabase.auth.signUp({
        email,
        password,
        options: {
          emailRedirectTo:
            process.env.NEXT_PUBLIC_DEV_SUPABASE_REDIRECT_URL ??
            `${window.location.origin}/auth/callback`,
          data: {
            username: email.split('@')[0],
            is_admin: isAdmin,
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

      // Auto-confirm email for admin accounts
      if (isAdmin && data.user?.id) {
        try {
          const response = await fetch('/api/admin/confirm-email', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ userId: data.user.id }),
          })

          if (!response.ok) {
            throw new Error('Failed to confirm email')
          }

          setMessage('Admin account created! You can now login.')
          setEmail('')
          setPassword('')
          setAdminSecret('')
          setIsAdmin(false)
        } catch (err: any) {
          setError('Account created but auto-confirmation failed. Please check your email.')
          setEmail('')
          setPassword('')
          setAdminSecret('')
          setIsAdmin(false)
        }
      } else {
        setMessage(
          'Check your email for a confirmation link to complete sign up'
        )
        setEmail('')
        setPassword('')
        setAdminSecret('')
        setIsAdmin(false)
      }
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

          {tab === 'register' && (
            <>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="admin-checkbox"
                  checked={isAdmin}
                  onChange={(e) => setIsAdmin(e.target.checked)}
                  disabled={loading}
                  className="w-4 h-4 bg-[#0f1419] border border-[#2d3a50] rounded cursor-pointer"
                />
                <label htmlFor="admin-checkbox" className="text-sm font-medium text-[#94a3b8]">
                  Create as Admin Account
                </label>
              </div>

              {isAdmin && (
                <div>
                  <label className="block text-sm font-medium text-[#94a3b8] mb-2">
                    Admin Secret Key
                  </label>
                  <input
                    type="password"
                    value={adminSecret}
                    onChange={(e) => setAdminSecret(e.target.value)}
                    placeholder="Enter admin secret"
                    disabled={loading}
                    className="w-full bg-[#0f1419] border border-[#2d3a50] rounded px-3 py-2 text-white placeholder-[#475569] focus:outline-none focus:border-cyan-500 transition disabled:opacity-50"
                    required
                  />
                  <p className="text-xs text-[#475569] mt-2">
                    Contact system administrator for the admin secret key
                  </p>
                </div>
              )}
            </>
          )}

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

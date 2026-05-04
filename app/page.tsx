'use client'

import { useState } from 'react'
import { AuthProvider, useAuth } from '@/lib/auth-context'
import { SupabaseAuthModal } from '@/components/ftp/supabase-auth-modal'
import { SupabaseFileManager } from '@/components/ftp/supabase-file-manager'
import { createClient } from '@/lib/supabase/client'
import { Homepage } from '@/components/ftp/homepage'

function FTPVaultContent() {
  const { user, loading } = useAuth()
  const [showAuthModal, setShowAuthModal] = useState(false)
  const supabase = createClient()

  const handleLogout = async () => {
    await supabase.auth.signOut()
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen bg-[#080c14]">
        <p className="text-[#e2e8f0]">Loading...</p>
      </div>
    )
  }

  if (!user) {
    return (
      <>
        <Homepage onOpenModal={() => setShowAuthModal(true)} />
        <SupabaseAuthModal
          isOpen={showAuthModal}
          onClose={() => setShowAuthModal(false)}
        />
      </>
    )
  }

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0]">
      {/* Header */}
      <header className="border-b border-[#2d3a50] bg-[#0f1419] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-cyan-400">FTPVault</h1>
            <p className="text-sm text-[#94a3b8]">Secure File Transfer</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm text-[#94a3b8]">{user.email}</span>
            <button
              onClick={handleLogout}
              className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded transition"
            >
              Logout
            </button>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        <div>
          <h2 className="text-3xl font-bold text-white mb-2">File Manager</h2>
          <p className="text-[#94a3b8] mb-8">
            Upload, manage, and organize your files with military-grade encryption.
          </p>
          <SupabaseFileManager />
        </div>
      </main>
    </div>
  )
}

export default function FTPVaultPage() {
  return (
    <AuthProvider>
      <FTPVaultContent />
    </AuthProvider>
  )
}

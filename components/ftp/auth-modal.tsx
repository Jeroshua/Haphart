"use client"

import { useState, useEffect } from "react"
import type { User } from "@/lib/ftp-types"
import { getUsers, saveUsers } from "@/lib/ftp-storage"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
  activeTab: "login" | "register"
  onTabChange: (tab: "login" | "register") => void
  onLogin: (user: User) => void
  onRegister: (user: User) => void
  notify: (msg: string, type: "success" | "error" | "info") => void
}

export function AuthModal({
  isOpen,
  onClose,
  activeTab,
  onTabChange,
  onLogin,
  onRegister,
  notify,
}: AuthModalProps) {
  const [loginUsername, setLoginUsername] = useState("")
  const [loginPassword, setLoginPassword] = useState("")
  const [loginError, setLoginError] = useState(false)

  const [regName, setRegName] = useState("")
  const [regUsername, setRegUsername] = useState("")
  const [regEmail, setRegEmail] = useState("")
  const [regPassword, setRegPassword] = useState("")
  const [regError, setRegError] = useState("")

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"
    } else {
      document.body.style.overflow = ""
    }
    return () => {
      document.body.style.overflow = ""
    }
  }, [isOpen])

  const clearErrors = () => {
    setLoginError(false)
    setRegError("")
  }

  const handleLogin = () => {
    const users = getUsers()
    const user = users.find(
      (u) => u.username === loginUsername.trim() && u.password === loginPassword
    )

    if (!user) {
      setLoginError(true)
      return
    }

    onLogin(user)
    setLoginUsername("")
    setLoginPassword("")
    clearErrors()
  }

  const handleRegister = () => {
    if (!regName || !regUsername || !regEmail || !regPassword) {
      notify("Please fill in all fields", "error")
      return
    }
    if (regPassword.length < 6) {
      notify("Password must be at least 6 characters", "error")
      return
    }

    const users = getUsers()
    if (users.find((u) => u.username === regUsername.trim().toLowerCase())) {
      setRegError("Username already taken")
      return
    }

    const newUser: User = {
      id: "u_" + Date.now(),
      name: regName.trim(),
      username: regUsername.trim().toLowerCase(),
      email: regEmail.trim(),
      password: regPassword,
      role: "user",
      quota: "1GB",
      status: "active",
      joined: new Date().toISOString(),
    }

    users.push(newUser)
    saveUsers(users)

    onRegister(newUser)
    setRegName("")
    setRegUsername("")
    setRegEmail("")
    setRegPassword("")
    clearErrors()
  }

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter") {
      if (activeTab === "login") {
        handleLogin()
      } else {
        handleRegister()
      }
    }
  }

  const handleOverlayClick = (e: React.MouseEvent) => {
    if (e.target === e.currentTarget) {
      onClose()
      clearErrors()
    }
  }

  if (!isOpen) return null

  return (
    <div
      className="fixed inset-0 bg-[rgba(0,0,0,0.8)] backdrop-blur-sm z-[1000] flex items-center justify-center p-5"
      onClick={handleOverlayClick}
    >
      <div className="bg-[#0d1321] border border-[#2d3a50] rounded-2xl p-10 w-full max-w-[440px] shadow-[0_40px_80px_rgba(0,0,0,0.6)] animate-modal-in relative">
        <button
          onClick={() => {
            onClose()
            clearErrors()
          }}
          className="absolute top-4 right-5 bg-transparent border-none text-[#475569] text-xl cursor-pointer leading-none hover:text-[#e2e8f0]"
        >
          ✕
        </button>

        <div className="font-sans font-extrabold text-[22px] text-[#00d4ff] mb-2">
          📡 FTPVault
        </div>
        <div className="text-[13px] text-[#94a3b8] mb-8">
          {activeTab === "login" ? "Sign in to your account" : "Create your FTPVault account"}
        </div>

        {/* Tabs */}
        <div className="flex bg-[#111827] rounded-lg p-1 mb-7 gap-1">
          <button
            onClick={() => {
              onTabChange("login")
              clearErrors()
            }}
            className={`flex-1 py-2 px-4 rounded-md border-none font-mono text-[13px] cursor-pointer transition-all ${
              activeTab === "login"
                ? "bg-[#00d4ff] text-black font-bold"
                : "bg-transparent text-[#94a3b8]"
            }`}
          >
            Login
          </button>
          <button
            onClick={() => {
              onTabChange("register")
              clearErrors()
            }}
            className={`flex-1 py-2 px-4 rounded-md border-none font-mono text-[13px] cursor-pointer transition-all ${
              activeTab === "register"
                ? "bg-[#00d4ff] text-black font-bold"
                : "bg-transparent text-[#94a3b8]"
            }`}
          >
            Register
          </button>
        </div>

        {/* Login Form */}
        {activeTab === "login" && (
          <div onKeyDown={handleKeyDown}>
            <div className="mb-5">
              <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
                USERNAME
              </label>
              <input
                type="text"
                value={loginUsername}
                onChange={(e) => setLoginUsername(e.target.value)}
                placeholder="admin"
                autoComplete="username"
                className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
                PASSWORD
              </label>
              <input
                type="password"
                value={loginPassword}
                onChange={(e) => setLoginPassword(e.target.value)}
                placeholder="••••••••"
                autoComplete="current-password"
                className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
              />
              {loginError && (
                <div className="text-xs text-[#ff4757] mt-1.5">
                  Invalid username or password
                </div>
              )}
            </div>
            <button
              onClick={handleLogin}
              className="w-full py-3 rounded-md font-mono text-sm font-bold cursor-pointer border-none bg-[#00d4ff] text-black hover:bg-[#33ddff] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
            >
              Sign In →
            </button>
          </div>
        )}

        {/* Register Form */}
        {activeTab === "register" && (
          <div onKeyDown={handleKeyDown}>
            <div className="mb-5">
              <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
                FULL NAME
              </label>
              <input
                type="text"
                value={regName}
                onChange={(e) => setRegName(e.target.value)}
                placeholder="John Doe"
                className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
                USERNAME
              </label>
              <input
                type="text"
                value={regUsername}
                onChange={(e) => setRegUsername(e.target.value)}
                placeholder="johndoe"
                className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
              />
              {regError && <div className="text-xs text-[#ff4757] mt-1.5">{regError}</div>}
            </div>
            <div className="mb-5">
              <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
                EMAIL
              </label>
              <input
                type="email"
                value={regEmail}
                onChange={(e) => setRegEmail(e.target.value)}
                placeholder="john@company.com"
                className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
              />
            </div>
            <div className="mb-5">
              <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
                PASSWORD
              </label>
              <input
                type="password"
                value={regPassword}
                onChange={(e) => setRegPassword(e.target.value)}
                placeholder="Min. 6 characters"
                className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] focus:shadow-[0_0_0_3px_rgba(0,212,255,0.1)] transition-all"
              />
            </div>
            <button
              onClick={handleRegister}
              className="w-full py-3 rounded-md font-mono text-sm font-bold cursor-pointer border-none bg-[#00ff88] text-black hover:bg-[#33ffaa] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              Create Account →
            </button>
          </div>
        )}

        <div className="mt-5 text-center text-[11px] text-[#475569]">
          Demo: admin / admin123 &nbsp;|&nbsp; 14-day free trial · No credit card
        </div>
      </div>
    </div>
  )
}

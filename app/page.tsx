"use client"

import { useState, useEffect, useCallback } from "react"
import { Homepage } from "@/components/ftp/homepage"
import { AuthModal } from "@/components/ftp/auth-modal"
import { Dashboard } from "@/components/ftp/dashboard"
import { NotificationContainer } from "@/components/ftp/notifications"
import type { User, Notification } from "@/lib/ftp-types"
import {
  getUsers,
  saveUsers,
  getActivity,
  saveActivity,
} from "@/lib/ftp-storage"

export default function FTPVaultPage() {
  const [currentView, setCurrentView] = useState<"homepage" | "dashboard">("homepage")
  const [currentUser, setCurrentUser] = useState<User | null>(null)
  const [showModal, setShowModal] = useState(false)
  const [modalTab, setModalTab] = useState<"login" | "register">("login")
  const [notifications, setNotifications] = useState<Notification[]>([])

  // Initialize default admin user
  useEffect(() => {
    const users = getUsers()
    if (!users.find((u) => u.username === "admin")) {
      users.push({
        id: "u1",
        name: "Administrator",
        username: "admin",
        email: "admin@ftpvault.io",
        password: "admin123",
        role: "admin",
        quota: "Unlimited",
        status: "active",
        joined: new Date().toISOString(),
      })
      saveUsers(users)
    }
  }, [])

  const notify = useCallback((msg: string, type: "success" | "error" | "info" = "info") => {
    const id = Date.now().toString()
    setNotifications((prev) => [...prev, { id, msg, type }])
    setTimeout(() => {
      setNotifications((prev) => prev.filter((n) => n.id !== id))
    }, 3500)
  }, [])

  const logActivity = useCallback((msg: string, type: string, color: string) => {
    const log = getActivity()
    log.unshift({ msg, type, color, time: new Date().toISOString() })
    if (log.length > 100) log.pop()
    saveActivity(log)
  }, [])

  const openModal = (tab: "login" | "register") => {
    setModalTab(tab)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user)
    setCurrentView("dashboard")
    closeModal()
    logActivity(`${user.name} logged in`, "login", "var(--green)")
    notify(`Welcome back, ${user.name}!`, "success")
  }

  const handleRegister = (user: User) => {
    setCurrentUser(user)
    setCurrentView("dashboard")
    closeModal()
    logActivity(`${user.name} registered & logged in`, "register", "var(--accent)")
    notify(`Account created! Welcome, ${user.name}!`, "success")
  }

  const handleLogout = () => {
    if (currentUser) {
      logActivity(`${currentUser.name} logged out`, "logout", "var(--yellow)")
    }
    setCurrentUser(null)
    setCurrentView("homepage")
    notify("Logged out successfully", "info")
  }

  return (
    <>
      <NotificationContainer notifications={notifications} />

      {currentView === "homepage" && <Homepage onOpenModal={openModal} />}

      {currentView === "dashboard" && currentUser && (
        <Dashboard
          user={currentUser}
          onLogout={handleLogout}
          notify={notify}
          logActivity={logActivity}
        />
      )}

      <AuthModal
        isOpen={showModal}
        onClose={closeModal}
        activeTab={modalTab}
        onTabChange={setModalTab}
        onLogin={handleLogin}
        onRegister={handleRegister}
        notify={notify}
      />
    </>
  )
}

"use client"

import { useState } from "react"
import type { User } from "@/lib/ftp-types"
import { FileManager } from "./file-manager"
import { AdminPanel } from "./admin-panel"
import { ActivityLog } from "./activity-log"

interface DashboardProps {
  user: User
  onLogout: () => void
  notify: (msg: string, type: "success" | "error" | "info") => void
  logActivity: (msg: string, type: string, color: string) => void
}

type Page = "files" | "admin" | "activity"

export function Dashboard({ user, onLogout, notify, logActivity }: DashboardProps) {
  const [activePage, setActivePage] = useState<Page>("files")
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const initials = user.name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .substring(0, 2)
    .toUpperCase()

  const titles = {
    files: "File Manager",
    admin: "Admin Panel",
    activity: "Activity Log",
  }

  return (
    <div className="min-h-screen bg-[#080c14] flex">
      {/* Sidebar */}
      <div
        className={`w-60 min-h-screen bg-[#0d1321] border-r border-[#1e293b] flex flex-col fixed top-0 left-0 z-50 transition-transform md:translate-x-0 ${
          sidebarOpen ? "translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="px-5 py-6 font-sans font-extrabold text-lg text-[#00d4ff] border-b border-[#1e293b] flex items-center gap-2">
          📡 <span className="text-[#e2e8f0]">FTP</span>Vault
        </div>

        <div className="px-5 py-4 border-b border-[#1e293b] flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center font-bold text-sm text-black shrink-0">
            {initials}
          </div>
          <div className="overflow-hidden">
            <div className="text-[13px] font-semibold text-[#e2e8f0] whitespace-nowrap overflow-hidden text-ellipsis">
              {user.name}
            </div>
            <div className="text-[11px] text-[#475569]">
              {user.role === "admin" ? "⭐ Administrator" : "👤 FTP User"}
            </div>
          </div>
        </div>

        <div className="p-3 flex-1">
          <button
            onClick={() => {
              setActivePage("files")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer mb-0.5 border-none font-mono text-left transition-all ${
              activePage === "files"
                ? "bg-[rgba(0,212,255,0.1)] text-[#00d4ff]"
                : "bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0]"
            }`}
          >
            <span className="text-base w-5 text-center">📁</span> File Manager
          </button>

          {user.role === "admin" && (
            <button
              onClick={() => {
                setActivePage("admin")
                setSidebarOpen(false)
              }}
              className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer mb-0.5 border-none font-mono text-left transition-all ${
                activePage === "admin"
                  ? "bg-[rgba(0,212,255,0.1)] text-[#00d4ff]"
                  : "bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0]"
              }`}
            >
              <span className="text-base w-5 text-center">⚙️</span> Admin Panel
            </button>
          )}

          <button
            onClick={() => {
              setActivePage("activity")
              setSidebarOpen(false)
            }}
            className={`w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer mb-0.5 border-none font-mono text-left transition-all ${
              activePage === "activity"
                ? "bg-[rgba(0,212,255,0.1)] text-[#00d4ff]"
                : "bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0]"
            }`}
          >
            <span className="text-base w-5 text-center">📋</span> Activity Log
          </button>
        </div>

        <div className="p-3 border-t border-[#1e293b]">
          <button
            onClick={onLogout}
            className="w-full flex items-center gap-2.5 px-3 py-2.5 rounded-lg text-[13px] cursor-pointer border-none font-mono text-left text-[#ff4757] bg-transparent hover:bg-[#111827] transition-all"
          >
            <span className="text-base w-5 text-center">🚪</span> Logout
          </button>
        </div>
      </div>

      {/* Main Content */}
      <div className="md:ml-60 flex-1 min-h-screen flex flex-col">
        {/* Topbar */}
        <div className="h-16 border-b border-[#1e293b] flex items-center justify-between px-4 md:px-8 bg-[#0d1321] sticky top-0 z-40">
          <div className="flex items-center gap-3">
            <button
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="md:hidden bg-transparent border-none text-[#e2e8f0] text-[22px] cursor-pointer p-1"
            >
              ☰
            </button>
            <div className="font-sans font-bold text-lg">{titles[activePage]}</div>
          </div>
          <div className="flex items-center gap-2.5">
            <div className="text-xs text-[#94a3b8] py-1.5 px-3 bg-[#111827] rounded-md border border-[#1e293b]">
              📡 ftp.vault.local <span className="text-[#00ff88]">● LIVE</span>
            </div>
            <div
              onClick={onLogout}
              title="Logout"
              className="w-9 h-9 rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center font-bold text-sm text-black cursor-pointer"
            >
              {initials}
            </div>
          </div>
        </div>

        {/* Pages */}
        <div className="flex-1 p-4 md:p-8">
          {activePage === "files" && (
            <FileManager user={user} notify={notify} logActivity={logActivity} />
          )}
          {activePage === "admin" && user.role === "admin" && (
            <AdminPanel notify={notify} logActivity={logActivity} />
          )}
          {activePage === "activity" && <ActivityLog notify={notify} />}
        </div>
      </div>

      {/* Overlay for mobile sidebar */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/50 z-40 md:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}
    </div>
  )
}

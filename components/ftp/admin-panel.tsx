"use client"

import { useState, useEffect, useCallback } from "react"
import type { User } from "@/lib/ftp-types"
import { getUsers, saveUsers, getFiles, formatSize } from "@/lib/ftp-storage"

interface AdminPanelProps {
  notify: (msg: string, type: "success" | "error" | "info") => void
  logActivity: (msg: string, type: string, color: string) => void
}

export function AdminPanel({ notify, logActivity }: AdminPanelProps) {
  const [users, setUsers] = useState<User[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0, totalSize: 0 })

  // Form state
  const [newName, setNewName] = useState("")
  const [newUsername, setNewUsername] = useState("")
  const [newEmail, setNewEmail] = useState("")
  const [newPassword, setNewPassword] = useState("")
  const [newRole, setNewRole] = useState<"user" | "admin">("user")
  const [newQuota, setNewQuota] = useState("1GB")

  const loadData = useCallback(() => {
    const allUsers = getUsers()
    const allFiles = getFiles()
    const totalSize = allFiles.reduce((sum, f) => sum + (f.size || 0), 0)

    setUsers(allUsers)
    setStats({
      totalUsers: allUsers.length,
      totalFiles: allFiles.length,
      totalSize,
    })
  }, [])

  useEffect(() => {
    loadData()
  }, [loadData])

  const addUser = () => {
    if (!newName || !newUsername || !newEmail || !newPassword) {
      notify("Fill in all fields", "error")
      return
    }

    const allUsers = getUsers()
    if (allUsers.find((u) => u.username === newUsername.trim().toLowerCase())) {
      notify("Username already taken", "error")
      return
    }

    allUsers.push({
      id: "u_" + Date.now(),
      name: newName.trim(),
      username: newUsername.trim().toLowerCase(),
      email: newEmail.trim(),
      password: newPassword,
      role: newRole,
      quota: newQuota,
      status: "active",
      joined: new Date().toISOString(),
    })
    saveUsers(allUsers)
    logActivity(
      `Admin registered new user "${newUsername}" (${newRole})`,
      "admin",
      "var(--accent)"
    )
    notify(`User "${newUsername}" registered!`, "success")

    // Clear form
    setNewName("")
    setNewUsername("")
    setNewEmail("")
    setNewPassword("")
    setNewRole("user")
    setNewQuota("1GB")
    loadData()
  }

  const toggleUserStatus = (userId: string) => {
    const allUsers = getUsers()
    const user = allUsers.find((u) => u.id === userId)
    if (!user) return

    user.status = user.status === "active" ? "suspended" : "active"
    saveUsers(allUsers)
    logActivity(
      `Admin ${user.status === "active" ? "activated" : "suspended"} user "${user.username}"`,
      "admin",
      "var(--yellow)"
    )
    notify(`User ${user.status}`, "info")
    loadData()
  }

  const deleteUser = (userId: string) => {
    const allUsers = getUsers()
    const user = allUsers.find((u) => u.id === userId)
    if (!user || !confirm(`Delete user "${user.username}"?`)) return

    saveUsers(allUsers.filter((u) => u.id !== userId))
    logActivity(`Admin deleted user "${user.username}"`, "admin", "var(--red)")
    notify(`User "${user.username}" deleted`, "info")
    loadData()
  }

  return (
    <div>
      {/* Stats Grid */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
          <div className="text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">TOTAL USERS</div>
          <div className="font-sans text-[32px] font-extrabold text-[#e2e8f0] tracking-[-1px]">
            {stats.totalUsers}
          </div>
          <div className="text-xs text-[#00ff88] mt-1">↑ All time</div>
        </div>
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
          <div className="text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">TOTAL FILES</div>
          <div className="font-sans text-[32px] font-extrabold text-[#e2e8f0] tracking-[-1px]">
            {stats.totalFiles}
          </div>
          <div className="text-xs text-[#00ff88] mt-1">Across all users</div>
        </div>
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
          <div className="text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">STORAGE USED</div>
          <div className="font-sans text-2xl font-extrabold text-[#e2e8f0] tracking-[-1px]">
            {formatSize(stats.totalSize)}
          </div>
          <div className="text-xs text-[#00ff88] mt-1">Combined total</div>
        </div>
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-6">
          <div className="text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">ACTIVE SESSIONS</div>
          <div className="font-sans text-[32px] font-extrabold text-[#e2e8f0] tracking-[-1px]">
            1
          </div>
          <div className="text-xs text-[#00ff88] mt-1">● Online now</div>
        </div>
      </div>

      {/* Add User Form */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden mb-6">
        <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between">
          <div className="font-sans font-bold text-[15px]">➕ Register FTP User</div>
        </div>
        <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
              FULL NAME
            </label>
            <input
              type="text"
              value={newName}
              onChange={(e) => setNewName(e.target.value)}
              placeholder="Full name"
              className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
              USERNAME
            </label>
            <input
              type="text"
              value={newUsername}
              onChange={(e) => setNewUsername(e.target.value)}
              placeholder="username"
              className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">EMAIL</label>
            <input
              type="email"
              value={newEmail}
              onChange={(e) => setNewEmail(e.target.value)}
              placeholder="user@email.com"
              className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
              PASSWORD
            </label>
            <input
              type="password"
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="Password"
              className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none focus:border-[#00d4ff] transition-all"
            />
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">ROLE</label>
            <select
              value={newRole}
              onChange={(e) => setNewRole(e.target.value as "user" | "admin")}
              className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none cursor-pointer focus:border-[#00d4ff]"
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
          </div>
          <div>
            <label className="block text-xs text-[#94a3b8] mb-2 tracking-[0.5px]">
              STORAGE QUOTA
            </label>
            <select
              value={newQuota}
              onChange={(e) => setNewQuota(e.target.value)}
              className="w-full py-[11px] px-4 bg-[#111827] border border-[#2d3a50] rounded-lg text-[#e2e8f0] font-mono text-sm outline-none cursor-pointer focus:border-[#00d4ff]"
            >
              <option value="1GB">1 GB</option>
              <option value="5GB">5 GB</option>
              <option value="10GB">10 GB</option>
              <option value="Unlimited">Unlimited</option>
            </select>
          </div>
          <div className="md:col-span-2">
            <button
              onClick={addUser}
              className="inline-flex items-center gap-1.5 px-5 py-2 rounded-md font-mono text-[13px] font-bold cursor-pointer border-none bg-[#00ff88] text-black hover:bg-[#33ffaa] hover:shadow-[0_0_20px_rgba(0,255,136,0.3)] transition-all"
            >
              ✅ Register User
            </button>
          </div>
        </div>
      </div>

      {/* Users Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between">
          <div className="font-sans font-bold text-[15px]">👥 Registered Users</div>
          <div className="text-xs text-[#94a3b8]">
            {users.length} user{users.length !== 1 ? "s" : ""}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full border-collapse">
            <thead>
              <tr>
                <th className="px-6 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                  User
                </th>
                <th className="px-6 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                  Role
                </th>
                <th className="px-6 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                  Quota
                </th>
                <th className="px-6 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                  Joined
                </th>
                <th className="px-6 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id} className="hover:bg-[rgba(255,255,255,0.02)]">
                  <td className="px-6 py-3.5 border-b border-[#1e293b]">
                    <div className="flex items-center gap-2.5">
                      <div className="w-[30px] h-[30px] rounded-full bg-gradient-to-br from-[#00d4ff] to-[#00ff88] flex items-center justify-center font-bold text-xs text-black">
                        {user.name
                          .split(" ")
                          .map((n) => n[0])
                          .join("")
                          .substring(0, 2)
                          .toUpperCase()}
                      </div>
                      <div>
                        <div className="text-[13px] font-semibold">{user.name}</div>
                        <div className="text-[11px] text-[#475569]">{user.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#1e293b]">
                    <span
                      className={`inline-flex py-0.5 px-2.5 rounded-full text-[11px] font-semibold ${
                        user.role === "admin"
                          ? "bg-[rgba(255,211,42,0.1)] text-[#ffd32a]"
                          : "bg-[rgba(0,212,255,0.1)] text-[#00d4ff]"
                      }`}
                    >
                      {user.role === "admin" ? "⭐ Admin" : "👤 User"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#94a3b8] border-b border-[#1e293b]">
                    {user.quota}
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#1e293b]">
                    <span
                      className={`inline-flex py-0.5 px-2.5 rounded-full text-[11px] font-semibold ${
                        user.status === "active"
                          ? "bg-[rgba(0,255,136,0.1)] text-[#00ff88]"
                          : "bg-[rgba(255,71,87,0.1)] text-[#ff4757]"
                      }`}
                    >
                      {user.status === "active" ? "● Active" : "○ Inactive"}
                    </span>
                  </td>
                  <td className="px-6 py-3.5 text-xs text-[#94a3b8] border-b border-[#1e293b]">
                    {new Date(user.joined).toLocaleDateString()}
                  </td>
                  <td className="px-6 py-3.5 border-b border-[#1e293b]">
                    <div className="flex gap-1.5">
                      <button
                        onClick={() => toggleUserStatus(user.id)}
                        className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-mono text-xs font-medium cursor-pointer border border-[#2d3a50] bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0] hover:border-[#00d4ff] transition-all"
                      >
                        {user.status === "active" ? "🔒 Suspend" : "🔓 Activate"}
                      </button>
                      {user.id !== "u1" && (
                        <button
                          onClick={() => deleteUser(user.id)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-mono text-xs font-semibold cursor-pointer border-none bg-[#ff4757] text-white hover:bg-[#ff6b7a] transition-all"
                        >
                          🗑️
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

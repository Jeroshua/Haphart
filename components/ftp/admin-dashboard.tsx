'use client'

import { useState, useEffect } from 'react'
import { getAllUsers, getAllFiles, getAllActivityLogs, getUserStatistics, deleteUser, deleteFile, updateUserAdmin, getUserFileCount, getUserStorageUsage } from '@/lib/admin-utils'
import { createClient } from '@/lib/supabase/client'

export function AdminDashboard() {
  const [activeTab, setActiveTab] = useState<'overview' | 'users' | 'files' | 'activity'>('overview')
  const [users, setUsers] = useState<any[]>([])
  const [files, setFiles] = useState<any[]>([])
  const [logs, setLogs] = useState<any[]>([])
  const [stats, setStats] = useState({ totalUsers: 0, totalFiles: 0, totalActivities: 0 })
  const [loading, setLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState('')

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    setLoading(true)
    const [usersData, filesData, logsData, statsData] = await Promise.all([
      getAllUsers(),
      getAllFiles(),
      getAllActivityLogs(),
      getUserStatistics(),
    ])
    setUsers(usersData)
    setFiles(filesData)
    setLogs(logsData)
    setStats(statsData)
    setLoading(false)
  }

  const handleDeleteUser = async (userId: string) => {
    if (confirm('Are you sure you want to delete this user and all their files?')) {
      await deleteUser(userId)
      loadData()
    }
  }

  const handleDeleteFile = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId)
      loadData()
    }
  }

  const handleToggleAdmin = async (userId: string, currentStatus: boolean) => {
    await updateUserAdmin(userId, !currentStatus)
    loadData()
  }

  const filteredUsers = users.filter(
    u => u.username?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.display_name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
         u.email?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredFiles = files.filter(
    f => f.name?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredLogs = logs.filter(
    l => l.action?.toLowerCase().includes(searchQuery.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-[#080c14] text-[#e2e8f0]">
      {/* Header */}
      <header className="border-b border-[#2d3a50] bg-[#0f1419] sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <h1 className="text-3xl font-bold text-cyan-400">Admin Dashboard</h1>
          <p className="text-sm text-[#94a3b8] mt-1">Manage users, files, and system activity</p>
        </div>
      </header>

      {/* Tabs */}
      <div className="border-b border-[#2d3a50] bg-[#0f1419] sticky top-16 z-30">
        <div className="max-w-7xl mx-auto px-6">
          <div className="flex gap-8">
            {['overview', 'users', 'files', 'activity'].map(tab => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab as any)}
                className={`py-4 px-2 font-medium border-b-2 transition capitalize ${
                  activeTab === tab
                    ? 'border-cyan-400 text-cyan-400'
                    : 'border-transparent text-[#94a3b8] hover:text-[#e2e8f0]'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Content */}
      <main className="max-w-7xl mx-auto px-6 py-12">
        {loading ? (
          <div className="text-center py-12">
            <p className="text-[#94a3b8]">Loading...</p>
          </div>
        ) : (
          <>
            {/* Overview Tab */}
            {activeTab === 'overview' && (
              <div className="space-y-8">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                  <div className="bg-[#0f1419] border border-[#2d3a50] rounded-lg p-6">
                    <div className="text-[#94a3b8] text-sm font-medium mb-2">Total Users</div>
                    <div className="text-4xl font-bold text-cyan-400">{stats.totalUsers}</div>
                  </div>
                  <div className="bg-[#0f1419] border border-[#2d3a50] rounded-lg p-6">
                    <div className="text-[#94a3b8] text-sm font-medium mb-2">Total Files</div>
                    <div className="text-4xl font-bold text-cyan-400">{stats.totalFiles}</div>
                  </div>
                  <div className="bg-[#0f1419] border border-[#2d3a50] rounded-lg p-6">
                    <div className="text-[#94a3b8] text-sm font-medium mb-2">Total Activities</div>
                    <div className="text-4xl font-bold text-cyan-400">{stats.totalActivities}</div>
                  </div>
                </div>

                <div className="bg-[#0f1419] border border-[#2d3a50] rounded-lg p-6">
                  <h3 className="text-xl font-bold mb-4">Recent Activity</h3>
                  <div className="space-y-3 max-h-96 overflow-y-auto">
                    {logs.slice(0, 20).map((log, idx) => (
                      <div key={idx} className="flex justify-between items-start pb-3 border-b border-[#2d3a50] last:border-0">
                        <div className="flex-1">
                          <p className="text-[#e2e8f0]">{log.action}</p>
                          <p className="text-xs text-[#94a3b8]">{log.profiles?.username}</p>
                        </div>
                        <p className="text-xs text-[#64748b]">
                          {new Date(log.created_at).toLocaleDateString()}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* Users Tab */}
            {activeTab === 'users' && (
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Search users by name, username, or email..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f1419] border border-[#2d3a50] rounded text-[#e2e8f0] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2d3a50]">
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Username</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Display Name</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Files</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Role</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Joined</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredUsers.map((user) => (
                        <tr key={user.id} className="border-b border-[#2d3a50] hover:bg-[#0f1419]/50">
                          <td className="py-3 px-4">{user.username}</td>
                          <td className="py-3 px-4">{user.display_name}</td>
                          <td className="py-3 px-4">
                            {users.reduce((count, u) => count + (u.id === user.id ? files.filter(f => f.user_id === user.id).length : 0), 0)}
                          </td>
                          <td className="py-3 px-4">
                            <span className={`px-2 py-1 rounded text-xs font-medium ${
                              user.is_admin
                                ? 'bg-cyan-400/20 text-cyan-400'
                                : 'bg-blue-400/20 text-blue-400'
                            }`}>
                              {user.is_admin ? 'Admin' : 'User'}
                            </span>
                          </td>
                          <td className="py-3 px-4 text-[#94a3b8]">
                            {new Date(user.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => handleToggleAdmin(user.id, user.is_admin)}
                                className={`px-2 py-1 rounded text-xs transition ${
                                  user.is_admin
                                    ? 'bg-red-500/20 hover:bg-red-500/30 text-red-400'
                                    : 'bg-cyan-500/20 hover:bg-cyan-500/30 text-cyan-400'
                                }`}
                              >
                                {user.is_admin ? 'Remove Admin' : 'Make Admin'}
                              </button>
                              <button
                                onClick={() => handleDeleteUser(user.id)}
                                className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition"
                              >
                                Delete
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Files Tab */}
            {activeTab === 'files' && (
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Search files by name..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f1419] border border-[#2d3a50] rounded text-[#e2e8f0] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-[#2d3a50]">
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Filename</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Owner</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Size</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Uploaded</th>
                        <th className="text-left py-3 px-4 text-[#94a3b8] font-medium">Actions</th>
                      </tr>
                    </thead>
                    <tbody>
                      {filteredFiles.map((file) => (
                        <tr key={file.id} className="border-b border-[#2d3a50] hover:bg-[#0f1419]/50">
                          <td className="py-3 px-4 truncate">{file.name}</td>
                          <td className="py-3 px-4">{file.profiles?.username}</td>
                          <td className="py-3 px-4">
                            {(file.size_bytes / 1024 / 1024).toFixed(2)} MB
                          </td>
                          <td className="py-3 px-4 text-[#94a3b8]">
                            {new Date(file.created_at).toLocaleDateString()}
                          </td>
                          <td className="py-3 px-4">
                            <button
                              onClick={() => handleDeleteFile(file.id)}
                              className="px-2 py-1 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded text-xs transition"
                            >
                              Delete
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {/* Activity Tab */}
            {activeTab === 'activity' && (
              <div className="space-y-6">
                <div>
                  <input
                    type="text"
                    placeholder="Search activities..."
                    value={searchQuery}
                    onChange={e => setSearchQuery(e.target.value)}
                    className="w-full px-4 py-2 bg-[#0f1419] border border-[#2d3a50] rounded text-[#e2e8f0] focus:outline-none focus:border-cyan-400"
                  />
                </div>

                <div className="space-y-3">
                  {filteredLogs.map((log, idx) => (
                    <div key={idx} className="bg-[#0f1419] border border-[#2d3a50] rounded-lg p-4">
                      <div className="flex justify-between items-start">
                        <div>
                          <p className="font-medium text-[#e2e8f0]">{log.action}</p>
                          <p className="text-sm text-[#94a3b8] mt-1">{log.profiles?.username}</p>
                          {log.details && <p className="text-xs text-[#64748b] mt-2">{JSON.stringify(log.details)}</p>}
                        </div>
                        <span className="text-xs text-[#64748b] whitespace-nowrap">
                          {new Date(log.created_at).toLocaleString()}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </>
        )}
      </main>
    </div>
  )
}

'use client'

import { useEffect, useState } from 'react'
import { useAuth } from '@/lib/auth-context'
import {
  getUserFiles,
  deleteFile,
  uploadFile,
  getActivityLogs,
} from '@/lib/supabase-utils'

interface File {
  id: string
  name: string
  size_bytes: number
  mime_type?: string
  created_at: string
  updated_at: string
}

interface ActivityLog {
  id: string
  action: string
  file_id?: string
  details?: any
  created_at: string
}

export function SupabaseFileManager() {
  const { user } = useAuth()
  const [files, setFiles] = useState<File[]>([])
  const [activityLogs, setActivityLogs] = useState<ActivityLog[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [uploading, setUploading] = useState(false)

  useEffect(() => {
    if (user) {
      loadData()
    }
  }, [user])

  const loadData = async () => {
    setLoading(true)
    const [filesData, logsData] = await Promise.all([
      getUserFiles(),
      getActivityLogs(),
    ])
    setFiles(filesData)
    setActivityLogs(logsData)
    setLoading(false)
  }

  const handleFileUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const fileList = e.currentTarget.files
    if (!fileList) return

    setUploading(true)
    for (let i = 0; i < fileList.length; i++) {
      const file = fileList[i]
      await uploadFile(file, file.name)
    }
    await loadData()
    setUploading(false)
  }

  const handleDeleteFile = async (fileId: string) => {
    if (confirm('Are you sure you want to delete this file?')) {
      await deleteFile(fileId)
      await loadData()
    }
  }

  const filteredFiles = files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  )

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return Math.round((bytes / Math.pow(k, i)) * 100) / 100 + ' ' + sizes[i]
  }

  const formatDate = (dateString: string): string => {
    return new Date(dateString).toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  }

  if (loading)
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-[#94a3b8]">Loading your files...</p>
      </div>
    )

  return (
    <div className="space-y-6">
      {/* Upload Section */}
      <div className="bg-[#1a1f2e] border-2 border-dashed border-[#2d3a50] rounded-lg p-8 text-center hover:border-cyan-500/50 transition cursor-pointer group">
        <label className="cursor-pointer block">
          <input
            type="file"
            multiple
            onChange={handleFileUpload}
            disabled={uploading}
            className="hidden"
          />
          <div className="group-hover:text-cyan-400 transition">
            <p className="text-2xl mb-2">↑</p>
            <p className="text-white font-semibold">
              {uploading ? 'Uploading...' : 'Drop files here or click to upload'}
            </p>
            <p className="text-sm text-[#94a3b8] mt-1">
              Drag and drop your files for instant upload
            </p>
          </div>
        </label>
      </div>

      {/* Search Bar */}
      <div>
        <input
          type="text"
          placeholder="Search files..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="w-full bg-[#0f1419] border border-[#2d3a50] rounded px-4 py-2 text-white placeholder-[#475569] focus:outline-none focus:border-cyan-500 transition"
        />
      </div>

      {/* Files Table */}
      <div className="bg-[#1a1f2e] border border-[#2d3a50] rounded-lg overflow-hidden">
        {filteredFiles.length === 0 ? (
          <div className="p-8 text-center text-[#94a3b8]">
            <p>
              {files.length === 0
                ? 'No files uploaded yet. Start by uploading a file!'
                : 'No files match your search.'}
            </p>
          </div>
        ) : (
          <table className="w-full">
            <thead className="bg-[#0f1419] border-b border-[#2d3a50]">
              <tr>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#94a3b8]">
                  File Name
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#94a3b8]">
                  Size
                </th>
                <th className="px-6 py-3 text-left text-sm font-medium text-[#94a3b8]">
                  Uploaded
                </th>
                <th className="px-6 py-3 text-right text-sm font-medium text-[#94a3b8]">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {filteredFiles.map((file) => (
                <tr
                  key={file.id}
                  className="border-b border-[#2d3a50] hover:bg-[#0f1419]/50 transition"
                >
                  <td className="px-6 py-3 text-white font-mono text-sm">
                    {file.name}
                  </td>
                  <td className="px-6 py-3 text-[#94a3b8] text-sm">
                    {formatFileSize(file.size_bytes)}
                  </td>
                  <td className="px-6 py-3 text-[#94a3b8] text-sm">
                    {formatDate(file.created_at)}
                  </td>
                  <td className="px-6 py-3 text-right">
                    <button
                      onClick={() => handleDeleteFile(file.id)}
                      className="text-red-400 hover:text-red-300 text-sm font-medium transition"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Activity Log */}
      {activityLogs.length > 0 && (
        <div className="bg-[#1a1f2e] border border-[#2d3a50] rounded-lg p-6">
          <h3 className="text-white font-semibold mb-4">Recent Activity</h3>
          <div className="space-y-2 max-h-48 overflow-y-auto">
            {activityLogs.slice(0, 10).map((log) => (
              <div
                key={log.id}
                className="text-sm text-[#94a3b8] flex justify-between"
              >
                <span>
                  {log.action.charAt(0).toUpperCase() + log.action.slice(1)}
                </span>
                <span>{formatDate(log.created_at)}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}

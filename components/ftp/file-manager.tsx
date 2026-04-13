"use client"

import { useState, useRef, useEffect, useCallback } from "react"
import type { User, FTPFile } from "@/lib/ftp-types"
import {
  getFiles,
  saveFiles,
  getFileIcon,
  getFileType,
  formatSize,
  formatDate,
} from "@/lib/ftp-storage"

interface FileManagerProps {
  user: User
  notify: (msg: string, type: "success" | "error" | "info") => void
  logActivity: (msg: string, type: string, color: string) => void
}

export function FileManager({ user, notify, logActivity }: FileManagerProps) {
  const [files, setFiles] = useState<FTPFile[]>([])
  const [searchQuery, setSearchQuery] = useState("")
  const [uploading, setUploading] = useState(false)
  const [uploadFilename, setUploadFilename] = useState("")
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const loadFiles = useCallback(() => {
    const allFiles = getFiles()
    const userFiles = allFiles.filter(
      (f) => f.ownerId === user.id || user.role === "admin"
    )
    setFiles(userFiles)
  }, [user.id, user.role])

  useEffect(() => {
    loadFiles()
  }, [loadFiles])

  const filteredFiles = searchQuery
    ? files.filter((f) => f.name.toLowerCase().includes(searchQuery.toLowerCase()))
    : files

  const simulateUpload = (fileList: FileList) => {
    const filesArray = Array.from(fileList)
    let index = 0

    const uploadNext = () => {
      if (index >= filesArray.length) {
        setUploading(false)
        loadFiles()
        notify(`${filesArray.length} file(s) uploaded successfully!`, "success")
        return
      }

      const file = filesArray[index]
      index++

      setUploading(true)
      setUploadFilename(`Uploading: ${file.name}`)
      setUploadProgress(0)

      let progress = 0
      const interval = setInterval(() => {
        progress += Math.random() * 20
        if (progress >= 100) {
          progress = 100
          clearInterval(interval)

          // Save file
          const allFiles = getFiles()
          allFiles.push({
            id: "f_" + Date.now() + "_" + Math.random().toString(36).slice(2),
            name: file.name,
            size: file.size,
            type: "file",
            ownerId: user.id,
            ownerName: user.name,
            uploaded: new Date().toISOString(),
          })
          saveFiles(allFiles)
          logActivity(
            `${user.name} uploaded "${file.name}" (${formatSize(file.size)})`,
            "upload",
            "var(--accent)"
          )

          setUploadProgress(100)
          setTimeout(() => {
            setUploadProgress(0)
            uploadNext()
          }, 400)
          return
        }
        setUploadProgress(progress)
      }, 80)
    }

    uploadNext()
  }

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      simulateUpload(e.target.files)
      e.target.value = ""
    }
  }

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(false)
    if (e.dataTransfer.files.length > 0) {
      simulateUpload(e.dataTransfer.files)
    }
  }

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = () => {
    setDragOver(false)
  }

  const downloadFile = (file: FTPFile) => {
    notify(`Downloading ${file.name}...`, "info")
    logActivity(`${user.name} downloaded "${file.name}"`, "download", "var(--green)")
  }

  const deleteFile = (file: FTPFile) => {
    if (!confirm(`Delete "${file.name}"?`)) return
    const allFiles = getFiles().filter((f) => f.id !== file.id)
    saveFiles(allFiles)
    logActivity(`${user.name} deleted "${file.name}"`, "delete", "var(--red)")
    notify(`"${file.name}" deleted`, "info")
    loadFiles()
  }

  const createFolder = () => {
    const name = prompt("Folder name:")
    if (!name) return
    const allFiles = getFiles()
    allFiles.push({
      id: "f_" + Date.now(),
      name: name.trim(),
      size: 0,
      type: "folder",
      ownerId: user.id,
      ownerName: user.name,
      uploaded: new Date().toISOString(),
    })
    saveFiles(allFiles)
    logActivity(`${user.name} created folder "${name}"`, "folder", "var(--yellow)")
    notify(`Folder "${name}" created`, "success")
    loadFiles()
  }

  return (
    <div>
      {/* Toolbar */}
      <div className="flex items-center gap-3 mb-6 flex-wrap">
        <div className="flex items-center gap-1.5 text-[13px] text-[#94a3b8] flex-1 min-w-0">
          <span
            className="text-[#00d4ff] cursor-pointer hover:underline"
            onClick={loadFiles}
          >
            🏠 root
          </span>
        </div>
        <button
          onClick={() => fileInputRef.current?.click()}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-bold cursor-pointer border-none bg-[#00d4ff] text-black hover:bg-[#33ddff] hover:shadow-[0_0_20px_rgba(0,212,255,0.4)] transition-all"
        >
          ⬆️ Upload File
        </button>
        <button
          onClick={createFolder}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-medium cursor-pointer border border-[#2d3a50] bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0] hover:border-[#00d4ff] transition-all"
        >
          📂 New Folder
        </button>
        <input
          ref={fileInputRef}
          type="file"
          multiple
          onChange={handleFileChange}
          className="hidden"
        />
      </div>

      {/* Upload Progress */}
      {uploading && (
        <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl p-5 mb-4">
          <div className="flex justify-between mb-2.5 text-[13px]">
            <span>{uploadFilename}</span>
            <span>{Math.round(uploadProgress)}%</span>
          </div>
          <div className="h-1.5 bg-[#111827] rounded-sm overflow-hidden">
            <div
              className="h-full bg-gradient-to-r from-[#00d4ff] to-[#00ff88] rounded-sm transition-all duration-100"
              style={{ width: `${uploadProgress}%` }}
            />
          </div>
        </div>
      )}

      {/* Drop Zone */}
      <div
        onClick={() => fileInputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        className={`border-2 border-dashed rounded-xl p-12 text-center cursor-pointer transition-all mb-6 bg-[#0f172a] ${
          dragOver
            ? "border-[#00d4ff] bg-[rgba(0,212,255,0.03)]"
            : "border-[#2d3a50] hover:border-[#00d4ff] hover:bg-[rgba(0,212,255,0.03)]"
        }`}
      >
        <div className="text-[40px] mb-3">📤</div>
        <div className="font-sans font-bold text-base mb-1.5">
          Drop files here or click to upload
        </div>
        <div className="text-xs text-[#94a3b8]">Supports all file types · Max 2GB per file</div>
      </div>

      {/* File Table */}
      <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
        <div className="p-4 md:px-5 border-b border-[#1e293b] flex items-center justify-between flex-wrap gap-3">
          <div className="font-sans font-bold text-[15px]">📁 Files &amp; Folders</div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="🔍 Search files..."
            className="py-1.5 px-3.5 bg-[#111827] border border-[#2d3a50] rounded-md text-[#e2e8f0] font-mono text-xs outline-none w-[200px] focus:border-[#00d4ff]"
          />
        </div>

        {filteredFiles.length === 0 ? (
          <div className="py-15 px-8 text-center text-[#475569]">
            <div className="text-[40px] mb-3">📭</div>
            <div className="text-sm">No files yet. Upload something to get started.</div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full border-collapse">
              <thead>
                <tr>
                  <th className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                    Name
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                    Type
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                    Size
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                    Uploaded
                  </th>
                  <th className="px-5 py-3 text-left text-[11px] tracking-wider uppercase text-[#475569] bg-[#111827] border-b border-[#1e293b]">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody>
                {filteredFiles.map((file) => (
                  <tr
                    key={file.id}
                    className="hover:bg-[rgba(255,255,255,0.02)]"
                  >
                    <td className="px-5 py-3.5 text-[13px] border-b border-[#1e293b]">
                      <div className="flex items-center text-[#e2e8f0]">
                        <span className="text-lg mr-2.5">
                          {getFileIcon(file.name, file.type)}
                        </span>
                        {file.name}
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-[13px] border-b border-[#1e293b]">
                      <span className="inline-flex py-0.5 px-2.5 rounded-full text-[11px] font-semibold bg-[rgba(0,212,255,0.1)] text-[#00d4ff]">
                        {getFileType(file.name, file.type)}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#94a3b8] border-b border-[#1e293b]">
                      {formatSize(file.size)}
                    </td>
                    <td className="px-5 py-3.5 text-xs text-[#94a3b8] border-b border-[#1e293b]">
                      {formatDate(file.uploaded)}
                    </td>
                    <td className="px-5 py-3.5 border-b border-[#1e293b]">
                      <div className="flex gap-1.5">
                        <button
                          onClick={() => downloadFile(file)}
                          className="inline-flex items-center gap-1 px-3 py-1 rounded-md font-mono text-xs font-medium cursor-pointer border border-[#2d3a50] bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0] hover:border-[#00d4ff] transition-all"
                        >
                          ⬇️
                        </button>
                        {(user.role === "admin" || file.ownerId === user.id) && (
                          <button
                            onClick={() => deleteFile(file)}
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
        )}
      </div>
    </div>
  )
}

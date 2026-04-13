import type { User, FTPFile, ActivityItem } from "./ftp-types"

const USERS_KEY = "ftpvault_users"
const FILES_KEY = "ftpvault_files"
const ACTIVITY_KEY = "ftpvault_activity"

export function getUsers(): User[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(USERS_KEY) || "[]")
}

export function getFiles(): FTPFile[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(FILES_KEY) || "[]")
}

export function getActivity(): ActivityItem[] {
  if (typeof window === "undefined") return []
  return JSON.parse(localStorage.getItem(ACTIVITY_KEY) || "[]")
}

export function saveUsers(users: User[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(USERS_KEY, JSON.stringify(users))
}

export function saveFiles(files: FTPFile[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(FILES_KEY, JSON.stringify(files))
}

export function saveActivity(activity: ActivityItem[]): void {
  if (typeof window === "undefined") return
  localStorage.setItem(ACTIVITY_KEY, JSON.stringify(activity))
}

export function getFileIcon(name: string, type: string): string {
  if (type === "folder") return "📁"
  const ext = name.split(".").pop()?.toLowerCase() || ""
  const icons: Record<string, string> = {
    pdf: "📄",
    doc: "📝",
    docx: "📝",
    txt: "📃",
    xls: "📊",
    xlsx: "📊",
    png: "🖼️",
    jpg: "🖼️",
    jpeg: "🖼️",
    gif: "🖼️",
    svg: "🎨",
    webp: "🖼️",
    mp4: "🎬",
    mov: "🎬",
    avi: "🎬",
    mp3: "🎵",
    wav: "🎵",
    flac: "🎵",
    zip: "🗜️",
    rar: "🗜️",
    tar: "🗜️",
    gz: "🗜️",
    js: "🟨",
    ts: "🔷",
    py: "🐍",
    html: "🌐",
    css: "🎨",
    json: "🔧",
    sh: "⚡",
    exe: "⚙️",
    dmg: "💿",
    iso: "💿",
    csv: "📊",
    sql: "🗄️",
    md: "📝",
    xml: "🔧",
  }
  return icons[ext] || "📄"
}

export function getFileType(name: string, type: string): string {
  if (type === "folder") return "folder"
  const ext = name.split(".").pop()?.toLowerCase() || ""
  const types: Record<string, string> = {
    pdf: "PDF",
    doc: "Word",
    docx: "Word",
    txt: "Text",
    xls: "Excel",
    xlsx: "Excel",
    png: "Image",
    jpg: "Image",
    jpeg: "Image",
    gif: "Image",
    svg: "Image",
    webp: "Image",
    mp4: "Video",
    mov: "Video",
    mp3: "Audio",
    wav: "Audio",
    zip: "Archive",
    rar: "Archive",
    tar: "Archive",
    gz: "Archive",
    js: "JavaScript",
    ts: "TypeScript",
    py: "Python",
    html: "HTML",
    css: "CSS",
    json: "JSON",
    csv: "CSV",
    sql: "SQL",
  }
  return types[ext] || ext.toUpperCase() || "File"
}

export function formatSize(bytes: number): string {
  if (bytes === 0) return "—"
  const k = 1024
  const sizes = ["B", "KB", "MB", "GB"]
  const i = Math.floor(Math.log(bytes) / Math.log(k))
  return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + " " + sizes[i]
}

export function formatDate(iso: string): string {
  const d = new Date(iso)
  return (
    d.toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    }) +
    " " +
    d.toLocaleTimeString("en-US", { hour: "2-digit", minute: "2-digit" })
  )
}

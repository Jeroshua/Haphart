export interface User {
  id: string
  name: string
  username: string
  email: string
  password: string
  role: "admin" | "user"
  quota: string
  status: "active" | "suspended"
  joined: string
}

export interface FTPFile {
  id: string
  name: string
  size: number
  type: "file" | "folder"
  ownerId: string
  ownerName: string
  uploaded: string
}

export interface ActivityItem {
  msg: string
  type: string
  color: string
  time: string
}

export interface Notification {
  id: string
  msg: string
  type: "success" | "error" | "info"
}

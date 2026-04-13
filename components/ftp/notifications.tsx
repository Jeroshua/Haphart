"use client"

import type { Notification } from "@/lib/ftp-types"

interface NotificationContainerProps {
  notifications: Notification[]
}

export function NotificationContainer({ notifications }: NotificationContainerProps) {
  const icons = {
    success: "✅",
    error: "❌",
    info: "ℹ️",
  }

  const styles = {
    success: "bg-[#0a2e1d] border border-[#00ff88] text-[#00ff88]",
    error: "bg-[#2e0a10] border border-[#ff4757] text-[#ff4757]",
    info: "bg-[#0a1e2e] border border-[#00d4ff] text-[#00d4ff]",
  }

  return (
    <div className="fixed bottom-6 right-6 z-[9999] flex flex-col gap-2 pointer-events-none">
      {notifications.map((notif) => (
        <div
          key={notif.id}
          className={`flex items-center gap-2.5 px-4 py-3.5 rounded-[10px] text-[13px] font-medium pointer-events-auto animate-notif-in max-w-[320px] shadow-[0_8px_24px_rgba(0,0,0,0.4)] ${styles[notif.type]}`}
        >
          <span>{icons[notif.type]}</span>
          <span>{notif.msg}</span>
        </div>
      ))}
    </div>
  )
}

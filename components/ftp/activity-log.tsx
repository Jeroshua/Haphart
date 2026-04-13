"use client"

import { useState, useEffect, useCallback } from "react"
import type { ActivityItem } from "@/lib/ftp-types"
import { getActivity, saveActivity, formatDate } from "@/lib/ftp-storage"

interface ActivityLogProps {
  notify: (msg: string, type: "success" | "error" | "info") => void
}

export function ActivityLog({ notify }: ActivityLogProps) {
  const [activity, setActivity] = useState<ActivityItem[]>([])

  const loadActivity = useCallback(() => {
    setActivity(getActivity())
  }, [])

  useEffect(() => {
    loadActivity()
  }, [loadActivity])

  const clearActivity = () => {
    if (!confirm("Clear all activity logs?")) return
    saveActivity([])
    loadActivity()
    notify("Activity log cleared", "info")
  }

  const getColorClass = (color: string) => {
    if (color.includes("green")) return "bg-[#00ff88]"
    if (color.includes("red")) return "bg-[#ff4757]"
    if (color.includes("yellow")) return "bg-[#ffd32a]"
    return "bg-[#00d4ff]"
  }

  return (
    <div className="bg-[#0f172a] border border-[#1e293b] rounded-xl overflow-hidden">
      <div className="px-6 py-5 border-b border-[#1e293b] flex items-center justify-between">
        <div className="font-sans font-bold text-[15px]">📋 Activity Log</div>
        <button
          onClick={clearActivity}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-md font-mono text-xs font-medium cursor-pointer border border-[#2d3a50] bg-transparent text-[#94a3b8] hover:bg-[#111827] hover:text-[#e2e8f0] hover:border-[#00d4ff] transition-all"
        >
          Clear
        </button>
      </div>

      {activity.length === 0 ? (
        <div className="py-15 px-8 text-center text-[#475569]">
          <div className="text-[40px] mb-3">📭</div>
          <div className="text-sm">No activity yet</div>
        </div>
      ) : (
        <div>
          {activity.map((item, i) => (
            <div
              key={i}
              className="flex items-start gap-3.5 px-6 py-3.5 border-b border-[#1e293b] last:border-b-0 text-[13px]"
            >
              <div
                className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${getColorClass(item.color)}`}
              />
              <div className="flex-1">
                <div className="text-[#e2e8f0] mb-0.5">{item.msg}</div>
                <div className="text-[11px] text-[#475569]">{formatDate(item.time)}</div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

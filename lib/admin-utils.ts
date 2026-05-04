'use client'

import { createClient } from '@/lib/supabase/client'

export async function getAllUsers() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('profiles')
    .select('*')
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching users:', error)
    return []
  }

  return data || []
}

export async function getAllFiles() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('files')
    .select(`
      *,
      profiles:user_id(username, display_name)
    `)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching files:', error)
    return []
  }

  return data || []
}

export async function getAllActivityLogs() {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('activity_logs')
    .select(`
      *,
      profiles:user_id(username, display_name)
    `)
    .order('created_at', { ascending: false })
    .limit(500)

  if (error) {
    console.error('Error fetching activity logs:', error)
    return []
  }

  return data || []
}

export async function getUserStatistics() {
  const supabase = createClient()

  const [usersRes, filesRes, logsRes] = await Promise.all([
    supabase.from('profiles').select('id', { count: 'exact' }),
    supabase.from('files').select('id', { count: 'exact' }),
    supabase.from('activity_logs').select('id', { count: 'exact' }),
  ])

  return {
    totalUsers: usersRes.count || 0,
    totalFiles: filesRes.count || 0,
    totalActivities: logsRes.count || 0,
  }
}

export async function deleteUser(userId: string) {
  const supabase = createClient()

  // Delete user's files first
  await supabase.from('files').delete().eq('user_id', userId)

  // Delete user's activity logs
  await supabase.from('activity_logs').delete().eq('user_id', userId)

  // Delete user profile
  const { error } = await supabase
    .from('profiles')
    .delete()
    .eq('id', userId)

  if (error) {
    console.error('Error deleting user:', error)
    return false
  }

  return true
}

export async function deleteFile(fileId: string) {
  const supabase = createClient()
  const { error } = await supabase.from('files').delete().eq('id', fileId)

  if (error) {
    console.error('Error deleting file:', error)
    return false
  }

  return true
}

export async function updateUserAdmin(userId: string, isAdmin: boolean) {
  const supabase = createClient()
  const { error } = await supabase
    .from('profiles')
    .update({ is_admin: isAdmin })
    .eq('id', userId)

  if (error) {
    console.error('Error updating user admin status:', error)
    return false
  }

  return true
}

export async function getUserFileCount(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('files')
    .select('id')
    .eq('user_id', userId)

  if (error) return 0
  return data?.length || 0
}

export async function getUserStorageUsage(userId: string) {
  const supabase = createClient()
  const { data, error } = await supabase
    .from('files')
    .select('size_bytes')
    .eq('user_id', userId)

  if (error) return 0

  return data?.reduce((sum, file) => sum + (file.size_bytes || 0), 0) || 0
}

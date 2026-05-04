import { createClient } from '@/lib/supabase/client'

export async function logActivity(
  action: string,
  fileId?: string,
  details?: Record<string, any>
) {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return

    const { error } = await supabase.from('activity_logs').insert({
      user_id: user.id,
      action,
      file_id: fileId,
      details: details || {},
    })

    if (error) console.error('Failed to log activity:', error)
  } catch (error) {
    console.error('Error logging activity:', error)
  }
}

export async function uploadFile(
  file: File,
  fileName: string
): Promise<{ id: string; name: string; size_bytes: number } | null> {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) throw new Error('Not authenticated')

    // Store file metadata in database
    const { data, error } = await supabase
      .from('files')
      .insert({
        user_id: user.id,
        name: fileName,
        size_bytes: file.size,
        mime_type: file.type,
        storage_path: `${user.id}/${Date.now()}-${fileName}`,
      })
      .select()
      .single()

    if (error) throw error

    await logActivity('upload', data.id, {
      file_name: fileName,
      file_size: file.size,
    })

    return data
  } catch (error) {
    console.error('Failed to upload file:', error)
    return null
  }
}

export async function deleteFile(fileId: string): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('files')
      .delete()
      .eq('id', fileId)

    if (error) throw error

    await logActivity('delete', fileId, { action: 'file_deleted' })

    return true
  } catch (error) {
    console.error('Failed to delete file:', error)
    return false
  }
}

export async function shareFile(
  fileId: string,
  userId: string,
  permission: 'view' | 'download' | 'edit' | 'delete' = 'view'
): Promise<boolean> {
  try {
    const supabase = createClient()

    const { error } = await supabase
      .from('file_shares')
      .insert({
        file_id: fileId,
        shared_with_user_id: userId,
        permission,
      })

    if (error) throw error

    await logActivity('share', fileId, {
      shared_with: userId,
      permission,
    })

    return true
  } catch (error) {
    console.error('Failed to share file:', error)
    return false
  }
}

export async function getUserFiles() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('files')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Failed to fetch files:', error)
    return []
  }
}

export async function getUserProfile() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return null

    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', user.id)
      .single()

    if (error) throw error

    return data
  } catch (error) {
    console.error('Failed to fetch profile:', error)
    return null
  }
}

export async function getActivityLogs() {
  try {
    const supabase = createClient()
    const {
      data: { user },
    } = await supabase.auth.getUser()

    if (!user) return []

    const { data, error } = await supabase
      .from('activity_logs')
      .select('*')
      .eq('user_id', user.id)
      .order('created_at', { ascending: false })
      .limit(50)

    if (error) throw error

    return data || []
  } catch (error) {
    console.error('Failed to fetch activity logs:', error)
    return []
  }
}

import { createClient } from '@/lib/supabase/server'
import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const { userId } = await request.json()

    if (!userId) {
      return NextResponse.json(
        { error: 'User ID is required' },
        { status: 400 }
      )
    }

    const supabase = await createClient()

    // Use admin API to confirm the email
    const { error } = await supabase.auth.admin.updateUserById(userId, {
      email_confirm: true,
    })

    if (error) {
      console.error('Error confirming email:', error)
      return NextResponse.json(
        { error: 'Failed to confirm email' },
        { status: 500 }
      )
    }

    return NextResponse.json({ success: true })
  } catch (error: any) {
    console.error('API error:', error)
    return NextResponse.json(
      { error: error.message || 'Internal server error' },
      { status: 500 }
    )
  }
}

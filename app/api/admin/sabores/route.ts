import { NextResponse } from 'next/server'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'

async function assertAdmin(req: Request) {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL
  const anon = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY
  if (!url || !anon) throw new Error('Supabase envs missing')
  const authHeader = req.headers.get('authorization') || ''
  const token = authHeader.startsWith('Bearer ') ? authHeader.slice(7) : null
  if (!token) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const supabaseAuth = createClient<Database>(url, anon)
  const { data, error } = await supabaseAuth.auth.getUser(token)
  if (error || !data.user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const allowed = (process.env.ADMIN_EMAILS || '').split(',').map(s => s.trim().toLowerCase()).filter(Boolean)
  if (allowed.length && !allowed.includes((data.user.email || '').toLowerCase())) {
    return NextResponse.json({ error: 'Forbidden' }, { status: 403 })
  }
  return null
}

export async function GET(req: Request) {
  const guard = await assertAdmin(req)
  if (guard) return guard
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('sabores')
      .select('*')
      .order('descripcion')

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}



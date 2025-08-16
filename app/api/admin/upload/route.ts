import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

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

export async function POST(req: Request) {
  const guard = await assertAdmin(req)
  if (guard) return guard
  try {
    const form = await req.formData()
    const file = form.get('file') as File | null
    const rawPath = (form.get('path') as string | null) || undefined
    const bodyBucket = (form.get('bucket') as string | null) || undefined

    if (!file) throw new Error('file requerido')
    const supabase = getSupabaseAdmin()

    // Bucket
    let bucket: string | undefined = bodyBucket || process.env.SUPABASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'products'

    // Path
    const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
    const path = rawPath || `uploads/${Date.now()}_${safeName}`

    // Subir
    const arrayBuffer = await file.arrayBuffer()
    const chosenBucket = bucket as string
    const { data, error } = await supabase.storage
      .from(chosenBucket)
      .upload(path, Buffer.from(arrayBuffer), { upsert: true, contentType: file.type || 'application/octet-stream' })
    if (error) throw error

    // Public URL
    const { data: pub } = supabase.storage.from(chosenBucket).getPublicUrl(path)
    return NextResponse.json({ bucket: chosenBucket, path, publicUrl: pub.publicUrl })
  } catch (e: any) {
    console.error('upload error:', e)
    return NextResponse.json({ error: e.message || 'Bad Request' }, { status: 400 })
  }
}



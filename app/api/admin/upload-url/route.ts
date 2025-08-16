import { NextResponse } from 'next/server'
import { createClient } from '@supabase/supabase-js'
import type { Database } from '@/types/database'
import { getSupabaseAdmin } from '@/lib/supabaseAdmin'

// Genera una URL firmada para subir un archivo directamente al bucket (signed upload URL)
// Requiere: BUCKET_NAME en env o en body

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
    const { path, bucket: bodyBucket } = await req.json()
    const supabase = getSupabaseAdmin()
    let bucket = bodyBucket || process.env.SUPABASE_STORAGE_BUCKET || process.env.NEXT_PUBLIC_SUPABASE_BUCKET || 'products'
    const url = process.env.NEXT_PUBLIC_SUPABASE_URL
    if (!bucket) {
      const { data: buckets, error: lbErr } = await (supabase.storage as any).listBuckets?.()
      if (lbErr) throw lbErr
      if (Array.isArray(buckets) && buckets.length > 0) {
        bucket = buckets[0].name
      } else {
        throw new Error('No hay buckets en Storage. Crea uno en Supabase o define SUPABASE_STORAGE_BUCKET')
      }
    }
    if (!path) throw new Error('path requerido')

    const { data, error } = await supabase.storage
      .from(bucket)
      .createSignedUploadUrl(path, { upsert: true })

    if (error) throw error
    const publicUrl = url ? `${url}/storage/v1/object/public/${bucket}/${path}` : undefined
    return NextResponse.json({ data: { ...data, bucket, publicUrl } })
  } catch (e: any) {
    console.error('upload-url error:', e)
    return NextResponse.json({ error: e.message || 'Bad Request' }, { status: 400 })
  }
}



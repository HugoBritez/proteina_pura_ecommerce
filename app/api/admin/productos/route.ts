import { NextResponse } from 'next/server'
import { z } from 'zod'
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

const schema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional().nullable(),
  precio: z.number().min(0),
  categoria: z.number().int(),
  isActivo: z.boolean().default(true),
  isOferta: z.boolean().default(false),
  cantidad_stock: z.number().int().min(0),
  sabores: z.array(z.number().int()).optional().nullable(),
  url_imagen: z.string().url().optional().default(''),
  galeria_urls: z.array(z.string().url()).optional().nullable(),
})

const updateSchema = schema.partial().extend({ id: z.number().int() })

export async function GET(req: Request) {
  const guard = await assertAdmin(req)
  if (guard) return guard
  try {
    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('productos')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 500 })
  }
}

export async function POST(req: Request) {
  const guard = await assertAdmin(req)
  if (guard) return guard
  try {
    const json = await req.json()
    const parsed = schema.parse(json)

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('productos')
      .insert({
        nombre: parsed.nombre,
        descripcion: parsed.descripcion ?? null,
        precio: parsed.precio,
        categoria: parsed.categoria,
        isActivo: parsed.isActivo,
        isOferta: parsed.isOferta,
        cantidad_stock: parsed.cantidad_stock,
        sabores: parsed.sabores && parsed.sabores.length ? parsed.sabores : null,
        url_imagen: parsed.url_imagen ?? '',
        galeria_urls: parsed.galeria_urls ?? null,
      })
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ data }, { status: 201 })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function PATCH(req: Request) {
  const guard = await assertAdmin(req)
  if (guard) return guard
  try {
    const json = await req.json()
    const parsed = updateSchema.parse(json)
    const { id, ...rest } = parsed

    const supabase = getSupabaseAdmin()
    const { data, error } = await supabase
      .from('productos')
      .update({
        ...rest,
        descripcion: rest.descripcion ?? null,
        sabores: rest.sabores && rest.sabores.length ? rest.sabores : null,
        galeria_urls: rest.galeria_urls ?? null,
      })
      .eq('id', id)
      .select('*')
      .single()

    if (error) throw error
    return NextResponse.json({ data })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}

export async function DELETE(req: Request) {
  const guard = await assertAdmin(req)
  if (guard) return guard
  try {
    const { id } = await req.json()
    if (!id) throw new Error('id requerido')
    const supabase = getSupabaseAdmin()
    const { error } = await supabase.from('productos').delete().eq('id', id)
    if (error) throw error
    return NextResponse.json({ ok: true })
  } catch (e: any) {
    return NextResponse.json({ error: e.message }, { status: 400 })
  }
}



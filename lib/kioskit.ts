import type { KioskitProduct, KioskitCategory } from '@/types/kioskit'

const API_URL = process.env.NEXT_PUBLIC_KIOSKIT_API_URL!
const SLUG = process.env.NEXT_PUBLIC_KIOSKIT_TENANT_SLUG!

// Simple in-memory cache to avoid refetching on back navigation
const cache = new Map<string, { data: unknown; ts: number }>()
const CACHE_TTL = 5 * 60 * 1000 // 5 minutes

async function apiFetch<T>(path: string): Promise<T> {
  const cached = cache.get(path)
  if (cached && Date.now() - cached.ts < CACHE_TTL) {
    return cached.data as T
  }
  const res = await fetch(`${API_URL}${path}`, { next: { revalidate: 60 } })
  if (!res.ok) throw new Error(`Kioskit API error: ${res.status} ${path}`)
  const data = await res.json() as T
  cache.set(path, { data, ts: Date.now() })
  return data
}

export async function getProductos(): Promise<KioskitProduct[]> {
  try {
    return await apiFetch<KioskitProduct[]>(`/public/${SLUG}/products`)
  } catch (e) {
    console.error('getProductos error:', e)
    return []
  }
}

export async function getProductosPorCategoria(categoryId: string): Promise<KioskitProduct[]> {
  try {
    return await apiFetch<KioskitProduct[]>(`/public/${SLUG}/products?category_id=${categoryId}`)
  } catch (e) {
    console.error('getProductosPorCategoria error:', e)
    return []
  }
}

export async function getCategorias(): Promise<KioskitCategory[]> {
  try {
    return await apiFetch<KioskitCategory[]>(`/public/${SLUG}/categories`)
  } catch (e) {
    console.error('getCategorias error:', e)
    return []
  }
}

/** Returns first 6 available products (replaces isOferta logic) */
export async function getProductosDestacados(): Promise<KioskitProduct[]> {
  const all = await getProductos()
  return all.slice(0, 6)
}

export async function getProductoById(id: string): Promise<KioskitProduct | null> {
  const all = await getProductos()
  return all.find(p => p.id === id) ?? null
}

/** Client-side search over name + description */
export function buscarProductos(query: string, products: KioskitProduct[]): KioskitProduct[] {
  const q = query.toLowerCase()
  return products.filter(
    (p) =>
      p.name.toLowerCase().includes(q) ||
      (p.description ?? '').toLowerCase().includes(q)
  )
}

export interface CreateOrderData {
  customer_data: {
    name: string
    phone: string
    document_number?: string
    address?: string
  }
  items: { variant_id: string; quantity: number }[]
  payment_method: string
  delivery_address?: string
  delivery_notes?: string
  notes?: string
}

export interface OrderConfirmation {
  order_id: string
  order_number: string
  total: number
  status: string
}

export async function createOrder(data: CreateOrderData): Promise<OrderConfirmation> {
  const res = await fetch(`${API_URL}/public/${SLUG}/orders`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j?.detail ?? `Order error ${res.status}`)
  }
  return res.json() as Promise<OrderConfirmation>
}

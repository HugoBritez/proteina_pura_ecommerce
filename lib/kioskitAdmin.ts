const API_URL = process.env.NEXT_PUBLIC_KIOSKIT_API_URL!

export const ADMIN_TOKEN_KEY = 'kioskit_admin_token'

function getToken(): string | null {
  if (typeof window === 'undefined') return null
  return sessionStorage.getItem(ADMIN_TOKEN_KEY)
}

async function adminFetch<T>(
  path: string,
  options?: RequestInit
): Promise<T> {
  const token = getToken()
  const res = await fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...(options?.headers as Record<string, string> | undefined),
    },
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j?.detail ?? `API error ${res.status} ${path}`)
  }
  return res.json() as Promise<T>
}

// ── Auth ─────────────────────────────────────────────────────────────────────

export interface LoginResponse {
  access_token: string
  token_type: string
}

export async function adminLogin(email: string, password: string): Promise<LoginResponse> {
  const res = await fetch(`${API_URL}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ email, password }),
  })
  if (!res.ok) {
    const j = await res.json().catch(() => ({}))
    throw new Error(j?.detail ?? 'Credenciales inválidas')
  }
  return res.json() as Promise<LoginResponse>
}

// ── Products ──────────────────────────────────────────────────────────────────

export interface AdminProduct {
  id: string
  name: string
  description: string | null
  category_id: string | null
  brand: string | null
  image_url: string | null
  is_active: boolean
  variants: AdminVariant[]
}

export interface AdminVariant {
  id: string
  sku: string
  attributes: Record<string, string>
  price: number
  cost: number
  stock: number
  min_stock: number
  is_active: boolean
}

export async function getProducts(): Promise<AdminProduct[]> {
  const data = await adminFetch<{ items: AdminProduct[] }>('/products?limit=200')
  return data.items
}

export async function createProduct(body: {
  name: string
  description?: string | null
  category_id?: string | null
  brand?: string | null
  image_url?: string | null
  is_active?: boolean
}): Promise<AdminProduct> {
  return adminFetch<AdminProduct>('/products', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateProduct(
  id: string,
  body: Partial<{
    name: string
    description: string | null
    category_id: string | null
    brand: string | null
    image_url: string | null
    is_active: boolean
  }>
): Promise<AdminProduct> {
  return adminFetch<AdminProduct>(`/products/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteProduct(id: string): Promise<void> {
  await adminFetch<unknown>(`/products/${id}`, { method: 'DELETE' })
}

// ── Variants ─────────────────────────────────────────────────────────────────

export async function createVariant(
  productId: string,
  body: {
    sku: string
    attributes?: Record<string, string>
    price: number
    cost?: number
    stock?: number
    min_stock?: number
    is_active?: boolean
  }
): Promise<AdminVariant> {
  return adminFetch<AdminVariant>(`/products/${productId}/variants`, {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateVariant(
  variantId: string,
  body: Partial<{
    sku: string
    attributes: Record<string, string>
    price: number
    cost: number
    stock: number
    min_stock: number
    is_active: boolean
  }>
): Promise<AdminVariant> {
  return adminFetch<AdminVariant>(`/products/variants/${variantId}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteVariant(variantId: string): Promise<void> {
  await adminFetch<unknown>(`/products/variants/${variantId}`, { method: 'DELETE' })
}

// ── Categories ────────────────────────────────────────────────────────────────

export interface AdminCategory {
  id: string
  name: string
  description: string | null
  parent_id: string | null
}

export async function getCategories(): Promise<AdminCategory[]> {
  const data = await adminFetch<{ items: AdminCategory[] }>('/categories?limit=200')
  return data.items
}

export async function createCategory(body: {
  name: string
  description?: string | null
  parent_id?: string | null
}): Promise<AdminCategory> {
  return adminFetch<AdminCategory>('/categories', {
    method: 'POST',
    body: JSON.stringify(body),
  })
}

export async function updateCategory(
  id: string,
  body: Partial<{ name: string; description: string | null; parent_id: string | null }>
): Promise<AdminCategory> {
  return adminFetch<AdminCategory>(`/categories/${id}`, {
    method: 'PATCH',
    body: JSON.stringify(body),
  })
}

export async function deleteCategory(id: string): Promise<void> {
  await adminFetch<unknown>(`/categories/${id}`, { method: 'DELETE' })
}

// ── Upload ────────────────────────────────────────────────────────────────────

export interface PresignResponse {
  url: string
  public_url: string
  fields?: Record<string, string>
}

export async function getPresignUrl(
  fileName: string,
  contentType: string
): Promise<PresignResponse> {
  return adminFetch<PresignResponse>('/uploads/presign', {
    method: 'POST',
    body: JSON.stringify({ file_name: fileName, content_type: contentType }),
  })
}

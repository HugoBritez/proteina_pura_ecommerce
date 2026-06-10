export interface KioskitVariant {
  id: string
  sku: string
  attributes: Record<string, string>
  price: number
  stock: number
  is_available: boolean
}

export interface KioskitProduct {
  id: string
  name: string
  description: string | null
  category_id: string | null
  category_name: string | null
  brand: string | null
  image_url: string | null
  variants: KioskitVariant[]
}

export interface KioskitCategory {
  id: string
  name: string
  description: string | null
  parent_id: string | null
}

export interface CartItem {
  product: KioskitProduct
  variant: KioskitVariant
  quantity: number
}

// Helpers
export function getProductPrice(product: KioskitProduct): number {
  const available = product.variants.filter((v) => v.is_available)
  if (available.length > 0) return Math.min(...available.map((v) => v.price))
  if (product.variants.length > 0) return product.variants[0].price
  return 0
}

export function getProductStock(product: KioskitProduct): number {
  return product.variants.reduce((sum, v) => sum + v.stock, 0)
}

export function isProductAvailable(product: KioskitProduct): boolean {
  return product.variants.some((v) => v.is_available)
}

export function getVariantLabel(variant: KioskitVariant): string {
  const values = Object.values(variant.attributes).filter(v => !/^#[0-9a-fA-F]/.test(v))
  return values.length > 0 ? values.join(', ') : 'Unidad'
}

import type { KioskitProduct, KioskitVariant, CartItem } from "@/types/kioskit"
import { getProductPrice, isProductAvailable, getVariantLabel } from "@/types/kioskit"
import { Badge } from "./ui/badge"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Plus, Check } from "lucide-react"
import Image from "next/image"
import Link from "next/link"
import { useState } from "react"
import { getProductPlaceholder, LIGHT_BLUR_PLACEHOLDER } from "@/lib/utils/imageUtils"

interface ProductCardProps {
  producto: KioskitProduct
  addToCart: (product: KioskitProduct, variant: KioskitVariant) => void
  getBadgeText: (producto: KioskitProduct) => string | null
  onAddToCart?: (productName: string) => void
  cartItems: CartItem[]
}

export function ProductCard({
  producto,
  addToCart,
  getBadgeText,
  onAddToCart,
  cartItems,
}: ProductCardProps) {
  const variantsWithStock = producto.variants.filter((v) => v.stock > 0)
  const [selectedVariant, setSelectedVariant] = useState<KioskitVariant | null>(
    variantsWithStock.length > 0 ? variantsWithStock[0] : null
  )

  const isOutOfStock = !isProductAvailable(producto) || variantsWithStock.length === 0
  const price = selectedVariant?.price ?? getProductPrice(producto)
  const [added, setAdded] = useState(false)

  const cartQty = selectedVariant
    ? cartItems.find(item => item.variant.id === selectedVariant.id)?.quantity ?? 0
    : 0

  const maxReached = selectedVariant ? cartQty >= selectedVariant.stock : false
  const canAdd = selectedVariant !== null && !maxReached

  const handleAdd = () => {
    if (!selectedVariant) return
    addToCart(producto, selectedVariant)
    onAddToCart?.(producto.name)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <Card className="group border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-lg">
      <CardHeader className="relative p-0">
        <Link href={`/productos/detalle/${producto.id}`} className="block">
          <div className="relative aspect-[3/4] overflow-hidden">
            <Image
              src={producto.image_url || getProductPlaceholder(producto.name, 300, 300)}
              alt={producto.name}
              fill
              loading="lazy"
              placeholder="blur"
              blurDataURL={LIGHT_BLUR_PLACEHOLDER}
              sizes="(max-width: 768px) 50vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-500"
            />
          </div>
        </Link>
        {!isOutOfStock && getBadgeText(producto) && (
          <Badge className="absolute top-2 right-2 text-xs">{getBadgeText(producto)}</Badge>
        )}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <Badge variant="secondary" className="text-sm">Agotado</Badge>
          </div>
        )}
      </CardHeader>

      <CardContent className="p-3 space-y-1.5">
        <Link href={`/productos/detalle/${producto.id}`} className="block">
          <h3 className="font-oswald text-sm font-semibold leading-tight line-clamp-2 hover:text-primary transition-colors">
            {producto.name}
          </h3>
        </Link>

        {isOutOfStock ? (
          <p className="text-xs text-muted-foreground">Producto temporalmente agotado</p>
        ) : (
          <>
            {producto.variants.length > 1 && (
              <div className="flex flex-wrap gap-1.5">
                {producto.variants.map((variant) => {
                  const vCartQty = cartItems.find(item => item.variant.id === variant.id)?.quantity ?? 0
                  const vMaxed = vCartQty >= variant.stock
                  const noStock = variant.stock <= 0 && !vMaxed
                  return (
                    <button
                      key={variant.id}
                      onClick={(e) => { e.preventDefault(); if (!noStock && !vMaxed) setSelectedVariant(variant) }}
                      disabled={noStock || vMaxed}
                      className={`px-2 py-0.5 text-[10px] rounded-full border transition-colors ${
                        noStock || vMaxed
                          ? "border-border text-muted-foreground/40 cursor-not-allowed line-through"
                          : selectedVariant?.id === variant.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary"
                      }`}
                    >
                      {getVariantLabel(variant)}
                    </button>
                  )
                })}
              </div>
            )}
            {cartQty > 0 && (
              <p className="text-[10px] text-muted-foreground">
                {cartQty} en carrito — stock: {selectedVariant?.stock ?? 0}
              </p>
            )}
            <span className="font-anton text-lg text-primary">{formatCurrency(price)}</span>
          </>
        )}
      </CardContent>

      <CardFooter className="p-3 pt-0">
        {isOutOfStock ? (
          <Button disabled size="sm" className="w-full text-xs">
            Agotado
          </Button>
        ) : (
          <Button
            onClick={handleAdd}
            disabled={!canAdd}
            size="sm"
            className={`w-full text-xs transition-colors ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
          >
            {added ? (
              <><Check className="mr-1 h-3.5 w-3.5" />Agregado</>
            ) : maxReached ? (
              'Stock agotado'
            ) : !selectedVariant ? (
              'Sin variantes'
            ) : (
              <><Plus className="mr-1 h-3.5 w-3.5" />Agregar al Carrito</>
            )}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

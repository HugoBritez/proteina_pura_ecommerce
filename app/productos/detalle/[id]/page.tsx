'use client'

import { useState, useEffect } from 'react'
import { useParams, notFound } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getProductoById } from '@/lib/kioskit'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCart } from '@/hooks/useCart'
import type { KioskitProduct, KioskitVariant } from '@/types/kioskit'
import { isProductAvailable, getVariantLabel } from '@/types/kioskit'
import { getProductPlaceholder, LIGHT_BLUR_PLACEHOLDER } from '@/lib/utils/imageUtils'
import { ArrowLeft, Plus, Check, MessageCircle, Truck, Shield } from 'lucide-react'
import { empresa } from '@/lib/consts/empresa.data'

export default function ProductDetailPage() {
  const [producto, setProducto] = useState<KioskitProduct | null>(null)
  const [loading, setLoading] = useState(true)
  const [selectedVariant, setSelectedVariant] = useState<KioskitVariant | null>(null)
  const [added, setAdded] = useState(false)
  const { addToCart, getCartItemsCount, cart } = useCart()
  const params = useParams<{ id: string }>()

  useEffect(() => {
    getProductoById(params.id)
      .then(p => {
        if (!p) { notFound(); return }
        setProducto(p)
        const withStock = p.variants.filter(v => v.stock > 0)
        if (withStock.length > 0) setSelectedVariant(withStock[0])
        else if (p.variants.length > 0) setSelectedVariant(p.variants[0])
      })
      .catch(() => notFound())
      .finally(() => setLoading(false))
  }, [params.id])

  if (loading) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartItems={getCartItemsCount()} />
        <div className="flex items-center justify-center py-40">
          <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-primary"></div>
        </div>
        <Footer />
      </div>
    )
  }

  if (!producto || !selectedVariant) return notFound()

  const outOfStock = !isProductAvailable(producto) || producto.variants.every(v => v.stock <= 0)

  const cartQty = selectedVariant
    ? cart.find(item => item.variant.id === selectedVariant.id)?.quantity ?? 0
    : 0

  const maxReached = selectedVariant ? cartQty >= selectedVariant.stock : false
  const canAdd = selectedVariant && selectedVariant.stock > 0 && !maxReached

  const handleAdd = () => {
    if (!canAdd || !selectedVariant) return
    addToCart(producto, selectedVariant)
    setAdded(true)
    setTimeout(() => setAdded(false), 1500)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />

      <div className="container mx-auto px-4 py-8">
        <Link href="/productos" className="inline-flex items-center gap-1 text-sm text-muted-foreground hover:text-primary transition-colors mb-6">
          <ArrowLeft className="h-4 w-4" />Volver a productos
        </Link>

        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12">
          {/* Image */}
          <div className="relative aspect-square lg:aspect-[4/5] rounded-2xl overflow-hidden bg-muted max-h-[500px] lg:max-h-[600px]">
            <Image
              src={producto.image_url || getProductPlaceholder(producto.name, 600, 800)}
              alt={producto.name}
              fill
              priority
              placeholder="blur"
              blurDataURL={LIGHT_BLUR_PLACEHOLDER}
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            {outOfStock && (
              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                <Badge variant="secondary" className="text-lg px-4 py-2">Agotado</Badge>
              </div>
            )}
          </div>

          {/* Info */}
          <div className="space-y-6">
            <div className="space-y-2">
              {producto.category_name && (
                <Link
                  href={`/productos/${encodeURIComponent(producto.category_name)}`}
                  className="text-sm text-primary font-oswald uppercase tracking-wider hover:underline"
                >
                  {producto.category_name}
                </Link>
              )}
              <h1 className="font-anton text-3xl lg:text-4xl text-foreground">{producto.name}</h1>
              {producto.description && (
                <p className="text-muted-foreground font-roboto leading-relaxed">{producto.description}</p>
              )}
            </div>

            <div className="flex items-baseline gap-2">
              <span className="font-anton text-3xl text-primary">{formatCurrency(selectedVariant.price)}</span>
              {producto.variants.length > 1 && (
                <Badge variant="outline" className="text-xs">{getVariantLabel(selectedVariant)}</Badge>
              )}
            </div>

            {cartQty > 0 && (
              <p className="text-sm text-muted-foreground font-roboto">
                {cartQty} {cartQty === 1 ? 'unidad' : 'unidades'} en tu carrito — stock disponible: {selectedVariant.stock}
              </p>
            )}

            {/* Variants */}
            {producto.variants.length > 1 && (
              <div className="space-y-2">
                <p className="text-sm font-medium text-foreground font-oswald">Variantes:</p>
                <div className="flex flex-wrap gap-2">
                  {producto.variants.map((variant) => (
                    <button
                      key={variant.id}
                      onClick={() => setSelectedVariant(variant)}
                      disabled={variant.stock <= 0}
                      className={`px-3 py-1.5 text-sm rounded-full border transition-colors ${
                        variant.stock <= 0
                          ? "border-border text-muted-foreground/50 cursor-not-allowed line-through"
                          : selectedVariant.id === variant.id
                            ? "bg-primary text-primary-foreground border-primary"
                            : "bg-background text-muted-foreground border-border hover:border-primary"
                      }`}
                    >
                      {getVariantLabel(variant)}
                    </button>
                  ))}
                </div>
              </div>
            )}

            {/* Add to cart */}
            <Button
              size="lg"
              disabled={!canAdd}
              className={`w-full sm:w-auto px-10 transition-colors ${added ? 'bg-green-600 hover:bg-green-700' : ''}`}
              onClick={handleAdd}
            >
              {added ? (
                <><Check className="mr-2 h-5 w-5" />Agregado</>
              ) : outOfStock ? (
                'Agotado'
              ) : maxReached ? (
                'Stock agotado en carrito'
              ) : (
                <><Plus className="mr-2 h-5 w-5" />Agregar al Carrito</>
              )}
            </Button>

            {/* Trust signals */}
            <div className="border-t pt-6 space-y-3">
              {[
                { icon: Truck, text: "Envío en 24-48hs a todo Paraguay" },
                { icon: Shield, text: "Autenticidad garantizada" },
                { icon: MessageCircle, text: "Asesoría nutricional por WhatsApp" },
              ].map(({ icon: Icon, text }, i) => (
                <div key={i} className="flex items-center gap-3 text-sm text-muted-foreground font-roboto">
                  <Icon className="h-4 w-4 text-primary flex-shrink-0" />
                  <span>{text}</span>
                </div>
              ))}
            </div>

            {/* WhatsApp CTA */}
            <Button variant="outline" className="w-full sm:w-auto border-green-500 text-green-600 hover:bg-green-50" asChild>
              <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank">
                <MessageCircle className="mr-2 h-5 w-5" />Consultar por WhatsApp
              </Link>
            </Button>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

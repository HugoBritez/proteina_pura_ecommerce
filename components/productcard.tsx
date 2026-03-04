import type { KioskitProduct, KioskitVariant } from "@/types/kioskit"
import { getProductPrice, isProductAvailable, getVariantLabel } from "@/types/kioskit"
import { Badge } from "./ui/badge"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card"
import { Button } from "./ui/button"
import { Plus } from "lucide-react"
import Image from "next/image"
import { useState } from "react"
import { getProductPlaceholder, LIGHT_BLUR_PLACEHOLDER } from "@/lib/utils/imageUtils"

interface ProductCardProps {
  producto: KioskitProduct
  addToCart: (product: KioskitProduct, variant: KioskitVariant) => void
  getBadgeText: (producto: KioskitProduct) => string | null
  onAddToCart?: (productName: string) => void
}

export function ProductCard({
  producto,
  addToCart,
  getBadgeText,
  onAddToCart,
}: ProductCardProps) {
  const availableVariants = producto.variants.filter((v) => v.is_available)
  const [selectedVariant, setSelectedVariant] = useState<KioskitVariant | null>(
    availableVariants.length > 0 ? availableVariants[0] : null
  )

  const isOutOfStock = !isProductAvailable(producto)
  const price = selectedVariant?.price ?? getProductPrice(producto)

  return (
    <Card
      className={`group transition-all duration-300 border shadow-lg pt-4 ${
        isOutOfStock
          ? "opacity-60 bg-gray-50 border-gray-300"
          : "hover:shadow-xl border-gray-200"
      }`}
    >
      <CardHeader className="relative p-0">
        <div className="relative overflow-hidden rounded-t-lg">
          <Image
            src={producto.image_url || getProductPlaceholder(producto.name, 300, 300)}
            alt={producto.name}
            width={300}
            height={300}
            loading="lazy"
            placeholder="blur"
            blurDataURL={LIGHT_BLUR_PLACEHOLDER}
            sizes="(max-width: 768px) 50vw, (max-width: 1200px) 33vw, 25vw"
            className={`w-full h-64 object-contain transition-transform duration-300 rounded-md ${
              isOutOfStock ? "grayscale" : "group-hover:scale-105"
            }`}
          />
          {!isOutOfStock && getBadgeText(producto) && (
            <Badge className="absolute top-4 left-4 bg-red-600 text-white">
              {getBadgeText(producto)}
            </Badge>
          )}
          {isOutOfStock && (
            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
              <Badge variant="secondary" className="bg-gray-800 text-white text-lg px-4 py-2">
                AGOTADO
              </Badge>
            </div>
          )}
        </div>
      </CardHeader>

      <CardContent className="p-6 space-y-4">
        <div className="space-y-2">
          <h3 className={`font-oswald text-xl font-bold ${isOutOfStock ? "text-gray-500" : "text-gray-900"}`}>
            {producto.name}
          </h3>

          {isOutOfStock ? (
            <div className="py-4 text-center">
              <p className="text-lg font-medium text-gray-500 mb-2">Producto temporalmente agotado</p>
              <p className="text-sm text-gray-400">Contáctanos para consultar disponibilidad</p>
            </div>
          ) : (
            <>
              {availableVariants.length > 0 ? (
                <div className="space-y-2">
                  <p className="text-sm font-medium text-gray-700">Variantes disponibles:</p>
                  <div className="flex flex-wrap gap-2">
                    {availableVariants.map((variant) => (
                      <button
                        key={variant.id}
                        onClick={() => setSelectedVariant(variant)}
                        className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                          selectedVariant?.id === variant.id
                            ? "bg-red-600 text-white border-red-600 shadow-md"
                            : "bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-600 hover:shadow-sm"
                        }`}
                      >
                        {getVariantLabel(variant)}
                      </button>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="text-sm text-gray-500">
                  <span className="text-green-600">✓</span> Producto sin variantes
                </div>
              )}
            </>
          )}
        </div>

        {!isOutOfStock && (
          <>
            <hr className="border-gray-100" />
            <div className="flex items-center gap-2">
              <span className="font-anton text-2xl font-semi text-red-600">
                {formatCurrency(price)}
              </span>
              {selectedVariant && (
                <Badge variant="outline" className="text-xs">
                  {getVariantLabel(selectedVariant)}
                </Badge>
              )}
            </div>
          </>
        )}
      </CardContent>

      <CardFooter className="p-6 pt-0">
        {isOutOfStock ? (
          <Button disabled className="w-full bg-gray-400 text-gray-600 cursor-not-allowed">
            Producto Agotado
          </Button>
        ) : (
          <Button
            onClick={() => {
              if (!selectedVariant) return
              addToCart(producto, selectedVariant)
              onAddToCart?.(producto.name)
            }}
            disabled={!selectedVariant}
            className="w-full bg-gradient-to-r disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
          >
            <Plus className="mr-2 h-4 w-4" />
            {!selectedVariant ? "Selecciona una variante" : "Agregar al carrito"}
          </Button>
        )}
      </CardFooter>
    </Card>
  )
}

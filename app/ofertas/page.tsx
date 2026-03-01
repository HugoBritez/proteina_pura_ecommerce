"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Plus, Clock, Percent } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductosDestacados } from "@/lib/kioskit"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { useCart } from "@/hooks/useCart"
import { getProductPrice, isProductAvailable } from "@/types/kioskit"
import type { KioskitProduct } from "@/types/kioskit"

export default function OfertasPage() {
  const [productos, setProductos] = useState<KioskitProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, getCartItemsCount } = useCart()

  useEffect(() => {
    getProductosDestacados()
      .then(setProductos)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />

      <section className="relative py-16 lg:py-24 bg-gradient-to-br from-red-600 to-red-700">
        <div className="absolute inset-0 bg-black/20"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="text-center space-y-6">
            <Badge className="bg-white/20 text-white border-white/30 font-medium backdrop-blur-sm text-lg px-6 py-2">
              <Percent className="mr-2 h-5 w-5" />Ofertas Especiales
            </Badge>
            <h1 className="font-anton text-4xl lg:text-6xl font-bold text-white leading-tight">
              PRODUCTOS<span className="block text-yellow-300">DESTACADOS</span>
            </h1>
            <p className="text-xl text-red-100 font-roboto max-w-2xl mx-auto">
              Descuentos exclusivos en los mejores productos para tu rendimiento deportivo.
            </p>
            <div className="flex items-center justify-center gap-2 text-yellow-300">
              <Clock className="h-5 w-5" />
              <span className="font-medium">¡Selección especial para vos!</span>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16">
        <div className="container mx-auto px-4">
          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {[1, 2, 3, 4, 5, 6].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="p-0"><div className="h-48 bg-gray-200 rounded-t-lg"></div></CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : productos.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {productos.map((producto) => {
                const available = isProductAvailable(producto)
                const price = getProductPrice(producto)
                const firstVariant = producto.variants.find(v => v.is_available) ?? producto.variants[0]
                return (
                  <Card key={producto.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="relative p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={producto.image_url || "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(producto.name)}
                          alt={producto.name}
                          width={300}
                          height={300}
                          className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        <Badge className="absolute top-3 left-3 bg-red-600 text-white text-sm font-bold">PREMIUM</Badge>
                        {!available && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="bg-gray-800 text-white">Agotado</Badge>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    <CardContent className="p-4 space-y-3">
                      <div className="space-y-2">
                        <h3 className="font-anton text-lg font-bold text-gray-900 line-clamp-2">{producto.name}</h3>
                        <p className="text-gray-600 font-roboto text-sm line-clamp-2">{producto.description}</p>
                      </div>
                      <div className="flex items-center gap-3">
                        <span className="font-anton text-2xl font-bold text-red-600">{formatCurrency(price)}</span>
                      </div>
                    </CardContent>
                    <CardFooter className="p-4 pt-0">
                      <Button
                        onClick={() => { if (firstVariant) addToCart(producto, firstVariant) }}
                        disabled={!available}
                        className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium disabled:opacity-50 disabled:cursor-not-allowed"
                      >
                        <Plus className="mr-2 h-4 w-4" />{available ? "Agregar al Carrito" : "Agotado"}
                      </Button>
                    </CardFooter>
                  </Card>
                )
              })}
            </div>
          ) : (
            <div className="text-center py-16">
              <div className="max-w-md mx-auto space-y-4">
                <div className="text-6xl">🎯</div>
                <h3 className="font-anton text-2xl font-bold text-gray-900">No hay productos disponibles</h3>
                <p className="text-gray-600 font-roboto">¡Pronto tendremos nuevas promociones increíbles!</p>
                <Link href="/productos"><Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">Ver Todos los Productos</Button></Link>
              </div>
            </div>
          )}
        </div>
      </section>

      {productos.length > 0 && (
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <div className="max-w-4xl mx-auto text-center space-y-6">
              <h2 className="font-anton text-3xl lg:text-4xl font-bold text-gray-900">¿Necesitas Asesoría?</h2>
              <p className="text-lg text-gray-600 font-roboto">Nuestros expertos en nutrición deportiva te ayudan a elegir los mejores productos para tus objetivos específicos.</p>
              <Link href="/contacto"><Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-8 py-4">Obtener Asesoría Gratis</Button></Link>
            </div>
          </div>
        </section>
      )}

      <Footer />
    </div>
  )
}

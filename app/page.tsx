"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Truck, Shield, Award, Users, ArrowRight, Plus } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductosDestacados } from "@/lib/products"
import { useCart } from "@/hooks/useCart"
import type { ProductoConDetalles } from "@/types/database"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from "@/components/ui/carousel"

const benefits = [
  {
    icon: Shield,
    title: "Calidad Garantizada",
    description: "Productos certificados y probados en laboratorio",
  },
  {
    icon: Truck,
    title: "Envío Gratis",
    description: "En pedidos superiores a $50.000",
  },
  {
    icon: Award,
    title: "Mejor Precio",
    description: "Garantía de mejor precio del mercado",
  },
  {
    icon: Users,
    title: "Soporte 24/7",
    description: "Asesoría nutricional especializada",
  },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductoConDetalles[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, getCartItemsCount } = useCart()

  useEffect(() => {
    async function loadFeaturedProducts() {
      try {
        const productos = await getProductosDestacados()
        setFeaturedProducts(productos)
      } catch (error) {
        console.error('Error loading featured products:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedProducts()
  }, [])

  const getBadgeText = (producto: ProductoConDetalles) => {
    if (producto.isOferta) return "Oferta"
    if (producto.categoria_info?.descripcion.toLowerCase().includes('vegetal')) return "Vegano"
    return "Premium"
  }

  const calculateDiscount = (precio: number) => {
    // Simular precio original con 20% de descuento
    return Math.round(precio * 1.25)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-br from-white to-gray-50 py-20 lg:py-32">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-red-50 text-red-600 border-red-200 font-medium">🏆 #1 en Proteínas Premium</Badge>
                <h1 className="font-anton text-5xl lg:text-7xl font-bold text-gray-900 leading-tight">
                  PROTEÍNA
                  <span className="text-red-600 block">PURA</span>
                </h1>
                <p className="text-xl text-gray-600 font-roboto max-w-lg">
                  Maximiza tu rendimiento con las proteínas de más alta calidad. Resultados garantizados para atletas
                  serios.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/productos">
                  <Button
                    size="lg"
                    className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-8 py-4 text-lg"
                  >
                    Ver Productos
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Button
                  variant="outline"
                  size="lg"
                  className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-4 text-lg bg-transparent"
                >
                  Asesoría Gratis
                </Button>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="font-anton text-2xl font-bold text-gray-900">50K+</div>
                  <div className="text-sm text-gray-600">Clientes Satisfechos</div>
                </div>
                <div className="text-center">
                  <div className="font-anton text-2xl font-bold text-gray-900">4.9★</div>
                  <div className="text-sm text-gray-600">Calificación Promedio</div>
                </div>
                <div className="text-center">
                  <div className="font-anton text-2xl font-bold text-gray-900">100%</div>
                  <div className="text-sm text-gray-600">Garantía</div>
                </div>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-200 rounded-full blur-3xl opacity-30"></div>
              <Image
                src="/placeholder.svg?height=600&width=600&text=Proteína+Pura+Hero"
                alt="Proteína Pura Products"
                width={600}
                height={600}
                className="relative z-10 w-full h-auto"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Benefits Section */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => (
              <div key={index} className="text-center space-y-4">
                <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full">
                  <benefit.icon className="h-8 w-8 text-red-600" />
                </div>
                <h3 className="font-anton text-xl font-bold text-gray-900">{benefit.title}</h3>
                <p className="text-gray-600 font-roboto">{benefit.description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-anton text-4xl lg:text-5xl font-bold text-gray-900">OFERTAS DESTACADAS</h2>
            <p className="text-xl text-gray-600 font-roboto max-w-2xl mx-auto">
              Aprovecha nuestras mejores ofertas en productos premium seleccionados
            </p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="p-0">
                    <div className="h-48 bg-gray-200 rounded-t-lg"></div>
                  </CardHeader>
                  <CardContent className="p-4 space-y-3">
                    <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                    <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel className="w-full">
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredProducts.map((producto) => (
                  <CarouselItem key={producto.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                    <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                      <CardHeader className="relative p-0">
                        <div className="relative overflow-hidden rounded-t-lg">
                          <Image
                            src={producto.url_imagen || "/placeholder.svg?height=200&width=200&text=" + encodeURIComponent(producto.nombre)}
                            alt={producto.nombre}
                            width={200}
                            height={200}
                            className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                          />
                          <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">
                            {getBadgeText(producto)}
                          </Badge>
                          {producto.cantidad_stock === 0 && (
                            <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                              <Badge variant="secondary" className="bg-gray-800 text-white">
                                Agotado
                              </Badge>
                            </div>
                          )}
                        </div>
                      </CardHeader>

                      <CardContent className="p-4 space-y-3">
                        <div className="space-y-1">
                          <h3 className="font-anton text-lg font-bold text-gray-900">{producto.nombre}</h3>
                          <p className="text-gray-600 font-roboto text-sm line-clamp-2">{producto.descripcion}</p>
                        </div>

                        <div className="flex items-center gap-2">
                          <span className="font-anton text-xl font-bold text-red-600">
                            ${producto.precio.toLocaleString()}
                          </span>
                          {producto.isOferta && (
                            <span className="text-sm text-gray-400 line-through">
                              ${calculateDiscount(producto.precio).toLocaleString()}
                            </span>
                          )}
                        </div>
                      </CardContent>

                      <CardFooter className="p-4 pt-0">
                        <Button
                          onClick={() => addToCart(producto, producto.sabores_info?.[0])}
                          disabled={producto.cantidad_stock === 0}
                          className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                          <Plus className="mr-2 h-3 w-3" />
                          {producto.cantidad_stock > 0 ? "Agregar al Carrito" : "Agotado"}
                        </Button>
                      </CardFooter>
                    </Card>
                  </CarouselItem>
                ))}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
            </Carousel>
          )}

          <div className="text-center mt-12">
            <Link href="/productos">
              <Button
                size="lg"
                variant="outline"
                className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-4 bg-transparent"
              >
                Ver Todos los Productos
                <ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Newsletter Section */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="font-anton text-4xl lg:text-5xl font-bold text-white">ÚNETE A LA COMUNIDAD</h2>
              <p className="text-xl text-red-100 font-roboto">
                Recibe consejos exclusivos, ofertas especiales y guías de entrenamiento
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input
                  type="email"
                  placeholder="Tu email"
                  className="bg-white border-0 text-gray-900 placeholder:text-gray-500"
                />
                <Button className="bg-white text-red-600 hover:bg-gray-100 font-medium px-8">Suscribirse</Button>
              </div>
              <p className="text-sm text-red-100 mt-2">Sin spam. Cancela cuando quieras.</p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}

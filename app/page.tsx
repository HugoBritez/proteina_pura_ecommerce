"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Truck, Shield, Award, Users, ArrowRight, Plus } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductosDestacados, getCategorias } from "@/lib/products"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { useCart } from "@/hooks/useCart"
import type { ProductoConDetalles, Categoria } from "@/types/database"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselIndicators } from "@/components/ui/carousel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { empresa } from "@/lib/consts/empresa.data"

const benefits = [
  {
    icon: Shield,
    title: "Calidad Garantizada",
    description: "Productos certificados y probados en laboratorio",
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

const highlights = [
  { icon: Shield, label: "Calidad garantizada" },
  { icon: Award, label: "Mejor precio" },
  { icon: Users, label: "Asesoría experta" },
  { icon: Star, label: "4.9/5 reseñas" },
]

const testimonials = [
  {
    name: "Carlos R.",
    role: "Triatleta",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    content:
      "Resultados visibles en 4 semanas. La digestión es ligera y el sabor espectacular. ¡Recomendadísimo!",
  },
  {
    name: "María L.",
    role: "Crossfitter",
    avatar: "/placeholder-user.jpg",
    rating: 5,
    content:
      "Excelente relación precio/calidad. El envío fue rapidísimo y la atención al cliente de 10.",
  },
  {
    name: "Jorge P.",
    role: "Fisicoculturista",
    avatar: "/placeholder-user.jpg",
    rating: 4,
    content:
      "Noté mejora en recuperación y fuerza. Volvería a comprar sin dudarlo.",
  },
]

const faqs = [
  {
    q: "¿Cuál es la mejor proteína para ganar masa muscular?",
    a: "La Whey Protein es ideal por su rápida absorción post‑entreno. Para períodos largos sin comer, la caseína ayuda por su liberación sostenida.",
  },
  {
    q: "¿Hacen envíos a todo el país?",
    a: "Sí. Envío gratis en pedidos superiores a Gs 50.000 y tiempos de entrega de 24‑72h según ciudad.",
  },
  {
    q: "¿Cómo elegir entre Whey, Caseína o Vegetal?",
    a: "Whey para recuperación rápida, Caseína para saciedad prolongada y Vegetal para dietas veganas o con intolerancia a lácteos.",
  },
  {
    q: "¿Puedo devolver un producto?",
    a: "Aceptamos cambios y devoluciones dentro de 7 días si el producto está cerrado y en perfecto estado.",
  },
] 

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<ProductoConDetalles[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, getCartItemsCount } = useCart()
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [categoriasLoading, setCategoriasLoading] = useState(true)

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

  useEffect(() => {
    async function loadCategorias() {
      try {
        const categoriasData = await getCategorias()
        setCategorias(categoriasData)
      } catch (error) {
        console.error('Error loading categorias:', error)
      } finally {
        setCategoriasLoading(false)
      }
    }

    loadCategorias()
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

  // Orden de importancia para las categorías
  const ordenImportancia = [
    'Proteínas',
    'Creatinas', 
    'Combos Promocionales',
    'Quemadores de Grasa',
    'Preentrenos',
    'Aminoácidos',
    'Salud y Vitalidad'
  ]

  const categoriasOrdenadas = useMemo(() => {
    return categorias.sort((a, b) => {
      const indexA = ordenImportancia.findIndex(cat => 
        a.descripcion.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(a.descripcion.toLowerCase())
      )
      const indexB = ordenImportancia.findIndex(cat => 
        b.descripcion.toLowerCase().includes(cat.toLowerCase()) ||
        cat.toLowerCase().includes(b.descripcion.toLowerCase())
      )
      
      // Si no se encuentra en el orden, va al final
      const posA = indexA === -1 ? 999 : indexA
      const posB = indexB === -1 ? 999 : indexB
      
      return posA - posB
    })
  }, [categorias])

  const defaultPattern = [
    "col-span-6 row-span-2 md:col-span-6 md:row-span-2",
    "col-span-3 row-span-1 md:col-span-6 md:row-span-1",
    "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
    "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
    "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
    "col-span-6 row-span-2 md:col-span-8 md:row-span-2",
    "col-span-3 row-span-2 md:col-span-4 md:row-span-2",
    "col-span-6 row-span-1 md:col-span-6 md:row-span-1",
  ]

  const bentoPattern = useMemo(() => {
    if (categoriasOrdenadas.length === 7) {
      return [
        "col-span-6 row-span-2 md:col-span-8 md:row-span-2",
        "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
        "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
        "col-span-6 row-span-1 md:col-span-4 md:row-span-1",
        "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
        "col-span-3 row-span-1 md:col-span-4 md:row-span-1",
        "col-span-6 row-span-1 md:col-span-12 md:row-span-1",
      ]
    }
    return defaultPattern
  }, [categoriasOrdenadas.length])

  const getBentoClasses = (index: number) => {
    return `${bentoPattern[index % bentoPattern.length]}`
  }

  return (
    <div className="min-h-screen bg-white">


      <Header cartItems={getCartItemsCount()} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-cover bg-center bg-no-repeat bg-[url('/ppmobile.jpg')] md:bg-[url('/ppdesktop.jpg')]">
        {/* Overlay para mejorar legibilidad del texto */}
        <div className="absolute inset-0 bg-black/30"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-red-600/90 text-white border-red-500 font-medium backdrop-blur-sm">🏆 #1 en Proteínas Premium</Badge>
                <h1 className="font-anton text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                  PROTEÍNA
                  <span className="text-red-600 block">PURA</span>
                </h1>
                <p className="text-xl text-gray-100 font-roboto max-w-lg drop-shadow-md">
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
                <Link href="/contacto">
                  <Button
                    variant="outline"
                    size="lg"
                    className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-4 text-lg bg-transparent"
                  >
                    Asesoría Gratis
                  </Button>
                </Link>
              </div>

              <div className="flex items-center gap-8 pt-4">
                <div className="text-center">
                  <div className="font-anton text-2xl font-bold text-white drop-shadow-lg">50K+</div>
                  <div className="text-sm text-gray-200 drop-shadow-md">Clientes Satisfechos</div>
                </div>
                <div className="text-center">
                  <div className="font-anton text-2xl font-bold text-white drop-shadow-lg">4.9★</div>
                  <div className="text-sm text-gray-200 drop-shadow-md">Calificación Promedio</div>
                </div>
                <div className="text-center">
                  <div className="font-anton text-2xl font-bold text-white drop-shadow-lg">100%</div>
                  <div className="text-sm text-gray-200 drop-shadow-md">Garantía</div>
                </div>
              </div>
            </div>
{/* 
            <div className="relative">
              <div className="absolute inset-0 bg-gradient-to-r from-red-100 to-red-200 rounded-full blur-3xl opacity-30"></div>
              <Image
                src="/placeholder.svg?height=600&width=600&text=Proteína+Pura+Hero"
                alt="Proteína Pura Products"
                width={600}
                height={600}
                priority
                sizes="(max-width: 768px) 100vw, 600px"
                className="relative z-10 w-full h-auto"
              />
            </div> */}
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
            <Carousel className="w-full" opts={{ loop: true, align: "start" }} autoplay autoplayInterval={4500} pauseOnHover>
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
                            {formatCurrency(producto.precio)}
                          </span>
                          {producto.isOferta && (
                            <span className="text-sm text-gray-400 line-through">
                              {formatCurrency(calculateDiscount(producto.precio))}
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
              <CarouselIndicators className="mt-6" />
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

      {/* Categories Grid (Bento) just below Hero */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-8">
            <h2 className="font-anton text-3xl lg:text-5xl font-bold text-gray-900">EXPLORA POR CATEGORÍAS</h2>
            <p className="text-base lg:text-lg text-gray-600 font-roboto">Encuentra más rápido lo que necesitas</p>
          </div>

          {categoriasLoading ? (
            <div className="grid grid-cols-6 md:grid-cols-12 auto-rows-[90px] md:auto-rows-[140px] [grid-auto-flow:dense] gap-2.5 md:gap-4">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className={`rounded-xl overflow-hidden animate-pulse ${getBentoClasses(i)}`}>
                  <div className="h-full w-full bg-gray-200" />
                </div>
              ))}
            </div>
          ) : (
            <div className="grid grid-cols-6 md:grid-cols-12 auto-rows-[90px] md:auto-rows-[140px] [grid-auto-flow:dense] gap-2.5 md:gap-4">
              {categoriasOrdenadas.map((cat, idx) => (
                <Link
                  key={cat.id}
                  href={`/productos/${encodeURIComponent(cat.descripcion)}`}
                  className={`block ${getBentoClasses(idx)}`}
                  aria-label={`Ver productos de ${cat.descripcion}`}
                >
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image
                      src={`/placeholder.svg?height=320&width=640&text=${encodeURIComponent(cat.descripcion)}`}
                      alt={cat.descripcion}
                      fill
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/35 text-white px-3 py-2">
                      <span className="font-anton text-sm sm:text-base">{cat.descripcion}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
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

      {/* Loop Highlights Section */}
      <section className="py-14">
        <div className="container mx-auto px-4">
          <div className="relative overflow-hidden rounded-2xl border border-gray-200 bg-white">
            <div className="absolute inset-0 bg-gradient-to-r from-red-50/60 via-transparent to-red-50/60" />
            <div className="[mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)]">
              <div className="flex gap-10 animate-[slide_25s_linear_infinite] px-6 py-6">
                {highlights.concat(highlights).concat(highlights).map((h, i) => (
                  <div key={i} className="flex items-center gap-3 whitespace-nowrap">
                    <div className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-100">
                      <h.icon className="h-4 w-4 text-red-600" />
                    </div>
                    <span className="font-roboto text-gray-800 text-sm sm:text-base">{h.label}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </section>

      


      {/* Testimonials Section */}
      <section className="py-20 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-12">
            <h2 className="font-anton text-4xl lg:text-5xl font-bold text-gray-900">LO QUE DICEN NUESTROS CLIENTES</h2>
            <p className="text-xl text-gray-600 font-roboto">Resultados reales, experiencias reales</p>
          </div>

          <Carousel className="w-full">
            <CarouselContent className="-ml-2 md:-ml-4">
              {testimonials.map((t, idx) => (
                <CarouselItem key={idx} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                  <Card className="border-0 shadow-lg h-full">
                    <CardContent className="p-6 flex flex-col justify-between gap-6 h-full">
                      <p className="text-gray-700 font-roboto">{t.content}</p>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-3">
                          <Avatar>
                            <AvatarImage src={t.avatar} alt={t.name} />
                            <AvatarFallback>{t.name.slice(0, 1)}</AvatarFallback>
                          </Avatar>
                          <div>
                            <div className="font-roboto font-semibold text-gray-900">{t.name}</div>
                            <div className="text-sm text-gray-500">{t.role}</div>
                          </div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500" aria-label={`${t.rating} estrellas`}>
                          {Array.from({ length: t.rating }).map((_, i) => (
                            <Star key={i} className="h-4 w-4 fill-current" />
                          ))}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </CarouselItem>
              ))}
            </CarouselContent>
            <CarouselPrevious className="hidden md:flex -left-4" />
            <CarouselNext className="hidden md:flex -right-4" />
          </Carousel>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-4 mb-10">
            <h2 className="font-anton text-4xl lg:text-5xl font-bold text-gray-900">PREGUNTAS FRECUENTES</h2>
            <p className="text-lg text-gray-600 font-roboto">Resolvemos tus dudas más comunes</p>
          </div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left font-medium">
                    {item.q}
                  </AccordionTrigger>
                  <AccordionContent>
                    <p className="text-gray-700 font-roboto">{item.a}</p>
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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

      {/* Floating WhatsApp/Asesoría Button */}
      <Link
        href="/contacto"
        aria-label="Asesoría por WhatsApp"
        className="fixed bottom-6 right-6 z-50"
      >
        <Button className="rounded-full h-14 w-14 p-0 shadow-lg bg-red-600 hover:bg-red-700">
          <Users className="h-6 w-6 text-white" />
        </Button>
      </Link>

      {/* Structured Data */}
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "Organization",
            name: empresa.nombre,
            url: empresa.api_url,
            logo: empresa.logo,
            contactPoint: [
              {
                "@type": "ContactPoint",
                telephone: empresa.telefono,
                contactType: "customer service",
                areaServed: "PY",
                availableLanguage: ["es"],
              },
            ],
          }),
        }}
      />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{
          __html: JSON.stringify({
            "@context": "https://schema.org",
            "@type": "FAQPage",
            mainEntity: faqs.map((f) => ({
              "@type": "Question",
              name: f.q,
              acceptedAnswer: { "@type": "Answer", text: f.a },
            })),
          }),
        }}
      />

      <Footer />
    </div>
  )
}

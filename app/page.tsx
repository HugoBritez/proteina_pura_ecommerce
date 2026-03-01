"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Star, Truck, Shield, Award, Users, ArrowRight, Plus, Search, MessageCircle, CheckCircle, ShoppingCart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductosDestacados, getCategorias } from "@/lib/kioskit"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { useCart } from "@/hooks/useCart"
import { getProductPlaceholder, generateCategoryPlaceholder, LIGHT_BLUR_PLACEHOLDER } from "@/lib/utils/imageUtils"
import { getProductPrice, isProductAvailable } from "@/types/kioskit"
import type { KioskitProduct, KioskitCategory } from "@/types/kioskit"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselIndicators } from "@/components/ui/carousel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { Avatar, AvatarImage, AvatarFallback } from "@/components/ui/avatar"
import { empresa } from "@/lib/consts/empresa.data"

const benefits = [
  { icon: Shield, title: "Calidad Garantizada", description: "Productos certificados y probados en laboratorio" },
  { icon: Award, title: "Mejor Precio", description: "Garantía de mejor precio del mercado" },
  { icon: Users, title: "Soporte 24/7", description: "Asesoría nutricional especializada" },
]

const highlights = [
  { icon: Shield, label: "Calidad garantizada" },
  { icon: Award, label: "Mejor precio" },
  { icon: Users, label: "Asesoría experta" },
  { icon: Star, label: "4.9/5 reseñas" },
]

const testimonials = [
  { name: "Carlos R.", role: "Triatleta", avatar: "/placeholder-user.jpg", rating: 5, content: "Resultados visibles en 4 semanas. La digestión es ligera y el sabor espectacular. ¡Recomendadísimo!" },
  { name: "María L.", role: "Crossfitter", avatar: "/placeholder-user.jpg", rating: 5, content: "Excelente relación precio/calidad. El envío fue rapidísimo y la atención al cliente de 10." },
  { name: "Jorge P.", role: "Fisicoculturista", avatar: "/placeholder-user.jpg", rating: 4, content: "Noté mejora en recuperación y fuerza. Volvería a comprar sin dudarlo." },
]

const faqs = [
  { q: "¿Qué suplemento me conviene si soy principiante?", a: "Si recién estás empezando, lo ideal es comenzar con lo básico: una proteína para cubrir tus requerimientos diarios y un multivitamínico para mantener tu energía. Después, según tu progreso, podés sumar creatina, preentrenos u otros productos más específicos." },
  { q: "¿Puedo tomar varios suplementos al mismo tiempo?", a: "Sí, muchos suplementos se pueden combinar sin problema. Por ejemplo: proteína + creatina + multivitamínico es una combinación muy usada. La clave es elegir los correctos y respetar las dosis recomendadas. Nuestro equipo puede asesorarte en cómo armar tu combo." },
  { q: "¿Necesito entrenar para tomar suplementos?", a: "No necesariamente. Muchos suplementos también ayudan a complementar la alimentación diaria (como multivitamínicos, omega-3, colágeno o proteína para cubrir requerimientos de dieta). Eso sí, con ejercicio los resultados son más visibles." },
  { q: "¿Cuándo y cómo debo tomar la proteína?", a: "Lo más común es: • Después del entrenamiento → para recuperación muscular. • En el desayuno o entre comidas → para cubrir requerimientos de proteínas diarios. La cantidad depende de tu peso, tu dieta y tu nivel de actividad." },
  { q: "¿Hacen envíos a todo Paraguay?", a: "Sí. Trabajamos con envíos a todo el país mediante transportadoras de confianza. El tiempo de entrega promedio es de 24 a 72 horas hábiles, dependiendo de la ciudad. También podés retirar tu pedido o solicitar tu delivery en el día en Asunción o Coronel Oviedo." },
  { q: "¿Cuáles son las formas de pago disponibles?", a: "Podés pagar mediante transferencia bancaria, billeteras electrónicas, tarjeta de crédito/débito. En Asunción Coronel Oviedo y Ciudad del Este, podes pagar contra entrega (pagas al recibir tus suplementos), pagando previamente el costo del envío. Siempre te damos opciones seguras y fáciles." },
  { q: "¿Los suplementos reemplazan la comida?", a: "No, los suplementos no sustituyen una dieta balanceada. Son un complemento para cubrir lo que muchas veces no logramos obtener solo con la alimentación. Una buena nutrición + entrenamiento + descanso son la base; los suplementos potencian tus resultados." },
]

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<KioskitProduct[]>([])
  const [loading, setLoading] = useState(true)
  const { addToCart, getCartItemsCount } = useCart()
  const [categorias, setCategorias] = useState<KioskitCategory[]>([])
  const [categoriasLoading, setCategoriasLoading] = useState(true)
  const [searchQuery, setSearchQuery] = useState("")
  const router = useRouter()

  const [showCartFeedback, setShowCartFeedback] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState<string>("")

  useEffect(() => {
    getProductosDestacados()
      .then(setFeaturedProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  useEffect(() => {
    getCategorias()
      .then(setCategorias)
      .catch(console.error)
      .finally(() => setCategoriasLoading(false))
  }, [])

  const getBadgeText = (_producto: KioskitProduct) => "Premium"

  const ordenImportancia = ['Proteínas', 'Creatinas', 'Combos Promocionales', 'Quemadores de Grasa', 'Preentrenos', 'Aminoácidos', 'Salud y Vitalidad']

  const categoriasOrdenadas = useMemo(() => {
    return [...categorias].sort((a, b) => {
      const posA = ordenImportancia.findIndex(cat => a.name.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(a.name.toLowerCase()))
      const posB = ordenImportancia.findIndex(cat => b.name.toLowerCase().includes(cat.toLowerCase()) || cat.toLowerCase().includes(b.name.toLowerCase()))
      return (posA === -1 ? 999 : posA) - (posB === -1 ? 999 : posB)
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

  const getBentoClasses = (index: number) => bentoPattern[index % bentoPattern.length]

  const [categoryImageIndexes, setCategoryImageIndexes] = useState<Record<string, number>>({})

  const getCategoryImages = (categoria: KioskitCategory) => {
    return featuredProducts
      .filter(p => p.category_id === categoria.id && p.image_url)
      .map(p => p.image_url!)
  }

  const getCategoryImage = (categoria: KioskitCategory) => {
    const images = getCategoryImages(categoria)
    if (images.length === 0) {
      const colorMap: Record<string, { bg: string; text: string }> = {
        'proteínas': { bg: '#3b82f6', text: '#ffffff' },
        'creatinas': { bg: '#10b981', text: '#ffffff' },
        'combos': { bg: '#f59e0b', text: '#ffffff' },
        'quemadores': { bg: '#ef4444', text: '#ffffff' },
        'preentrenos': { bg: '#8b5cf6', text: '#ffffff' },
        'aminoácidos': { bg: '#06b6d4', text: '#ffffff' },
        'aminos': { bg: '#06b6d4', text: '#ffffff' },
        'salud': { bg: '#84cc16', text: '#ffffff' },
      }
      const key = Object.keys(colorMap).find(k => categoria.name.toLowerCase().includes(k))
      const colors = key ? colorMap[key] : { bg: '#f3f4f6', text: '#6b7280' }
      return generateCategoryPlaceholder(categoria.name, colors.bg, colors.text, 400, 300)
    }
    const idx = categoryImageIndexes[categoria.id] || 0
    return images[idx % images.length]
  }

  useEffect(() => {
    const interval = setInterval(() => {
      setCategoryImageIndexes(prev => {
        const next = { ...prev }
        categoriasOrdenadas.forEach(cat => {
          const images = getCategoryImages(cat)
          if (images.length > 1) next[cat.id] = ((prev[cat.id] || 0) + 1) % images.length
        })
        return next
      })
    }, 3000)
    return () => clearInterval(interval)
  }, [categoriasOrdenadas, featuredProducts])

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchQuery.trim()) router.push(`/productos?search=${encodeURIComponent(searchQuery.trim())}`)
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />

      {/* Hero Section */}
      <section className="relative py-20 lg:py-32 bg-cover bg-center bg-no-repeat bg-[url('/ppdesktop.jpg')]">
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div className="space-y-8">
              <div className="space-y-4">
                <Badge className="bg-red-600/90 text-white border-red-500 font-medium backdrop-blur-sm">🏆 #1 en Proteínas Premium</Badge>
                <h1 className="font-anton text-5xl lg:text-7xl font-bold text-white leading-tight drop-shadow-lg">
                  PROTEÍNA<span className="text-red-600 block">PURA</span>
                </h1>
                <p className="text-xl text-gray-100 font-roboto max-w-lg drop-shadow-md">
                  Maximiza tu rendimiento con las proteínas de más alta calidad. Resultados garantizados para atletas serios.
                </p>
              </div>
              <div className="flex flex-col sm:flex-row gap-4">
                <Link href="/productos">
                  <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-8 py-4 text-lg">
                    Ver todos los suplementos<ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
                <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank">
                  <Button variant="outline" size="lg" className="border-green-400 text-green-600 hover:bg-green-50 px-8 py-4 text-lg bg-white/95 backdrop-blur-sm">
                    <MessageCircle className="mr-2 h-5 w-5" />Asesoría Gratis por WhatsApp
                  </Button>
                </Link>
              </div>
              <div className="flex items-center gap-8 pt-4">
                <div className="text-center"><div className="font-anton text-2xl font-bold text-white drop-shadow-lg">50K+</div><div className="text-sm text-gray-200 drop-shadow-md">Clientes Satisfechos</div></div>
                <div className="text-center"><div className="font-anton text-2xl font-bold text-white drop-shadow-lg">4.9★</div><div className="text-sm text-gray-200 drop-shadow-md">Calificación Promedio</div></div>
                <div className="text-center"><div className="font-anton text-2xl font-bold text-white drop-shadow-lg">100%</div><div className="text-sm text-gray-200 drop-shadow-md">Garantía</div></div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-anton text-4xl lg:text-5xl font-bold text-gray-900">PRODUCTOS DESTACADOS</h2>
            <p className="text-xl text-gray-600 font-roboto max-w-2xl mx-auto">Descubre nuestra selección de productos premium</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[1, 2, 3].map((i) => (
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
          ) : (
            <Carousel className="w-full" opts={{ loop: true, align: "start" }} autoplay autoplayInterval={4500} pauseOnHover>
              <CarouselContent className="-ml-2 md:-ml-4">
                {featuredProducts.map((producto) => {
                  const available = isProductAvailable(producto)
                  const price = getProductPrice(producto)
                  const firstVariant = producto.variants.find(v => v.is_available) ?? producto.variants[0]
                  return (
                    <CarouselItem key={producto.id} className="pl-2 md:pl-4 basis-full md:basis-1/2 lg:basis-1/3">
                      <Card className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                        <CardHeader className="relative p-0">
                          <div className="relative overflow-hidden rounded-t-lg">
                            <Image
                              src={producto.image_url || getProductPlaceholder(producto.name, 400, 300)}
                              alt={producto.name}
                              width={400}
                              height={300}
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL={LIGHT_BLUR_PLACEHOLDER}
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="w-full h-48 object-contain group-hover:scale-105 transition-transform duration-300"
                            />
                            <Badge className="absolute top-2 left-2 bg-red-600 text-white text-xs">
                              {getBadgeText(producto)}
                            </Badge>
                            {!available && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="secondary" className="bg-gray-800 text-white">Agotado</Badge>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-4 space-y-3">
                          <div className="space-y-1">
                            <h3 className="font-anton text-lg font-bold text-gray-900">{producto.name}</h3>
                            <p className="text-gray-600 font-roboto text-sm line-clamp-2">{producto.description}</p>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="font-anton text-xl font-bold text-red-600">{formatCurrency(price)}</span>
                          </div>
                        </CardContent>
                        <CardFooter className="p-4 pt-0">
                          <Button
                            onClick={() => {
                              if (!firstVariant) return
                              addToCart(producto, firstVariant)
                              setLastAddedProduct(producto.name)
                              setShowCartFeedback(true)
                              setTimeout(() => setShowCartFeedback(false), 3000)
                            }}
                            disabled={!available}
                            className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium text-sm disabled:opacity-50 disabled:cursor-not-allowed"
                          >
                            <Plus className="mr-2 h-3 w-3" />
                            {available ? "Agregar al Carrito" : "Agotado"}
                          </Button>
                        </CardFooter>
                      </Card>
                    </CarouselItem>
                  )
                })}
              </CarouselContent>
              <CarouselPrevious className="hidden md:flex -left-4" />
              <CarouselNext className="hidden md:flex -right-4" />
              <CarouselIndicators className="mt-6" />
            </Carousel>
          )}

          <div className="text-center mt-12">
            <Link href="/productos">
              <Button size="lg" variant="outline" className="border-red-200 text-red-600 hover:bg-red-50 px-8 py-4 bg-transparent">
                Ver Todos los Productos<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Categories Grid (Bento) */}
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
                  href={`/productos/${encodeURIComponent(cat.name)}`}
                  className={`block ${getBentoClasses(idx)}`}
                  aria-label={`Ver productos de ${cat.name}`}
                >
                  <div className="relative h-full w-full rounded-xl overflow-hidden">
                    <Image
                      src={getCategoryImage(cat)}
                      alt={cat.name}
                      fill
                      loading="lazy"
                      placeholder="blur"
                      blurDataURL={LIGHT_BLUR_PLACEHOLDER}
                      sizes="(max-width: 768px) 50vw, 25vw"
                      className="object-cover"
                    />
                    <div className="absolute inset-x-0 bottom-0 bg-black/35 text-white px-3 py-2">
                      <span className="font-anton text-sm sm:text-base">{cat.name}</span>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* Why Choose Section */}
      <section className="py-20 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-4 mb-16">
            <h2 className="font-anton text-4xl lg:text-5xl font-bold text-gray-900">¿POR QUÉ ELEGIR PROTEÍNA PURA?</h2>
            <p className="text-xl text-gray-600 font-roboto max-w-3xl mx-auto">No somos solo otra tienda de suplementos. Somos tu aliado para alcanzar tus objetivos fitness.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[
              { icon: Shield, color: "red", title: "100% Auténtico", desc: "Importamos directamente de fabricantes certificados. Cada producto incluye códigos de verificación de autenticidad." },
              { icon: Award, color: "green", title: "Garantía de Precio", desc: "Si encontrás un precio menor en cualquier otro lugar, igualamos el precio + 5% de descuento adicional." },
              { icon: Users, color: "blue", title: "Asesoría Especializada", desc: "Nuestro equipo incluye nutricionistas y entrenadores certificados. Consultas gratuitas por WhatsApp." },
              { icon: Truck, color: "yellow", title: "Envío Express", desc: "Entrega en 24-48hs en Asunción y Gran Asunción. Envío gratis en compras mayores a 500.000 Gs." },
              { icon: Star, color: "purple", title: "4.9/5 en Reseñas", desc: "+50,000 clientes satisfechos nos respaldan. Leé testimonios reales en nuestras redes sociales." },
              { icon: ArrowRight, color: "red", title: "Satisfacción Garantizada", desc: "30 días para devolver cualquier producto si no estás 100% satisfecho. Sin preguntas ni complicaciones." },
            ].map(({ icon: Icon, color, title, desc }, i) => (
              <div key={i} className="text-center space-y-4 p-6 rounded-xl border border-gray-100 hover:shadow-lg transition-shadow">
                <div className={`inline-flex items-center justify-center w-16 h-16 bg-${color}-100 rounded-full`}>
                  <Icon className={`h-8 w-8 text-${color}-600`} />
                </div>
                <h3 className="font-anton text-xl font-bold text-gray-900">{title}</h3>
                <p className="text-gray-600 font-roboto">{desc}</p>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link href="/productos">
              <Button size="lg" className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-12 py-4 text-lg">
                Empezar mi Transformación<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
            <p className="text-sm text-gray-500 mt-3">Únete a +50,000 atletas que ya confían en nosotros</p>
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

      {/* Loop Highlights */}
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

      {/* Testimonials */}
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
                          <Avatar><AvatarImage src={t.avatar} alt={t.name} /><AvatarFallback>{t.name.slice(0, 1)}</AvatarFallback></Avatar>
                          <div><div className="font-roboto font-semibold text-gray-900">{t.name}</div><div className="text-sm text-gray-500">{t.role}</div></div>
                        </div>
                        <div className="flex items-center gap-1 text-amber-500">
                          {Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-current" />)}
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

      {/* FAQ */}
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
                  <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                  <AccordionContent><p className="text-gray-700 font-roboto">{item.a}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </div>
      </section>

      {/* Newsletter */}
      <section className="py-20 bg-gradient-to-r from-red-600 to-red-700">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto text-center space-y-8">
            <div className="space-y-4">
              <h2 className="font-anton text-4xl lg:text-5xl font-bold text-white">ÚNETE A LA COMUNIDAD</h2>
              <p className="text-xl text-red-100 font-roboto">Recibe consejos exclusivos, ofertas especiales y guías de entrenamiento</p>
            </div>
            <div className="max-w-md mx-auto">
              <div className="flex gap-4">
                <Input type="email" placeholder="Tu email" className="bg-white border-0 text-gray-900 placeholder:text-gray-500" />
                <Button className="bg-white text-red-600 hover:bg-gray-100 font-medium px-8">Suscribirse</Button>
              </div>
              <p className="text-sm text-red-100 mt-2">Sin spam. Cancela cuando quieras.</p>
            </div>
          </div>
        </div>
      </section>

      {/* Mini Cart Feedback */}
      {showCartFeedback && (
        <div className="fixed top-6 right-6 z-50 animate-in slide-in-from-right-8 fade-in duration-300">
          <div className="bg-green-600 text-white p-4 rounded-lg shadow-xl border border-green-500 min-w-[300px]">
            <div className="flex items-center gap-3">
              <CheckCircle className="h-6 w-6 text-green-200 flex-shrink-0" />
              <div className="flex-1">
                <h3 className="font-semibold text-sm">¡Agregado al carrito!</h3>
                <p className="text-green-100 text-xs mt-1 line-clamp-1">{lastAddedProduct}</p>
              </div>
              <Link href="/carrito">
                <Button size="sm" variant="outline" className="bg-transparent border-green-300 text-green-100 hover:bg-green-500 hover:text-white text-xs px-3 py-1">
                  Ver Carrito ({getCartItemsCount()})
                </Button>
              </Link>
            </div>
          </div>
        </div>
      )}

      {/* Floating WhatsApp */}
      <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank" aria-label="Asesoría por WhatsApp" className="fixed bottom-6 right-6 z-50 group">
        <div className="relative">
          <div className="absolute inset-0 bg-green-500 rounded-full animate-ping opacity-75"></div>
          <Button className="relative rounded-full h-16 w-16 p-0 shadow-xl bg-green-500 hover:bg-green-600 transition-all duration-300 group-hover:scale-110">
            <MessageCircle className="h-7 w-7 text-white" />
          </Button>
          <div className="absolute right-full mr-3 top-1/2 -translate-y-1/2 bg-gray-900 text-white px-3 py-2 rounded-lg text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap">
            💬 Asesoría Gratis
            <div className="absolute top-1/2 -translate-y-1/2 left-full border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </Link>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: empresa.nombre, url: empresa.api_url, logo: empresa.logo, contactPoint: [{ "@type": "ContactPoint", telephone: empresa.telefono, contactType: "customer service", areaServed: "PY", availableLanguage: ["es"] }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />

      <Footer />
    </div>
  )
}

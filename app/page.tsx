"use client"

import { useState, useEffect, useMemo } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Truck, Shield, Award, ArrowRight, Plus, Search, MessageCircle, CheckCircle, BadgeCheck, Dumbbell, Flame, Zap, Heart } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductosDestacados } from "@/lib/kioskit"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { useCart } from "@/hooks/useCart"
import { getProductPlaceholder, LIGHT_BLUR_PLACEHOLDER } from "@/lib/utils/imageUtils"
import { getProductPrice, isProductAvailable } from "@/types/kioskit"
import type { KioskitProduct } from "@/types/kioskit"
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious, CarouselIndicators } from "@/components/ui/carousel"
import { Accordion, AccordionItem, AccordionTrigger, AccordionContent } from "@/components/ui/accordion"
import { empresa } from "@/lib/consts/empresa.data"

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
  const router = useRouter()

  const [showCartFeedback, setShowCartFeedback] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState<string>("")

  useEffect(() => {
    getProductosDestacados()
      .then(setFeaturedProducts)
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const sortedProducts = useMemo(() => {
    return featuredProducts.filter(p => p.image_url)
  }, [featuredProducts])

  const getBadgeText = (_producto: KioskitProduct) => "Premium"

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />

      {/* Hero Section */}
      <section className="relative min-h-screen flex items-center bg-cover bg-center bg-no-repeat bg-[url('/ppdesktop.jpg')]">
        <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/70 to-black/80"></div>
        <div className="container mx-auto px-4 relative z-10 py-20 lg:py-0">
          <div className="max-w-3xl space-y-8">
            <div className="space-y-5">
              <span className="inline-block bg-primary text-white px-4 py-1.5 rounded-full text-sm font-oswald uppercase tracking-wider">
                #1 en Suplementos Premium
              </span>
              <h1 className="font-anton text-6xl sm:text-7xl lg:text-8xl text-white leading-[0.9] drop-shadow-lg">
                PROTEÍNA<span className="text-primary block">PURA</span>
              </h1>
              <p className="text-lg lg:text-xl text-gray-200 font-roboto max-w-xl">
                Suplementos importados directamente. Resultados reales, sin vueltas.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button size="lg" asChild>
                <Link href="/productos">
                  Ver todos los productos<ArrowRight className="ml-2 h-5 w-5" />
                </Link>
              </Button>
              <Button variant="outline" size="lg" asChild className="border-green-500 text-green-400 bg-white/10 backdrop-blur-sm hover:bg-green-500/20 hover:text-white">
                <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank">
                  <MessageCircle className="mr-2 h-5 w-5" />Asesoría por WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* Trust Bar */}
      <section className="border-b">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 py-8">
            {[
              { icon: Shield, label: "Importado Directo" },
              { icon: BadgeCheck, label: "Autenticidad Garantizada" },
              { icon: Truck, label: "Envío 24-48hs" },
              { icon: MessageCircle, label: "Asesoría WhatsApp" },
            ].map(({ icon: Icon, label }, i) => (
              <div key={i} className="flex items-center gap-3 justify-center md:justify-start">
                <div className="flex-shrink-0 w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <span className="font-oswald text-sm font-medium text-foreground">{label}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Quiz: Elegí tu Suplemento */}
      <section className="py-16 lg:py-24 bg-muted/40">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-10">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-oswald">No sé qué comprar</p>
            <h2 className="font-anton text-3xl lg:text-5xl">ELEGÍ TU SUPLEMENTO</h2>
            <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">Respondé dos preguntas y te mostramos los productos ideales para vos.</p>
          </div>
          <QuizSection router={router} />
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 overflow-x-hidden">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-oswald">Selección Premium</p>
            <h2 className="font-anton text-3xl lg:text-5xl">PRODUCTOS DESTACADOS</h2>
            <p className="text-lg text-muted-foreground font-roboto max-w-2xl mx-auto">Los más vendidos, elegidos por atletas que exigen resultados.</p>
          </div>

          {loading ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 max-w-3xl mx-auto">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="animate-pulse">
                  <CardHeader className="p-0"><div className="aspect-[3/4] bg-muted rounded-t-lg"></div></CardHeader>
                  <CardContent className="p-3 space-y-2">
                    <div className="h-3 bg-muted rounded w-3/4"></div>
                    <div className="h-5 bg-muted rounded w-1/3"></div>
                  </CardContent>
                </Card>
              ))}
            </div>
          ) : (
            <Carousel className="w-full max-w-3xl mx-auto" opts={{ loop: true, align: "center", slidesToScroll: 1 }} autoplay autoplayInterval={4500} pauseOnHover>
              <CarouselContent className="-ml-2 md:-ml-4">
                {sortedProducts.map((producto) => {
                  const available = isProductAvailable(producto)
                  const price = getProductPrice(producto)
                  const firstVariant = producto.variants.find(v => v.is_available) ?? producto.variants[0]
                  return (
                    <CarouselItem key={producto.id} className="pl-2 md:pl-4 basis-1/2 md:basis-1/3">
                      <Card className="group border-0 shadow-sm hover:shadow-md transition-shadow duration-300 overflow-hidden rounded-lg">
                        <CardHeader className="relative p-0">
                          <div className="relative aspect-[3/4] overflow-hidden">
                            <Image
                              src={producto.image_url || getProductPlaceholder(producto.name, 400, 300)}
                              alt={producto.name}
                              fill
                              loading="lazy"
                              placeholder="blur"
                              blurDataURL={LIGHT_BLUR_PLACEHOLDER}
                              sizes="(max-width: 768px) 50vw, 33vw"
                              className="object-cover group-hover:scale-105 transition-transform duration-500"
                            />
                            <Badge className="absolute top-2 right-2 text-xs">
                              {getBadgeText(producto)}
                            </Badge>
                            {!available && (
                              <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                                <Badge variant="secondary" className="bg-gray-800 text-white">Agotado</Badge>
                              </div>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="p-3 space-y-1">
                          <h3 className="font-oswald text-sm font-semibold leading-tight line-clamp-2">{producto.name}</h3>
                          <span className="font-anton text-lg text-primary">{formatCurrency(price)}</span>
                        </CardContent>
                        <CardFooter className="p-3 pt-0">
                          <Button
                            onClick={() => {
                              if (!firstVariant) return
                              addToCart(producto, firstVariant)
                              setLastAddedProduct(producto.name)
                              setShowCartFeedback(true)
                              setTimeout(() => setShowCartFeedback(false), 3000)
                            }}
                            disabled={!available}
                            size="sm"
                            className="w-full text-xs"
                          >
                            <Plus className="mr-1 h-3.5 w-3.5" />
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
              <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10">
                Ver Todos los Productos<ArrowRight className="ml-2 h-5 w-5" />
              </Button>
            </Link>
          </div>
        </div>
      </section>

      {/* Why Choose */}
      <section className="relative min-h-[80vh] flex items-center bg-cover bg-center bg-no-repeat bg-[url('/ppdesktop.jpg')]">
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto px-4 relative z-10 py-20">
          <div className="text-center space-y-3 mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-oswald">Nuestra Diferencia</p>
            <h2 className="font-anton text-3xl lg:text-5xl text-white">¿POR QUÉ PROTEÍNA PURA?</h2>
            <p className="text-lg text-white/70 font-roboto max-w-2xl mx-auto">No somos otra tienda de suplementos. Somos el aliado que te dice la verdad sobre lo que funciona.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-5xl mx-auto">
            {[
              { icon: Shield, title: "Autenticidad Garantizada", desc: "Importación directa de fabricantes certificados. Cada producto incluye código de verificación." },
              { icon: Truck, title: "Envío en 24-48hs", desc: "A todo Paraguay. Envío gratis en compras mayores a 500.000 Gs." },
              { icon: MessageCircle, title: "Asesoría Nutricional", desc: "Nutricionistas y entrenadores certificados. Consultas gratis por WhatsApp." },
              { icon: Award, title: "Garantía de Precio", desc: "Encontrás un precio menor, igualamos + 5% de descuento adicional." },
            ].map(({ icon: Icon, title, desc }, i) => (
              <div key={i} className="p-6 rounded-xl border border-white/10 bg-white/5 backdrop-blur-sm hover:bg-white/10 transition-all duration-300">
                <div className="w-12 h-12 rounded-full bg-primary/20 flex items-center justify-center mb-4">
                  <Icon className="h-6 w-6 text-primary" />
                </div>
                <h3 className="font-oswald text-lg font-semibold text-white mb-2">{title}</h3>
                <p className="text-white/60 font-roboto text-sm leading-relaxed">{desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Cómo Comprar */}
      <section className="py-16 lg:py-24 bg-primary text-white">
        <div className="container mx-auto px-4">
          <div className="text-center space-y-3 mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-white/70 font-oswald">Es Fácil</p>
            <h2 className="font-anton text-3xl lg:text-5xl">CÓMO COMPRAR</h2>
            <p className="text-lg text-white/80 font-roboto max-w-2xl mx-auto">Tres pasos y tus suplementos van camino a tu casa.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
            {[
              { step: "01", icon: Search, title: "Elegí tus suplementos", desc: "Navegá por categorías, compará y elegí lo que necesitás para tu objetivo." },
              { step: "02", icon: MessageCircle, title: "Pedí por WhatsApp o Web", desc: "Agregá al carrito y finalizá tu compra. O escribinos y te asesoramos sin compromiso." },
              { step: "03", icon: Truck, title: "Recibí en tu casa", desc: "Envío a todo Paraguay en 24-48hs. Pago contra entrega disponible en Asunción, Cnel. Oviedo y CdE." },
            ].map(({ step, icon: Icon, title, desc }, i) => (
              <div key={i} className="text-center space-y-4 relative">
                <div className="w-16 h-16 rounded-full bg-white text-primary flex items-center justify-center mx-auto text-2xl font-anton">
                  {step}
                </div>
                <div>
                  <h3 className="font-oswald text-lg font-semibold mb-1">{title}</h3>
                  <p className="text-white/70 font-roboto text-sm">{desc}</p>
                </div>
              </div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Button size="lg" variant="secondary" asChild className="px-10 bg-white text-primary hover:bg-white/90">
              <Link href="/productos">
                Empezar a comprar<ArrowRight className="ml-2 h-5 w-5" />
              </Link>
            </Button>
          </div>
        </div>
      </section>

      {/* Social Proof */}
      <section className="relative min-h-[80vh] flex items-center bg-cover bg-center bg-no-repeat bg-[url('/ppdesktop.jpg')]">
        <div className="absolute inset-0 bg-black/80"></div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-2xl mx-auto text-center space-y-6">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-oswald">Comunidad</p>
            <h2 className="font-anton text-3xl lg:text-5xl text-white">RESULTADOS REALES</h2>
            <p className="text-lg text-white/70 font-roboto">
              Seguinos en <a href="https://www.instagram.com/proteinapurapy/" target="_blank" className="text-primary hover:underline">Instagram</a> y <a href="https://www.tiktok.com/@proteinapurapy" target="_blank" className="text-primary hover:underline">TikTok</a>. Mirá las transformaciones de nuestra comunidad y consultanos por WhatsApp lo que necesités.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center pt-4">
              <Button asChild size="lg">
                <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank">
                  <MessageCircle className="mr-2 h-5 w-5" />Consultar por WhatsApp
                </Link>
              </Button>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      <section className="py-16 lg:py-24">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center space-y-3 mb-12">
            <p className="text-sm uppercase tracking-[0.2em] text-primary font-oswald">Ayuda</p>
            <h2 className="font-anton text-3xl lg:text-5xl">PREGUNTAS FRECUENTES</h2>
            <p className="text-lg text-muted-foreground font-roboto">Resolvemos tus dudas más comunes.</p>
          </div>
          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((item, idx) => (
                <AccordionItem key={idx} value={`item-${idx}`}>
                  <AccordionTrigger className="text-left font-medium">{item.q}</AccordionTrigger>
                  <AccordionContent><p className="text-muted-foreground font-roboto leading-relaxed">{item.a}</p></AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
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
            Asesoría Gratis
            <div className="absolute top-1/2 -translate-y-1/2 left-full border-4 border-transparent border-l-gray-900"></div>
          </div>
        </div>
      </Link>

      {/* Structured Data */}
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "Organization", name: empresa.nombre, url: empresa.api_url, logo: empresa.logo, contactPoint: [{ "@type": "ContactPoint", telephone: empresa.telefono, contactType: "customer service", areaServed: "PY", availableLanguage: ["es"] }] }) }} />
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify({ "@context": "https://schema.org", "@type": "FAQPage", mainEntity: faqs.map(f => ({ "@type": "Question", name: f.q, acceptedAnswer: { "@type": "Answer", text: f.a } })) }) }} />

      {/* Sticky Mobile CTA */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-card border-t md:hidden">
        <div className="flex gap-2 p-3">
          <Button asChild variant="outline" size="lg" className="flex-1 border-primary text-primary hover:bg-primary/10">
            <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank">
              <MessageCircle className="mr-2 h-5 w-5" />Comprar por WhatsApp
            </Link>
          </Button>
          <Button asChild size="lg" className="flex-1">
            <Link href="/productos">
              Ver Productos
            </Link>
          </Button>
        </div>
      </div>

      <Footer />
    </div>
  )
}

function QuizSection({ router }: { router: ReturnType<typeof useRouter> }) {
  const [step, setStep] = useState(0)
  const [objetivo, setObjetivo] = useState("")

  const objetivos = [
    { id: "masa", icon: Dumbbell, label: "Ganar masa muscular", desc: "Proteínas, creatinas, ganadores de peso" },
    { id: "definir", icon: Flame, label: "Definir / perder grasa", desc: "Quemadores, termogénicos, L-carnitina" },
    { id: "energia", icon: Zap, label: "Más energía para entrenar", desc: "Preentrenos, energizantes, aminoácidos" },
    { id: "recuperacion", icon: Heart, label: "Recuperación y salud", desc: "Multivitamínicos, omega-3, glutamina" },
  ]

  const searchMap: Record<string, string> = {
    masa: "proteina",
    definir: "quemador",
    energia: "preentreno",
    recuperacion: "aminoacidos",
  }

  if (step === 0) {
    return (
      <div className="max-w-2xl mx-auto">
        <p className="text-center text-muted-foreground font-roboto mb-6">¿Cuál es tu objetivo principal?</p>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {objetivos.map((o) => {
              const Icon = o.icon
              return (
            <button
              key={o.id}
              onClick={() => { setObjetivo(o.id); setStep(1) }}
              className="p-4 rounded-xl border border-border hover:border-primary hover:bg-primary/5 text-left transition-all duration-200 group"
            >
              <Icon className="h-6 w-6 text-primary mb-2" />
              <h3 className="font-oswald font-semibold text-foreground">{o.label}</h3>
              <p className="text-sm text-muted-foreground font-roboto mt-1">{o.desc}</p>
            </button>
              )
            })}
        </div>
        <div className="text-center mt-6">
          <button onClick={() => router.push("/productos")} className="text-primary font-roboto text-sm hover:underline">
            Ver todos los productos →
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="max-w-2xl mx-auto text-center space-y-6">
      <div className="flex items-center justify-center gap-2">
        <div className="w-3 h-3 rounded-full bg-primary" />
        <div className="w-3 h-3 rounded-full bg-primary" />
      </div>
      <p className="text-lg text-foreground font-roboto">
        Perfecto. Los productos ideales para <strong className="font-oswald">{objetivos.find(o => o.id === objetivo)?.label.toLowerCase()}</strong>:
      </p>
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Button size="lg" onClick={() => router.push(`/productos?search=${searchMap[objetivo]}`)}>
          Ver suplementos recomendados<ArrowRight className="ml-2 h-5 w-5" />
        </Button>
        <Button size="lg" variant="outline" className="border-primary text-primary hover:bg-primary/10" onClick={() => { setStep(0); setObjetivo("") }}>
          Elegir otro objetivo
        </Button>
      </div>
      <p className="text-sm text-muted-foreground font-roboto">
        ¿No estás seguro? <button onClick={() => window.open(`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`, '_blank')} className="text-primary hover:underline">Consultá con un asesor por WhatsApp</button>
      </p>
    </div>
  )
}

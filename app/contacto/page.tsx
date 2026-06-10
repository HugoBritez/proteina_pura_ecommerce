'use client'

import { empresa } from '@/lib/consts/empresa.data'
import { MessageCircle, Mail, MapPin, Clock, Phone, ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Card, CardContent } from '@/components/ui/card'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

const whatsappUrl = `https://wa.me/${empresa.telefono.replace(/\s/g, '')}`

export default function ContactoPage() {
    const { getCartItemsCount } = useCart()

    return (
        <div className="min-h-screen">
            <Header cartItems={getCartItemsCount()} />

            {/* Hero section */}
            <section className="relative min-h-[50vh] flex items-center bg-cover bg-center bg-no-repeat bg-[url('/ppdesktop.jpg')]">
                <div className="absolute inset-0 bg-black/70" />
                <div className="container relative z-10 py-16">
                    <div className="max-w-2xl">
                        <span className="inline-block bg-primary text-white px-4 py-1.5 rounded-full text-sm font-oswald uppercase tracking-wider mb-6">
                            Contacto
                        </span>
                        <h1 className="font-anton text-5xl lg:text-7xl text-white leading-[0.9] mb-6">
                            HABLEMOS<span className="text-primary">.</span>
                        </h1>
                        <p className="font-roboto text-lg text-gray-200 max-w-xl">
                            Asesoría personalizada, consultas sobre productos y pedidos. Estamos para ayudarte.
                        </p>
                    </div>
                </div>
            </section>

            {/* Contact cards */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
                        {/* WhatsApp */}
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-green-500/10 flex items-center justify-center">
                                    <MessageCircle className="h-6 w-6 text-green-500" />
                                </div>
                                <h3 className="font-oswald text-xl font-semibold">WhatsApp</h3>
                                <p className="text-muted-foreground text-sm font-roboto">
                                    El canal más rápido. Respondemos en minutos.
                                </p>
                                <Link href={whatsappUrl} target="_blank">
                                    <Button className="w-full bg-green-500 hover:bg-green-600">
                                        <MessageCircle className="mr-2 h-4 w-4" />
                                        Abrir WhatsApp
                                    </Button>
                                </Link>
                                <p className="text-sm text-muted-foreground font-roboto text-center">
                                    {empresa.telefono}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Email */}
                        <Card className="border-0 shadow-md">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <Mail className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-oswald text-xl font-semibold">Email</h3>
                                <p className="text-muted-foreground text-sm font-roboto">
                                    Consultas detalladas, pedidos mayoristas o colaboraciones.
                                </p>
                                <Link href={`mailto:${empresa.email}`}>
                                    <Button variant="outline" className="w-full border-primary text-primary hover:bg-primary/10">
                                        <Mail className="mr-2 h-4 w-4" />
                                        Enviar Email
                                    </Button>
                                </Link>
                                <p className="text-sm text-muted-foreground font-roboto text-center break-all">
                                    {empresa.email}
                                </p>
                            </CardContent>
                        </Card>

                        {/* Location */}
                        <Card className="border-0 shadow-md md:col-span-2 lg:col-span-1">
                            <CardContent className="p-6 space-y-4">
                                <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                                    <MapPin className="h-6 w-6 text-primary" />
                                </div>
                                <h3 className="font-oswald text-xl font-semibold">Ubicación</h3>
                                <p className="text-muted-foreground text-sm font-roboto">
                                    {empresa.direccion}
                                </p>
                                <div className="flex items-center gap-2 text-sm text-muted-foreground font-roboto">
                                    <Clock className="h-4 w-4 flex-shrink-0" />
                                    <span>Lun-Vie 8:00-18:00, Sáb 8:00-12:00</span>
                                </div>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </section>

            {/* Why contact us */}
            <section className="py-16 lg:py-24 bg-muted/20">
                <div className="container mx-auto px-4">
                    <div className="text-center space-y-3 mb-12">
                        <p className="text-sm uppercase tracking-[0.2em] text-primary font-oswald">¿Por qué escribirnos?</p>
                        <h2 className="font-anton text-3xl lg:text-5xl">ASESORÍA QUE MARCA LA DIFERENCIA</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-4xl mx-auto">
                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <MessageCircle className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-oswald text-lg font-semibold">Respuesta Rápida</h3>
                            <p className="text-muted-foreground text-sm font-roboto">
                                Te respondemos en minutos, no en horas.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <ArrowRight className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-oswald text-lg font-semibold">Asesoría Experta</h3>
                            <p className="text-muted-foreground text-sm font-roboto">
                                Consejos personalizados para tus objetivos.
                            </p>
                        </div>

                        <div className="space-y-3">
                            <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-primary" />
                            </div>
                            <h3 className="font-oswald text-lg font-semibold">Pedidos Fáciles</h3>
                            <p className="text-muted-foreground text-sm font-roboto">
                                Comprá directo por WhatsApp, sin complicaciones.
                            </p>
                        </div>
                    </div>
                </div>
            </section>

            {/* CTA section */}
            <section className="py-16 lg:py-24">
                <div className="container mx-auto px-4">
                    <div className="max-w-2xl mx-auto text-center space-y-6">
                        <h2 className="font-anton text-3xl lg:text-4xl">¿LISTO PARA EMPEZAR?</h2>
                        <p className="text-lg text-muted-foreground font-roboto">
                            Escribinos por WhatsApp y te ayudamos a elegir el suplemento ideal para vos.
                        </p>
                        <Link href={whatsappUrl} target="_blank">
                            <Button size="lg" className="bg-green-500 hover:bg-green-600 px-8 py-6 text-lg">
                                <MessageCircle className="mr-2 h-5 w-5" />
                                Chatear Ahora
                            </Button>
                        </Link>
                    </div>
                </div>
            </section>

            <Footer />
        </div>
    )
}
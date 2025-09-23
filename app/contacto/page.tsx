'use client'

import { empresa } from '@/lib/consts/empresa.data'
import { MessageCircle } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/hooks/useCart'
import Link from 'next/link'

export default function ContactoPage() {
    const { getCartItemsCount } = useCart()

    return (
        <div className="min-h-screen bg-white">
            <Header cartItems={getCartItemsCount()} />

            <div className="py-20 px-4">
                <div className="max-w-2xl mx-auto text-center">
                    <div className="mb-8">
                        <MessageCircle className="w-16 h-16 text-red-600 mx-auto mb-6" />
                        <h1 className="font-anton text-4xl font-bold text-gray-900 mb-4">
                            ¡Hablemos por WhatsApp!
                        </h1>
                        <p className="text-xl text-gray-600 font-roboto max-w-lg mx-auto">
                            Estamos listos para ayudarte con asesoría personalizada, consultas sobre productos y todo lo que necesites.
                        </p>
                    </div>

                    <div className="space-y-6">
                        <Link href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`} target="_blank">
                            <Button
                                size="lg"
                                className="bg-green-500 hover:bg-green-600 text-white font-medium px-12 py-6 text-lg"
                            >
                                <MessageCircle className="mr-3 h-6 w-6" />
                                Abrir WhatsApp
                            </Button>
                        </Link>

                        <div className="text-gray-600 font-roboto">
                            <p className="mb-2">📱 {empresa.telefono}</p>
                            <p className="text-sm">Horarios: Lun-Vie 8:00-18:00, Sáb 8:00-12:00</p>
                        </div>
                    </div>

                    <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
                        <div className="p-4">
                            <div className="text-2xl mb-2">⚡</div>
                            <h3 className="font-medium text-gray-900 mb-1">Respuesta Rápida</h3>
                            <p className="text-sm text-gray-600">Te respondemos en minutos</p>
                        </div>
                        <div className="p-4">
                            <div className="text-2xl mb-2">💪</div>
                            <h3 className="font-medium text-gray-900 mb-1">Asesoría Experta</h3>
                            <p className="text-sm text-gray-600">Consejos personalizados</p>
                        </div>
                        <div className="p-4">
                            <div className="text-2xl mb-2">🛒</div>
                            <h3 className="font-medium text-gray-900 mb-1">Pedidos Fáciles</h3>
                            <p className="text-sm text-gray-600">Compra directo por WhatsApp</p>
                        </div>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
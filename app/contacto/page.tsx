'use client'

import { empresa } from '@/lib/consts/empresa.data'
import { useState } from 'react'
import { 
    Phone, 
    Mail, 
    MapPin, 
    Clock,
    Send,
    CheckCircle
} from 'lucide-react'
import { Card, CardContent } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { useCart } from '@/hooks/useCart'

export default function ContactoPage() {
    const [formData, setFormData] = useState({
        nombre: '',
        email: '',
        telefono: '',
        asunto: '',
        mensaje: ''
    })
    const [enviando, setEnviando] = useState(false)
    const [enviado, setEnviado] = useState(false)
    const { getCartItemsCount } = useCart()

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        })
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setEnviando(true)
        
        // Simular envío
        await new Promise(resolve => setTimeout(resolve, 1500))
        
        setEnviando(false)
        setEnviado(true)
        
        // Resetear formulario
        setTimeout(() => {
            setEnviado(false)
            setFormData({
                nombre: '',
                email: '',
                telefono: '',
                asunto: '',
                mensaje: ''
            })
        }, 3000)
    }

    return (
        <div className="min-h-screen bg-white">
            <Header cartItems={getCartItemsCount()} />
            
            <div className="py-8 px-4">
                <div className="max-w-4xl mx-auto">
                    {/* Header simple y directo */}
                    <div className="text-center mb-12">
                        <h1 className="text-3xl font-bold text-gray-900 mb-3">
                            ¿Necesitas ayuda?
                        </h1>
                        <p className="text-gray-600">
                            Estamos aquí para responder todas tus preguntas
                        </p>
                    </div>

                    <div className="grid lg:grid-cols-2 gap-8">
                        {/* Información de contacto - lado izquierdo */}
                        <div className="space-y-6">
                            {/* Contacto directo */}
                            <div className="space-y-4">
                                <h2 className="text-lg font-semibold text-gray-900">
                                    Contacto directo
                                </h2>
                                
                                <div className="space-y-4">
                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Phone className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-gray-900">{empresa.telefono}</p>
                                            <p className="text-sm text-gray-500">Llamada directa</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Mail className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-gray-900">{empresa.email}</p>
                                            <p className="text-sm text-gray-500">Respuesta en 24h</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <MapPin className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-gray-900">Ubicación</p>
                                            <p className="text-sm text-gray-500">{empresa.direccion}</p>
                                        </div>
                                    </div>

                                    <div className="flex items-center gap-3 p-3 rounded-lg hover:bg-gray-50 transition-colors">
                                        <Clock className="w-5 h-5 text-primary" />
                                        <div>
                                            <p className="font-medium text-gray-900">Horarios</p>
                                            <p className="text-sm text-gray-500">Lun-Vie 8:00-18:00, Sáb 8:00-12:00</p>
                                        </div>
                                    </div>
                                </div>
                            </div>

                            {/* Información adicional */}
                            <Card className="bg-gray-50 border-0">
                                <CardContent className="p-4">
                                    <h3 className="font-medium text-gray-900 mb-2">
                                        ¿Por qué contactarnos?
                                    </h3>
                                    <ul className="text-sm text-gray-600 space-y-1">
                                        <li>• Consultas sobre productos</li>
                                        <li>• Pedidos especiales</li>
                                        <li>• Asesoría nutricional</li>
                                        <li>• Soporte post-venta</li>
                                    </ul>
                                </CardContent>
                            </Card>
                        </div>

                        {/* Formulario - lado derecho */}
                        <Card className="border border-gray-200">
                            <CardContent className="p-6">
                                {enviado ? (
                                    <div className="text-center py-8">
                                        <div className="w-16 h-16 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                            <CheckCircle className="w-8 h-8 text-green-600" />
                                        </div>
                                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                            ¡Mensaje enviado!
                                        </h3>
                                        <p className="text-gray-600 text-sm">
                                            Te responderemos lo antes posible
                                        </p>
                                    </div>
                                ) : (
                                    <>
                                        <h2 className="text-lg font-semibold text-gray-900 mb-4">
                                            Envíanos un mensaje
                                        </h2>
                                        
                                        <form onSubmit={handleSubmit} className="space-y-4">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <Input
                                                        type="text"
                                                        name="nombre"
                                                        value={formData.nombre}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Nombre"
                                                        className="h-10"
                                                    />
                                                </div>
                                                <div>
                                                    <Input
                                                        type="email"
                                                        name="email"
                                                        value={formData.email}
                                                        onChange={handleChange}
                                                        required
                                                        placeholder="Email"
                                                        className="h-10"
                                                    />
                                                </div>
                                            </div>

                                            <Input
                                                type="tel"
                                                name="telefono"
                                                value={formData.telefono}
                                                onChange={handleChange}
                                                placeholder="Teléfono (opcional)"
                                                className="h-10"
                                            />

                                            <Input
                                                type="text"
                                                name="asunto"
                                                value={formData.asunto}
                                                onChange={handleChange}
                                                required
                                                placeholder="¿En qué podemos ayudarte?"
                                                className="h-10"
                                            />

                                            <Textarea
                                                name="mensaje"
                                                value={formData.mensaje}
                                                onChange={handleChange}
                                                required
                                                rows={4}
                                                placeholder="Cuéntanos más detalles..."
                                                className="resize-none"
                                            />

                                            <Button
                                                type="submit"
                                                disabled={enviando}
                                                className="w-full h-10"
                                            >
                                                {enviando ? (
                                                    <>
                                                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin mr-2"></div>
                                                        Enviando...
                                                    </>
                                                ) : (
                                                    <>
                                                        <Send className="w-4 h-4 mr-2" />
                                                        Enviar mensaje
                                                    </>
                                                )}
                                            </Button>
                                        </form>
                                    </>
                                )}
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>

            <Footer />
        </div>
    )
}
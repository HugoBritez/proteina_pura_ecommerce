"use client"

import { useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/useCart"

export default function CarritoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemsCount } = useCart()
  const [promoCode, setPromoCode] = useState("")

  const shipping = cart.length > 0 ? (getCartTotal() > 50000 ? 0 : 8000) : 0
  const subtotal = getCartTotal()
  const total = subtotal + shipping

  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartItems={getCartItemsCount()} />
        
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
            <h1 className="font-anton text-3xl font-bold text-gray-900">Tu carrito está vacío</h1>
            <p className="text-gray-600 font-roboto max-w-md mx-auto">
              Parece que aún no has agregado ningún producto a tu carrito. ¡Explora nuestros productos premium!
            </p>
            <Link href="/productos">
              <Button className="bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium px-8 py-3">
                Ver Productos
              </Button>
            </Link>
          </div>
        </div>

        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <Link href="/productos" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Continuar Comprando
          </Link>
          <h1 className="font-anton text-4xl font-bold text-gray-900">CARRITO DE COMPRAS</h1>
          <p className="text-gray-600 font-roboto">Revisa tus productos antes de proceder al checkout</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={`${item.producto.id}-${item.sabor_seleccionado?.id || 'no-sabor'}`} className="p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.producto.url_imagen || "/placeholder.svg?height=100&width=100&text=" + encodeURIComponent(item.producto.nombre)}
                      alt={item.producto.nombre}
                      fill
                      className="object-cover rounded-lg"
                    />
                  </div>
                  
                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-anton text-lg font-bold text-gray-900">{item.producto.nombre}</h3>
                        <p className="text-sm text-gray-600">{item.producto.categoria_info?.descripcion}</p>
                        {item.sabor_seleccionado && (
                          <p className="text-sm text-gray-500">Sabor: {item.sabor_seleccionado.descripcion}</p>
                        )}
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.producto.id, item.sabor_seleccionado?.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.producto.id, item.sabor_seleccionado?.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.producto.id, item.sabor_seleccionado?.id, item.quantity + 1)}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      
                      <div className="text-right">
                        <p className="font-anton text-xl font-bold text-red-600">
                          ${(item.producto.precio * item.quantity).toLocaleString()}
                        </p>
                        <p className="text-sm text-gray-500">
                          ${item.producto.precio.toLocaleString()} c/u
                        </p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}
            
            <div className="flex justify-between items-center pt-4">
              <Button
                variant="outline"
                onClick={clearCart}
                className="text-red-600 border-red-200 hover:bg-red-50"
              >
                Vaciar Carrito
              </Button>
              <p className="text-sm text-gray-500">
                {getCartItemsCount()} {getCartItemsCount() === 1 ? 'producto' : 'productos'} en tu carrito
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="font-anton text-xl">Resumen del Pedido</CardTitle>
              </CardHeader>
              
              <CardContent className="p-0 space-y-4">
                <div className="flex justify-between">
                  <span className="font-roboto">Subtotal</span>
                  <span className="font-medium">${subtotal.toLocaleString()}</span>
                </div>
                
                <div className="flex justify-between">
                  <span className="font-roboto">Envío</span>
                  <span className="font-medium">
                    {shipping === 0 ? 'Gratis' : `$${shipping.toLocaleString()}`}
                  </span>
                </div>
                
                {shipping === 0 && subtotal > 0 && (
                  <p className="text-sm text-green-600">
                    ¡Felicidades! Tu pedido califica para envío gratis
                  </p>
                )}
                
                <Separator />
                
                <div className="flex justify-between text-lg font-bold">
                  <span className="font-anton">Total</span>
                  <span className="font-anton text-red-600">${total.toLocaleString()}</span>
                </div>
                
                <div className="space-y-3 pt-4">
                  <div className="flex gap-2">
                    <Input
                      placeholder="Código de descuento"
                      value={promoCode}
                      onChange={(e) => setPromoCode(e.target.value)}
                    />
                    <Button variant="outline">Aplicar</Button>
                  </div>
                  
                  <Button className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3">
                    Proceder al Checkout
                  </Button>
                  
                  <p className="text-xs text-gray-500 text-center">
                    Envío gratis en pedidos superiores a $50.000
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Trust Badges */}
            <Card className="p-6">
              <div className="space-y-4">
                <h3 className="font-anton text-lg font-bold">Compra Segura</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Pago 100% seguro</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Garantía de satisfacción</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Soporte 24/7</span>
                  </div>
                </div>
              </div>
            </Card>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

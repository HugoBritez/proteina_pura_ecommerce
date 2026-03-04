"use client"

import { useEffect, useState } from "react"
import Image from "next/image"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Separator } from "@/components/ui/separator"
import { Minus, Plus, Trash2, ShoppingBag, ArrowLeft, Loader2, CheckCircle2 } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { useCart } from "@/hooks/useCart"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { getVariantLabel } from "@/types/kioskit"
import { createOrder, type OrderConfirmation } from "@/lib/kioskit"

export default function CarritoPage() {
  const { cart, updateQuantity, removeFromCart, clearCart, getCartTotal, getCartItemsCount } = useCart()
  const [fullName, setFullName] = useState("")
  const [phone, setPhone] = useState("")
  const [ciRuc, setCiRuc] = useState("")
  const [address, setAddress] = useState("")
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [confirmation, setConfirmation] = useState<OrderConfirmation | null>(null)

  const hasStockIssues = cart.some((item) => item.quantity > item.variant.stock)
  const shipping = cart.length > 0 ? (getCartTotal() > 50000 ? 0 : 8000) : 0
  const subtotal = getCartTotal()
  const total = subtotal + shipping

  useEffect(() => {
    try {
      const raw = localStorage.getItem('pp_checkout')
      if (raw) {
        const data = JSON.parse(raw) as { fullName?: string; phone?: string; ciRuc?: string; address?: string }
        setFullName(data.fullName || "")
        setPhone(data.phone || "")
        setCiRuc(data.ciRuc || "")
        setAddress(data.address || "")
      }
    } catch {}
  }, [])

  useEffect(() => {
    try {
      localStorage.setItem('pp_checkout', JSON.stringify({ fullName, phone, ciRuc, address }))
    } catch {}
  }, [fullName, phone, ciRuc, address])

  async function handleSubmit() {
    if (!fullName.trim() || !phone.trim() || !ciRuc.trim() || !address.trim()) {
      setSubmitError("Por favor completá todos los campos: nombre, teléfono, CI/RUC y dirección.")
      return
    }
    if (hasStockIssues) {
      setSubmitError("Hay productos que superan el stock disponible. Ajustá las cantidades.")
      return
    }

    setSubmitting(true)
    setSubmitError(null)

    try {
      const result = await createOrder({
        customer_data: { name: fullName, phone, document_number: ciRuc, address },
        items: cart.map(i => ({ variant_id: i.variant.id, quantity: i.quantity })),
        payment_method: 'cash',
        delivery_address: address,
      })
      clearCart()
      localStorage.removeItem('pp_checkout')
      setConfirmation(result)
    } catch (e) {
      setSubmitError(e instanceof Error ? e.message : "Error al procesar el pedido. Intentá de nuevo.")
    } finally {
      setSubmitting(false)
    }
  }

  // Success screen
  if (confirmation) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartItems={0} />
        <div className="container mx-auto px-4 py-16">
          <div className="mx-auto max-w-md text-center space-y-6">
            <CheckCircle2 className="mx-auto h-20 w-20 text-green-500" />
            <div>
              <h1 className="font-anton text-3xl font-bold text-gray-900">¡Pedido recibido!</h1>
              <p className="mt-2 text-gray-500 font-roboto">
                Tu pedido fue registrado correctamente. Nos comunicaremos a la brevedad.
              </p>
            </div>
            <Card className="text-left p-6 space-y-3">
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Número de pedido</span>
                <span className="font-mono font-bold">{confirmation.order_number}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Total</span>
                <span className="font-bold text-red-600">{formatCurrency(confirmation.total)}</span>
              </div>
              <div className="flex justify-between text-sm">
                <span className="text-gray-500">Estado</span>
                <span className="capitalize text-yellow-600 font-medium">{confirmation.status}</span>
              </div>
            </Card>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <Link href="/">
                <Button variant="outline" className="w-full sm:w-auto">Ir al inicio</Button>
              </Link>
              <Link href="/productos">
                <Button className="w-full sm:w-auto bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white">
                  Seguir comprando
                </Button>
              </Link>
            </div>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  // Empty cart
  if (cart.length === 0) {
    return (
      <div className="min-h-screen bg-white">
        <Header cartItems={getCartItemsCount()} />
        <div className="container mx-auto px-4 py-16">
          <div className="text-center space-y-6">
            <ShoppingBag className="mx-auto h-24 w-24 text-gray-300" />
            <h1 className="font-anton text-3xl font-bold text-gray-900">Tu carrito está vacío</h1>
            <p className="text-gray-600 font-roboto max-w-md mx-auto">
              Parece que aún no agregaste ningún producto. ¡Explorá nuestros productos premium!
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
        <div className="mb-8">
          <Link href="/productos" className="inline-flex items-center text-red-600 hover:text-red-700 mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />Continuar Comprando
          </Link>
          <h1 className="font-anton text-4xl font-bold text-gray-900">CARRITO DE COMPRAS</h1>
          <p className="text-gray-600 font-roboto">Revisá tus productos antes de confirmar el pedido</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">
          {/* Cart Items */}
          <div className="lg:col-span-2 space-y-4">
            {cart.map((item) => (
              <Card key={`${item.product.id}-${item.variant.id}`} className="p-6">
                <div className="flex gap-4">
                  <div className="relative w-24 h-24 flex-shrink-0">
                    <Image
                      src={item.product.image_url || "/placeholder.svg?height=100&width=100"}
                      alt={item.product.name}
                      fill
                      className="object-contain rounded-lg"
                    />
                  </div>

                  <div className="flex-1 space-y-2">
                    <div className="flex justify-between items-start">
                      <div>
                        <h3 className="font-oswald text-lg font-bold text-gray-900">{item.product.name}</h3>
                        <p className="text-sm text-gray-500 font-oswald">{getVariantLabel(item.variant)}</p>
                      </div>
                      <Button
                        variant="ghost"
                        size="icon"
                        onClick={() => removeFromCart(item.product.id, item.variant.id)}
                        className="text-gray-400 hover:text-red-600"
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </div>

                    {item.quantity > item.variant.stock && (
                      <p className="text-xs text-red-600 font-medium">
                        ⚠️ Stock disponible: {item.variant.stock}
                      </p>
                    )}

                    <div className="flex justify-between items-center">
                      <div className="flex items-center space-x-3">
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.variant.id, item.quantity - 1)}
                          className="h-8 w-8"
                        >
                          <Minus className="h-3 w-3" />
                        </Button>
                        <span className="font-medium w-8 text-center">{item.quantity}</span>
                        <Button
                          variant="outline"
                          size="icon"
                          onClick={() => updateQuantity(item.product.id, item.variant.id, Math.min(item.quantity + 1, item.variant.stock))}
                          disabled={item.quantity >= item.variant.stock}
                          className="h-8 w-8"
                        >
                          <Plus className="h-3 w-3" />
                        </Button>
                      </div>
                      <div className="text-right">
                        <p className="font-oswald text-xl font-bold text-red-600">
                          {formatCurrency(item.variant.price * item.quantity)}
                        </p>
                        <p className="text-sm text-gray-500">{formatCurrency(item.variant.price)} c/u</p>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            ))}

            <div className="flex justify-between items-center pt-4">
              <Button variant="outline" onClick={clearCart} className="text-red-600 border-red-200 hover:bg-red-50">
                Vaciar Carrito
              </Button>
              <p className="text-sm text-gray-500">
                {getCartItemsCount()} {getCartItemsCount() === 1 ? 'producto' : 'productos'}
              </p>
            </div>
          </div>

          {/* Order Summary */}
          <div className="space-y-6 lg:sticky lg:top-8 lg:self-start">
            <Card className="p-6">
              <CardHeader className="p-0 mb-4">
                <CardTitle className="font-anton text-xl">Datos del pedido</CardTitle>
              </CardHeader>
              <CardContent className="p-0 space-y-4">
                <div className="space-y-3">
                  <div>
                    <Label>Nombre completo</Label>
                    <Input placeholder="Tu nombre y apellido" value={fullName} onChange={(e) => setFullName(e.target.value)} />
                  </div>
                  <div>
                    <Label>Teléfono</Label>
                    <Input placeholder="0981 000 000" value={phone} onChange={(e) => setPhone(e.target.value)} />
                  </div>
                  <div>
                    <Label>CI o RUC</Label>
                    <Input placeholder="Documento o RUC" value={ciRuc} onChange={(e) => setCiRuc(e.target.value)} />
                  </div>
                  <div>
                    <Label>Dirección</Label>
                    <Textarea
                      placeholder="Calle, número, barrio/ciudad, referencias"
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                    />
                  </div>
                </div>

                <div className="flex justify-between text-sm">
                  <span className="font-roboto text-gray-600">Subtotal</span>
                  <span className="font-medium">{formatCurrency(subtotal)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="font-roboto text-gray-600">Envío</span>
                  <span className="font-medium">{shipping === 0 ? 'Gratis' : formatCurrency(shipping)}</span>
                </div>
                {shipping === 0 && subtotal > 0 && (
                  <p className="text-xs text-green-600">¡Tu pedido califica para envío gratis!</p>
                )}
                <Separator />
                <div className="flex justify-between text-lg font-bold">
                  <span className="font-anton">Total</span>
                  <span className="font-anton text-red-600">{formatCurrency(total)}</span>
                </div>

                {submitError && (
                  <p className="text-xs text-red-600">⚠️ {submitError}</p>
                )}

                <Button
                  onClick={handleSubmit}
                  disabled={submitting || hasStockIssues}
                  className="w-full bg-gradient-to-r from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium py-3 disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {submitting ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                      Procesando...
                    </>
                  ) : (
                    "Confirmar pedido"
                  )}
                </Button>
              </CardContent>
            </Card>

            <Card className="p-6">
              <div className="space-y-3">
                <h3 className="font-anton text-lg font-bold">Compra Segura</h3>
                <div className="space-y-2 text-sm text-gray-600">
                  {["Pedido registrado al instante", "Garantía de satisfacción", "Soporte 24/7"].map((t) => (
                    <div key={t} className="flex items-center gap-2">
                      <div className="w-2 h-2 bg-green-500 rounded-full" />
                      <span>{t}</span>
                    </div>
                  ))}
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

'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { ArrowLeft } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCategorias, getProductosPorCategoria } from '@/lib/kioskit'
import { useCart } from '@/hooks/useCart'
import type { KioskitProduct, KioskitCategory, CartItem } from '@/types/kioskit'
import { ProductCard } from '@/components/productcard'

export default function CategoriaPage() {
    const [productos, setProductos] = useState<KioskitProduct[]>([])
    const [categoria, setCategoria] = useState<KioskitCategory | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addToCart, getCartItemsCount, cart } = useCart()
    const params = useParams<{ categoria: string }>()

    useEffect(() => {
        async function loadProductos() {
            try {
                setLoading(true)
                const slug = decodeURIComponent(params.categoria)

                const categorias = await getCategorias()
                const found = categorias.find(c => c.name === slug || c.name.toLowerCase() === slug.toLowerCase())

                if (!found) {
                    setError('Categoría no encontrada')
                    return
                }

                setCategoria(found)
                const prods = await getProductosPorCategoria(found.id)
                setProductos(prods.filter(p => p.image_url))
            } catch (e) {
                console.error('Error loading productos:', e)
                setError('Error al cargar los productos')
            } finally {
                setLoading(false)
            }
        }

        loadProductos()
    }, [params.categoria])

    const getBadgeText = (_producto: KioskitProduct) => null

    if (error) {
        notFound()
    }

    if (loading) {
        return (
            <div className="min-h-screen bg-white">
                <Header cartItems={getCartItemsCount()} />
                <div className="py-8 px-4">
                    <div className="max-w-7xl mx-auto">
                        <div className="text-center py-20">
                            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div>
                            <p className="mt-4 text-muted-foreground">Cargando productos...</p>
                        </div>
                    </div>
                </div>
                <Footer />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-white">
            <Header cartItems={getCartItemsCount()} />

            <div className="py-8 px-4">
                <div className="max-w-7xl mx-auto">
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                            <Link href="/productos" className="hover:text-primary transition-colors">Productos</Link>
                            <span>/</span>
                            <span className="text-foreground">{categoria?.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="font-anton text-3xl text-foreground mb-1">{categoria?.name}</h1>
                                <p className="text-muted-foreground font-roboto text-sm">{productos.length} producto{productos.length !== 1 ? 's' : ''}</p>
                            </div>
                            <Link href="/productos">
                                <Button variant="outline" className="gap-2 border-primary text-primary hover:bg-primary/10">
                                    <ArrowLeft className="w-4 h-4" />Ver todos
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {productos.length === 0 ? (
                        <div className="text-center py-20">
                            <h3 className="text-lg font-semibold text-foreground mb-2">No hay productos en esta categoría</h3>
                            <p className="text-muted-foreground mb-6">Pronto agregaremos más productos</p>
                            <Link href="/productos"><Button>Ver todos los productos</Button></Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                            {productos.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    producto={producto}
                                    addToCart={addToCart}
                                    getBadgeText={getBadgeText}
                                    cartItems={cart}
                                />
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}

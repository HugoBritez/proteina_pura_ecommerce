'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Plus, ArrowLeft, Filter } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getCategorias, getProductosPorCategoria } from '@/lib/kioskit'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCart } from '@/hooks/useCart'
import { getProductPrice, isProductAvailable, getVariantLabel } from '@/types/kioskit'
import type { KioskitProduct, KioskitCategory } from '@/types/kioskit'
import { ProductCard } from '@/components/productcard'

export default function CategoriaPage() {
    const [productos, setProductos] = useState<KioskitProduct[]>([])
    const [categoria, setCategoria] = useState<KioskitCategory | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addToCart, getCartItemsCount } = useCart()
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
                setProductos(prods)
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
                            <p className="mt-4 text-gray-600">Cargando productos...</p>
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
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Link href="/productos" className="hover:text-primary transition-colors">Productos</Link>
                            <span>/</span>
                            <span className="text-gray-900">{categoria?.name}</span>
                        </div>

                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">{categoria?.name}</h1>
                                <p className="text-gray-600">{productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}</p>
                            </div>
                            <Link href="/productos">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />Ver todos los productos
                                </Button>
                            </Link>
                        </div>
                    </div>

                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Filtros:</span>
                            </div>
                            <Badge variant="secondary" className="bg-white">{productos.length} productos</Badge>
                        </div>
                        <div className="text-sm text-gray-500">Ordenado por: Más recientes</div>
                    </div>

                    {productos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">No hay productos en esta categoría</h3>
                            <p className="text-gray-600 mb-6">Pronto agregaremos más productos a esta categoría</p>
                            <Link href="/productos"><Button>Ver todos los productos</Button></Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productos.map((producto) => (
                                <ProductCard
                                    key={producto.id}
                                    producto={producto}
                                    addToCart={addToCart}
                                    getBadgeText={getBadgeText}
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

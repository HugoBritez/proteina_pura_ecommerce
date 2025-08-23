'use client'

import { useState, useEffect } from 'react'
import { notFound, useParams } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import { Button } from '@/components/ui/button'
import { Card, CardContent, CardFooter } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Star, Plus, ArrowLeft, Filter } from 'lucide-react'
import { Header } from '@/components/header'
import { Footer } from '@/components/footer'
import { getProductosPorCategoriaSlug } from '@/lib/products'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { useCart } from '@/hooks/useCart'
import type { ProductoConDetalles, Categoria } from '@/types/database'

export default function CategoriaPage() {
    const [productos, setProductos] = useState<ProductoConDetalles[]>([])
    const [categoria, setCategoria] = useState<Categoria | null>(null)
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState<string | null>(null)
    const { addToCart, getCartItemsCount } = useCart()
    const params = useParams<{ categoria: string }>()

    useEffect(() => {
        async function loadProductos() {
            try {
                setLoading(true)
                const { productos: productosData, categoria: categoriaData } = await getProductosPorCategoriaSlug(params.categoria)
                
                if (!categoriaData) {
                    setError('Categoría no encontrada')
                    return
                }
                
                setProductos(productosData)
                setCategoria(categoriaData)
            } catch (error) {
                console.error('Error loading productos:', error)
                setError('Error al cargar los productos')
            } finally {
                setLoading(false)
            }
        }

        loadProductos()
    }, [params.categoria])

    const getBadgeText = (producto: ProductoConDetalles) => {
        if (producto.isOferta) return "Oferta"
        if (producto.categoria_info?.descripcion.toLowerCase().includes('vegetal')) return "Vegano"
        return "Premium"
    }

    const calculateDiscount = (precio: number) => {
        // Simular precio original con 20% de descuento
        return Math.round(precio * 1.25)
    }

    const handleAddToCart = (producto: ProductoConDetalles) => {
        addToCart(producto, undefined)
    }

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
                    {/* Breadcrumb y título */}
                    <div className="mb-8">
                        <div className="flex items-center gap-2 text-sm text-gray-500 mb-4">
                            <Link href="/productos" className="hover:text-primary transition-colors">
                                Productos
                            </Link>
                            <span>/</span>
                            <span className="text-gray-900">{categoria?.descripcion}</span>
                        </div>
                        
                        <div className="flex items-center justify-between">
                            <div>
                                <h1 className="text-3xl font-bold text-gray-900 mb-2">
                                    {categoria?.descripcion}
                                </h1>
                                <p className="text-gray-600">
                                    {productos.length} producto{productos.length !== 1 ? 's' : ''} encontrado{productos.length !== 1 ? 's' : ''}
                                </p>
                            </div>
                            
                            <Link href="/productos">
                                <Button variant="outline" className="gap-2">
                                    <ArrowLeft className="w-4 h-4" />
                                    Ver todos los productos
                                </Button>
                            </Link>
                        </div>
                    </div>

                    {/* Filtros y ordenamiento */}
                    <div className="flex items-center justify-between mb-6 p-4 bg-gray-50 rounded-lg">
                        <div className="flex items-center gap-4">
                            <div className="flex items-center gap-2">
                                <Filter className="w-4 h-4 text-gray-500" />
                                <span className="text-sm text-gray-600">Filtros:</span>
                            </div>
                            <Badge variant="secondary" className="bg-white">
                                {productos.length} productos
                            </Badge>
                        </div>
                        
                        <div className="text-sm text-gray-500">
                            Ordenado por: Más recientes
                        </div>
                    </div>

                    {/* Grid de productos */}
                    {productos.length === 0 ? (
                        <div className="text-center py-20">
                            <div className="w-24 h-24 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <Filter className="w-12 h-12 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-semibold text-gray-900 mb-2">
                                No hay productos en esta categoría
                            </h3>
                            <p className="text-gray-600 mb-6">
                                Pronto agregaremos más productos a esta categoría
                            </p>
                            <Link href="/productos">
                                <Button>
                                    Ver todos los productos
                                </Button>
                            </Link>
                        </div>
                    ) : (
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                            {productos.map((producto) => (
                                <Card key={producto.id} className="group hover:shadow-lg transition-all duration-200 border-gray-200">
                                    <CardContent className="p-4">
                                        {/* Imagen del producto */}
                                        <div className="relative mb-4">
                                            <div className="aspect-square bg-gray-100 rounded-lg overflow-hidden">
                                                <Image
                                                    src={producto.url_imagen}
                                                    alt={producto.nombre}
                                                    width={400}
                                                    height={400}
                                                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                                                />
                                            </div>
                                            
                                            {/* Badge de oferta */}
                                            {producto.isOferta && (
                                                <Badge className="absolute top-2 left-2 bg-red-600 text-white">
                                                    Oferta
                                                </Badge>
                                            )}
                                            
                                            {/* Badge de categoría */}
                                            <Badge variant="secondary" className="absolute top-2 right-2 bg-white/90 text-gray-700">
                                                {getBadgeText(producto)}
                                            </Badge>
                                        </div>

                                        {/* Información del producto */}
                                        <div className="space-y-2">
                                            <h3 className="font-semibold text-gray-900 line-clamp-2 group-hover:text-primary transition-colors">
                                                {producto.nombre}
                                            </h3>
                                            
                                            <p className="text-sm text-gray-600 line-clamp-2">
                                                {producto.descripcion}
                                            </p>

                                            {/* Sabores disponibles */}
                                            {producto.sabores_info && producto.sabores_info.length > 0 && (
                                                <div className="flex flex-wrap gap-1">
                                                    {producto.sabores_info.slice(0, 3).map((sabor) => (
                                                        <Badge key={sabor.id} variant="outline" className="text-xs">
                                                            {sabor.descripcion}
                                                        </Badge>
                                                    ))}
                                                    {producto.sabores_info.length > 3 && (
                                                        <Badge variant="outline" className="text-xs">
                                                            +{producto.sabores_info.length - 3}
                                                        </Badge>
                                                    )}
                                                </div>
                                            )}

                                            {/* Precio */}
                                            <div className="flex items-center gap-2">
                                                {producto.isOferta ? (
                                                    <>
                                                        <span className="text-lg font-bold text-red-600">
                                                            {formatCurrency(producto.precio)}
                                                        </span>
                                                        <span className="text-sm text-gray-500 line-through">
                                                            {formatCurrency(calculateDiscount(producto.precio))}
                                                        </span>
                                                    </>
                                                ) : (
                                                    <span className="text-lg font-bold text-gray-900">
                                                        {formatCurrency(producto.precio)}
                                                    </span>
                                                )}
                                            </div>

                                            {/* Stock */}
                                            <div className="text-sm text-gray-500">
                                                {producto.cantidad_stock > 0 ? (
                                                    <span className="text-green-600">✓ En stock</span>
                                                ) : (
                                                    <span className="text-red-600">✗ Sin stock</span>
                                                )}
                                            </div>
                                        </div>
                                    </CardContent>

                                    <CardFooter className="p-4 pt-0">
                                        <Button 
                                            onClick={() => handleAddToCart(producto)}
                                            disabled={producto.cantidad_stock === 0}
                                            className="w-full gap-2"
                                        >
                                            <Plus className="w-4 h-4" />
                                            Agregar al carrito
                                        </Button>
                                    </CardFooter>
                                </Card>
                            ))}
                        </div>
                    )}
                </div>
            </div>

            <Footer />
        </div>
    )
}
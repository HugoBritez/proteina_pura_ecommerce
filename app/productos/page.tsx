"use client"

import { useState, useEffect, useCallback } from "react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Filter, Search, CheckCircle } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductos, getCategorias, buscarProductos } from "@/lib/kioskit"
import { useCart } from "@/hooks/useCart"
import type { KioskitProduct, KioskitCategory } from "@/types/kioskit"
import { getProductPrice, isProductAvailable } from "@/types/kioskit"
import { ProductCard } from "@/components/productcard"
import { Suspense } from "react"

function ProductsPageInner() {
  const [allProducts, setAllProducts] = useState<KioskitProduct[]>([])
  const [categorias, setCategorias] = useState<KioskitCategory[]>([])
  const [loading, setLoading] = useState(true)

  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [sortBy, setSortBy] = useState("default")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)

  const { addToCart, getCartItemsCount } = useCart()
  const searchParams = useSearchParams()

  const [showCartFeedback, setShowCartFeedback] = useState(false)
  const [lastAddedProduct, setLastAddedProduct] = useState<string>("")

  const handleAddToCart = (productName: string) => {
    setLastAddedProduct(productName)
    setShowCartFeedback(true)
    setTimeout(() => setShowCartFeedback(false), 3000)
  }

  useEffect(() => {
    const initialSearch = searchParams.get('search') || ''
    setSearchQuery(initialSearch)

    Promise.all([getProductos(), getCategorias()])
      .then(([prods, cats]) => {
        setAllProducts(prods)
        setCategorias(cats)
      })
      .catch(console.error)
      .finally(() => setLoading(false))
  }, [])

  const filteredProducts = (() => {
    let products = searchQuery.trim()
      ? buscarProductos(searchQuery, allProducts)
      : allProducts

    if (selectedCategory !== null) {
      products = products.filter(p => p.category_id === selectedCategory)
    }
    if (showOnlyInStock) {
      products = products.filter(p => isProductAvailable(p))
    }
    return products
  })()

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "precio-asc": return getProductPrice(a) - getProductPrice(b)
      case "precio-desc": return getProductPrice(b) - getProductPrice(a)
      case "nombre": return a.name.localeCompare(b.name)
      default: return 0
    }
  })

  const getBadgeText = (_producto: KioskitProduct) => null

  const FilterSidebar = () => (
    <div className="space-y-6">
      <div className="space-y-2">
        <h3 className="font-oswald text-lg font-bold">Buscar</h3>
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
          <Input
            placeholder="Buscar productos..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-oswald text-lg font-bold">Categorías</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === null ? "bg-red-100 text-red-700 font-medium" : "hover:bg-gray-100"}`}
          >
            <div className="flex justify-between items-center">
              <span className="font-roboto">Todas las Categorías</span>
              <span className="text-sm text-gray-500">({allProducts.length})</span>
            </div>
          </button>
          {categorias.map((cat) => {
            const count = allProducts.filter(p => p.category_id === cat.id).length
            return (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${selectedCategory === cat.id ? "bg-red-100 text-red-700 font-medium" : "hover:bg-gray-100"}`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-roboto">{cat.name}</span>
                  <span className="text-sm text-gray-500">({count})</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      <div className="space-y-2">
        <h3 className="font-oswald text-lg font-bold">Filtros</h3>
        <div className="flex items-center space-x-2">
          <Checkbox
            id="in-stock"
            checked={showOnlyInStock}
            onCheckedChange={(v) => setShowOnlyInStock(v as boolean)}
          />
          <Label htmlFor="in-stock" className="font-roboto text-sm">Solo en stock</Label>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="font-anton text-4xl font-bold text-gray-900 mb-2">NUESTROS PRODUCTOS</h1>
          <p className="text-gray-600 font-roboto">Descubre nuestra gama completa de proteínas premium para maximizar tu rendimiento</p>
        </div>

        <div className="flex gap-8">
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24"><FilterSidebar /></div>
          </div>

          <div className="flex-1">
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="py-4"><FilterSidebar /></div>
                </SheetContent>
              </Sheet>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Más Recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="nombre">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-gray-600 font-roboto">Mostrando {sortedProducts.length} de {allProducts.length} productos</p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48"><SelectValue placeholder="Ordenar por" /></SelectTrigger>
                <SelectContent>
                  <SelectItem value="default">Más Recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="nombre">Nombre A-Z</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="p-0"><div className="h-64 bg-gray-200 rounded-t-lg"></div></CardHeader>
                    <CardContent className="p-6 space-y-4">
                      <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                      <div className="h-3 bg-gray-200 rounded w-full"></div>
                      <div className="h-6 bg-gray-200 rounded w-1/2"></div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {sortedProducts.map((producto) => (
                  <ProductCard
                    key={producto.id}
                    producto={producto}
                    addToCart={addToCart}
                    getBadgeText={getBadgeText}
                    onAddToCart={handleAddToCart}
                  />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-roboto text-lg">No se encontraron productos que coincidan con tus filtros.</p>
                <Button
                  onClick={() => { setSelectedCategory(null); setSearchQuery(""); setShowOnlyInStock(false) }}
                  variant="outline"
                  className="mt-4"
                >
                  Limpiar Filtros
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

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

      <Footer />
    </div>
  )
}

export default function ProductsPage() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600"></div></div>}>
      <ProductsPageInner />
    </Suspense>
  )
}

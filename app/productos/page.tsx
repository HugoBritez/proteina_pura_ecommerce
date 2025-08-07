"use client"

import { useState, useEffect } from "react"
import Image from "next/image"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardFooter, CardHeader } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { Star, Filter, Plus, Search } from 'lucide-react'
import { Header } from "@/components/header"
import { Footer } from "@/components/footer"
import { getProductos, getCategorias, getSabores, buscarProductos } from "@/lib/products"
import { useCart } from "@/hooks/useCart"
import type { ProductoConDetalles, Categoria, Sabor } from "@/types/database"
import { formatCurrency } from "@/lib/utils/formatCurrency"
import { ProductCard } from "@/components/productcard"

export default function ProductsPage() {
  const [productos, setProductos] = useState<ProductoConDetalles[]>([])
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [loading, setLoading] = useState(true)
  
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null)
  const [selectedSabores, setSelectedSabores] = useState<number[]>([])
  const [sortBy, setSortBy] = useState("created_at")
  const [searchQuery, setSearchQuery] = useState("")
  const [showOnlyInStock, setShowOnlyInStock] = useState(false)
  const [showOnlyOffers, setShowOnlyOffers] = useState(false)

  const { addToCart, getCartItemsCount } = useCart()

  useEffect(() => {
    async function loadData() {
      try {
        const [productosData, categoriasData, saboresData] = await Promise.all([
          getProductos(),
          getCategorias(),
          getSabores()
        ])
        
        setProductos(productosData)
        setCategorias(categoriasData)
        setSabores(saboresData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  useEffect(() => {
    async function handleSearch() {
      if (searchQuery.trim()) {
        setLoading(true)
        try {
          const results = await buscarProductos(searchQuery)
          setProductos(results)
        } catch (error) {
          console.error('Error searching products:', error)
        } finally {
          setLoading(false)
        }
      } else {
        // Si no hay búsqueda, cargar todos los productos
        setLoading(true)
        try {
          const allProducts = await getProductos()
          setProductos(allProducts)
        } catch (error) {
          console.error('Error loading products:', error)
        } finally {
          setLoading(false)
        }
      }
    }

    const debounceTimer = setTimeout(handleSearch, 300)
    return () => clearTimeout(debounceTimer)
  }, [searchQuery])

  const filteredProducts = productos.filter(producto => {
    const matchesCategory = selectedCategory === null || producto.categoria === selectedCategory
    const matchesSabor = selectedSabores.length === 0 || 
      (producto.sabores && producto.sabores.some(saborId => selectedSabores.includes(saborId)))
    const matchesStock = !showOnlyInStock || producto.cantidad_stock > 0
    const matchesOffers = !showOnlyOffers || producto.isOferta
    
    return matchesCategory && matchesSabor && matchesStock && matchesOffers
  })

  const sortedProducts = [...filteredProducts].sort((a, b) => {
    switch (sortBy) {
      case "precio-asc":
        return a.precio - b.precio
      case "precio-desc":
        return b.precio - a.precio
      case "nombre":
        return a.nombre.localeCompare(b.nombre)
      case "stock":
        return b.cantidad_stock - a.cantidad_stock
      default:
        return new Date(b.created_at).getTime() - new Date(a.created_at).getTime()
    }
  })

  const handleSaborChange = (saborId: number, checked: boolean) => {
    if (checked) {
      setSelectedSabores([...selectedSabores, saborId])
    } else {
      setSelectedSabores(selectedSabores.filter(id => id !== saborId))
    }
  }

  const getBadgeText = (producto: ProductoConDetalles) => {
    if (producto.isOferta) return "Oferta"
    if (producto.categoria_info?.descripcion.toLowerCase().includes('vegetal')) return "Vegano"
    return null
  }

  const calculateDiscount = (precio: number) => {
    return Math.round(precio * 1.25)
  }

  const FilterSidebar = () => (
    <div className="space-y-6">
      {/* Search */}
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

      {/* Categories */}
      <div className="space-y-2">
        <h3 className="font-oswald text-lg font-bold">Categorías</h3>
        <div className="space-y-2">
          <button
            onClick={() => setSelectedCategory(null)}
            className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
              selectedCategory === null
                ? "bg-red-100 text-red-700 font-medium"
                : "hover:bg-gray-100"
            }`}
          >
            <div className="flex justify-between items-center">
              <span className="font-roboto">Todas las Categorías</span>
              <span className="text-sm text-gray-500">({productos.length})</span>
            </div>
          </button>
          {categorias.map((categoria) => {
            const count = productos.filter(p => p.categoria === categoria.id).length
            return (
              <button
                key={categoria.id}
                onClick={() => setSelectedCategory(categoria.id)}
                className={`w-full text-left px-3 py-2 rounded-lg transition-colors ${
                  selectedCategory === categoria.id
                    ? "bg-red-100 text-red-700 font-medium"
                    : "hover:bg-gray-100"
                }`}
              >
                <div className="flex justify-between items-center">
                  <span className="font-roboto">{categoria.descripcion}</span>
                  <span className="text-sm text-gray-500">({count})</span>
                </div>
              </button>
            )
          })}
        </div>
      </div>

      {/* Sabores */}
      <div className="space-y-2">
        <h3 className="font-oswald text-lg font-bold">Sabores</h3>
        <div className="space-y-2">
          {sabores.map((sabor) => (
            <div key={sabor.id} className="flex items-center space-x-2">
              <Checkbox
                id={`sabor-${sabor.id}`}
                checked={selectedSabores.includes(sabor.id)}
                onCheckedChange={(checked) => handleSaborChange(sabor.id, checked as boolean)}
              />
              <Label htmlFor={`sabor-${sabor.id}`} className="font-roboto text-sm">
                {sabor.descripcion}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Filters */}
      <div className="space-y-2">
        <h3 className="font-oswald text-lg font-bold">Filtros</h3>
        <div className="space-y-2">
          <div className="flex items-center space-x-2">
            <Checkbox
              id="in-stock"
              checked={showOnlyInStock}
              onCheckedChange={(checked) => setShowOnlyInStock(checked as boolean)}
            />
            <Label htmlFor="in-stock" className="font-roboto text-sm">
              Solo en stock
            </Label>
          </div>
          <div className="flex items-center space-x-2">
            <Checkbox
              id="offers"
              checked={showOnlyOffers}
              onCheckedChange={(checked) => setShowOnlyOffers(checked as boolean)}
            />
            <Label htmlFor="offers" className="font-roboto text-sm">
              Solo ofertas
            </Label>
          </div>
        </div>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-white">
      <Header cartItems={getCartItemsCount()} />
      
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="font-anton text-4xl font-bold text-gray-900 mb-2">
            NUESTROS PRODUCTOS
          </h1>
          <p className="text-gray-600 font-roboto">
            Descubre nuestra gama completa de proteínas premium para maximizar tu rendimiento
          </p>
        </div>

        <div className="flex gap-8">
          {/* Desktop Sidebar */}
          <div className="hidden lg:block w-64 flex-shrink-0">
            <div className="sticky top-24">
              <FilterSidebar />
            </div>
          </div>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter & Sort */}
            <div className="flex justify-between items-center mb-6 lg:hidden">
              <Sheet>
                <SheetTrigger asChild>
                  <Button variant="outline" className="flex items-center gap-2">
                    <Filter className="h-4 w-4" />
                    Filtros
                  </Button>
                </SheetTrigger>
                <SheetContent side="left" className="w-80">
                  <div className="py-4">
                    <FilterSidebar />
                  </div>
                </SheetContent>
              </Sheet>

              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Más Recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="nombre">Nombre A-Z</SelectItem>
                  <SelectItem value="stock">Mayor Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Desktop Sort */}
            <div className="hidden lg:flex justify-between items-center mb-6">
              <p className="text-gray-600 font-roboto">
                Mostrando {sortedProducts.length} de {productos.length} productos
              </p>
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger className="w-48">
                  <SelectValue placeholder="Ordenar por" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="created_at">Más Recientes</SelectItem>
                  <SelectItem value="precio-asc">Precio: Menor a Mayor</SelectItem>
                  <SelectItem value="precio-desc">Precio: Mayor a Menor</SelectItem>
                  <SelectItem value="nombre">Nombre A-Z</SelectItem>
                  <SelectItem value="stock">Mayor Stock</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Products Grid */}
            {loading ? (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
                {[1, 2, 3, 4, 5, 6].map((i) => (
                  <Card key={i} className="animate-pulse">
                    <CardHeader className="p-0">
                      <div className="h-64 bg-gray-200 rounded-t-lg"></div>
                    </CardHeader>
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
                    calculateDiscount={calculateDiscount}
                  />
                ))}
              </div>
            )}

            {sortedProducts.length === 0 && !loading && (
              <div className="text-center py-12">
                <p className="text-gray-500 font-roboto text-lg">
                  No se encontraron productos que coincidan con tus filtros.
                </p>
                <Button 
                  onClick={() => {
                    setSelectedCategory(null)
                    setSelectedSabores([])
                    setSearchQuery("")
                    setShowOnlyInStock(false)
                    setShowOnlyOffers(false)
                  }}
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

      <Footer />
    </div>
  )
}

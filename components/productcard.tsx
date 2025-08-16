import { ProductoConDetalles, Sabor } from "@/types/database";
import { Badge } from "./ui/badge";
import { formatCurrency } from "@/lib/utils/formatCurrency";
import { Card, CardHeader, CardContent, CardFooter } from "./ui/card";
import { Button } from "./ui/button";
import { Plus } from "lucide-react";
import Image from "next/image";
import { useState } from "react";


interface ProductCardProps
{
    producto: ProductoConDetalles
    addToCart: (producto: ProductoConDetalles, sabor?: Sabor) => void
    getBadgeText: (producto: ProductoConDetalles) => string | null
    calculateDiscount: (precio: number) => number
}

export function ProductCard({ producto, addToCart, getBadgeText, calculateDiscount }: ProductCardProps) {
  const [saborSeleccionado, setSaborSeleccionado] = useState<Sabor | null>(
    producto.sabores_info && producto.sabores_info.length > 0 
      ? producto.sabores_info[0] 
      : null
  );

  return (
    <Card key={producto.id} className="group hover:shadow-xl transition-all duration-300 border-0 shadow-lg">
                    <CardHeader className="relative p-0">
                      <div className="relative overflow-hidden rounded-t-lg">
                        <Image
                          src={(producto.galeria_urls && producto.galeria_urls.length > 0 ? producto.galeria_urls[0] : producto.url_imagen) || 
                               "/placeholder.svg?height=300&width=300&text=" + encodeURIComponent(producto.nombre)}
                          alt={producto.nombre}
                          width={300}
                          height={300}
                          className="w-full h-64 object-cover group-hover:scale-105 transition-transform duration-300"
                        />
                        {getBadgeText(producto) && (
                          <Badge className="absolute top-4 left-4 bg-red-600 text-white">
                            {getBadgeText(producto)}
                          </Badge>
                        )}
                        {producto.cantidad_stock === 0 && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                            <Badge variant="secondary" className="bg-gray-800 text-white">
                              Agotado
                            </Badge>
                          </div>
                        )}
                      </div>
                    </CardHeader>
                    
                    <CardContent className="p-6 space-y-4">
                      <div className="space-y-2">
                        <h3 className="font-oswald text-xl font-bold text-gray-900">{producto.nombre}</h3>
                        <p className="text-gray-600 font-roboto text-sm">{producto.descripcion}</p>
                        <div className="flex justify-between text-sm text-gray-500">
                          <span>Categoría: {producto.categoria_info?.descripcion}</span>
                        </div>
                        {producto.sabores_info && producto.sabores_info.length > 0 ? (
                          // Producto CON sabores
                          <div className="space-y-2">
                            <p className="text-sm font-medium text-gray-700">Sabores disponibles:</p>
                            <div className="flex flex-wrap gap-2">
                              {producto.sabores_info.map((sabor) => (
                                <button
                                  key={sabor.id}
                                  onClick={() => setSaborSeleccionado(sabor)}
                                  className={`px-3 py-1.5 text-xs rounded-full border transition-all ${
                                    saborSeleccionado?.id === sabor.id
                                      ? 'bg-red-600 text-white border-red-600 shadow-md'
                                      : 'bg-white text-gray-700 border-gray-300 hover:border-red-400 hover:text-red-600 hover:shadow-sm'
                                  }`}
                                >
                                  {sabor.descripcion}
                                </button>
                              ))}
                            </div>
                            {!saborSeleccionado && (
                              <p className="text-xs text-amber-600">⚠️ Selecciona un sabor para continuar</p>
                            )}
                          </div>
                        ) : (
                          // Producto SIN sabores
                          <div className="text-sm text-gray-500">
                            <span className="text-green-600">✓</span> Producto sin variantes
                          </div>
                        )}
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="font-anton text-2xl font-semi text-red-600">
                          {formatCurrency(producto.precio)}
                        </span>
                        {saborSeleccionado && (
                          <Badge variant="outline" className="text-xs">
                            {saborSeleccionado.descripcion}
                          </Badge>
                        )}
                        {producto.isOferta && (
                          <span className="text-lg text-gray-400 line-through">
                            {formatCurrency(calculateDiscount(producto.precio))}
                          </span>
                        )}
                      </div>
                    </CardContent>
                    
                    <CardFooter className="p-6 pt-0">
                      <Button 
                        onClick={() => addToCart(producto, saborSeleccionado ||  undefined)}
                        disabled={producto.cantidad_stock === 0 || (producto.sabores_info && producto.sabores_info.length > 0 && !saborSeleccionado)}
                        className="w-full bg-gradient-to-r disabled:opacity-50 disabled:cursor-not-allowed disabled:bg-gray-300 from-red-600 to-red-700 hover:from-red-700 hover:to-red-800 text-white font-medium"
                      >
                        <Plus className="mr-2 h-4 w-4" />
                        {producto.cantidad_stock === 0 
                          ? "Agotado"
                          : producto.sabores_info && producto.sabores_info.length > 0
                            ? !saborSeleccionado 
                              ? "Selecciona un sabor" 
                              : `Agregar ${saborSeleccionado.descripcion}`
                            : "Agregar al Carrito"
                        }
                      </Button>
                    </CardFooter>
                  </Card>
  )
}
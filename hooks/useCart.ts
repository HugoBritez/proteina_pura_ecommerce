"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CartItem, ProductoConDetalles, Sabor } from '@/types/database'

const CART_STORAGE_KEY = 'proteina-pura-cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        // Validar que sea un array
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      // Limpiar localStorage corrupto
      localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart, isLoading])

  const addToCart = useCallback((producto: ProductoConDetalles, sabor?: Sabor) => {
    setCart(prevCart => {
      const existingItemIndex = prevCart.findIndex(
        item => item.producto.id === producto.id && 
                 item.sabor_seleccionado?.id === sabor?.id
      )

      if (existingItemIndex > -1) {
        // Si el producto ya existe, incrementar cantidad
        const updatedCart = [...prevCart]
        updatedCart[existingItemIndex].quantity += 1
        return updatedCart
      } else {
        // Si es nuevo, agregarlo al carrito
        return [...prevCart, {
          producto,
          quantity: 1,
          sabor_seleccionado: sabor
        }]
      }
    })
  }, [])

  const removeFromCart = useCallback((productId: number, saborId?: number) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.producto.id === productId && 
          item.sabor_seleccionado?.id === saborId)
      )
    )
  }, [])

  const updateQuantity = useCallback((productId: number, saborId: number | undefined, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, saborId)
      return
    }

    setCart(prevCart =>
      prevCart.map(item =>
        item.producto.id === productId && 
        item.sabor_seleccionado?.id === saborId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  // Memoizar cálculos costosos
  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.producto.precio * item.quantity), 0)
  }, [cart])

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const isCartEmpty = useMemo(() => {
    return cart.length === 0
  }, [cart])

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () => cartTotal,
    getCartItemsCount: () => cartItemsCount,
    isCartEmpty
  }
}

"use client"

import { useState, useEffect } from 'react'
import type { CartItem, ProductoConDetalles, Sabor } from '@/types/database'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])

  // Cargar carrito desde localStorage al inicializar
  useEffect(() => {
    const savedCart = localStorage.getItem('proteina-pura-cart')
    if (savedCart) {
      try {
        setCart(JSON.parse(savedCart))
      } catch (error) {
        console.error('Error loading cart from localStorage:', error)
      }
    }
  }, [])

  // Guardar carrito en localStorage cuando cambie
  useEffect(() => {
    localStorage.setItem('proteina-pura-cart', JSON.stringify(cart))
  }, [cart])

  const addToCart = (producto: ProductoConDetalles, sabor?: Sabor) => {
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
  }

  const removeFromCart = (productId: number, saborId?: number) => {
    setCart(prevCart => 
      prevCart.filter(item => 
        !(item.producto.id === productId && 
          item.sabor_seleccionado?.id === saborId)
      )
    )
  }

  const updateQuantity = (productId: number, saborId: number | undefined, newQuantity: number) => {
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
  }

  const clearCart = () => {
    setCart([])
  }

  const getCartTotal = () => {
    return cart.reduce((total, item) => total + (item.producto.precio * item.quantity), 0)
  }

  const getCartItemsCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }

  return {
    cart,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal,
    getCartItemsCount
  }
}

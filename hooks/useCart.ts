"use client"

import { useState, useEffect, useCallback, useMemo } from 'react'
import type { CartItem, KioskitProduct, KioskitVariant } from '@/types/kioskit'

const CART_STORAGE_KEY = 'proteina-pura-cart'

export function useCart() {
  const [cart, setCart] = useState<CartItem[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    try {
      const savedCart = localStorage.getItem(CART_STORAGE_KEY)
      if (savedCart) {
        const parsedCart = JSON.parse(savedCart)
        if (Array.isArray(parsedCart)) {
          setCart(parsedCart)
        }
      }
    } catch (error) {
      console.error('Error loading cart from localStorage:', error)
      localStorage.removeItem(CART_STORAGE_KEY)
    } finally {
      setIsLoading(false)
    }
  }, [])

  useEffect(() => {
    if (!isLoading) {
      try {
        localStorage.setItem(CART_STORAGE_KEY, JSON.stringify(cart))
      } catch (error) {
        console.error('Error saving cart to localStorage:', error)
      }
    }
  }, [cart, isLoading])

  const addToCart = useCallback((product: KioskitProduct, variant: KioskitVariant) => {
    const key = `${product.id}-${variant.id}`
    setCart(prevCart => {
      const existingIndex = prevCart.findIndex(
        item => `${item.product.id}-${item.variant.id}` === key
      )
      if (existingIndex > -1) {
        const updated = [...prevCart]
        updated[existingIndex] = { ...updated[existingIndex], quantity: updated[existingIndex].quantity + 1 }
        return updated
      }
      return [...prevCart, { product, variant, quantity: 1 }]
    })
  }, [])

  const removeFromCart = useCallback((productId: string, variantId: string) => {
    setCart(prevCart =>
      prevCart.filter(item =>
        !(item.product.id === productId && item.variant.id === variantId)
      )
    )
  }, [])

  const updateQuantity = useCallback((productId: string, variantId: string, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeFromCart(productId, variantId)
      return
    }
    setCart(prevCart =>
      prevCart.map(item =>
        item.product.id === productId && item.variant.id === variantId
          ? { ...item, quantity: newQuantity }
          : item
      )
    )
  }, [removeFromCart])

  const clearCart = useCallback(() => {
    setCart([])
  }, [])

  const cartTotal = useMemo(() => {
    return cart.reduce((total, item) => total + (item.variant.price * item.quantity), 0)
  }, [cart])

  const cartItemsCount = useMemo(() => {
    return cart.reduce((total, item) => total + item.quantity, 0)
  }, [cart])

  const isCartEmpty = useMemo(() => cart.length === 0, [cart])

  return {
    cart,
    isLoading,
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getCartTotal: () => cartTotal,
    getCartItemsCount: () => cartItemsCount,
    isCartEmpty,
  }
}

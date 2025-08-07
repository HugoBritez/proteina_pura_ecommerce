"use client"

import { useState } from "react"
import Link from "next/link"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Search, Menu, User, Heart } from 'lucide-react'

interface HeaderProps {
  cartItems?: number
}

export function Header({ cartItems = 0 }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          {/* Logo */}
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-anton text-2xl font-bold text-red-600">PROTEÍNA PURA</div>
          </Link>

          {/* Desktop Navigation */}
          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              {/*}
              <NavigationMenuItem>
                <NavigationMenuTrigger className="font-roboto font-medium">Productos</NavigationMenuTrigger>
                <NavigationMenuContent>
                  <div className="grid gap-3 p-6 w-[400px]">
                    <div className="grid gap-1">
                      <h3 className="font-anton font-bold text-red-600">Proteínas</h3>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/productos"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-50"
                        >
                          <div className="text-sm font-medium leading-none">Todos los Productos</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Explora nuestra gama completa
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/productos?categoria=whey"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-50"
                        >
                          <div className="text-sm font-medium leading-none">Whey Protein</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                            Proteína de suero de absorción rápida
                          </p>
                        </Link>
                      </NavigationMenuLink>
                      <NavigationMenuLink asChild>
                        <Link
                          href="/productos?categoria=vegetal"
                          className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-red-50"
                        >
                          <div className="text-sm font-medium leading-none">Proteína Vegetal</div>
                          <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">100% origen vegetal</p>
                        </Link>
                      </NavigationMenuLink>
                    </div>
                  </div>
                </NavigationMenuContent>
              </NavigationMenuItem>
              */}
              <NavigationMenuItem>
                <Link
                  href="/productos"
                  className="font-roboto font-medium px-4 py-2 hover:text-red-600 transition-colors"
                >
                  Productos
                </Link>
              </NavigationMenuItem>

              <NavigationMenuItem>
                <Link
                  href="/ofertas"
                  className="font-roboto font-medium px-4 py-2 hover:text-red-600 transition-colors"
                >
                  Ofertas
                </Link>
              </NavigationMenuItem>
{/*
              <NavigationMenuItem>
                <Link href="/blog" className="font-roboto font-medium px-4 py-2 hover:text-red-600 transition-colors">
                  Blog
                </Link>
              </NavigationMenuItem>
*/}
              <NavigationMenuItem>
                <Link
                  href="/contacto"
                  className="font-roboto font-medium px-4 py-2 hover:text-red-600 transition-colors"
                >
                  Contacto
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          {/* Search Bar */}
          <div className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 border-gray-200 focus:border-red-300 focus:ring-red-200"
              />
            </div>
          </div>

          {/* Actions */}
          <div className="flex items-center space-x-4">
            {/* Mobile Search */}
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            {/* Wishlist */}
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <Heart className="h-5 w-5" />
            </Button>

            {/* Account 
            <Button variant="ghost" size="icon" className="hidden sm:flex">
              <User className="h-5 w-5" />
            </Button>
*/}
            {/* Cart */}
            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-red-600 text-white text-xs">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>

            {/* Mobile Menu */}
            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link
                    href="/productos"
                    className="font-roboto font-medium text-lg hover:text-red-600 transition-colors"
                  >
                    Productos
                  </Link>
                  <Link
                    href="/ofertas"
                    className="font-roboto font-medium text-lg hover:text-red-600 transition-colors"
                  >
                    Ofertas
                  </Link>
                  {/*
                  <Link href="/blog" className="font-roboto font-medium text-lg hover:text-red-600 transition-colors">
                    Blog
                  </Link>
                  */}
                  <Link
                    href="/contacto"
                    className="font-roboto font-medium text-lg hover:text-red-600 transition-colors"
                  >
                    Contacto
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {/* Mobile Search Bar */}
        {isSearchOpen && (
          <div className="md:hidden py-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                className="pl-10 border-gray-200 focus:border-red-300 focus:ring-red-200"
              />
            </div>
          </div>
        )}
      </div>
    </header>
  )
}

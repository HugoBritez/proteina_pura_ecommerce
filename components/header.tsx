"use client"

import { useState } from "react"
import Link from "next/link"
import { useRouter } from "next/navigation"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuList,
} from "@/components/ui/navigation-menu"
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet"
import { ShoppingCart, Search, Menu } from 'lucide-react'

interface HeaderProps {
  cartItems?: number
}

export function Header({ cartItems = 0 }: HeaderProps) {
  const [isSearchOpen, setIsSearchOpen] = useState(false)
  const [searchValue, setSearchValue] = useState("")
  const router = useRouter()

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault()
    if (searchValue.trim()) {
      router.push(`/productos?search=${encodeURIComponent(searchValue.trim())}`)
      setSearchValue("")
      setIsSearchOpen(false)
    }
  }

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-white/95 backdrop-blur supports-[backdrop-filter]:bg-white/60">
      <div className="container mx-auto px-4">
        <div className="flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center space-x-2">
            <div className="font-anton text-2xl font-bold text-primary">PROTEÍNA PURA</div>
          </Link>

          <NavigationMenu className="hidden lg:flex">
            <NavigationMenuList>
              <NavigationMenuItem>
                <Link href="/productos" className="font-oswald text-sm font-medium px-4 py-2 hover:text-primary transition-colors">
                  Productos
                </Link>
              </NavigationMenuItem>
              <NavigationMenuItem>
                <Link href="/contacto" className="font-oswald text-sm font-medium px-4 py-2 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <form onSubmit={handleSearch} className="hidden md:flex flex-1 max-w-sm mx-8">
            <div className="relative w-full">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>

          <div className="flex items-center space-x-3">
            <Button variant="ghost" size="icon" className="md:hidden" onClick={() => setIsSearchOpen(!isSearchOpen)}>
              <Search className="h-5 w-5" />
            </Button>

            <Link href="/carrito">
              <Button variant="ghost" size="icon" className="relative">
                <ShoppingCart className="h-5 w-5" />
                {cartItems > 0 && (
                  <Badge className="absolute -top-2 -right-2 h-5 w-5 rounded-full p-0 flex items-center justify-center bg-primary text-white text-xs">
                    {cartItems}
                  </Badge>
                )}
              </Button>
            </Link>

            <Sheet>
              <SheetTrigger asChild>
                <Button variant="ghost" size="icon" className="lg:hidden">
                  <Menu className="h-5 w-5" />
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[300px] sm:w-[400px]">
                <nav className="flex flex-col space-y-4">
                  <Link href="/productos" className="font-oswald font-medium text-lg hover:text-primary transition-colors">
                    Productos
                  </Link>
                  <Link href="/contacto" className="font-oswald font-medium text-lg hover:text-primary transition-colors">
                    Contacto
                  </Link>
                </nav>
              </SheetContent>
            </Sheet>
          </div>
        </div>

        {isSearchOpen && (
          <form onSubmit={handleSearch} className="md:hidden py-4 border-t">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
              <Input
                type="search"
                placeholder="Buscar productos..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10"
              />
            </div>
          </form>
        )}
      </div>
    </header>
  )
}

import Link from "next/link"
import { Instagram, MessageCircle, Mail, Phone, MapPin } from "lucide-react"
import { empresa } from "@/lib/consts/empresa.data"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-anton text-2xl font-bold text-primary">PROTEÍNA PURA</div>
            <p className="text-gray-300 font-roboto text-sm leading-relaxed max-w-xs">
              Suplementos importados directamente. Sin vueltas, resultados reales.
            </p>
            <div className="flex space-x-3">
              <Link
                href="https://www.instagram.com/proteinapurapy/"
                target="_blank"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <Instagram className="h-5 w-5" />
              </Link>
              <Link
                href="https://www.tiktok.com/@proteinapurapy"
                target="_blank"
                className="text-gray-400 hover:text-primary transition-colors"
              >
                <svg className="h-5 w-5" viewBox="0 0 24 24" fill="currentColor">
                  <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.89a2.89 2.89 0 0 1-5.2 1.74 2.89 2.89 0 0 1 2.31-4.64 2.93 2.93 0 0 1 .88.13V9.4a6.84 6.84 0 0 0-1-.05A6.33 6.33 0 0 0 5 20.1a6.34 6.34 0 0 0 10.86-4.43v-7a8.16 8.16 0 0 0 4.77 1.52v-3.4a4.85 4.85 0 0 1-1-.1z"/>
                </svg>
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-anton text-lg font-bold text-white">Explorá</h3>
            <ul className="space-y-2 font-roboto text-sm">
              <li>
                <Link href="/productos" className="text-gray-300 hover:text-primary transition-colors">
                  Todos los productos
                </Link>
              </li>
              <li>
                <Link href="/carrito" className="text-gray-300 hover:text-primary transition-colors">
                  Carrito
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-primary transition-colors">
                  Contacto
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-anton text-lg font-bold text-white">Contacto</h3>
            <div className="space-y-3 font-roboto text-sm">
              <div className="flex items-center space-x-3">
                <MessageCircle className="h-4 w-4 text-primary flex-shrink-0" />
                <Link
                  href={`https://wa.me/${empresa.telefono.replace(/\s/g, '')}`}
                  target="_blank"
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  {empresa.telefono}
                </Link>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300">{empresa.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-primary flex-shrink-0" />
                <span className="text-gray-300">{empresa.direccion}</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 font-roboto text-sm">
              © {new Date().getFullYear()} {empresa.nombre}. Todos los derechos reservados.
            </p>
            <div className="flex space-x-6 text-sm font-roboto">
              <Link href="/privacidad" className="text-gray-400 hover:text-primary transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-primary transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

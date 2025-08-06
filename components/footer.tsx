import Link from "next/link"
import { Facebook, Instagram, Twitter, Youtube, Mail, Phone, MapPin } from "lucide-react"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="space-y-4">
            <div className="font-anton text-2xl font-bold text-red-500">PROTEÍNA PURA</div>
            <p className="text-gray-300 font-roboto">
              Tu aliado en el camino hacia el máximo rendimiento deportivo. Proteínas premium para atletas serios.
            </p>
            <div className="flex space-x-4">
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Facebook className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Instagram className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Twitter className="h-5 w-5" />
              </Link>
              <Link href="#" className="text-gray-400 hover:text-red-500 transition-colors">
                <Youtube className="h-5 w-5" />
              </Link>
            </div>
          </div>

          {/* Products */}
          <div className="space-y-4">
            <h3 className="font-anton text-lg font-bold text-white">Productos</h3>
            <ul className="space-y-2 font-roboto">
              <li>
                <Link href="/productos/whey" className="text-gray-300 hover:text-red-500 transition-colors">
                  Whey Protein
                </Link>
              </li>
              <li>
                <Link href="/productos/casein" className="text-gray-300 hover:text-red-500 transition-colors">
                  Caseína
                </Link>
              </li>
              <li>
                <Link href="/productos/plant" className="text-gray-300 hover:text-red-500 transition-colors">
                  Proteína Vegetal
                </Link>
              </li>
              <li>
                <Link href="/productos/creatina" className="text-gray-300 hover:text-red-500 transition-colors">
                  Creatina
                </Link>
              </li>
              <li>
                <Link href="/productos/aminoacidos" className="text-gray-300 hover:text-red-500 transition-colors">
                  Aminoácidos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="space-y-4">
            <h3 className="font-anton text-lg font-bold text-white">Soporte</h3>
            <ul className="space-y-2 font-roboto">
              <li>
                <Link href="/ayuda" className="text-gray-300 hover:text-red-500 transition-colors">
                  Centro de Ayuda
                </Link>
              </li>
              <li>
                <Link href="/envios" className="text-gray-300 hover:text-red-500 transition-colors">
                  Envíos y Devoluciones
                </Link>
              </li>
              <li>
                <Link href="/garantia" className="text-gray-300 hover:text-red-500 transition-colors">
                  Garantía
                </Link>
              </li>
              <li>
                <Link href="/contacto" className="text-gray-300 hover:text-red-500 transition-colors">
                  Contacto
                </Link>
              </li>
              <li>
                <Link href="/asesoria" className="text-gray-300 hover:text-red-500 transition-colors">
                  Asesoría Nutricional
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div className="space-y-4">
            <h3 className="font-anton text-lg font-bold text-white">Contacto</h3>
            <div className="space-y-3 font-roboto">
              <div className="flex items-center space-x-3">
                <Phone className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">+57 300 123 4567</span>
              </div>
              <div className="flex items-center space-x-3">
                <Mail className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">info@proteinapura.com</span>
              </div>
              <div className="flex items-center space-x-3">
                <MapPin className="h-4 w-4 text-red-500" />
                <span className="text-gray-300">Bogotá, Colombia</span>
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-12 pt-8">
          <div className="flex flex-col md:flex-row justify-between items-center space-y-4 md:space-y-0">
            <p className="text-gray-400 font-roboto text-sm">© 2024 Proteína Pura. Todos los derechos reservados.</p>
            <div className="flex space-x-6 text-sm font-roboto">
              <Link href="/privacidad" className="text-gray-400 hover:text-red-500 transition-colors">
                Política de Privacidad
              </Link>
              <Link href="/terminos" className="text-gray-400 hover:text-red-500 transition-colors">
                Términos y Condiciones
              </Link>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
}

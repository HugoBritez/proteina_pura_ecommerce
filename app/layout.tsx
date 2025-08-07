import type { Metadata } from "next"
import { Anton, Roboto, Oswald } from 'next/font/google'
import "./globals.css"

const anton = Anton({ 
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-anton"
})

const oswald = Oswald({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-oswald"
})

const roboto = Roboto({ 
  subsets: ["latin"],
  weight: ["300", "400", "500", "700"],
  variable: "--font-roboto"
})

export const metadata: Metadata = {
  title: "Proteína Pura - Suplementos Deportivos Premium",
  description: "Descubre las mejores proteínas y suplementos deportivos. Calidad premium para atletas serios. Envío gratis en Colombia.",
  keywords: "proteína, whey protein, suplementos deportivos, nutrición deportiva, fitness, culturismo",
    generator: 'v0.dev'
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="es">
      <body className={`${anton.variable} ${oswald.variable} ${roboto.variable} font-roboto`}>{children}</body>
    </html>
  )
}

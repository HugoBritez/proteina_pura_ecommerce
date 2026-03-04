'use client'

import { useEffect } from 'react'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error(error)
  }, [error])

  return (
    <div className="flex min-h-[60vh] flex-col items-center justify-center gap-4 px-4 text-center">
      <h2 className="text-2xl font-bold text-gray-800">Algo salió mal</h2>
      <p className="max-w-md text-gray-500">
        Ocurrió un error inesperado. Podés intentar recargar la página o volver al inicio.
      </p>
      <div className="flex gap-3">
        <button
          onClick={reset}
          className="rounded-md bg-red-600 px-5 py-2 text-sm font-semibold text-white hover:bg-red-700"
        >
          Reintentar
        </button>
        <a
          href="/"
          className="rounded-md border border-gray-300 px-5 py-2 text-sm font-semibold text-gray-700 hover:bg-gray-50"
        >
          Ir al inicio
        </a>
      </div>
    </div>
  )
}

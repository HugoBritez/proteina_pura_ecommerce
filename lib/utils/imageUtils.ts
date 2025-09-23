/**
 * Utilidades para optimización de imágenes
 */

export function getOptimizedImageUrl(
  url: string | null | undefined,
  width: number = 300,
  height: number = 300,
  quality: number = 80
): string {
  if (!url) {
    return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=Sin+Imagen`;
  }

  // Si es una URL de Supabase Storage, agregar transformaciones
  if (url.includes('supabase') || url.includes('storage')) {
    const separator = url.includes('?') ? '&' : '?';
    return `${url}${separator}width=${width}&height=${height}&resize=cover&quality=${quality}`;
  }

  // Para otras URLs, devolverlas tal como están
  return url;
}

export function getProductPlaceholder(productName: string, width: number = 300, height: number = 300): string {
  const encodedName = encodeURIComponent(productName);
  return `https://via.placeholder.com/${width}x${height}/f3f4f6/6b7280?text=${encodedName}`;
}

// Blur placeholder base64 gris claro para mejor UX
export const BLUR_PLACEHOLDER = "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAYEBQYFBAYGBQYHBwYIChAKCgkJChQODwwQFxQYGBcUFhYaHSUfGhsjHBYWICwgIyYnKSopGR8tMC0oMCUoKSj/2wBDAQcHBwoIChMKChMoGhYaKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCgoKCj/wAARCAAIAAoDASIAAhEBAxEB/8QAFQABAQAAAAAAAAAAAAAAAAAAAAv/xAAhEAACAQMDBQAAAAAAAAAAAAABAgMABAUGIWGRkqGx0f/EABUBAQEAAAAAAAAAAAAAAAAAAAMF/8QAGhEAAgIDAAAAAAAAAAAAAAAAAAECEgMRkf/aAAwDAQACEQMRAD8AltJagyeH0AthI5xdrLcNM91BF5pX2HaH9bcfaSXWGaRmknyJckliyjqTzSlT54b6bk+h0R//2Q==";

// Mejor blur placeholder que coincide con el diseño
export const LIGHT_BLUR_PLACEHOLDER = "data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMzIwIiBoZWlnaHQ9IjMyMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj4KICA8ZGVmcz4KICAgIDxsaW5lYXJHcmFkaWVudCBpZD0iZ3JhZGllbnQiIHgxPSIwJSIgeTE9IjAlIiB4Mj0iMTAwJSIgeTI9IjEwMCUiPgogICAgICA8c3RvcCBvZmZzZXQ9IjAlIiBzdG9wLWNvbG9yPSIjZjlmYWZiIi8+CiAgICAgIDxzdG9wIG9mZnNldD0iNTAlIiBzdG9wLWNvbG9yPSIjZjNmNGY2Ii8+CiAgICAgIDxzdG9wIG9mZnNldD0iMTAwJSIgc3RvcC1jb2xvcj0iI2Y5ZmFmYiIvPgogICAgPC9saW5lYXJHcmFkaWVudD4KICA8L2RlZnM+CiAgPHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmFkaWVudCkiLz4KICA8Y2lyY2xlIGN4PSI1MCUiIGN5PSI1MCUiIHI9IjQwIiBmaWxsPSIjZTVlN2ViIiBvcGFjaXR5PSIwLjMiLz4KPC9zdmc+";
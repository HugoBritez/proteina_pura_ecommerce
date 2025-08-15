import { supabase } from './supabase'
import type { ProductoConDetalles, Categoria, Sabor } from '@/types/database'

export async function getProductos(): Promise<ProductoConDetalles[]> {
  const { data: productos, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria_info:categorias(*)
    `)
    .eq('isActivo', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching productos:', error)
    return []
  }

  // Obtener información de sabores para cada producto
  const productosConSabores = await Promise.all(
    productos.map(async (producto) => {
      if (producto.sabores && producto.sabores.length > 0) {
        const { data: sabores } = await supabase
          .from('sabores')
          .select('*')
          .in('id', producto.sabores)

        return {
          ...producto,
          sabores_info: sabores || []
        }
      }
      return {
        ...producto,
        sabores_info: []
      }
    })
  )
  return productosConSabores
}

export async function getProductosPorCategoria(categoriaId: number): Promise<ProductoConDetalles[]> {
  const { data: productos, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria_info:categorias(*)
    `)
    .eq('categoria', categoriaId)
    .eq('isActivo', true)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error fetching productos por categoria:', error)
    return []
  }

  const productosConSabores = await Promise.all(
    productos.map(async (producto) => {
      if (producto.sabores && producto.sabores.length > 0) {
        const { data: sabores } = await supabase
          .from('sabores')
          .select('*')
          .in('id', producto.sabores)

        return {
          ...producto,
          sabores_info: sabores || []
        }
      }
      return {
        ...producto,
        sabores_info: []
      }
    })
  )

  return productosConSabores
}

export async function getProductosPorCategoriaSlug(categoriaSlug: string): Promise<{
  productos: ProductoConDetalles[]
  categoria: Categoria | null
}> {
  // Primero obtener la categoría por descripción
  const { data: categoria, error: errorCategoria } = await supabase
    .from('categorias')
    .select('*')
    .eq('isActivo', true)
    .ilike('descripcion', `%${categoriaSlug}%`)
    .single()

  if (errorCategoria || !categoria) {
    console.error('Error fetching categoria:', errorCategoria)
    return { productos: [], categoria: null }
  }

  // Luego obtener los productos de esa categoría
  const { data: productos, error: errorProductos } = await supabase
    .from('productos')
    .select(`
      *,
      categoria_info:categorias(*)
    `)
    .eq('categoria', categoria.id)
    .eq('isActivo', true)
    .order('created_at', { ascending: false })

  if (errorProductos) {
    console.error('Error fetching productos por categoria:', errorProductos)
    return { productos: [], categoria }
  }

  const productosConSabores = await Promise.all(
    productos.map(async (producto) => {
      if (producto.sabores && producto.sabores.length > 0) {
        const { data: sabores } = await supabase
          .from('sabores')
          .select('*')
          .in('id', producto.sabores)

        return {
          ...producto,
          sabores_info: sabores || []
        }
      }
      return {
        ...producto,
        sabores_info: []
      }
    })
  )

  return { productos: productosConSabores, categoria }
}

export async function getProductosDestacados(): Promise<ProductoConDetalles[]> {
  const { data: productos, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria_info:categorias(*)
    `)
    .eq('isActivo', true)
    .eq('isOferta', true)
    .order('created_at', { ascending: false })
    .limit(6)

  if (error) {
    console.error('Error fetching productos destacados:', error)
    return []
  }

  const productosConSabores = await Promise.all(
    productos.map(async (producto) => {
      if (producto.sabores && producto.sabores.length > 0) {
        const { data: sabores } = await supabase
          .from('sabores')
          .select('*')
          .in('id', producto.sabores)

        return {
          ...producto,
          sabores_info: sabores || []
        }
      }
      return {
        ...producto,
        sabores_info: []
      }
    })
  )

  return productosConSabores
}

export async function getCategorias(): Promise<Categoria[]> {
  const { data: categorias, error } = await supabase
    .from('categorias')
    .select('*')
    .eq('isActivo', true)
    .order('descripcion')

  if (error) {
    console.error('Error fetching categorias:', error)
    return []
  }

  return categorias
}

export async function getSabores(): Promise<Sabor[]> {
  const { data: sabores, error } = await supabase
    .from('sabores')
    .select('*')
    .order('descripcion')

  if (error) {
    console.error('Error fetching sabores:', error)
    return []
  }

  return sabores
}

export async function buscarProductos(query: string): Promise<ProductoConDetalles[]> {
  const { data: productos, error } = await supabase
    .from('productos')
    .select(`
      *,
      categoria_info:categorias(*)
    `)
    .eq('isActivo', true)
    .or(`nombre.ilike.%${query}%,descripcion.ilike.%${query}%`)
    .order('created_at', { ascending: false })

  if (error) {
    console.error('Error searching productos:', error)
    return []
  }

  const productosConSabores = await Promise.all(
    productos.map(async (producto) => {
      if (producto.sabores && producto.sabores.length > 0) {
        const { data: sabores } = await supabase
          .from('sabores')
          .select('*')
          .in('id', producto.sabores)

        return {
          ...producto,
          sabores_info: sabores || []
        }
      }
      return {
        ...producto,
        sabores_info: []
      }
    })
  )

  return productosConSabores
}

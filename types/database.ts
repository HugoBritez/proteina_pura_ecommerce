export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export type Database = {
  public: {
    Tables: {
      categorias: {
        Row: {
          created_at: string
          descripcion: string
          id: number
          isActivo: boolean
        }
        Insert: {
          created_at?: string
          descripcion: string
          id?: number
          isActivo?: boolean
        }
        Update: {
          created_at?: string
          descripcion?: string
          id?: number
          isActivo?: boolean
        }
        Relationships: []
      }
      productos: {
        Row: {
          cantidad_stock: number
          categoria: number
          created_at: string
          descripcion: string | null
          id: number
          isActivo: boolean
          isOferta: boolean
          nombre: string
          precio: number
          sabores: number[] | null
          url_imagen: string
        }
        Insert: {
          cantidad_stock?: number
          categoria?: number
          created_at?: string
          descripcion?: string | null
          id?: number
          isActivo?: boolean
          isOferta?: boolean
          nombre: string
          precio: number
          sabores?: number[] | null
          url_imagen?: string
        }
        Update: {
          cantidad_stock?: number
          categoria?: number
          created_at?: string
          descripcion?: string | null
          id?: number
          isActivo?: boolean
          isOferta?: boolean
          nombre?: string
          precio?: number
          sabores?: number[] | null
          url_imagen?: string
        }
        Relationships: [
          {
            foreignKeyName: "productos_categoria_fkey"
            columns: ["categoria"]
            isOneToOne: false
            referencedRelation: "categorias"
            referencedColumns: ["id"]
          },
        ]
      }
      sabores: {
        Row: {
          descripcion: string
          id: number
        }
        Insert: {
          descripcion?: string
          id?: number
        }
        Update: {
          descripcion?: string
          id?: number
        }
        Relationships: []
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      [_ in never]: never
    }
    CompositeTypes: {
      [_ in never]: never
    }
  }
}

// Tipos de conveniencia
export type Producto = Database['public']['Tables']['productos']['Row']
export type Categoria = Database['public']['Tables']['categorias']['Row']
export type Sabor = Database['public']['Tables']['sabores']['Row']

// Tipos extendidos para la UI
export type ProductoConDetalles = Producto & {
  categoria_info: Categoria
  sabores_info: Sabor[]
}

export type CartItem = {
  producto: ProductoConDetalles
  quantity: number
  sabor_seleccionado?: Sabor
}

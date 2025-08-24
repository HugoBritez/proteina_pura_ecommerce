"use client"

import { useEffect, useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { zodResolver } from '@hookform/resolvers/zod'
import { toast } from '@/hooks/use-toast'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Card, CardContent, CardHeader } from '@/components/ui/card'
import { Label } from '@/components/ui/label'
import { Checkbox } from '@/components/ui/checkbox'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import type { Categoria, Producto, Sabor } from '@/types/database'
import { supabase } from '@/lib/supabase'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import { ImageUploader } from '@/components/ImageUploader'
import Image from 'next/image'

const schema = z.object({
  nombre: z.string().min(2),
  descripcion: z.string().optional().nullable(),
  precio: z.coerce.number().min(0),
  categoria: z.coerce.number().int(),
  isActivo: z.boolean().default(true),
  isOferta: z.boolean().default(false),
  cantidad_stock: z.coerce.number().int().min(0),
  sabores: z.array(z.coerce.number().int()).optional().nullable(),
  url_imagen: z.string().url().optional().default(''),
  galeria_urls: z.array(z.string().url()).optional().default([]),
})

type FormValues = z.infer<typeof schema>

export default function AdminPage() {
  const [categorias, setCategorias] = useState<Categoria[]>([])
  const [sabores, setSabores] = useState<Sabor[]>([])
  const [productos, setProductos] = useState<Producto[]>([])
  const [loading, setLoading] = useState(false)
  const [search, setSearch] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<number | 'all'>('all')
  const [soloActivos, setSoloActivos] = useState(false)
  const [soloOferta, setSoloOferta] = useState(false)
  const router = useRouter()

  const form = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: {
      nombre: '',
      descripcion: '',
      precio: 0,
      categoria: undefined as unknown as number,
      isActivo: true,
      isOferta: false,
      cantidad_stock: 0,
      sabores: [],
      url_imagen: '',
      galeria_urls: [],
    }
  })

  useEffect(() => {
    async function load() {
      const session = (await supabase.auth.getSession()).data.session
      if (!session) {
        router.replace('/login?redirectTo=/admin')
        return
      }
      const token = session.access_token
      const headers: Record<string, string> = token ? { Authorization: `Bearer ${token}` } : {}
      const [catRes, sabRes, prodsRes] = await Promise.all([
        fetch('/api/admin/categorias', { headers }),
        fetch('/api/admin/sabores', { headers }),
        fetch('/api/admin/productos', { headers }),
      ])
      const [{ data: cat }, { data: sab }, { data: prods }] = await Promise.all([
        catRes.json(), sabRes.json(), prodsRes.json()
      ])
      setCategorias(cat || [])
      setSabores(sab || [])
      setProductos(prods || [])
    }
    load()
  }, [])

  async function onSubmit(values: FormValues) {
    try {
      setLoading(true)
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/admin/productos', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } as Record<string, string>,
        body: JSON.stringify({
          ...values,
          descripcion: values.descripcion ?? null,
          sabores: values.sabores && values.sabores.length ? values.sabores : null,
          url_imagen: values.url_imagen ?? '',
          galeria_urls: values.galeria_urls && values.galeria_urls.length ? values.galeria_urls : null,
        })
      })
      const json = await res.json()
      if (!res.ok) throw new Error(json.error || 'Error creando producto')
      toast({ title: 'Producto creado' })
      form.reset()
      const { data: prods } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
      setProductos(prods || [])
    } catch (e: any) {
      toast({ title: 'Error', description: e.message })
    } finally {
      setLoading(false)
    }
  }

  const productosFiltrados = useMemo(() => {
    const byText = (p: Producto) => p.nombre.toLowerCase().includes(search.toLowerCase())
    const byCat = (p: Producto) => categoriaFiltro === 'all' ? true : p.categoria === categoriaFiltro
    const byActivo = (p: Producto) => (soloActivos ? p.isActivo : true)
    const byOferta = (p: Producto) => (soloOferta ? p.isOferta : true)
    return productos.filter((p) => byText(p) && byCat(p) && byActivo(p) && byOferta(p))
  }, [productos, search, categoriaFiltro, soloActivos, soloOferta])

  const totalActivos = useMemo(() => productos.filter(p => p.isActivo).length, [productos])
  const totalOferta = useMemo(() => productos.filter(p => p.isOferta).length, [productos])
  const totalSinStock = useMemo(() => productos.filter(p => p.cantidad_stock <= 0).length, [productos])

  async function refreshProductos() {
    const { data: prods } = await supabase.from('productos').select('*').order('created_at', { ascending: false })
    setProductos(prods || [])
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={async () => { await supabase.auth.signOut(); router.replace('/login') }}>Cerrar sesión</Button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card>
          <CardHeader>
            <div className="text-sm text-muted-foreground">Productos</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{productos.length}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-sm text-muted-foreground">Activos</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalActivos}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-sm text-muted-foreground">En oferta</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalOferta}</div>
          </CardContent>
        </Card>
        <Card>
          <CardHeader>
            <div className="text-sm text-muted-foreground">Sin stock</div>
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalSinStock}</div>
          </CardContent>
        </Card>
      </div>

      <Tabs defaultValue="productos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="nuevo">Nuevo producto</TabsTrigger>
        </TabsList>

        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-4 gap-3">
                  <div className="space-y-1">
                    <Label>Búsqueda</Label>
                    <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Categoría</Label>
                    <Select value={String(categoriaFiltro)} onValueChange={(v) => setCategoriaFiltro(v === 'all' ? 'all' : Number(v))}>
                      <SelectTrigger>
                        <SelectValue placeholder="Todas" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {categorias.map((c) => (
                          <SelectItem key={c.id} value={String(c.id)}>{c.descripcion}</SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-1">
                    <Label>Solo activos</Label>
                    <div className="h-10 px-3 border rounded-md flex items-center gap-2">
                      <Checkbox checked={soloActivos} onCheckedChange={(v) => setSoloActivos(Boolean(v))} />
                      <span className="text-sm">Activos</span>
                    </div>
                  </div>
                  <div className="space-y-1">
                    <Label>Solo oferta</Label>
                    <div className="h-10 px-3 border rounded-md flex items-center gap-2">
                      <Checkbox checked={soloOferta} onCheckedChange={(v) => setSoloOferta(Boolean(v))} />
                      <span className="text-sm">Oferta</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Imagen</TableHead>
                      <TableHead>Nombre</TableHead>
                      <TableHead>Precio</TableHead>
                      <TableHead>Stock</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead>Oferta</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productosFiltrados.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                            <Image
                              src={(p.galeria_urls && p.galeria_urls.length > 0 ? p.galeria_urls[0] : p.url_imagen) || 
                                   "/placeholder.svg?height=48&width=48&text=" + encodeURIComponent(p.nombre)}
                              alt={p.nombre}
                              fill
                              className="object-cover"
                              sizes="48px"
                            />
                            {p.galeria_urls && p.galeria_urls.length > 1 && (
                              <div className="absolute bottom-0 right-0 bg-black/60 text-white text-xs px-1 rounded-tl">
                                +{p.galeria_urls.length - 1}
                              </div>
                            )}
                          </div>  
                        </TableCell>
                        <TableCell className="max-w-[260px]">
                          <div className="font-medium truncate">{p.nombre}</div>
                          <div className="text-xs text-muted-foreground">ID: {p.id}</div>
                        </TableCell>
                        <TableCell>{formatCurrency(p.precio)}</TableCell>
                        <TableCell>
                          {p.cantidad_stock <= 0 ? (
                            <Badge variant="destructive">Sin stock</Badge>
                          ) : (
                            <span>{p.cantidad_stock}</span>
                          )}
                        </TableCell>
                        <TableCell>
                          {p.isActivo ? <Badge>Activo</Badge> : <Badge variant="secondary">Inactivo</Badge>}
                        </TableCell>
                        <TableCell>
                          {p.isOferta ? <Badge variant="outline">Oferta</Badge> : <span className="text-muted-foreground">—</span>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Dialog>
                              <DialogTrigger asChild>
                                <Button size="sm" variant="outline">Editar</Button>
                              </DialogTrigger>
                              <DialogContent className="sm:max-w-[900px] max-h-[90vh]">
                                <DialogHeader>
                                  <DialogTitle>Editar producto</DialogTitle>
                                </DialogHeader>
                                <ProductoEditor p={p} onSaved={async () => { await refreshProductos() }} />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild>
                                <Button size="sm" variant="destructive">Eliminar</Button>
                              </AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                  <AlertDialogDescription>
                                    Esta acción no se puede deshacer. Se eliminará permanentemente el producto "{p.nombre}".
                                  </AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction
                                    onClick={async () => {
                                      try {
                                        const token = (await supabase.auth.getSession()).data.session?.access_token
                                        const res = await fetch('/api/admin/productos', {
                                          method: 'DELETE',
                                          headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } as Record<string, string>,
                                          body: JSON.stringify({ id: p.id })
                                        })
                                        const j = await res.json()
                                        if (!res.ok) throw new Error(j.error || 'No se pudo eliminar')
                                        toast({ title: 'Producto eliminado' })
                                        await refreshProductos()
                                      } catch (e: any) {
                                        toast({ title: 'Error', description: e.message })
                                      }
                                    }}
                                  >
                                    Eliminar
                                  </AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {productosFiltrados.length === 0 && (
                      <TableRow>
                        <TableCell colSpan={7} className="text-center text-sm text-muted-foreground">Sin resultados</TableCell>
                      </TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="nuevo">
          <Card>
            <CardHeader>
              <h2 className="font-semibold">Nuevo producto</h2>
            </CardHeader>
            <CardContent>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
                {/* Información básica */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground border-b pb-2">Información básica</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="nombre">Nombre *</Label>
                      <Input 
                        id="nombre"
                        {...form.register('nombre')} 
                        placeholder="Ej: Proteína Whey Vainilla"
                        className={form.formState.errors.nombre ? 'border-destructive' : ''}
                      />
                      {form.formState.errors.nombre && (
                        <p className="text-sm text-destructive">{form.formState.errors.nombre.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="categoria">Categoría *</Label>
                      <Select onValueChange={(v) => form.setValue('categoria', Number(v))}>
                        <SelectTrigger className={form.formState.errors.categoria ? 'border-destructive' : ''}>
                          <SelectValue placeholder="Selecciona categoría" />
                        </SelectTrigger>
                        <SelectContent>
                          {categorias.map((c) => (
                            <SelectItem key={c.id} value={String(c.id)}>{c.descripcion}</SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      {form.formState.errors.categoria && (
                        <p className="text-sm text-destructive">{form.formState.errors.categoria.message}</p>
                      )}
                    </div>
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="descripcion">Descripción</Label>
                    <Input 
                      id="descripcion"
                      {...form.register('descripcion')} 
                      placeholder="Descripción detallada del producto"
                    />
                  </div>
                </div>

                {/* Precios y stock */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground border-b pb-2">Precios y stock</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="precio">Precio *</Label>
                      <Input 
                        id="precio"
                        type="number" 
                        step="1" 
                        {...form.register('precio')}
                        placeholder="0"
                        className={form.formState.errors.precio ? 'border-destructive' : ''}
                      />
                      {form.formState.errors.precio && (
                        <p className="text-sm text-destructive">{form.formState.errors.precio.message}</p>
                      )}
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="stock">Stock inicial *</Label>
                      <Input 
                        id="stock"
                        type="number" 
                        {...form.register('cantidad_stock')}
                        placeholder="0"
                        className={form.formState.errors.cantidad_stock ? 'border-destructive' : ''}
                      />
                      {form.formState.errors.cantidad_stock && (
                        <p className="text-sm text-destructive">{form.formState.errors.cantidad_stock.message}</p>
                      )}
                    </div>
                  </div>
                </div>

                {/* Sabores */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground border-b pb-2">Sabores disponibles</h3>
                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 max-h-48 overflow-auto p-3 border rounded-lg bg-muted/30">
                    {sabores.map((s) => {
                      const checked = (form.watch('sabores') || []).includes(s.id)
                      return (
                        <label key={s.id} className="flex items-center gap-2 text-sm p-1 hover:bg-background/50 rounded cursor-pointer">
                          <Checkbox checked={checked} onCheckedChange={(v) => {
                            const current = form.getValues('sabores') || []
                            if (v) form.setValue('sabores', [...current, s.id])
                            else form.setValue('sabores', current.filter((x) => x !== s.id))
                          }} />
                          <span className="truncate">{s.descripcion}</span>
                        </label>
                      )
                    })}
                  </div>
                  <p className="text-xs text-muted-foreground">Selecciona los sabores disponibles para este producto</p>
                </div>

                {/* Estados */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground border-b pb-2">Estado del producto</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <Card className="p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox checked={form.watch('isActivo')} onCheckedChange={(v) => form.setValue('isActivo', Boolean(v))} />
                        <div>
                          <div className="font-medium">Producto activo</div>
                          <div className="text-sm text-muted-foreground">Visible en la tienda</div>
                        </div>
                      </label>
                    </Card>
                    <Card className="p-4">
                      <label className="flex items-center gap-3 cursor-pointer">
                        <Checkbox checked={form.watch('isOferta')} onCheckedChange={(v) => form.setValue('isOferta', Boolean(v))} />
                        <div>
                          <div className="font-medium">En oferta</div>
                          <div className="text-sm text-muted-foreground">Aparece en sección ofertas</div>
                        </div>
                      </label>
                    </Card>
                  </div>
                </div>

                {/* Imágenes */}
                <div className="space-y-4">
                  <h3 className="text-lg font-medium text-foreground border-b pb-2">Imágenes del producto</h3>
                  <div className="space-y-4">
                    <ImageUploader 
                      value={form.watch('url_imagen')} 
                      onChange={(url) => form.setValue('url_imagen', typeof url === 'string' ? url : '')}
                      multiple={false}
                      label="Imagen principal *"
                    />
                    <ImageUploader 
                      value={form.watch('galeria_urls')} 
                      onChange={(urls) => form.setValue('galeria_urls', Array.isArray(urls) ? urls : [urls])}
                      multiple={true}
                      label="Galería de imágenes adicionales (opcional)"
                    />
                    <p className="text-xs text-muted-foreground">
                      La imagen principal se mostrará en las tarjetas de producto. Las imágenes de galería se verán en la página de detalle.
                    </p>
                  </div>
                </div>

                {/* Botones de acción */}
                <div className="flex flex-col sm:flex-row gap-3 pt-4 border-t">
                  <Button 
                    type="submit" 
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    {loading ? (
                      <>
                        <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                        Guardando producto...
                      </>
                    ) : (
                      'Crear producto'
                    )}
                  </Button>
                  <Button 
                    type="button" 
                    variant="outline" 
                    onClick={() => {
                      form.reset()
                      toast({ title: 'Formulario limpiado' })
                    }}
                    disabled={loading}
                    className="flex-1 sm:flex-none"
                  >
                    Limpiar formulario
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}

function ProductoEditor({ p, onSaved }: { p: Producto, onSaved: () => void }) {
  const [precio, setPrecio] = useState<number>(p.precio)
  const [stock, setStock] = useState<number>(p.cantidad_stock)
  const [activo, setActivo] = useState<boolean>(p.isActivo)
  const [oferta, setOferta] = useState<boolean>(p.isOferta)
  const [imagenPrincipal, setImagenPrincipal] = useState<string>(p.url_imagen || '')
  const [galeria, setGaleria] = useState<string[]>(p.galeria_urls || [])
  const [saving, setSaving] = useState(false)

  async function save() {
    try {
      setSaving(true)
      const token = (await supabase.auth.getSession()).data.session?.access_token
      
      const updatePayload = { 
        id: p.id, 
        precio, 
        cantidad_stock: stock, 
        isActivo: activo, 
        isOferta: oferta, 
        url_imagen: imagenPrincipal,
        galeria_urls: galeria 
      }
      
      console.log('Updating product with payload:', updatePayload)
      
      const res = await fetch('/api/admin/productos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } as Record<string, string>,
        body: JSON.stringify(updatePayload)
      })
      const j = await res.json()
      if (!res.ok) {
        console.error('Error updating product:', j)
        throw new Error(j.error || 'No se pudo actualizar')
      }
      toast({ title: 'Producto actualizado correctamente' })
      onSaved()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6 max-h-[70vh] overflow-y-auto">
      {/* Información del producto */}
      <div className="space-y-3">
        <div className="flex items-center gap-3 pb-2 border-b">
          <h4 className="font-medium">Editando: {p.nombre}</h4>
          <span className="text-xs text-muted-foreground">ID: {p.id}</span>
        </div>
      </div>

      {/* Precios y stock */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Precios y stock</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label htmlFor="edit-precio">Precio</Label>
            <Input 
              id="edit-precio"
              type="number" 
              value={precio} 
              onChange={(e) => setPrecio(Number(e.target.value))}
              placeholder="0"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="edit-stock">Stock</Label>
            <Input 
              id="edit-stock"
              type="number" 
              value={stock} 
              onChange={(e) => setStock(Number(e.target.value))}
              placeholder="0"
            />
          </div>
        </div>
      </div>

      {/* Estados */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Estado del producto</h5>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          <Card className="p-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={activo} onCheckedChange={(v) => setActivo(Boolean(v))} />
              <div>
                <div className="font-medium text-sm">Producto activo</div>
                <div className="text-xs text-muted-foreground">Visible en la tienda</div>
              </div>
            </label>
          </Card>
          <Card className="p-3">
            <label className="flex items-center gap-3 cursor-pointer">
              <Checkbox checked={oferta} onCheckedChange={(v) => setOferta(Boolean(v))} />
              <div>
                <div className="font-medium text-sm">En oferta</div>
                <div className="text-xs text-muted-foreground">Aparece en ofertas</div>
              </div>
            </label>
          </Card>
        </div>
      </div>

      {/* Imagen principal */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Imagen principal</h5>
        <ImageUploader 
          value={imagenPrincipal} 
          onChange={(url) => setImagenPrincipal(typeof url === 'string' ? url : '')}
          multiple={false}
          label=""
        />
      </div>

      {/* Galería */}
      <div className="space-y-4">
        <h5 className="font-medium text-sm">Galería de imágenes</h5>
        <ImageUploader 
          value={galeria} 
          onChange={(urls) => setGaleria(Array.isArray(urls) ? urls : [urls])}
          multiple={true}
          label=""
        />
      </div>

      {/* Botón guardar */}
      <div className="flex gap-2 pt-4 border-t">
        <Button onClick={save} disabled={saving} className="flex-1">
          {saving ? (
            <>
              <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
              Guardando...
            </>
          ) : (
            'Guardar cambios'
          )}
        </Button>
      </div>
    </div>
  )
}

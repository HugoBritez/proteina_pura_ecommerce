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
                          {p.url_imagen ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={p.url_imagen} alt={p.nombre} className="h-10 w-10 object-cover rounded" />
                          ) : (
                            <div className="h-10 w-10 bg-muted rounded" />
                          )}
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
                              <DialogContent className="sm:max-w-[700px]">
                                <DialogHeader>
                                  <DialogTitle>Editar producto</DialogTitle>
                                </DialogHeader>
                                <ProductoEditor p={p} onSaved={async () => { await refreshProductos(); toast({ title: 'Producto actualizado' }) }} />
                                <DialogFooter>
                                  <Button onClick={async () => { await refreshProductos() }}>Actualizar lista</Button>
                                </DialogFooter>
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
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-5">
                <div className="space-y-2">
                  <Label>Nombre</Label>
                  <Input {...form.register('nombre')} placeholder="Nombre" />
                </div>
                <div className="space-y-2">
                  <Label>Descripción</Label>
                  <Input {...form.register('descripcion')} placeholder="Descripción" />
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Precio</Label>
                    <Input type="number" step="1" {...form.register('precio')} />
                  </div>
                  <div className="space-y-2">
                    <Label>Stock</Label>
                    <Input type="number" {...form.register('cantidad_stock')} />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label>Categoría</Label>
                  <Select onValueChange={(v) => form.setValue('categoria', Number(v))}>
                    <SelectTrigger>
                      <SelectValue placeholder="Selecciona categoría" />
                    </SelectTrigger>
                    <SelectContent>
                      {categorias.map((c) => (
                        <SelectItem key={c.id} value={String(c.id)}>{c.descripcion}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label>Sabores</Label>
                  <div className="grid grid-cols-2 gap-2 max-h-40 overflow-auto p-2 border rounded-md bg-white">
                    {sabores.map((s) => {
                      const checked = (form.watch('sabores') || []).includes(s.id)
                      return (
                        <label key={s.id} className="flex items-center gap-2 text-sm">
                          <Checkbox checked={checked} onCheckedChange={(v) => {
                            const current = form.getValues('sabores') || []
                            if (v) form.setValue('sabores', [...current, s.id])
                            else form.setValue('sabores', current.filter((x) => x !== s.id))
                          }} />
                          {s.descripcion}
                        </label>
                      )
                    })}
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form.watch('isActivo')} onCheckedChange={(v) => form.setValue('isActivo', Boolean(v))} />
                    Activo
                  </label>
                  <label className="flex items-center gap-2 text-sm">
                    <Checkbox checked={form.watch('isOferta')} onCheckedChange={(v) => form.setValue('isOferta', Boolean(v))} />
                    Oferta
                  </label>
                </div>
                <div className="space-y-2">
                  <Label>Imagen principal</Label>
                  <div className="flex items-center gap-4">
                    {form.watch('url_imagen') ? (
                      // eslint-disable-next-line @next/next/no-img-element
                      <img src={form.watch('url_imagen')!} alt="preview" className="h-16 w-16 object-cover rounded border" />
                    ) : (
                      <div className="h-16 w-16 rounded border bg-muted" />
                    )}
                    <div className="flex-1 space-y-2">
                      <Input {...form.register('url_imagen')} placeholder="https://..." />
                      <input type="file" accept="image/*" onChange={async (e) => {
                        const file = e.target.files?.[0]
                        if (!file) return
                        try {
                          const session = (await supabase.auth.getSession()).data.session
                          if (!session) throw new Error('No autenticado')
                          const token = session.access_token
                          const path = `productos/${Date.now()}_${file.name}`
                          const formData = new FormData()
                          formData.append('file', file)
                          formData.append('path', path)
                          const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
                          const json = await res.json()
                          if (!res.ok) throw new Error(json.error || 'Error subiendo archivo')
                          form.setValue('url_imagen', json.publicUrl)
                          toast({ title: 'Imagen subida' })
                        } catch (err: any) {
                          toast({ title: 'Error subiendo imagen', description: err.message })
                        }
                      }} />
                    </div>
                  </div>
                </div>
                <div className="flex gap-2">
                  <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Guardar'}</Button>
                  <Button type="button" variant="outline" onClick={() => form.reset()}>Limpiar</Button>
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
  const [galeria, setGaleria] = useState<string[]>(p.galeria_urls || [])
  const [saving, setSaving] = useState(false)

  async function save() {
    try {
      setSaving(true)
      const token = (await supabase.auth.getSession()).data.session?.access_token
      const res = await fetch('/api/admin/productos', {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) } as Record<string, string>,
        body: JSON.stringify({ id: p.id, precio, cantidad_stock: stock, isActivo: activo, isOferta: oferta, galeria_urls: galeria })
      })
      const j = await res.json()
      if (!res.ok) throw new Error(j.error || 'No se pudo actualizar')
      onSaved()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
      <div>
        <Label>Precio</Label>
        <Input type="number" value={precio} onChange={(e) => setPrecio(Number(e.target.value))} />
      </div>
      <div>
        <Label>Stock</Label>
        <Input type="number" value={stock} onChange={(e) => setStock(Number(e.target.value))} />
      </div>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={activo} onCheckedChange={(v) => setActivo(Boolean(v))} />
        Activo
      </label>
      <label className="flex items-center gap-2 text-sm">
        <Checkbox checked={oferta} onCheckedChange={(v) => setOferta(Boolean(v))} />
        Oferta
      </label>
      <div className="md:col-span-2">
        <Label>Galería</Label>
        <div className="flex flex-wrap gap-2">
          {galeria.map((u, i) => (
            <div key={i} className="flex items-center gap-2 border rounded px-2 py-1 text-xs">
              <span className="truncate max-w-[200px]">{u}</span>
              <Button size="sm" variant="ghost" onClick={() => setGaleria(galeria.filter((_, idx) => idx !== i))}>Quitar</Button>
            </div>
          ))}
        </div>
        <input type="file" accept="image/*" className="mt-2" onChange={async (e) => {
          const file = e.target.files?.[0]
          if (!file) return
          try {
            const session = (await supabase.auth.getSession()).data.session
            if (!session) throw new Error('No autenticado')
            const token = session.access_token
            const path = `productos/${p.id}/${Date.now()}_${file.name}`
            const formData = new FormData()
            formData.append('file', file)
            formData.append('path', path)
            const res = await fetch('/api/admin/upload', { method: 'POST', headers: { Authorization: `Bearer ${token}` }, body: formData })
            const json = await res.json()
            if (!res.ok) throw new Error(json.error || 'Error subiendo archivo')
            setGaleria((g) => [...g, json.publicUrl])
            toast({ title: 'Imagen agregada a galería' })
          } catch (err: any) {
            toast({ title: 'Error subiendo imagen', description: err.message })
          }
        }} />
      </div>
      <div className="md:col-span-2 flex gap-2 mt-2">
        <Button onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
      </div>
    </div>
  )
}

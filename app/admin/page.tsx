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
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import { Badge } from '@/components/ui/badge'
import {
  AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent,
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog'
import { formatCurrency } from '@/lib/utils/formatCurrency'
import Image from 'next/image'
import {
  ADMIN_TOKEN_KEY, getProducts, createProduct, updateProduct, deleteProduct,
  createVariant, updateVariant, deleteVariant,
  getCategories, createCategory, updateCategory, deleteCategory,
  getPresignUrl,
  type AdminProduct, type AdminCategory, type AdminVariant,
} from '@/lib/kioskitAdmin'

// ── Schemas ──────────────────────────────────────────────────────────────────

const productSchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
  category_id: z.string().optional().nullable(),
  brand: z.string().optional().nullable(),
  image_url: z.string().optional().nullable(),
  is_active: z.boolean().default(true),
})

const variantSchema = z.object({
  sku: z.string().min(1),
  sabor: z.string().optional(), // mapped to attributes.sabor
  price: z.coerce.number().min(0),
  cost: z.coerce.number().min(0).default(0),
  stock: z.coerce.number().int().min(0).default(0),
})

const categorySchema = z.object({
  name: z.string().min(2),
  description: z.string().optional().nullable(),
})

type ProductForm = z.infer<typeof productSchema>
type VariantForm = z.infer<typeof variantSchema>
type CategoryForm = z.infer<typeof categorySchema>

// ── Main Component ─────────────────────────────────────────────────────────

export default function AdminPage() {
  const [categorias, setCategorias] = useState<AdminCategory[]>([])
  const [productos, setProductos] = useState<AdminProduct[]>([])
  const [loading, setLoading] = useState(true)
  const [search, setSearch] = useState('')
  const [categoriaFiltro, setCategoriaFiltro] = useState<string | 'all'>('all')
  const [soloActivos, setSoloActivos] = useState(false)
  const router = useRouter()

  const productForm = useForm<ProductForm>({
    resolver: zodResolver(productSchema),
    defaultValues: { name: '', description: '', category_id: null, brand: null, image_url: null, is_active: true },
  })

  useEffect(() => {
    const token = sessionStorage.getItem(ADMIN_TOKEN_KEY)
    if (!token) {
      router.replace('/login?redirectTo=/admin')
      return
    }
    Promise.all([getProducts(), getCategories()])
      .then(([prods, cats]) => { setProductos(prods); setCategorias(cats) })
      .catch((e) => { toast({ title: 'Error cargando datos', description: e.message }); router.replace('/login?redirectTo=/admin') })
      .finally(() => setLoading(false))
  }, [])

  async function refreshData() {
    const [prods, cats] = await Promise.all([getProducts(), getCategories()])
    setProductos(prods)
    setCategorias(cats)
  }

  async function onCreateProduct(values: ProductForm) {
    try {
      setLoading(true)
      await createProduct({
        name: values.name,
        description: values.description ?? null,
        category_id: values.category_id ?? null,
        brand: values.brand ?? null,
        image_url: values.image_url ?? null,
        is_active: values.is_active,
      })
      toast({ title: 'Producto creado' })
      productForm.reset()
      await refreshData()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message })
    } finally {
      setLoading(false)
    }
  }

  const productosFiltrados = useMemo(() => {
    return productos.filter(p => {
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false
      if (categoriaFiltro !== 'all' && p.category_id !== categoriaFiltro) return false
      if (soloActivos && !p.is_active) return false
      return true
    })
  }, [productos, search, categoriaFiltro, soloActivos])

  const totalActivos = useMemo(() => productos.filter(p => p.is_active).length, [productos])
  const totalSinStock = useMemo(() => productos.filter(p => p.variants.every(v => v.stock <= 0)).length, [productos])

  function handleLogout() {
    sessionStorage.removeItem(ADMIN_TOKEN_KEY)
    router.replace('/login')
  }

  if (loading) {
    return <div className="p-6 text-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto"></div></div>
  }

  return (
    <div className="p-6 max-w-7xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold">Panel de Administración</h1>
        <Button variant="outline" onClick={handleLogout}>Cerrar sesión</Button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
        <Card><CardHeader><div className="text-sm text-muted-foreground">Productos</div></CardHeader><CardContent><div className="text-2xl font-bold">{productos.length}</div></CardContent></Card>
        <Card><CardHeader><div className="text-sm text-muted-foreground">Activos</div></CardHeader><CardContent><div className="text-2xl font-bold">{totalActivos}</div></CardContent></Card>
        <Card><CardHeader><div className="text-sm text-muted-foreground">Categorías</div></CardHeader><CardContent><div className="text-2xl font-bold">{categorias.length}</div></CardContent></Card>
        <Card><CardHeader><div className="text-sm text-muted-foreground">Sin stock</div></CardHeader><CardContent><div className="text-2xl font-bold">{totalSinStock}</div></CardContent></Card>
      </div>

      <Tabs defaultValue="productos" className="space-y-6">
        <TabsList>
          <TabsTrigger value="productos">Productos</TabsTrigger>
          <TabsTrigger value="nuevo">Nuevo producto</TabsTrigger>
          <TabsTrigger value="categorias">Categorías</TabsTrigger>
        </TabsList>

        {/* ── Listado de productos ─────────────────────── */}
        <TabsContent value="productos" className="space-y-4">
          <Card>
            <CardHeader>
              <div className="flex flex-col gap-3 md:flex-row md:items-end md:justify-between">
                <div className="flex-1 grid grid-cols-1 md:grid-cols-3 gap-3">
                  <div className="space-y-1">
                    <Label>Búsqueda</Label>
                    <Input placeholder="Buscar por nombre..." value={search} onChange={(e) => setSearch(e.target.value)} />
                  </div>
                  <div className="space-y-1">
                    <Label>Categoría</Label>
                    <Select value={String(categoriaFiltro)} onValueChange={(v) => setCategoriaFiltro(v)}>
                      <SelectTrigger><SelectValue placeholder="Todas" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="all">Todas</SelectItem>
                        {categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
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
                      <TableHead>Variantes</TableHead>
                      <TableHead>Estado</TableHead>
                      <TableHead className="text-right">Acciones</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {productosFiltrados.map((p) => (
                      <TableRow key={p.id}>
                        <TableCell>
                          <div className="relative h-12 w-12 rounded-lg overflow-hidden bg-muted">
                            {p.image_url ? (
                              <Image src={p.image_url} alt={p.name} fill className="object-cover" sizes="48px" />
                            ) : (
                              <div className="h-full w-full bg-gray-200 flex items-center justify-center text-xs text-gray-400">Sin img</div>
                            )}
                          </div>
                        </TableCell>
                        <TableCell className="max-w-[260px]">
                          <div className="font-medium truncate">{p.name}</div>
                          <div className="text-xs text-muted-foreground truncate">{p.id.slice(0, 8)}…</div>
                        </TableCell>
                        <TableCell>
                          {p.variants.length === 0 ? (
                            <Badge variant="secondary">Sin variantes</Badge>
                          ) : (
                            <div className="flex flex-wrap gap-1">
                              {p.variants.slice(0, 3).map(v => (
                                <Badge key={v.id} variant="outline" className="text-xs">
                                  {Object.values(v.attributes).join(', ') || v.sku} — {formatCurrency(v.price)} ({v.stock})
                                </Badge>
                              ))}
                              {p.variants.length > 3 && <Badge variant="outline" className="text-xs">+{p.variants.length - 3}</Badge>}
                            </div>
                          )}
                        </TableCell>
                        <TableCell>
                          {p.is_active ? <Badge>Activo</Badge> : <Badge variant="secondary">Inactivo</Badge>}
                        </TableCell>
                        <TableCell className="text-right">
                          <div className="flex items-center gap-2 justify-end">
                            <Dialog>
                              <DialogTrigger asChild><Button size="sm" variant="outline">Editar</Button></DialogTrigger>
                              <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                                <DialogHeader><DialogTitle>Editar producto</DialogTitle></DialogHeader>
                                <ProductEditor p={p} categorias={categorias} onSaved={refreshData} />
                              </DialogContent>
                            </Dialog>
                            <AlertDialog>
                              <AlertDialogTrigger asChild><Button size="sm" variant="destructive">Eliminar</Button></AlertDialogTrigger>
                              <AlertDialogContent>
                                <AlertDialogHeader>
                                  <AlertDialogTitle>¿Eliminar producto?</AlertDialogTitle>
                                  <AlertDialogDescription>Esta acción no se puede deshacer. Se eliminará "{p.name}" y todas sus variantes.</AlertDialogDescription>
                                </AlertDialogHeader>
                                <AlertDialogFooter>
                                  <AlertDialogCancel>Cancelar</AlertDialogCancel>
                                  <AlertDialogAction onClick={async () => {
                                    try {
                                      await deleteProduct(p.id)
                                      toast({ title: 'Producto eliminado' })
                                      await refreshData()
                                    } catch (e: any) { toast({ title: 'Error', description: e.message }) }
                                  }}>Eliminar</AlertDialogAction>
                                </AlertDialogFooter>
                              </AlertDialogContent>
                            </AlertDialog>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                    {productosFiltrados.length === 0 && (
                      <TableRow><TableCell colSpan={5} className="text-center text-sm text-muted-foreground">Sin resultados</TableCell></TableRow>
                    )}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Nuevo producto ───────────────────────────── */}
        <TabsContent value="nuevo">
          <Card>
            <CardHeader><h2 className="font-semibold">Nuevo producto</h2></CardHeader>
            <CardContent>
              <form onSubmit={productForm.handleSubmit(onCreateProduct)} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label>Nombre *</Label>
                    <Input {...productForm.register('name')} placeholder="Ej: Proteína Whey Vainilla" />
                    {productForm.formState.errors.name && <p className="text-sm text-destructive">{productForm.formState.errors.name.message}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label>Categoría</Label>
                    <Select onValueChange={(v) => productForm.setValue('category_id', v === 'none' ? null : v)}>
                      <SelectTrigger><SelectValue placeholder="Selecciona categoría" /></SelectTrigger>
                      <SelectContent>
                        <SelectItem value="none">Sin categoría</SelectItem>
                        {categorias.map((c) => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
                      </SelectContent>
                    </Select>
                  </div>
                  <div className="space-y-2">
                    <Label>Descripción</Label>
                    <Input {...productForm.register('description')} placeholder="Descripción del producto" />
                  </div>
                  <div className="space-y-2">
                    <Label>Marca</Label>
                    <Input {...productForm.register('brand')} placeholder="Ej: Optimum Nutrition" />
                  </div>
                  <div className="space-y-2 md:col-span-2">
                    <Label>URL de imagen principal</Label>
                    <Input {...productForm.register('image_url')} placeholder="https://..." />
                    <p className="text-xs text-muted-foreground">Pega la URL pública de la imagen. Para subir archivos usa el editor de producto.</p>
                  </div>
                </div>
                <Card className="p-4">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <Checkbox checked={productForm.watch('is_active')} onCheckedChange={(v) => productForm.setValue('is_active', Boolean(v))} />
                    <div><div className="font-medium">Producto activo</div><div className="text-sm text-muted-foreground">Visible en la tienda</div></div>
                  </label>
                </Card>
                <div className="flex gap-3">
                  <Button type="submit" disabled={loading}>{loading ? 'Guardando...' : 'Crear producto'}</Button>
                  <Button type="button" variant="outline" onClick={() => productForm.reset()}>Limpiar</Button>
                </div>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* ── Categorías ────────────────────────────────── */}
        <TabsContent value="categorias">
          <CategoryManager categorias={categorias} onRefresh={refreshData} />
        </TabsContent>
      </Tabs>
    </div>
  )
}

// ── ProductEditor ─────────────────────────────────────────────────────────

function ProductEditor({ p, categorias, onSaved }: { p: AdminProduct; categorias: AdminCategory[]; onSaved: () => void }) {
  const [name, setName] = useState(p.name)
  const [description, setDescription] = useState(p.description ?? '')
  const [categoryId, setCategoryId] = useState(p.category_id ?? '')
  const [brand, setBrand] = useState(p.brand ?? '')
  const [imageUrl, setImageUrl] = useState(p.image_url ?? '')
  const [isActive, setIsActive] = useState(p.is_active)
  const [saving, setSaving] = useState(false)
  const [uploadingImage, setUploadingImage] = useState(false)

  // Variant form
  const [variantSku, setVariantSku] = useState('')
  const [variantSabor, setVariantSabor] = useState('')
  const [variantPrice, setVariantPrice] = useState(0)
  const [variantCost, setVariantCost] = useState(0)
  const [variantStock, setVariantStock] = useState(0)
  const [addingVariant, setAddingVariant] = useState(false)

  async function handleImageUpload(file: File) {
    try {
      setUploadingImage(true)
      const { url, public_url } = await getPresignUrl(file.name, file.type)
      await fetch(url, { method: 'PUT', body: file, headers: { 'Content-Type': file.type } })
      setImageUrl(public_url)
      toast({ title: 'Imagen subida correctamente' })
    } catch (e: any) {
      toast({ title: 'Error subiendo imagen', description: e.message })
    } finally {
      setUploadingImage(false)
    }
  }

  async function save() {
    try {
      setSaving(true)
      await updateProduct(p.id, {
        name, description: description || null,
        category_id: categoryId || null,
        brand: brand || null,
        image_url: imageUrl || null,
        is_active: isActive,
      })
      toast({ title: 'Producto actualizado' })
      onSaved()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message, variant: 'destructive' })
    } finally {
      setSaving(false)
    }
  }

  async function handleAddVariant() {
    if (!variantSku) { toast({ title: 'SKU requerido' }); return }
    try {
      setAddingVariant(true)
      await createVariant(p.id, {
        sku: variantSku,
        attributes: variantSabor ? { sabor: variantSabor } : {},
        price: variantPrice,
        cost: variantCost,
        stock: variantStock,
      })
      toast({ title: 'Variante agregada' })
      setVariantSku(''); setVariantSabor(''); setVariantPrice(0); setVariantCost(0); setVariantStock(0)
      onSaved()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message })
    } finally {
      setAddingVariant(false)
    }
  }

  async function handleDeleteVariant(variantId: string) {
    try {
      await deleteVariant(variantId)
      toast({ title: 'Variante eliminada' })
      onSaved()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message })
    }
  }

  return (
    <div className="space-y-6">
      {/* Basic info */}
      <div className="space-y-4">
        <h4 className="font-medium border-b pb-2">Información básica — {p.name}</h4>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-2"><Label>Nombre</Label><Input value={name} onChange={e => setName(e.target.value)} /></div>
          <div className="space-y-2">
            <Label>Categoría</Label>
            <Select value={categoryId || 'none'} onValueChange={v => setCategoryId(v === 'none' ? '' : v)}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="none">Sin categoría</SelectItem>
                {categorias.map(c => <SelectItem key={c.id} value={c.id}>{c.name}</SelectItem>)}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-2"><Label>Descripción</Label><Input value={description} onChange={e => setDescription(e.target.value)} /></div>
          <div className="space-y-2"><Label>Marca</Label><Input value={brand} onChange={e => setBrand(e.target.value)} /></div>
        </div>
        {/* Image */}
        <div className="space-y-2">
          <Label>Imagen principal</Label>
          <div className="flex gap-2 items-center">
            <Input value={imageUrl} onChange={e => setImageUrl(e.target.value)} placeholder="https://..." className="flex-1" />
            <label className="cursor-pointer">
              <Button type="button" variant="outline" size="sm" disabled={uploadingImage} onClick={() => document.getElementById(`img-upload-${p.id}`)?.click()}>
                {uploadingImage ? 'Subiendo...' : 'Subir'}
              </Button>
              <input id={`img-upload-${p.id}`} type="file" accept="image/*" className="hidden" onChange={e => { if (e.target.files?.[0]) handleImageUpload(e.target.files[0]) }} />
            </label>
          </div>
          {imageUrl && <div className="relative h-24 w-24 rounded border overflow-hidden"><Image src={imageUrl} alt="preview" fill className="object-cover" sizes="96px" /></div>}
        </div>
        <Card className="p-3">
          <label className="flex items-center gap-3 cursor-pointer">
            <Checkbox checked={isActive} onCheckedChange={v => setIsActive(Boolean(v))} />
            <div><div className="font-medium text-sm">Producto activo</div><div className="text-xs text-muted-foreground">Visible en la tienda</div></div>
          </label>
        </Card>
        <Button onClick={save} disabled={saving}>{saving ? 'Guardando...' : 'Guardar cambios'}</Button>
      </div>

      {/* Variants */}
      <div className="space-y-4 border-t pt-4">
        <h4 className="font-medium">Variantes ({p.variants.length})</h4>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>SKU</TableHead>
              <TableHead>Sabor / Attrs</TableHead>
              <TableHead>Precio</TableHead>
              <TableHead>Stock</TableHead>
              <TableHead></TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {p.variants.map(v => (
              <TableRow key={v.id}>
                <TableCell className="font-mono text-xs">{v.sku}</TableCell>
                <TableCell>{Object.entries(v.attributes).map(([k, val]) => `${k}: ${val}`).join(', ') || '—'}</TableCell>
                <TableCell>{formatCurrency(v.price)}</TableCell>
                <TableCell>{v.stock}</TableCell>
                <TableCell>
                  <AlertDialog>
                    <AlertDialogTrigger asChild><Button size="sm" variant="ghost" className="text-destructive h-7 px-2">✕</Button></AlertDialogTrigger>
                    <AlertDialogContent>
                      <AlertDialogHeader><AlertDialogTitle>¿Eliminar variante?</AlertDialogTitle><AlertDialogDescription>Se eliminará la variante "{v.sku}" permanentemente.</AlertDialogDescription></AlertDialogHeader>
                      <AlertDialogFooter><AlertDialogCancel>Cancelar</AlertDialogCancel><AlertDialogAction onClick={() => handleDeleteVariant(v.id)}>Eliminar</AlertDialogAction></AlertDialogFooter>
                    </AlertDialogContent>
                  </AlertDialog>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Add variant form */}
        <div className="p-4 border rounded-lg space-y-3 bg-muted/30">
          <h5 className="font-medium text-sm">Agregar variante</h5>
          <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
            <div><Label className="text-xs">SKU *</Label><Input value={variantSku} onChange={e => setVariantSku(e.target.value)} placeholder="PP-CHOC-1KG" /></div>
            <div><Label className="text-xs">Sabor</Label><Input value={variantSabor} onChange={e => setVariantSabor(e.target.value)} placeholder="Chocolate" /></div>
            <div><Label className="text-xs">Precio *</Label><Input type="number" value={variantPrice} onChange={e => setVariantPrice(Number(e.target.value))} /></div>
            <div><Label className="text-xs">Costo</Label><Input type="number" value={variantCost} onChange={e => setVariantCost(Number(e.target.value))} /></div>
            <div><Label className="text-xs">Stock</Label><Input type="number" value={variantStock} onChange={e => setVariantStock(Number(e.target.value))} /></div>
          </div>
          <Button onClick={handleAddVariant} disabled={addingVariant} size="sm">{addingVariant ? 'Agregando...' : 'Agregar variante'}</Button>
        </div>
      </div>
    </div>
  )
}

// ── CategoryManager ───────────────────────────────────────────────────────

function CategoryManager({ categorias, onRefresh }: { categorias: AdminCategory[]; onRefresh: () => void }) {
  const form = useForm<CategoryForm>({ resolver: zodResolver(categorySchema), defaultValues: { name: '', description: '' } })
  const [saving, setSaving] = useState(false)

  async function onSubmit(values: CategoryForm) {
    try {
      setSaving(true)
      await createCategory({ name: values.name, description: values.description ?? null })
      toast({ title: 'Categoría creada' })
      form.reset()
      onRefresh()
    } catch (e: any) {
      toast({ title: 'Error', description: e.message })
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader><h2 className="font-semibold">Categorías</h2></CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>Nombre</TableHead>
                <TableHead>Descripción</TableHead>
                <TableHead className="text-right">Acciones</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {categorias.map(c => (
                <TableRow key={c.id}>
                  <TableCell className="font-medium">{c.name}</TableCell>
                  <TableCell className="text-muted-foreground text-sm">{c.description ?? '—'}</TableCell>
                  <TableCell className="text-right">
                    <AlertDialog>
                      <AlertDialogTrigger asChild><Button size="sm" variant="destructive">Eliminar</Button></AlertDialogTrigger>
                      <AlertDialogContent>
                        <AlertDialogHeader>
                          <AlertDialogTitle>¿Eliminar categoría?</AlertDialogTitle>
                          <AlertDialogDescription>Se eliminará "{c.name}". Los productos en esta categoría quedarán sin categoría.</AlertDialogDescription>
                        </AlertDialogHeader>
                        <AlertDialogFooter>
                          <AlertDialogCancel>Cancelar</AlertDialogCancel>
                          <AlertDialogAction onClick={async () => {
                            try { await deleteCategory(c.id); toast({ title: 'Categoría eliminada' }); onRefresh() }
                            catch (e: any) { toast({ title: 'Error', description: e.message }) }
                          }}>Eliminar</AlertDialogAction>
                        </AlertDialogFooter>
                      </AlertDialogContent>
                    </AlertDialog>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      <Card>
        <CardHeader><h2 className="font-semibold">Nueva categoría</h2></CardHeader>
        <CardContent>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label>Nombre *</Label>
                <Input {...form.register('name')} placeholder="Ej: Proteínas" />
                {form.formState.errors.name && <p className="text-sm text-destructive">{form.formState.errors.name.message}</p>}
              </div>
              <div className="space-y-2">
                <Label>Descripción</Label>
                <Input {...form.register('description')} placeholder="Descripción opcional" />
              </div>
            </div>
            <Button type="submit" disabled={saving}>{saving ? 'Creando...' : 'Crear categoría'}</Button>
          </form>
        </CardContent>
      </Card>
    </div>
  )
}

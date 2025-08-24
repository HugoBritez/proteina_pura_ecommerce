"use client"

import { useState, useRef, useCallback } from 'react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Card, CardContent } from '@/components/ui/card'
import { toast } from '@/hooks/use-toast'
import { supabase } from '@/lib/supabase'
import { X, Upload, Link, ImageIcon } from 'lucide-react'

interface ImageUploaderProps {
  value: string | string[]
  onChange: (value: string | string[]) => void
  multiple?: boolean
  label?: string
  className?: string
}

export function ImageUploader({ value, onChange, multiple = false, label, className }: ImageUploaderProps) {
  const [uploading, setUploading] = useState(false)
  const [dragActive, setDragActive] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const currentValues = Array.isArray(value) ? value : (value ? [value] : [])

  const uploadFile = useCallback(async (file: File): Promise<string> => {
    const session = (await supabase.auth.getSession()).data.session
    if (!session) throw new Error('No autenticado')
    
    const token = session.access_token
    const path = `productos/${Date.now()}_${file.name.replace(/[^a-zA-Z0-9._-]/g, '_')}`
    const formData = new FormData()
    formData.append('file', file)
    formData.append('path', path)
    
    const res = await fetch('/api/admin/upload', {
      method: 'POST',
      headers: { Authorization: `Bearer ${token}` },
      body: formData
    })
    
    const json = await res.json()
    if (!res.ok) throw new Error(json.error || 'Error subiendo archivo')
    
    return json.publicUrl
  }, [])

  const handleFiles = useCallback(async (files: FileList) => {
    if (!files.length) return

    setUploading(true)
    try {
      const uploadPromises = Array.from(files).map(uploadFile)
      const newUrls = await Promise.all(uploadPromises)
      
      if (multiple) {
        const allUrls = [...currentValues, ...newUrls]
        onChange(allUrls)
      } else {
        onChange(newUrls[0])
      }
      
      toast({ 
        title: `${newUrls.length > 1 ? 'Imágenes subidas' : 'Imagen subida'}`,
        description: `${newUrls.length} archivo(s) subido(s) correctamente`
      })
    } catch (error: any) {
      toast({
        title: 'Error subiendo archivos',
        description: error.message,
        variant: 'destructive'
      })
    } finally {
      setUploading(false)
    }
  }, [uploadFile, multiple, currentValues, onChange])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFiles(files)
    }
  }, [handleFiles])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setDragActive(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      handleFiles(e.target.files)
    }
  }, [handleFiles])

  const removeImage = useCallback((indexOrUrl: number | string) => {
    if (multiple) {
      const newUrls = typeof indexOrUrl === 'number' 
        ? currentValues.filter((_, i) => i !== indexOrUrl)
        : currentValues.filter(url => url !== indexOrUrl)
      onChange(newUrls)
    } else {
      onChange('')
    }
  }, [multiple, currentValues, onChange])

  const addUrlManually = useCallback((url: string) => {
    if (!url.trim()) return
    
    try {
      new URL(url) // Validar URL
      if (multiple) {
        onChange([...currentValues, url])
      } else {
        onChange(url)
      }
    } catch {
      toast({
        title: 'URL inválida',
        description: 'Por favor ingresa una URL válida',
        variant: 'destructive'
      })
    }
  }, [multiple, currentValues, onChange])

  return (
    <div className={`space-y-3 ${className}`}>
      {label && <Label className="text-sm font-medium">{label}</Label>}
      
      {/* Drop Zone */}
      <Card 
        className={`border-2 border-dashed transition-colors ${
          dragActive ? 'border-primary bg-primary/5' : 'border-muted-foreground/25'
        }`}
        onDrop={handleDrop}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
      >
        <CardContent className="p-6">
          <div className="text-center">
            <ImageIcon className="mx-auto h-12 w-12 text-muted-foreground mb-4" />
            <div className="space-y-2">
              <p className="text-sm text-muted-foreground">
                Arrastra y suelta imágenes aquí, o
              </p>
              <Button
                type="button"
                variant="outline"
                onClick={() => fileInputRef.current?.click()}
                disabled={uploading}
                className="mx-auto"
              >
                <Upload className="h-4 w-4 mr-2" />
                {uploading ? 'Subiendo...' : 'Seleccionar archivos'}
              </Button>
              <p className="text-xs text-muted-foreground">
                {multiple ? 'Múltiples archivos permitidos' : 'Solo una imagen'} • PNG, JPG, GIF hasta 10MB
              </p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Input file oculto */}
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        multiple={multiple}
        onChange={handleFileInput}
        className="hidden"
      />

      {/* URL manual */}
      <div className="flex gap-2">
        <Input
          placeholder="O pega una URL de imagen..."
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              e.preventDefault()
              addUrlManually(e.currentTarget.value)
              e.currentTarget.value = ''
            }
          }}
        />
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={(e) => {
            const input = e.currentTarget.previousElementSibling as HTMLInputElement
            addUrlManually(input.value)
            input.value = ''
          }}
        >
          <Link className="h-4 w-4" />
        </Button>
      </div>

      {/* Preview de imágenes */}
      {currentValues.length > 0 && (
        <div className="space-y-2">
          <Label className="text-sm">Vista previa:</Label>
          <div className={`grid gap-3 ${multiple ? 'grid-cols-2 md:grid-cols-3 lg:grid-cols-4' : 'grid-cols-1'}`}>
            {currentValues.map((url, index) => (
              <div key={index} className="relative group">
                <div className="aspect-square rounded-lg border overflow-hidden bg-muted">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={url}
                    alt={`Preview ${index + 1}`}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const target = e.target as HTMLImageElement
                      target.src = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSIjZjNmNGY2Ii8+PHRleHQgeD0iNTAlIiB5PSI1MCUiIGZvbnQtZmFtaWx5PSJBcmlhbCIgZm9udC1zaXplPSIxNCIgZmlsbD0iIzZiNzI4MCIgdGV4dC1hbmNob3I9Im1pZGRsZSIgZHk9Ii4zZW0iPkVycm9yPC90ZXh0Pjwvc3ZnPg=='
                    }}
                  />
                </div>
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="absolute -top-2 -right-2 h-6 w-6 rounded-full p-0 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => removeImage(index)}
                >
                  <X className="h-3 w-3" />
                </Button>
                {multiple && (
                  <div className="absolute bottom-1 left-1 bg-black/50 text-white text-xs px-1 rounded">
                    {index + 1}
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Estado de carga */}
      {uploading && (
        <div className="text-center">
          <div className="inline-flex items-center gap-2 text-sm text-muted-foreground">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-primary"></div>
            Subiendo archivos...
          </div>
        </div>
      )}
    </div>
  )
}

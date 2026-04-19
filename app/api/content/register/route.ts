import { NextRequest, NextResponse } from 'next/server'
import { addContentToLibrary } from '@/lib/admin-control'
import { createClient } from '@/lib/supabase/server'

export async function POST(req: NextRequest) {
  try {
    // Auth check
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

    const { title, description, type, url, size, duration, tags, metadata } = await req.json()

    if (!title || !type || !url || !size) {
      return NextResponse.json({ 
        error: 'Missing required fields: title, type, url, size are required' 
      }, { status: 400 })
    }

    // Validar tipo de contenido
    if (!['image', 'video', 'text'].includes(type)) {
      return NextResponse.json({ 
        error: 'Invalid content type. Must be: image, video, or text' 
      }, { status: 400 })
    }

    // Agregar contenido a la biblioteca del administrador
    const newContent = addContentToLibrary(
      title,
      description || 'Contenido subido',
      type as 'image' | 'video' | 'text',
      url,
      size,
      user.id,
      duration || (type === 'video' ? 10000 : 5000), // 10s para video, 5s para imagen
      tags || ['uploaded'],
      metadata
    )

    return NextResponse.json({ 
      success: true, 
      content: newContent,
      message: 'Contenido agregado a la biblioteca exitosamente'
    })

  } catch (error) {
    console.error('Error registering content:', error)
    return NextResponse.json({ 
      error: 'Failed to register content',
      details: error instanceof Error ? error.message : 'Unknown error'
    }, { status: 500 })
  }
}
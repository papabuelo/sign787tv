import { ListObjectsV2Command } from '@aws-sdk/client-s3'
import { NextRequest, NextResponse } from 'next/server'
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2'

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url)
    const deviceId = searchParams.get('deviceId')
    
    // If deviceId is provided, only fetch that folder.
    // If deviceId is exactly '', fetch 'uploads/' (General)
    // If deviceId is null, fetch everything
    let prefix: string | undefined = undefined;
    if (deviceId !== null) {
      prefix = deviceId === '' ? 'uploads/' : `dispositivos/${deviceId}/`
    }

    const command = new ListObjectsV2Command({
      Bucket: R2_BUCKET,
      Prefix: prefix
    })

    const response = await r2.send(command)
    
    const items = (response.Contents ?? [])
      // Filter out root directory objects themselves if any
      .filter(obj => obj.Key && !obj.Key.endsWith('/'))
      .map(obj => {
      // Determine type based on extension
      const ext = obj.Key?.split('.').pop()?.toLowerCase() || ''
      const isVideo = ['mp4', 'webm', 'mov', 'ogg'].includes(ext)
      const type = isVideo ? 'video' : 'image'
      
      // Extract clean name and folder
      const parts = obj.Key?.split('/') || []
      const fileName = parts.pop() || 'Unknown'
      const folder = parts.join('/')

      return {
        id: obj.Key || Math.random().toString(),
        name: fileName,
        folder: folder,
        type: type,
        r2_url: `${R2_PUBLIC_URL}/${obj.Key}`,
        size_bytes: obj.Size || 0,
        created_at: obj.LastModified?.toISOString() || new Date().toISOString()
      }
    })

    // Sort newest first
    items.sort((a, b) => new Date(b.created_at).getTime() - new Date(a.created_at).getTime())

    return NextResponse.json({ data: items })
  } catch (error: any) {
    console.error('R2 Error:', error)
    return NextResponse.json({ error: error.message }, { status: 500 })
  }
}

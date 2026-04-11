import { PutObjectCommand } from '@aws-sdk/client-s3'
import { getSignedUrl } from '@aws-sdk/s3-request-presigner'
import { NextRequest, NextResponse } from 'next/server'
import { r2, R2_BUCKET, R2_PUBLIC_URL } from '@/lib/r2'
import { createClient } from '@/lib/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req: NextRequest) {
  // Auth check
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  const { filename, contentType, size, clientId } = await req.json()

  if (!filename || !contentType) {
    return NextResponse.json({ error: 'Missing filename or contentType' }, { status: 400 })
  }

  // Build a safe unique key: folder/uuid-originalname
  const ext = filename.split('.').pop()
  const key = `uploads/${uuidv4()}.${ext}`

  // Generate presigned PUT URL (expires in 10 minutes)
  const command = new PutObjectCommand({
    Bucket: R2_BUCKET,
    Key: key,
    ContentType: contentType,
  })

  const presignedUrl = await getSignedUrl(r2, command, { expiresIn: 600 })

  // Detect media type
  const type = contentType.startsWith('video/')
    ? 'video'
    : contentType.startsWith('image/')
    ? 'image'
    : 'webpage'

  const publicUrl = `${R2_PUBLIC_URL}/${key}`

  return NextResponse.json({ presignedUrl, key, publicUrl, type, size, userId: user.id, clientId: clientId ?? null })
}

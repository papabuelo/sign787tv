const { S3Client, PutBucketCorsCommand } = require('@aws-sdk/client-s3')

const R2_ACCOUNT_ID = process.env.R2_ACCOUNT_ID
const R2_ACCESS_KEY_ID = process.env.R2_ACCESS_KEY_ID
const R2_SECRET_ACCESS_KEY = process.env.R2_SECRET_ACCESS_KEY
const R2_BUCKET_NAME = process.env.R2_BUCKET_NAME || 'sign787-media'

if (!R2_ACCOUNT_ID || !R2_ACCESS_KEY_ID || !R2_SECRET_ACCESS_KEY) {
  console.error('❌ Faltan variables de entorno de R2')
  process.exit(1)
}

const r2 = new S3Client({
  region: 'auto',
  endpoint: `https://${R2_ACCOUNT_ID}.r2.cloudflarestorage.com`,
  forcePathStyle: true,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
})

const corsConfig = {
  Bucket: R2_BUCKET_NAME,
  CORSConfiguration: {
    CORSRules: [
      {
        AllowedHeaders: ['*'],
        AllowedMethods: ['GET', 'HEAD', 'POST', 'PUT', 'DELETE'],
        AllowedOrigins: [
          'https://sign787tv.vercel.app',
          'https://*.vercel.app',
          'http://localhost:3000'
        ],
        ExposeHeaders: ['ETag'],
        MaxAgeSeconds: 3600,
      },
    ],
  },
}

async function setupCORS() {
  try {
    console.log('🔄 Configurando CORS para R2...')
    console.log('📦 Bucket:', R2_BUCKET_NAME)
    console.log('🌐 Dominios permitidos:', corsConfig.CORSConfiguration.CORSRules[0].AllowedOrigins)
    
    const command = new PutBucketCorsCommand(corsConfig)
    await r2.send(command)
    
    console.log('✅ CORS configurado exitosamente')
    console.log('🎉 Tu aplicación en Vercel ahora puede acceder a los archivos de R2')
  } catch (error) {
    console.error('❌ Error configurando CORS:', error)
    process.exit(1)
  }
}

setupCORS()